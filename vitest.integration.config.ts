import { defineConfig } from "vitest/config";

const integrationProject = (name: string) => ({
  test: {
    name: `${name}:integration`,
    root: `packages/${name}`,
    include: ["src/**/*.integration.test.{ts,tsx}"],
  },
});

export default defineConfig({
  test: {
    projects: ["core", "db"].map(integrationProject),
    globalSetup: ["test/integration/global-setup.ts"],
    // All suites share one database and reset its schema: run them one at a time.
    fileParallelism: false,
    maxWorkers: 1,
    hookTimeout: 120_000,
  },
});
