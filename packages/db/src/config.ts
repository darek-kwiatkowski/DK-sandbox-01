import { defineConfig, type Options } from "@mikro-orm/postgresql";
import { entities } from "./entities";

/** Runtime ORM config shared by the app and the CLI. Reads `DATABASE_URL` unless `clientUrl` is given. */
export function createOrmConfig(overrides: Partial<Options> = {}): Options {
  const clientUrl = overrides.clientUrl ?? process.env.DATABASE_URL;
  if (!clientUrl) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env in the repository root.");
  }
  return defineConfig({
    entities,
    pool: { min: 0, max: 10, idleTimeoutMillis: 30_000 },
    debug: process.env.NODE_ENV === "development" ? ["query"] : false,
    ...overrides,
    clientUrl,
  });
}
