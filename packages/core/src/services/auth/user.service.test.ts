import { UniqueConstraintViolationException, User, type EntityManager } from "@devmentor/db";
import { describe, expect, it, vi } from "vitest";
import { ConflictError } from "../../http/errors";
import { UserService } from "./user.service";

function fakeEntityManager(flush: () => Promise<void> = async () => undefined) {
  const persisted: unknown[] = [];
  const em = {
    find: vi.fn(async () => [{ email: "ada@example.test" }]),
    create: vi.fn((_entity: unknown, data: object) => ({ ...data })),
    persist: vi.fn((entity: unknown) => {
      persisted.push(entity);
      return { flush };
    }),
  };
  return { em, persisted, service: new UserService({ em: em as unknown as EntityManager }) };
}

describe("UserService", () => {
  it("lists users newest first", async () => {
    const { em, service } = fakeEntityManager();

    await expect(service.list()).resolves.toEqual([{ email: "ada@example.test" }]);
    expect(em.find).toHaveBeenCalledWith(User, {}, { orderBy: { createdAt: "desc" } });
  });

  it("creates, persists and flushes a user", async () => {
    const flush = vi.fn(async () => undefined);
    const { em, persisted, service } = fakeEntityManager(flush);

    const user = await service.create({ email: "ada@example.test", name: "Ada" });

    expect(em.create).toHaveBeenCalledWith(User, { email: "ada@example.test", name: "Ada" });
    expect(persisted).toEqual([user]);
    expect(flush).toHaveBeenCalledOnce();
  });

  it("maps a unique-constraint violation to ConflictError with an email field error", async () => {
    const { service } = fakeEntityManager(async () => {
      throw new UniqueConstraintViolationException(new Error("duplicate key value violates unique constraint"));
    });

    const attempt = service.create({ email: "ada@example.test", name: "Ada" });

    await expect(attempt).rejects.toBeInstanceOf(ConflictError);
    await expect(attempt).rejects.toMatchObject({ fieldErrors: { email: ["Ten adres e-mail jest już zajęty."] } });
  });

  it("rethrows any other persistence error unchanged", async () => {
    const failure = new Error("connection lost");
    const { service } = fakeEntityManager(async () => {
      throw failure;
    });

    await expect(service.create({ email: "ada@example.test", name: "Ada" })).rejects.toBe(failure);
  });
});
