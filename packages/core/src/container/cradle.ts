import type { EntityManager, MikroORM } from "@devmentor/db";
import type { UserService } from "../services/auth/user.service";

/**
 * Everything resolvable from the DI container. Every new dependency is one
 * explicit line here and one in `container.ts` (no auto-discovery).
 */
export interface Cradle {
  /** Process singleton; closed by `container.dispose()`. */
  orm: MikroORM;
  /** Request-scoped fork (own Unit of Work). Never use `orm.em` directly. */
  em: EntityManager;
  userService: UserService;
}
