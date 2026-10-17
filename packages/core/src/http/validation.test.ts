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

describe("readJsonBody", () => {
  it("turns malformed JSON into a ValidationError", async () => {
    const request = new Request("http://test", { method: "POST", body: "{not json" });
    await expect(readJsonBody(request)).rejects.toBeInstanceOf(ValidationError);
  });
});
