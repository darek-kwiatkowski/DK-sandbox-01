// Entry point of `npm run check:tokens [paths…]`; the logic lives in ./check-design-tokens/scan.mjs.
import { resolve } from "node:path";
import { run } from "./check-design-tokens/scan.mjs";

process.exitCode = await run({
  root: resolve(import.meta.dirname, ".."),
  targets: process.argv.slice(2),
  write: (/** @type {string} */ text) => process.stdout.write(text),
});
