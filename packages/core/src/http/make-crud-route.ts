import { z } from "zod";
import { withScope } from "../container/container";
import type { Cradle } from "../container/cradle";
import { apiHandler, type RouteContext, type RouteHandler } from "./api-handler";
import { requireSession, type Session } from "./auth";
import { MethodNotAllowedError } from "./errors";
import { parseInput, readJsonBody } from "./validation";

/**
 * Who may call the route. `"public"` must be a deliberate choice; `"session"`
 * requires a valid session before any service is touched.
 */
export type RouteAccess = "public" | "session";

export interface CrudContext {
  cradle: Cradle;
  /** Present when `access` is `"session"`. */
  session: Session | null;
}

interface WithInput<S extends z.ZodType> {
  schema: S;
}

export interface CrudRouteConfig<
  CreateSchema extends z.ZodType = z.ZodType,
  UpdateSchema extends z.ZodType = z.ZodType,
> {
  access: RouteAccess;
  /** GET on a collection route. */
  list?: (ctx: CrudContext) => Promise<unknown>;
  /** GET on an item route (`[id]`). */
  read?: (ctx: CrudContext, id: string) => Promise<unknown>;
  /** POST: body parsed by `schema`, only its output reaches the service. */
  create?: WithInput<CreateSchema> & { run: (ctx: CrudContext, input: z.output<CreateSchema>) => Promise<unknown> };
  /** PUT on an item route (`[id]`). */
  update?: WithInput<UpdateSchema> & {
    run: (ctx: CrudContext, id: string, input: z.output<UpdateSchema>) => Promise<unknown>;
  };
  /** DELETE on an item route (`[id]`). */
  remove?: (ctx: CrudContext, id: string) => Promise<unknown>;
}

const idSchema = z.object({ id: z.uuid() });

/** All four methods are always defined; unconfigured ones answer 405. A route file re-exports the ones it serves. */
export type CrudHandlers = Record<"GET" | "POST" | "PUT" | "DELETE", RouteHandler>;

const methodNotAllowed: RouteHandler = apiHandler(() => {
  throw new MethodNotAllowedError();
});

/**
 * Builds the handlers of a plain CRUD resource from configuration. Each
 * request gets one DI scope. Workflow endpoints use `apiHandler` directly.
 */
export function makeCrudRoute<C extends z.ZodType, U extends z.ZodType>(
  config: CrudRouteConfig<C, U>,
): CrudHandlers {
  if (config.list && config.read) {
    throw new Error("makeCrudRoute: `list` (collection route) and `read` (item route) are mutually exclusive.");
  }

  // Authentication always comes first, before input parsing or any service.
  const authenticate = (request: Request) =>
    config.access === "session" ? requireSession(request) : Promise.resolve(null);
  const inScope = <T>(session: Session | null, fn: (ctx: CrudContext) => Promise<T>) =>
    withScope((cradle) => fn({ cradle, session }));

  const handlers: CrudHandlers = {
    GET: methodNotAllowed,
    POST: methodNotAllowed,
    PUT: methodNotAllowed,
    DELETE: methodNotAllowed,
  };
  const { list, read, create, update, remove } = config;
  if (list) {
    handlers.GET = apiHandler(async (request) => inScope(await authenticate(request), list));
  }
  if (read) {
    handlers.GET = apiHandler(async (request, context) => {
      const session = await authenticate(request);
      const id = await readId(context);
      return inScope(session, (ctx) => read(ctx, id));
    });
  }
  if (create) {
    handlers.POST = apiHandler(
      async (request) => {
        const session = await authenticate(request);
        const input = parseInput(create.schema, await readJsonBody(request));
        return inScope(session, (ctx) => create.run(ctx, input));
      },
      { status: 201 },
    );
  }
  if (update) {
    handlers.PUT = apiHandler(async (request, context) => {
      const session = await authenticate(request);
      const id = await readId(context);
      const input = parseInput(update.schema, await readJsonBody(request));
      return inScope(session, (ctx) => update.run(ctx, id, input));
    });
  }
  if (remove) {
    handlers.DELETE = apiHandler(async (request, context) => {
      const session = await authenticate(request);
      const id = await readId(context);
      await inScope(session, (ctx) => remove(ctx, id));
      return null;
    });
  }
  return handlers;
}

async function readId(context: RouteContext): Promise<string> {
  return parseInput(idSchema, await context.params).id;
}
