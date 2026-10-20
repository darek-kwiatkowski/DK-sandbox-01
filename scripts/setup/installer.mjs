// Idempotent local installer behind `npm run setup` (README → Uruchomienie).
// It runs before `npm install`, so it uses Node built-ins only. Every step
// reports why it can be skipped; a failed run is resumed by running it again.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { constants, copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { connect } from "node:net";
import { resolve } from "node:path";
import { parseEnv } from "node:util";

/**
 * @typedef {{ status: number, stdout: string }} ExecResult
 * @typedef {(command: string, args: string[], options?: { capture?: boolean }) => ExecResult} Exec
 * @typedef {{
 *   env: Record<string, string | undefined>,
 *   probePostgres: (url: string) => Promise<boolean>,
 *   exec: Exec,
 *   npm: (args: string[], options?: { capture?: boolean }) => ExecResult,
 *   exists: (file: string) => boolean,
 *   read: (file: string) => string,
 *   write: (file: string, content: string) => void,
 *   copy: (from: string, to: string) => void,
 *   log: (message: string) => void,
 *   error: (message: string) => void,
 * }} SetupContext
 * @typedef {{
 *   title: string,
 *   skipReason: (ctx: SetupContext) => string | null | Promise<string | null>,
 *   run: (ctx: SetupContext) => void | Promise<void>,
 * }} SetupStep
 */

// Inside node_modules, so deleting node_modules also forgets the install.
export const INSTALL_MARKER = "node_modules/.devmentor-setup-lock.sha256";

// PostgreSQL SSLRequest packet: length 8, request code 80877103. Every server
// answers it before authentication, so it detects PostgreSQL without a driver
// (none is installed yet) and without credentials.
const SSL_REQUEST = Buffer.from([0, 0, 0, 8, 4, 210, 22, 47]);
// "S" / "N" (SSL supported or not), "E" from servers that reject the request.
const POSTGRES_REPLIES = [0x53, 0x4e, 0x45];
// Long enough for a remote server, short enough not to stall the installer.
export const PROBE_TIMEOUT_MS = 3000;

/**
 * Whether a PostgreSQL server listens at the host and port of `url`.
 * @param {string} url
 * @param {number} [timeoutMs]
 * @returns {Promise<boolean>}
 */
export function probePostgres(url, timeoutMs = PROBE_TIMEOUT_MS) {
  let target;
  try {
    target = new URL(url);
  } catch {
    return Promise.resolve(false);
  }
  const host = target.hostname.replace(/^\[|\]$/g, "") || "localhost";
  return new Promise((done) => {
    const socket = connect({ host, port: Number(target.port) || 5432 });
    /** @param {boolean} isPostgres */
    const finish = (isPostgres) => {
      socket.destroy();
      done(isPostgres);
    };
    socket.setTimeout(timeoutMs, () => finish(false));
    socket.once("error", () => finish(false));
    socket.once("connect", () => socket.write(SSL_REQUEST));
    socket.once("data", (reply) => finish(POSTGRES_REPLIES.includes(reply[0])));
  });
}

/** @param {string} content */
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

/** @param {ExecResult} result @param {string} command */
const assertSucceeded = (result, command) => {
  if (result.status !== 0) {
    throw new Error(`Polecenie \`${command}\` zakończyło się kodem ${result.status}.`);
  }
};

/**
 * The URL migrations will use: the shell environment wins over `.env`,
 * exactly as in packages/db/src/mikro-orm.config.ts.
 * @param {SetupContext} ctx
 */
const effectiveDatabaseUrl = (ctx) => ctx.env.DATABASE_URL ?? parseEnv(ctx.read(".env")).DATABASE_URL;

/** @type {SetupStep[]} */
export const steps = [
  {
    title: "Instalacja zależności (npm install)",
    skipReason: (ctx) =>
      ctx.exists(INSTALL_MARKER) && ctx.read(INSTALL_MARKER) === sha256(ctx.read("package-lock.json"))
        ? "zależności są zgodne z package-lock.json"
        : null,
    run: (ctx) => {
      assertSucceeded(ctx.npm(["install"]), "npm install");
      ctx.write(INSTALL_MARKER, sha256(ctx.read("package-lock.json")));
    },
  },
  {
    title: "Plik .env",
    skipReason: (ctx) => (ctx.exists(".env") ? "plik .env już istnieje i nie zostanie nadpisany" : null),
    run: (ctx) => ctx.copy(".env.example", ".env"),
  },
  {
    title: "PostgreSQL",
    // Any PostgreSQL already answering at DATABASE_URL (local, remote or a
    // running compose container) is used as is; Docker is the fallback.
    skipReason: async (ctx) => {
      const url = effectiveDatabaseUrl(ctx);
      return url && (await ctx.probePostgres(url)) ? "PostgreSQL pod DATABASE_URL przyjmuje połączenia" : null;
    },
    run: (ctx) => {
      const url = effectiveDatabaseUrl(ctx);
      if (!url) {
        throw new Error("DATABASE_URL nie jest ustawiony ani w środowisku, ani w .env.");
      }
      if (url !== parseEnv(ctx.read(".env.example")).DATABASE_URL) {
        // Docker would start the database from docker-compose.yml, not this one.
        throw new Error("PostgreSQL wskazany w DATABASE_URL nie odpowiada. Uruchom go albo popraw DATABASE_URL w .env.");
      }
      if (ctx.exec("docker", ["compose", "version"], { capture: true }).status !== 0) {
        throw new Error(
          "Pod DATABASE_URL nie działa PostgreSQL, a Docker Compose jest niedostępny. Uruchom własny PostgreSQL (i ustaw DATABASE_URL w .env) albo zainstaluj Dockera.",
        );
      }
      assertSucceeded(ctx.exec("docker", ["compose", "up", "-d", "--wait", "postgres"]), "docker compose up -d --wait postgres");
    },
  },
  {
    title: "Migracje bazy danych",
    skipReason: (ctx) => {
      const pending = ctx.npm(["exec", "-w", "@devmentor/db", "--", "mikro-orm", "migration:pending"], { capture: true });
      return pending.status === 0 && pending.stdout.includes("No pending migrations") ? "brak oczekujących migracji" : null;
    },
    run: (ctx) => {
      if (ctx.npm(["run", "db:migrate"]).status !== 0) {
        // The PostgreSQL probe does not authenticate, so wrong credentials surface here.
        throw new Error(
          "Migracje się nie powiodły (szczegóły powyżej). Sprawdź, czy DATABASE_URL ma poprawny host, port, użytkownika, hasło i nazwę bazy.",
        );
      }
    },
  },
];

/**
 * Runs the steps in order and stops at the first failure.
 * @param {SetupContext} ctx
 * @param {SetupStep[]} [setupSteps]
 * @returns {Promise<number>} process exit code
 */
export async function runSetup(ctx, setupSteps = steps) {
  for (const step of setupSteps) {
    try {
      const reason = await step.skipReason(ctx);
      if (reason) {
        ctx.log(`⏭  ${step.title}: pominięto (${reason})`);
        continue;
      }
      ctx.log(`▶  ${step.title}`);
      await step.run(ctx);
      ctx.log(`✔  ${step.title}: gotowe`);
    } catch (error) {
      ctx.error(`✖  ${step.title}: ${error instanceof Error ? error.message : String(error)}`);
      ctx.error("Usuń przyczynę i uruchom ponownie `npm run setup`. Wykonane kroki zostaną pominięte.");
      return 1;
    }
  }
  ctx.log("Środowisko gotowe. Uruchom `npm run dev` (http://localhost:3000, panel: /backend).");
  return 0;
}

/**
 * Real dependencies, with every path relative to the repository root.
 * @param {string} root
 * @param {Record<string, string | undefined>} env
 * @returns {SetupContext}
 */
export function createContext(root, env) {
  /** @type {Exec} */
  const exec = (command, args, { capture = false } = {}) => {
    const result = spawnSync(command, args, {
      cwd: root,
      encoding: "utf8",
      stdio: capture ? ["ignore", "pipe", "ignore"] : "inherit",
    });
    // `status` is null when the command is missing or was killed.
    return { status: result.status ?? 1, stdout: result.stdout ?? "" };
  };
  // `npm run` exposes its own CLI script; running it through node avoids a
  // shell, which Windows would otherwise need for npm.cmd.
  const npmCli = env.npm_execpath;
  return {
    env,
    probePostgres: (url) => probePostgres(url),
    exec,
    npm: (args, options) => (npmCli ? exec(process.execPath, [npmCli, ...args], options) : exec("npm", args, options)),
    exists: (file) => existsSync(resolve(root, file)),
    read: (file) => readFileSync(resolve(root, file), "utf8"),
    write: (file, content) => writeFileSync(resolve(root, file), content),
    copy: (from, to) => copyFileSync(resolve(root, from), resolve(root, to), constants.COPYFILE_EXCL),
    log: (message) => console.log(message),
    error: (message) => console.error(message),
  };
}
