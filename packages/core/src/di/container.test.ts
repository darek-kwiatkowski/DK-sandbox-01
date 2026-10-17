import { asClass, asFunction, asValue } from "awilix";
import { describe, expect, it, vi } from "vitest";
import { buildContainer, type AppContainer } from "./container";

// Test-only registrations; the cast keeps AppCradle free of test entries.
type TestCradle = Record<string, unknown>;
const cradleOf = (container: AppContainer) => container.cradle as TestCradle;

describe("buildContainer", () => {
  it("runs modules in order, so later modules can use earlier registrations", () => {
    const calls: string[] = [];
    const container = buildContainer([
      (c) => {
        calls.push("first");
        c.register({ greeting: asValue("hello") });
      },
      (c) => {
        calls.push("second");
        c.register({
          message: asFunction(({ greeting }: { greeting: string }) => `${greeting} world`),
        });
      },
    ]);

    expect(calls).toEqual(["first", "second"]);
    expect(cradleOf(container).message).toBe("hello world");
  });

  it("injects dependencies by property name (PROXY mode)", () => {
    class Greeter {
      constructor(private readonly deps: { name: string }) {}
      greet() {
        return `hi ${this.deps.name}`;
      }
    }
    const container = buildContainer([
      (c) => c.register({ name: asValue("Ada"), greeter: asClass(Greeter) }),
    ]);

    expect((cradleOf(container).greeter as Greeter).greet()).toBe("hi Ada");
  });

  it("shares singletons across scopes and isolates scoped registrations per scope", () => {
    const container = buildContainer([
      (c) =>
        c.register({
          shared: asFunction(() => ({})).singleton(),
          perRequest: asFunction(() => ({})).scoped(),
        }),
    ]);
    const first = cradleOf(container.createScope());
    const second = cradleOf(container.createScope());

    expect(first.shared).toBe(second.shared);
    expect(first.perRequest).toBe(first.perRequest);
    expect(first.perRequest).not.toBe(second.perRequest);
  });

  it("rejects a singleton that depends on a scoped registration (strict mode)", () => {
    const container = buildContainer([
      (c) =>
        c.register({
          perRequest: asFunction(() => ({})).scoped(),
          leaky: asFunction(({ perRequest }: { perRequest: object }) => ({ perRequest })).singleton(),
        }),
    ]);

    expect(() => cradleOf(container.createScope()).leaky).toThrow(/lifetime/i);
  });

  it("calls disposers of resolved singletons on dispose()", async () => {
    const close = vi.fn();
    const container = buildContainer([
      (c) => c.register({ resource: asFunction(() => ({ close })).singleton().disposer((r) => r.close()) }),
    ]);

    void cradleOf(container).resource;
    await container.dispose();

    expect(close).toHaveBeenCalledOnce();
  });
});
