import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Vitest 5.0.5's cached globalSetup code is a Buffer, breaking Vite's
    // error source mapping. Disable the disk module cache until that is fixed.
    fsModuleCache: false,
    name: "e2e",
    include: ["test/e2e/**/*.e2e.test.ts"],
    globalSetup: ["test/e2e/global-setup.ts"],
    // One app, one database, one browser session: run sequentially.
    fileParallelism: false,
    maxWorkers: 1,
    testTimeout: 60_000,
    hookTimeout: 180_000,
  },
});
