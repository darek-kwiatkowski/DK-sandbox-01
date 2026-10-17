import { readdirSync } from "node:fs";
import { buildContainer } from "@devmentor/core";
import { MikroORM, UniqueConstraintViolationException } from "@mikro-orm/postgresql";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createOrmConfig } from "./config";
import { migratorOptions } from "./migrator-config";
import { createDbModule } from "./module";

// Runs against a dedicated, disposable database: the suite DROPS the schema.
// It never falls back to DATABASE_URL, which points at a real dev database.
const testDatabaseUrl = process.env.TEST_DATABASE_URL;

describe.skipIf(!testDatabaseUrl)("@devmentor/db against PostgreSQL (requires TEST_DATABASE_URL)", () => {
  const overrides = { clientUrl: testDatabaseUrl, debug: false };
  let orm: MikroORM;

  beforeAll(async () => {
    if (testDatabaseUrl === process.env.DATABASE_URL) {
      throw new Error("TEST_DATABASE_URL must not equal DATABASE_URL: the integration tests drop the schema.");
    }
    orm = new MikroORM(createOrmConfig({ ...overrides, ...migratorOptions }));
    await orm.schema.drop({ dropMigrationsTable: true });
  });

  afterAll(async () => {
    await orm?.schema.drop({ dropMigrationsTable: true });
    await orm?.close();
  });

  it("applies every migration to an empty database", async () => {
    const migrationFiles = readdirSync(migratorOptions.migrations.path).filter((file) =>
      /^Migration\d+\.ts$/.test(file),
    );

    await orm.migrator.up();

    const executed = (await orm.migrator.getExecuted()).map((row) => `${row.name}.ts`);
    expect(executed.sort()).toEqual(migrationFiles.sort());
    expect(await orm.migrator.getPending()).toHaveLength(0);
  });

  it("has migrations that fully match the entity definitions", async () => {
    // A missing migration would leave a schema diff after migrating up.
    const diff = await orm.schema.getUpdateSchemaSQL();
    expect(diff.trim()).toBe("");
  });

  it("creates and lists users through the DI container with per-scope entity managers", async () => {
    const container = buildContainer([createDbModule(overrides)]);
    try {
      const writer = container.createScope().cradle;
      const created = await writer.userService.create({ email: "ada@example.test", name: "Ada" });

      const reader = container.createScope().cradle;
      expect(reader.em).not.toBe(writer.em);
      const users = await reader.userService.list();

      expect(users.map((user) => user.email)).toContain("ada@example.test");
      expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(created.createdAt).toBeInstanceOf(Date);
    } finally {
      await container.dispose();
    }
  });

  it("rejects a duplicate email", async () => {
    const container = buildContainer([createDbModule(overrides)]);
    try {
      const { userService } = container.createScope().cradle;
      await expect(userService.create({ email: "ada@example.test", name: "Ada again" })).rejects.toBeInstanceOf(
        UniqueConstraintViolationException,
      );
    } finally {
      await container.dispose();
    }
  });
});
