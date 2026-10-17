import { createContainer, InjectionMode, type AwilixContainer } from "awilix";

/**
 * Registry of everything resolvable from the DI container.
 *
 * Packages add their registrations through declaration merging, so `core`
 * never imports the packages that build on it:
 *
 *   declare module "@devmentor/core" {
 *     interface AppCradle { userService: UserService }
 *   }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- extended via declaration merging
export interface AppCradle {}

export type AppContainer = AwilixContainer<AppCradle>;

/** Registers one package's dependencies. Modules run in the order given. */
export type ContainerModule = (container: AppContainer) => void;

export function buildContainer(modules: readonly ContainerModule[]): AppContainer {
  const container = createContainer<AppCradle>({
    // PROXY resolves by property name, which survives minification.
    injectionMode: InjectionMode.PROXY,
    // Rejects singletons that depend on scoped/transient registrations.
    strict: true,
  });
  for (const register of modules) {
    register(container);
  }
  return container;
}
