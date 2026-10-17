import { asClass, asFunction, type ContainerModule } from "@devmentor/core";
import { MikroORM, type EntityManager, type Options } from "@mikro-orm/postgresql";
import { createOrmConfig } from "./config";
import { UserService } from "./services/user-service";

declare module "@devmentor/core" {
  interface AppCradle {
    orm: MikroORM;
    /** Request-scoped fork; never use `orm.em` (the global EM) directly. */
    em: EntityManager;
    userService: UserService;
  }
}

/**
 * Registers the ORM (process singleton, created on first use, closed by
 * `container.dispose()`) and data services. `em` and everything using it are
 * scoped: resolve them from `container.createScope()`.
 */
export function createDbModule(overrides: Partial<Options> = {}): ContainerModule {
  return (container) => {
    container.register({
      orm: asFunction(() => new MikroORM(createOrmConfig(overrides)))
        .singleton()
        .disposer((orm) => orm.close()),
      em: asFunction(({ orm }: { orm: MikroORM }) => orm.em.fork()).scoped(),
      userService: asClass(UserService).scoped(),
    });
  };
}

/** Module configured from `DATABASE_URL`. */
export const dbModule: ContainerModule = createDbModule();
