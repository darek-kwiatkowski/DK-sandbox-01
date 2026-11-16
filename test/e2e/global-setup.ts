import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { startTestDatabase } from "../support/postgres";

const APP_DIR = resolve("packages/app");
const SERVER_START_TIMEOUT_MS = 60_000;

/**
 * Boots the app ephemerally for E2E: a fresh PostgreSQL (Testcontainers),
 * migrations through the real CLI, then `next start` on a free port.
 */
export default async function setup() {
  if (!existsSync(resolve(APP_DIR, ".next/BUILD_ID"))) {
    throw new Error("No production build found: run `npm run build` before `npm run test:e2e`.");
  }
  const database = await startTestDatabase();
  const env = { ...process.env, DATABASE_URL: database.url, NODE_ENV: "production" as const };

  let server: ChildProcess | undefined;
  try {
    // Invoke the same migration CLI as db:migrate without platform-specific npm shims.
    await runToCompletion(process.execPath, [resolve("node_modules/@mikro-orm/cli/cli.js"), "migration:up"], env, resolve("packages/db"));
    const port = await freePort();
    server = spawn(process.execPath, [resolve("node_modules/next/dist/bin/next"), "start", "--port", String(port)], {
      cwd: APP_DIR,
      env,
      windowsHide: true,
      stdio: ["ignore", "inherit", "inherit"],
    });
    const baseUrl = `http://127.0.0.1:${port}`;
    let spawnError: Error | undefined;
    server.on("error", (error) => { spawnError = error; });
    await waitForHealthy(baseUrl, server, () => spawnError);
    // Test workers start after global setup, so they inherit these.
    process.env.E2E_BASE_URL = baseUrl;
    process.env.E2E_DATABASE_URL = database.url;
  } catch (error) {
    try {
      if (server) await stopProcess(server);
    } finally {
      await database.stop();
    }
    throw error;
  }
  const startedServer = server;
  return async () => {
    try {
      await stopProcess(startedServer);
    } finally {
      await database.stop();
    }
  };
}

function runToCompletion(command: string, args: string[], env: NodeJS.ProcessEnv, cwd: string): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { env, cwd, stdio: "inherit", windowsHide: true });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`${command} ${args.join(" ")} exited with ${code}`)),
    );
  });
}

function freePort(): Promise<number> {
  return new Promise((resolvePromise, reject) => {
    const probe = createServer();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      probe.close(() => (typeof address === "object" && address ? resolvePromise(address.port) : reject(new Error("No port"))));
    });
  });
}

async function waitForHealthy(baseUrl: string, server: ChildProcess, getSpawnError: () => Error | undefined): Promise<void> {
  const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const spawnError = getSpawnError();
    if (spawnError) throw spawnError;
    if (server.exitCode !== null) {
      throw new Error(`next start exited early with code ${server.exitCode}`);
    }
    const healthy = await fetch(`${baseUrl}/api/health`).then(
      (response) => response.ok,
      () => false,
    );
    if (healthy) {
      return;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`The app did not become healthy within ${SERVER_START_TIMEOUT_MS} ms`);
}

function stopProcess(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null || child.pid === undefined) {
    return Promise.resolve();
  }
  return new Promise((resolvePromise) => {
    child.once("exit", () => resolvePromise());
    child.kill("SIGTERM");
  });
}
