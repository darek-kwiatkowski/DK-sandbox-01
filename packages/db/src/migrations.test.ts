import { describe, expect, it } from "vitest";
import { Migration20261017073349 } from "./migrations/Migration20261017073349";

type MigrationArgs = ConstructorParameters<typeof Migration20261017073349>;

describe("Migration20261017073349 (initial schema)", () => {
  it("creates the users table with a unique email constraint", async () => {
    // up() only queues SQL, so the driver and config are never touched.
    const migration = new Migration20261017073349({} as unknown as MigrationArgs[0], {} as unknown as MigrationArgs[1]);

    await migration.up();

    expect(migration.name).toBe("Migration20261017073349");
    expect(migration.getQueries()).toEqual([
      'create table "users" ("id" uuid not null, "email" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz not null, primary key ("id"));',
      'alter table "users" add constraint "users_email_unique" unique ("email");',
    ]);
  });
});
