import { describe, expect, it, vi } from "vitest";

const captured = vi.hoisted(() => ({
  config: undefined as undefined | { access: string; list: (ctx: unknown) => Promise<unknown> },
  GET: vi.fn(),
}));

vi.mock("@devmentor/core", () => ({
  makeCrudRoute: (config: typeof captured.config) => {
    captured.config = config;
    return { GET: captured.GET, POST: vi.fn(), PUT: vi.fn(), DELETE: vi.fn() };
  },
}));

describe("api/users route", () => {
  it("is a force-dynamic, explicitly public, read-only CRUD route", async () => {
    const route = await import("./route");

    expect(route.dynamic).toBe("force-dynamic");
    expect(route.GET).toBe(captured.GET);
    expect(Object.keys(route).sort()).toEqual(["GET", "dynamic"]);
    expect(captured.config?.access).toBe("public");
  });

  it("lists users through the scoped UserService", async () => {
    await import("./route");
    const users = [{ id: "1", email: "ada@example.test" }];
    const list = vi.fn(async () => users);

    await expect(captured.config!.list({ cradle: { userService: { list } } })).resolves.toBe(users);
    expect(list).toHaveBeenCalledOnce();
  });
});
