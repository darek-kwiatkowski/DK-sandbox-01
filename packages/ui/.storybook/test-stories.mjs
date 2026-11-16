import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const packageRoot = resolve(import.meta.dirname, "..");
const vitestCli = resolve(packageRoot, "../../node_modules/vitest/vitest.mjs");
const themes = ["light", "dark"];

for (const theme of themes) {
  const result = spawnSync(process.execPath, [vitestCli, "run", "--config", "vitest.storybook.config.ts", "--passWithNoTests"], {
    cwd: packageRoot,
    env: { ...process.env, STORYBOOK_THEME: theme },
    stdio: "inherit",
  });
  if (result.error) {
    process.stderr.write(`${result.error.message}\n`);
    process.exitCode = 1;
    break;
  }
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    break;
  }
}
