import { asFunction } from "awilix";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppContainer, withScope, type AppContainer } from "./container";

// The ORM connects lazily, so these tests never open a connection.
const unusedDatabase = { orm: { clientUrl: "postgresql://unused@127.0.0.1:1/unused" } };

describe("createAppContainer", () => {
  let container: AppContainer;
  afterEach(async () => {
    await container.dispose();
  });

  it("shares the ORM across scopes and gives every scope its own EntityManager", () => {
    container = createAppContainer(unusedDatabase);
    const first = container.createScope().cradle;
    const second = container.createScope().cradle;

    expect(first.orm).toBe(second.orm);
    expect(first.em).toBe(first.em);
    expect(first.em).not.toBe(second.em);
    expect(first.userService).not.toBe(second.userService);
  });

  it("rejects a singleton that depends on a scoped registration (strict mode)", () => {
    container = createAppContainer(unusedDatabase);
    const leaky = container.register({
      leaky: asFunction(({ em }: { em: unknown }) => ({ em })).singleton(),
    });

    expect(() => leaky.createScope().cradle.leaky).toThrow(/lifetime/i);
  });
});

describe("withScope", () => {
  it("disposes the scope after the callback, also when it throws", async () => {
    const container = createAppContainer(unusedDatabase);
    const dispose = vi.fn();
    const withResource = container.register({
      resource: asFunction(() => ({ dispose })).scoped().disposer((r) => r.dispose()),
    });

    await expect(withScope((cradle) => (cradle as typeof withResource.cradle).resource, withResource)).resolves.toBeDefined();
    await expect(
      withScope((cradle) => {
        void (cradle as typeof withResource.cradle).resource;
        throw new Error("boom");
      }, withResource),
    ).rejects.toThrow("boom");

    expect(dispose).toHaveBeenCalledTimes(2);
    await container.dispose();
  });
});
