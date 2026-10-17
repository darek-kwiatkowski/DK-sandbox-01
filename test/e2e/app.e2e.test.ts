import { createAppContainer, withScope, type AppContainer } from "@devmentor/core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AgentBrowser } from "../support/agent-browser";

const baseUrl = process.env.E2E_BASE_URL!;
const browser = new AgentBrowser(`devmentor-e2e-${process.pid}`);
let container: AppContainer;

beforeAll(() => {
  // Seeds and resets data through the same services the app uses.
  container = createAppContainer({ orm: { clientUrl: process.env.E2E_DATABASE_URL, debug: false } });
});

afterAll(async () => {
  await browser.close().catch(() => undefined);
  await container?.dispose();
});

describe("DevMentor (ephemeral app, agent-browser)", () => {
  it("serves the marketing home page", async () => {
    await browser.open(`${baseUrl}/`);

    expect(await browser.text("h1")).toBe("Rozwijaj się jako programista z pomocą mentora.");
  });

  it("reports liveness without touching the database", async () => {
    const response = await fetch(`${baseUrl}/api/health`);

    expect(await response.json()).toEqual({ ok: true, data: { status: "ok" } });
  });

  it("lists users from the database in the /backend panel", async () => {
    await withScope(async ({ userService }) => {
      await userService.create({ email: "ada@example.test", name: "Ada" });
      await userService.create({ email: "grace@example.test", name: "Grace" });
    }, container);

    await browser.open(`${baseUrl}/backend`);
    await browser.waitForText("ada@example.test");

    const table = await browser.text("table");
    expect(table).toContain("Ada");
    expect(table).toContain("grace@example.test");
  });

  it("shows the empty state when there are no users", async () => {
    await container.cradle.orm.schema.clear();

    await browser.open(`${baseUrl}/backend`);
    await browser.waitForText("Brak użytkowników.");

    expect(await browser.run<{ count: number }>("get", "count", "table")).toMatchObject({ count: 0 });
  });

  it("raises no uncaught JavaScript errors", async () => {
    expect(await browser.pageErrors()).toEqual([]);
  });
});
