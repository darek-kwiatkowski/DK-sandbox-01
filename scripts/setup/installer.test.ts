import { createHash } from "node:crypto";
import { EventEmitter } from "node:events";
import { constants } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

const spawnSync = vi.hoisted(() => vi.fn());
const connect = vi.hoisted(() => vi.fn());
const fs = vi.hoisted(() => ({
  copyFileSync: vi.fn(),
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));
vi.mock("node:child_process", () => ({ spawnSync }));
vi.mock("node:net", () => ({ connect }));
vi.mock("node:fs", async (importOriginal) => ({ ...(await importOriginal<typeof import("node:fs")>()), ...fs }));

const { INSTALL_MARKER, PROBE_TIMEOUT_MS, createContext, probePostgres, runSetup, steps } = await import("./installer.mjs");

type Context = Parameters<typeof runSetup>[0];
type ExecResult = { status: number; stdout: string };

const LOCKFILE = '{"lockfileVersion":3}';
const DOCKER_URL = "postgresql://devmentor:devmentor@localhost:5432/devmentor";
const sha256 = (content: string) => createHash("sha256").update(content).digest("hex");

/**
 * An in-memory repository. `commands` answers each `docker`/`npm` call by its
 * joined command line; `postgresAt` lists the URLs where PostgreSQL answers.
 */
function fakeContext({
  files = {},
  env = {},
  commands = {},
  postgresAt = [],
}: {
  files?: Record<string, string>;
  env?: Record<string, string>;
  commands?: Record<string, ExecResult>;
  postgresAt?: string[];
} = {}) {
  const store: Record<string, string> = {
    "package-lock.json": LOCKFILE,
    ".env.example": `DATABASE_URL=${DOCKER_URL}\n`,
    ...files,
  };
  const calls: string[] = [];
  const answer = (line: string) => {
    calls.push(line);
    return commands[line] ?? { status: 0, stdout: "" };
  };
  const ctx = {
    env,
    probePostgres: vi.fn(async (url: string) => postgresAt.includes(url)),
    exec: vi.fn((command: string, args: string[]) => answer([command, ...args].join(" "))),
    npm: vi.fn((args: string[]) => answer(["npm", ...args].join(" "))),
    exists: (file: string) => file in store,
    read: (file: string) => {
      if (!(file in store)) throw new Error(`ENOENT: ${file}`);
      return store[file];
    },
    write: (file: string, content: string) => {
      store[file] = content;
    },
    copy: (from: string, to: string) => {
      store[to] = store[from];
    },
    log: vi.fn(),
    error: vi.fn(),
  } satisfies Context;
  return { ctx, store, calls };
}

const step = (title: string) => {
  const found = steps.find((s) => s.title.startsWith(title));
  if (!found) throw new Error(`No step ${title}`);
  return found;
};

const PENDING = "npm exec -w @devmentor/db -- mikro-orm migration:pending";

describe("dependencies step", () => {
  const deps = step("Instalacja");

  it("installs and records the lockfile hash when nothing was installed", async () => {
    const { ctx, store, calls } = fakeContext();
    expect(await deps.skipReason(ctx)).toBeNull();
    await deps.run(ctx);
    expect(calls).toEqual(["npm install"]);
    expect(store[INSTALL_MARKER]).toBe(sha256(LOCKFILE));
  });

  it("is skipped while the lockfile matches the recorded hash", async () => {
    const { ctx } = fakeContext({ files: { [INSTALL_MARKER]: sha256(LOCKFILE) } });
    expect(await deps.skipReason(ctx)).toMatch(/zgodne z package-lock.json/);
  });

  it("reinstalls after the lockfile changed", async () => {
    const { ctx } = fakeContext({ files: { [INSTALL_MARKER]: sha256("old") } });
    expect(await deps.skipReason(ctx)).toBeNull();
  });

  it("does not record the hash when npm install fails", async () => {
    const { ctx, store } = fakeContext({ commands: { "npm install": { status: 1, stdout: "" } } });
    await expect(async () => deps.run(ctx)).rejects.toThrow("`npm install` zakończyło się kodem 1");
    expect(store[INSTALL_MARKER]).toBeUndefined();
  });
});

describe(".env step", () => {
  const envStep = step("Plik .env");

  it("copies .env.example when .env is missing", async () => {
    const { ctx, store } = fakeContext();
    expect(await envStep.skipReason(ctx)).toBeNull();
    await envStep.run(ctx);
    expect(store[".env"]).toBe(store[".env.example"]);
  });

  it("never touches an existing .env", async () => {
    const { ctx } = fakeContext({ files: { ".env": "DATABASE_URL=custom\n" } });
    expect(await envStep.skipReason(ctx)).toMatch(/nie zostanie nadpisany/);
  });
});

describe("PostgreSQL step", () => {
  const postgres = step("PostgreSQL");
  const dockerEnv = { ".env": `DATABASE_URL=${DOCKER_URL}\n` };
  const OWN_URL = "postgres://own-host:5433/db";

  it("uses a PostgreSQL that answers at the shell DATABASE_URL, without calling Docker", async () => {
    const { ctx, calls } = fakeContext({ files: dockerEnv, env: { DATABASE_URL: OWN_URL }, postgresAt: [OWN_URL] });
    expect(await postgres.skipReason(ctx)).toMatch(/przyjmuje połączenia/);
    expect(ctx.probePostgres).toHaveBeenCalledWith(OWN_URL);
    expect(calls).toEqual([]);
  });

  it("uses a PostgreSQL that already answers at the default URL, e.g. a local server without Docker", async () => {
    const { ctx, calls } = fakeContext({ files: dockerEnv, postgresAt: [DOCKER_URL] });
    expect(await postgres.skipReason(ctx)).toMatch(/przyjmuje połączenia/);
    expect(calls).toEqual([]);
  });

  it("runs when nothing answers at DATABASE_URL", async () => {
    const { ctx } = fakeContext({ files: dockerEnv });
    expect(await postgres.skipReason(ctx)).toBeNull();
  });

  it("runs, without probing, when DATABASE_URL is set nowhere", async () => {
    const { ctx } = fakeContext({ files: { ".env": "LOG_LEVEL=info\n" } });
    expect(await postgres.skipReason(ctx)).toBeNull();
    expect(ctx.probePostgres).not.toHaveBeenCalled();
    await expect(async () => postgres.run(ctx)).rejects.toThrow("DATABASE_URL nie jest ustawiony");
  });

  it("does not start Docker for an unreachable database other than the compose one", async () => {
    const { ctx, calls } = fakeContext({ files: { ".env": `DATABASE_URL=${OWN_URL}\n` } });
    await expect(async () => postgres.run(ctx)).rejects.toThrow(/wskazany w DATABASE_URL nie odpowiada/);
    expect(calls).toEqual([]);
  });

  it("starts the compose container and waits for it to become healthy", async () => {
    const { ctx, calls } = fakeContext({ files: dockerEnv });
    await postgres.run(ctx);
    expect(calls).toEqual(["docker compose version", "docker compose up -d --wait postgres"]);
  });

  it("explains both ways out when there is neither PostgreSQL nor Docker Compose", async () => {
    const { ctx, calls } = fakeContext({ files: dockerEnv, commands: { "docker compose version": { status: 1, stdout: "" } } });
    await expect(async () => postgres.run(ctx)).rejects.toThrow(/Docker Compose jest niedostępny.*własny PostgreSQL/);
    expect(calls).toEqual(["docker compose version"]);
  });

  it("fails when the container does not come up", async () => {
    const { ctx } = fakeContext({
      files: dockerEnv,
      commands: { "docker compose up -d --wait postgres": { status: 1, stdout: "" } },
    });
    await expect(async () => postgres.run(ctx)).rejects.toThrow("`docker compose up -d --wait postgres` zakończyło się kodem 1");
  });
});

describe("migrations step", () => {
  const migrate = step("Migracje");

  it("is skipped when no migration is pending", async () => {
    const { ctx } = fakeContext({ commands: { [PENDING]: { status: 0, stdout: "No pending migrations\n" } } });
    expect(await migrate.skipReason(ctx)).toBe("brak oczekujących migracji");
  });

  it("runs when migrations are pending", async () => {
    const { ctx } = fakeContext({ commands: { [PENDING]: { status: 0, stdout: "│ Migration20261017073349 │" } } });
    expect(await migrate.skipReason(ctx)).toBeNull();
  });

  it("runs when the pending check fails, so the migration reports the real error", async () => {
    const { ctx } = fakeContext({ commands: { [PENDING]: { status: 1, stdout: "No pending migrations" } } });
    expect(await migrate.skipReason(ctx)).toBeNull();
  });

  it("applies migrations and fails on a non-zero exit", async () => {
    const ok = fakeContext();
    await migrate.run(ok.ctx);
    expect(ok.calls).toEqual(["npm run db:migrate"]);

    const failing = fakeContext({ commands: { "npm run db:migrate": { status: 2, stdout: "" } } });
    await expect(async () => migrate.run(failing.ctx)).rejects.toThrow(/Migracje się nie powiodły.*DATABASE_URL ma poprawny host, port, użytkownika, hasło/);
  });
});

describe("runSetup", () => {
  const fakeStep = (title: string, skipReason: string | null, run = vi.fn()) => ({
    title,
    skipReason: () => skipReason,
    run,
  });

  it("runs pending steps, skips done ones and tells the user how to start the app", async () => {
    const { ctx } = fakeContext();
    const first = fakeStep("A", null);
    const second = fakeStep("B", "już zrobione");
    expect(await runSetup(ctx, [first, second])).toBe(0);
    expect(first.run).toHaveBeenCalledWith(ctx);
    expect(second.run).not.toHaveBeenCalled();
    expect(ctx.log.mock.calls.flat()).toEqual([
      "▶  A",
      "✔  A: gotowe",
      "⏭  B: pominięto (już zrobione)",
      expect.stringContaining("npm run dev"),
    ]);
  });

  it("stops at the first failure with a non-zero code and a resume hint", async () => {
    const { ctx } = fakeContext();
    const after = fakeStep("C", null);
    const failing = fakeStep("B", null, vi.fn(async () => {
      throw new Error("boom");
    }));
    expect(await runSetup(ctx, [failing, after])).toBe(1);
    expect(after.run).not.toHaveBeenCalled();
    expect(ctx.error.mock.calls.flat()).toEqual(["✖  B: boom", expect.stringContaining("uruchom ponownie `npm run setup`")]);
  });

  it("reports non-Error throws, including from a skip check", async () => {
    const { ctx } = fakeContext();
    const broken = {
      title: "D",
      skipReason: () => {
        throw "nope";
      },
      run: vi.fn(),
    };
    expect(await runSetup(ctx, [broken])).toBe(1);
    expect(ctx.error).toHaveBeenCalledWith("✖  D: nope");
  });

  it("is idempotent end to end: a second run skips every real step", async () => {
    const { ctx, store } = fakeContext({
      commands: { [PENDING]: { status: 0, stdout: "No pending migrations" } },
      postgresAt: [DOCKER_URL],
    });
    expect(await runSetup(ctx)).toBe(0);
    const envAfterFirstRun = store[".env"];
    ctx.exec.mockClear();
    ctx.npm.mockClear();
    ctx.log.mockClear();

    expect(await runSetup(ctx)).toBe(0);
    expect(store[".env"]).toBe(envAfterFirstRun);
    expect(ctx.log.mock.calls.flat().filter((line: string) => line.startsWith("⏭"))).toHaveLength(steps.length);
    expect(ctx.exec).not.toHaveBeenCalled();
    expect(ctx.npm.mock.calls.map(([args]) => args.join(" "))).toEqual(["exec -w @devmentor/db -- mikro-orm migration:pending"]);
  });
});

describe("probePostgres", () => {
  class FakeSocket extends EventEmitter {
    write = vi.fn();
    destroy = vi.fn();
    setTimeout = vi.fn((_ms: number, onTimeout: () => void) => this.once("timeout", onTimeout));
  }
  const fakeSocket = () => {
    const socket = new FakeSocket();
    connect.mockReturnValue(socket);
    return socket;
  };

  afterEach(() => vi.clearAllMocks());

  it.each([
    ["S", "SSL supported"],
    ["N", "SSL not supported"],
    ["E", "request rejected"],
  ])("detects PostgreSQL by its SSLRequest reply %s (%s)", async (reply) => {
    const socket = fakeSocket();
    const result = probePostgres("postgresql://u:p@db.example:5433/app");
    expect(connect).toHaveBeenCalledWith({ host: "db.example", port: 5433 });
    expect(socket.setTimeout).toHaveBeenCalledWith(PROBE_TIMEOUT_MS, expect.any(Function));
    socket.emit("connect");
    expect(socket.write).toHaveBeenCalledWith(Buffer.from([0, 0, 0, 8, 4, 210, 22, 47]));
    socket.emit("data", Buffer.from(reply));
    expect(await result).toBe(true);
    expect(socket.destroy).toHaveBeenCalled();
  });

  it("rejects a server that answers like something other than PostgreSQL", async () => {
    const socket = fakeSocket();
    const result = probePostgres(DOCKER_URL);
    socket.emit("connect");
    socket.emit("data", Buffer.from("HTTP/1.1 400"));
    expect(await result).toBe(false);
  });

  it("is false when the connection fails or times out", async () => {
    const refused = fakeSocket();
    const failed = probePostgres(DOCKER_URL);
    refused.emit("error", new Error("ECONNREFUSED"));
    expect(await failed).toBe(false);

    const silent = fakeSocket();
    const timedOut = probePostgres(DOCKER_URL, 10);
    expect(silent.setTimeout).toHaveBeenCalledWith(10, expect.any(Function));
    silent.emit("timeout");
    expect(await timedOut).toBe(false);
    expect(silent.destroy).toHaveBeenCalled();
  });

  it("defaults to localhost:5432 and strips IPv6 brackets", async () => {
    const local = fakeSocket();
    const defaulted = probePostgres("postgresql:///devmentor");
    expect(connect).toHaveBeenLastCalledWith({ host: "localhost", port: 5432 });
    local.emit("error", new Error("ECONNREFUSED"));
    expect(await defaulted).toBe(false);

    const ipv6 = fakeSocket();
    const bracketed = probePostgres("postgresql://u@[::1]:6543/db");
    expect(connect).toHaveBeenLastCalledWith({ host: "::1", port: 6543 });
    ipv6.emit("error", new Error("ECONNREFUSED"));
    expect(await bracketed).toBe(false);
  });

  it("is false for a URL that cannot be parsed, without connecting", async () => {
    expect(await probePostgres("not a url")).toBe(false);
    expect(connect).not.toHaveBeenCalled();
  });
});

describe("createContext", () => {
  afterEach(() => vi.clearAllMocks());

  it("runs commands in the repository root, inheriting stdio by default", () => {
    spawnSync.mockReturnValue({ status: 0, stdout: null });
    expect(createContext("/repo", {}).exec("docker", ["compose", "version"])).toEqual({ status: 0, stdout: "" });
    expect(spawnSync).toHaveBeenCalledWith("docker", ["compose", "version"], {
      cwd: "/repo",
      encoding: "utf8",
      stdio: "inherit",
    });
  });

  it("captures stdout on request and treats a missing command as a failure", () => {
    spawnSync.mockReturnValue({ status: null, stdout: "out" });
    expect(createContext("/repo", {}).exec("docker", [], { capture: true })).toEqual({ status: 1, stdout: "out" });
    expect(spawnSync).toHaveBeenCalledWith("docker", [], expect.objectContaining({ stdio: ["ignore", "pipe", "ignore"] }));
  });

  it("runs npm through the CLI that started `npm run`, falling back to npm on PATH", () => {
    spawnSync.mockReturnValue({ status: 0, stdout: "" });
    createContext("/repo", { npm_execpath: "/npm/bin/npm-cli.js" }).npm(["install"]);
    expect(spawnSync).toHaveBeenLastCalledWith(process.execPath, ["/npm/bin/npm-cli.js", "install"], expect.anything());

    createContext("/repo", {}).npm(["install"], { capture: true });
    expect(spawnSync).toHaveBeenLastCalledWith("npm", ["install"], expect.objectContaining({ stdio: ["ignore", "pipe", "ignore"] }));
  });

  it("probes PostgreSQL over the network", async () => {
    const socket = new EventEmitter() as EventEmitter & { setTimeout: () => void; destroy: () => void };
    socket.setTimeout = vi.fn();
    socket.destroy = vi.fn();
    connect.mockReturnValue(socket);
    const result = createContext("/repo", {}).probePostgres(DOCKER_URL);
    socket.emit("error", new Error("ECONNREFUSED"));
    expect(await result).toBe(false);
    expect(connect).toHaveBeenCalledWith({ host: "localhost", port: 5432 });
  });

  it("resolves files against the root and never overwrites when copying", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue("content");
    const ctx = createContext("/repo", {});

    expect(ctx.exists(".env")).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledWith("/repo/.env");
    expect(ctx.read(".env")).toBe("content");
    expect(fs.readFileSync).toHaveBeenCalledWith("/repo/.env", "utf8");
    ctx.write("a.txt", "x");
    expect(fs.writeFileSync).toHaveBeenCalledWith("/repo/a.txt", "x");
    ctx.copy(".env.example", ".env");
    expect(fs.copyFileSync).toHaveBeenCalledWith("/repo/.env.example", "/repo/.env", constants.COPYFILE_EXCL);
  });

  it("prints progress to stdout and failures to stderr", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const ctx = createContext("/repo", {});
    ctx.log("info");
    ctx.error("bad");
    expect(log).toHaveBeenCalledWith("info");
    expect(error).toHaveBeenCalledWith("bad");
  });
});
