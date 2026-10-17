import { resolve } from "node:path";
import { Migrator } from "@mikro-orm/migrations";
import type { Options } from "@mikro-orm/postgresql";

const migrationsPath = resolve(import.meta.dirname, "migrations");

/** Migrator setup shared by the CLI config and the integration tests. Not used by the app. */
export const migratorOptions = {
  extensions: [Migrator],
  migrations: {
    path: migrationsPath,
    pathTs: migrationsPath,
    emit: "ts",
    // Fixed name; the default embeds the database name, which differs per environment.
    snapshotName: ".snapshot",
  },
} satisfies Partial<Options>;
