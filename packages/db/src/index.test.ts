import { describe, expect, it } from "vitest";
import * as db from "./index";

describe("@devmentor/db public API", () => {
  it("exposes the ORM factory, config, entities and the ORM errors core maps", () => {
    expect(Object.keys(db).sort()).toEqual(
      ["UniqueConstraintViolationException", "User", "createOrm", "createOrmConfig", "entities"].sort(),
    );
  });
});
