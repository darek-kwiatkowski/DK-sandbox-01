import { afterEach, describe, expect, it } from "vitest";
import { createOrmConfig } from "./config";
import { User } from "./entities";

const originalEnv = { DATABASE_URL: process.env.DATABASE_URL, NODE_ENV: process.env.NODE_ENV };

function setEnv(name: keyof typeof originalEnv, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

afterEach(() => {
  setEnv("DATABASE_URL", originalEnv.DATABASE_URL);
  setEnv("NODE_ENV", originalEnv.NODE_ENV);
});

describe("createOrmConfig", () => {
  it("reads DATABASE_URL and registers every entity with a bounded pool", () => {
    setEnv("DATABASE_URL", "postgresql://app@db.example:5432/devmentor");

    const config = createOrmConfig();

    expect(config.clientUrl).toBe("postgresql://app@db.example:5432/devmentor");
    expect(config.entities).toEqual([User]);
    expect(config.pool).toEqual({ min: 0, max: 10, idleTimeoutMillis: 30_000 });
  });

  it("lets an explicit clientUrl win over DATABASE_URL", () => {
    setEnv("DATABASE_URL", "postgresql://app@db.example:5432/devmentor");

    expect(createOrmConfig({ clientUrl: "postgresql://tester@localhost/test" }).clientUrl).toBe(
      "postgresql://tester@localhost/test",
    );
  });

  it("fails fast without any connection URL", () => {
    setEnv("DATABASE_URL", undefined);

    expect(() => createOrmConfig()).toThrow(/DATABASE_URL is not set/);
  });

  it("logs queries only in development", () => {
    setEnv("DATABASE_URL", "postgresql://app@db.example:5432/devmentor");

    setEnv("NODE_ENV", "development");
    expect(createOrmConfig().debug).toEqual(["query"]);

    setEnv("NODE_ENV", "production");
    expect(createOrmConfig().debug).toBe(false);
  });

  it("applies other overrides", () => {
    expect(createOrmConfig({ clientUrl: "postgresql://x@localhost/x", debug: true }).debug).toBe(true);
  });
});
