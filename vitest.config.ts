import { defineConfig } from "vitest/config";

// Unit tests of every workspace package. Integration (`*.integration.test.ts`)
// and E2E suites have their own configs because they need PostgreSQL.
const unitProject = (name: string) => ({
  test: {
    name,
    root: `packages/${name}`,
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["src/**/*.integration.test.{ts,tsx}"],
  },
});

export default defineConfig({
  test: {
    projects: [
      ...["app", "core", "db", "ui"].map(unitProject),
      // Repo tooling run by npm scripts (e.g. `npm run setup`).
      { test: { name: "scripts", root: "scripts", include: ["**/*.test.ts"] } },
    ],
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**/*.{ts,tsx}", "scripts/**/*.mjs"],
      exclude: ["packages/*/src/**/*.test.{ts,tsx}"],
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "coverage",
      // AGENTS.md: all code is 100% covered by unit tests. A 100% total
      // implies 100% in every package. Never lower this.
      thresholds: { 100: true },
    },
  },
});
