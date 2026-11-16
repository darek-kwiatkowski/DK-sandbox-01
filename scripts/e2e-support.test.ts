import { EventEmitter } from "node:events";
import { resolve } from "node:path";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ spawn: vi.fn(), stop: vi.fn(), start: vi.fn(), exists: vi.fn() }));
vi.mock("node:child_process", () => ({ spawn: mocks.spawn }));
vi.mock("node:fs", () => ({ existsSync: mocks.exists }));
vi.mock("../test/support/postgres", () => ({ startTestDatabase: mocks.start }));
vi.mock("node:net", () => ({ createServer: () => ({
  on: vi.fn(), listen: (_port: number, _host: string, callback: () => void) => callback(),
  address: () => ({ port: 43210 }), close: (callback: () => void) => callback(),
}) }));

import setup from "../test/e2e/global-setup";

function child() {
  const process = Object.assign(new EventEmitter(), { pid: 123, exitCode: null, signalCode: null, kill: vi.fn() });
  process.kill.mockImplementation(() => { process.emit("exit", 0); return true; });
  return process;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.exists.mockReturnValue(true);
  mocks.start.mockResolvedValue({ url: "postgres://disposable-test", stop: mocks.stop });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

it("starts migration and Next through Node with correct working directories and cleans both resources", async () => {
  vi.stubEnv("E2E_BASE_URL", "");
  vi.stubEnv("E2E_DATABASE_URL", "");
  const migration = child();
  const server = child();
  mocks.spawn.mockImplementationOnce(() => { queueMicrotask(() => migration.emit("exit", 0)); return migration; })
    .mockReturnValueOnce(server);
  const teardown = await setup();
  expect(mocks.spawn).toHaveBeenNthCalledWith(1, process.execPath,
    [resolve("node_modules/@mikro-orm/cli/cli.js"), "migration:up"], expect.objectContaining({ cwd: resolve("packages/db"), windowsHide: true }));
  expect(mocks.spawn).toHaveBeenNthCalledWith(2, process.execPath,
    [resolve("node_modules/next/dist/bin/next"), "start", "--port", "43210"], expect.objectContaining({ cwd: resolve("packages/app"), windowsHide: true }));
  expect(process.env.E2E_BASE_URL).toBe("http://127.0.0.1:43210");
  await teardown();
  expect(server.kill).toHaveBeenCalledWith("SIGTERM");
  expect(mocks.stop).toHaveBeenCalledOnce();
});

it("releases its database when migrations fail, without starting Next", async () => {
  const migration = child();
  mocks.spawn.mockImplementationOnce(() => { queueMicrotask(() => migration.emit("exit", 1)); return migration; });
  await expect(setup()).rejects.toThrow("exited with 1");
  expect(mocks.spawn).toHaveBeenCalledOnce();
  expect(mocks.stop).toHaveBeenCalledOnce();
});

it("refuses missing production builds before allocating a database", async () => {
  mocks.exists.mockReturnValue(false);
  await expect(setup()).rejects.toThrow("No production build found");
  expect(mocks.start).not.toHaveBeenCalled();
});
