// Config for the `mikro-orm` CLI only (loaded through tsx). The app builds its
// ORM from `createOrmConfig()` and never loads the migrator.
import { resolve } from "node:path";
import { createOrmConfig } from "./config";
import { migratorOptions } from "./migrator-config";

// MikroORM 7 no longer reads .env files itself.
try {
  process.loadEnvFile(resolve(import.meta.dirname, "../../../.env"));
} catch {
  // No .env file: rely on variables already present in the environment.
}

export default createOrmConfig(migratorOptions);
