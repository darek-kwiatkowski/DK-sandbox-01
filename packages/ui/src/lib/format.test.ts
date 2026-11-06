import { describe, expect, it } from "vitest";

import { formatDateTime, formatPln } from "./format";

describe("formatPln", () => {
  it("formats integer grosze as Polish złoty", () => {
    expect(formatPln(18000)).toBe("180,00 zł");
    expect(formatPln(123456)).toBe("1234,56 zł");
  });
});

describe("formatDateTime", () => {
  it("prints weekday, date, 24-hour time and the zone label", () => {
    expect(formatDateTime("2026-11-13T17:00:00Z", { timeZone: "Europe/Warsaw" })).toBe("pt., 13 lis, 18:00 CET");
  });

  it("uses the runtime zone when none is given", () => {
    expect(formatDateTime("2026-11-13T17:00:00Z")).toMatch(/13 lis/);
  });
});
