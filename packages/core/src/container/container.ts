import { asClass, asFunction, createContainer, InjectionMode, type AwilixContainer } from "awilix";
import { createOrm, type OrmOverrides } from "@devmentor/db";
import { UserService } from "../services/auth/user.service";
import type { Cradle } from "./cradle";

export type AppContainer = AwilixContainer<Cradle>;

export interface AppContainerOptions {
  /** ORM config overrides, e.g. `{ clientUrl }` for integration tests. */
  orm?: OrmOverrides;
}

export function createAppContainer(options: AppContainerOptions = {}): AppContainer {
  const container = createContainer<Cradle>({
    // PROXY resolves by property name, which survives minification.
    injectionMode: InjectionMode.PROXY,
    // Rejects singletons that depend on scoped registrations.
    strict: true,
  });
  container.register({
    orm: asFunction(() => createOrm(options.orm))
      .singleton()
      .disposer((orm) => orm.close()),
    em: asFunction(({ orm }: { orm: Cradle["orm"] }) => orm.em.fork()).scoped(),
    userService: asClass(UserService).scoped(),
  });
  return container;
}

// One container per server process, kept on globalThis so dev hot reloads
// reuse it instead of opening a new connection pool on every edit.
const globalForContainer = globalThis as typeof globalThis & {
  __devmentorContainer?: AppContainer;
};

// Not exported from the package: resolving scoped services on the root
// container would cache one EntityManager for the whole process.
export function getContainer(): AppContainer {
  globalForContainer.__devmentorContainer ??= createAppContainer();
  return globalForContainer.__devmentorContainer;
}

/**
 * Runs `fn` with a fresh request scope (own EntityManager) and disposes the
 * scope afterwards. Call it once per request, page render or job, and pass the
 * resolved services down instead of calling it again.
 */
export async function withScope<T>(
  fn: (cradle: Cradle) => T | Promise<T>,
  container: AppContainer = getContainer(),
): Promise<T> {
  const scope = container.createScope();
  try {
    return await fn(scope.cradle);
  } finally {
    await scope.dispose();
  }
}
