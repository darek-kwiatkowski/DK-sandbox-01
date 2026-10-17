import "server-only";
import { cache } from "react";
import { buildContainer, type AppContainer } from "@devmentor/core";
import { dbModule } from "@devmentor/db";

// One container per server process. Kept on globalThis so dev hot reloads
// reuse it instead of opening a new connection pool on every edit.
const globalForContainer = globalThis as typeof globalThis & {
  __devmentorContainer?: AppContainer;
};

export function getContainer(): AppContainer {
  globalForContainer.__devmentorContainer ??= buildContainer([dbModule]);
  return globalForContainer.__devmentorContainer;
}

/**
 * Child scope for the current request (memoized per request by React `cache`).
 * Resolve request-bound services, e.g. `getRequestScope().cradle.userService`.
 */
export const getRequestScope = cache((): AppContainer => getContainer().createScope());
