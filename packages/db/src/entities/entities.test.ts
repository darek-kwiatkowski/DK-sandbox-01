import { afterAll, describe, expect, it } from "vitest";
import { createOrm } from "../orm";
import { entities, User } from "./index";

// MikroORM connects lazily: this instance never opens a connection.
const orm = createOrm({ clientUrl: "postgresql://unused@127.0.0.1:1/unused", debug: false });
afterAll(() => orm.close());

describe("entities", () => {
  it("registers every entity", () => {
    expect(entities).toEqual([User]);
  });

  it("maps User to the users table with a unique email", () => {
    const meta = orm.getMetadata().get(User);

    expect(meta.tableName).toBe("users");
    expect(meta.properties.email.unique).toBe(true);
    expect(meta.properties.email.length).toBe(255);
    expect(meta.primaryKeys).toEqual(["id"]);
  });

  it("generates a UUID id and a creation date for new entities (base properties)", () => {
    const before = Date.now();
    const meta = orm.getMetadata().get(User);
    const em = orm.em.fork();
    const draft = em.create(User, { email: "ada@example.test", name: "Ada" });

    const id = meta.properties.id.onCreate?.(draft, em);
    const createdAt = meta.properties.createdAt.onCreate?.(draft, em);

    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(meta.properties.id.onCreate?.(draft, em)).not.toBe(id);
    expect(createdAt).toBeInstanceOf(Date);
    expect((createdAt as Date).getTime()).toBeGreaterThanOrEqual(before);
  });
});
