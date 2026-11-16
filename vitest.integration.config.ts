import { defineConfig } from "vitest/config";

const integrationProject = (name: string) => ({
  test: {
    // Vitest 5.0.5 reads cached globalSetup code as a Buffer. Vite's source-map
    // handler expects text and masks setup failures with code.charCodeAt.
    // Keep source maps and test failures intact; disable only the disk module cache.
    fsModuleCache: false,
    name: `${name}:integration`,
    root: `packages/${name}`,
    include: ["src/**/*.integration.test.{ts,tsx}"],
  },
});

export default defineConfig({
  test: {
    // globalSetup executes in the root project, outside the child test projects.
    // Its disk cache must also be disabled to preserve the original setup error.
    fsModuleCache: false,
    projects: ["core", "db"].map(integrationProject),
    globalSetup: ["test/integration/global-setup.ts"],
    // All suites share one database and reset its schema: run them one at a time.
    fileParallelism: false,
    maxWorkers: 1,
    hookTimeout: 120_000,
  },
});
