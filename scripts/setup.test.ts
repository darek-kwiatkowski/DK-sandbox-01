import { resolve } from "node:path";
import { afterEach, expect, it, vi } from "vitest";

const installer = vi.hoisted(() => ({ createContext: vi.fn(() => "ctx"), runSetup: vi.fn(async () => 1) }));
vi.mock("./setup/installer.mjs", () => installer);

afterEach(() => {
  process.exitCode = undefined;
});

it("runs the installer from the repository root and exits with its code", async () => {
  await import("./setup.mjs");
  expect(installer.createContext).toHaveBeenCalledWith(resolve(import.meta.dirname, ".."), process.env);
  expect(installer.runSetup).toHaveBeenCalledWith("ctx");
  expect(process.exitCode).toBe(1);
});
