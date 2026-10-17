import { resolve } from "node:path";
import { Migrator } from "@mikro-orm/migrations";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { migratorOptions } from "./migrator-config";

const migrationsDir = resolve(import.meta.dirname, "migrations");
const rootEnvFile = resolve(import.meta.dirname, "../../../.env");
const originalUrl = process.env.DATABASE_URL;

beforeEach(() => {
  vi.resetModules();
  process.env.DATABASE_URL = "postgresql://cli@localhost:5432/devmentor";
});

afterEach(() => {
  vi.restoreAllMocks();
  if (originalUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalUrl;
  }
});

describe("migratorOptions", () => {
  it("registers the migrator and keeps TypeScript migrations with a stable snapshot name", () => {
    expect(migratorOptions.extensions).toEqual([Migrator]);
    expect(migratorOptions.migrations).toEqual({
      path: migrationsDir,
      pathTs: migrationsDir,
      emit: "ts",
      snapshotName: ".snapshot",
    });
  });
});

describe("mikro-orm.config (CLI)", () => {
  it("loads the repository-root .env and builds the config with the migrator", async () => {
    const loadEnvFile = vi.spyOn(process, "loadEnvFile").mockImplementation(() => undefined);

    const { default: config } = await import("./mikro-orm.config");

    expect(loadEnvFile).toHaveBeenCalledWith(rootEnvFile);
    expect(config.clientUrl).toBe("postgresql://cli@localhost:5432/devmentor");
    expect(config.extensions).toEqual([Migrator]);
    expect(config.migrations).toMatchObject({ path: migrationsDir, snapshotName: ".snapshot" });
  });

  it("falls back to the existing environment when there is no .env file", async () => {
    vi.spyOn(process, "loadEnvFile").mockImplementation(() => {
      throw Object.assign(new Error("ENOENT: no such file or directory"), { code: "ENOENT" });
    });

    const { default: config } = await import("./mikro-orm.config");

    expect(config.clientUrl).toBe("postgresql://cli@localhost:5432/devmentor");
  });
});
