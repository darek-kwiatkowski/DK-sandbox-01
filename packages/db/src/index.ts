// @devmentor/db is the only package that imports @mikro-orm/*; it re-exports
// the few ORM types and errors that @devmentor/core services need.
export type { EntityManager, MikroORM } from "@mikro-orm/postgresql";
export { UniqueConstraintViolationException } from "@mikro-orm/postgresql";
export { createOrmConfig } from "./config";
export { User, entities } from "./entities";
export { createOrm, type OrmOverrides } from "./orm";
