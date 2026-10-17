import { MikroORM, type Options } from "@mikro-orm/postgresql";
import { createOrmConfig } from "./config";

/** Overrides for the ORM config (e.g. `clientUrl` in tests), without exposing MikroORM types to callers. */
export type OrmOverrides = Partial<Options>;

/** Creates the ORM. The connection is lazy: nothing connects until the first query. */
export function createOrm(overrides: OrmOverrides = {}): MikroORM {
  return new MikroORM(createOrmConfig(overrides));
}
