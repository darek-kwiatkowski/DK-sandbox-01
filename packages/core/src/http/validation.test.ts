import { z } from "zod";
import { describe, expect, it } from "vitest";
import { ValidationError } from "./errors";
import { parseInput, readJsonBody } from "./validation";

const schema = z.object({ email: z.email(), profile: z.object({ name: z.string().min(1) }) });

describe("parseInput", () => {
  it("returns only the schema's fields, dropping anything else the client sent (no mass assignment)", () => {
    const parsed = parseInput(schema, {
      email: "ada@example.test",
      profile: { name: "Ada" },
      id: "00000000-0000-0000-0000-000000000000",
      status: "confirmed",
    });

    expect(parsed).toEqual({ email: "ada@example.test", profile: { name: "Ada" } });
  });

  it("throws ValidationError with field errors keyed by path", () => {
    try {
      parseInput(schema, { email: "nope", profile: { name: "" } });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(Object.keys((error as ValidationError).fieldErrors).sort()).toEqual(["email", "profile.name"]);
    }
  });
});

describe("toFieldErrors via parseInput", () => {
  it("files issues without a path (object-level rules) under _form", () => {
    const passwords = z
      .object({ password: z.string(), repeat: z.string() })
      .refine((value) => value.password === value.repeat, "Hasła muszą być identyczne");

    try {
      parseInput(passwords, { password: "a", repeat: "b" });
      expect.unreachable();
    } catch (error) {
      expect((error as ValidationError).fieldErrors).toEqual({ _form: ["Hasła muszą być identyczne"] });
    }
  });

  it("collects several messages for the same field", () => {
    const strict = z.object({ name: z.string().min(3, "Za krótkie").regex(/^[A-Z]/, "Wielka litera") });

    try {
      parseInput(strict, { name: "a" });
      expect.unreachable();
    } catch (error) {
      expect((error as ValidationError).fieldErrors).toEqual({ name: ["Za krótkie", "Wielka litera"] });
    }
  });
});

describe("readJsonBody", () => {
  it("returns the parsed JSON body", async () => {
    const request = new Request("http://test", { method: "POST", body: JSON.stringify({ a: 1 }) });
    await expect(readJsonBody(request)).resolves.toEqual({ a: 1 });
  });

  it("turns malformed JSON into a ValidationError", async () => {
    const request = new Request("http://test", { method: "POST", body: "{not json" });
    await expect(readJsonBody(request)).rejects.toBeInstanceOf(ValidationError);
  });
});
