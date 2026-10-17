import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAppContainer, withScope, type AppContainer } from "../../container/container";
import { ConflictError } from "../../http/errors";

// Run through `npm run test:integration`: its global setup starts an ephemeral
// PostgreSQL (Testcontainers) and sets TEST_DATABASE_URL. The suite DROPS the
// schema, so it never falls back to DATABASE_URL (a real dev database).
const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) {
  throw new Error("TEST_DATABASE_URL is not set: run integration tests with `npm run test:integration`.");
}

describe("UserService against PostgreSQL", () => {
  let container: AppContainer;

  beforeAll(async () => {
    if (testDatabaseUrl === process.env.DATABASE_URL) {
      throw new Error("TEST_DATABASE_URL must not equal DATABASE_URL: the integration tests drop the schema.");
    }
    container = createAppContainer({ orm: { clientUrl: testDatabaseUrl, debug: false } });
    await container.cradle.orm.schema.refresh();
  });

  afterAll(async () => {
    await container?.cradle.orm.schema.drop();
    await container?.dispose();
  });

  it("creates a user in one scope and lists it from another", async () => {
    const created = await withScope(({ userService }) => userService.create({ email: "ada@example.test", name: "Ada" }), container);
    const users = await withScope(({ userService }) => userService.list(), container);

    expect(users.map((user) => user.email)).toContain("ada@example.test");
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(created.createdAt).toBeInstanceOf(Date);
  });

  it("maps a duplicate email to ConflictError with a field error", async () => {
    const attempt = withScope(({ userService }) => userService.create({ email: "ada@example.test", name: "Ada again" }), container);

    await expect(attempt).rejects.toBeInstanceOf(ConflictError);
    await expect(attempt).rejects.toMatchObject({ fieldErrors: { email: ["Ten adres e-mail jest już zajęty."] } });
  });
});
