import { resolve } from "node:path";
import { afterEach, expect, it, vi } from "vitest";

type RunOptions = { root: string; targets: string[]; write: (text: string) => void };
const scan = vi.hoisted(() => ({ run: vi.fn<(options: RunOptions) => Promise<number>>(async () => 1) }));
vi.mock("./check-design-tokens/scan.mjs", () => scan);

afterEach(() => {
  process.exitCode = undefined;
});

it("scans from the repository root with the CLI paths and exits with the result", async () => {
  const argv = process.argv;
  process.argv = ["node", "check-design-tokens.mjs", "packages/ui/src"];
  const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);
  await import("./check-design-tokens.mjs");
  const [options] = scan.run.mock.calls[0];
  expect(options.root).toBe(resolve(import.meta.dirname, ".."));
  expect(options.targets).toEqual(["packages/ui/src"]);
  options.write("x");
  expect(stdout).toHaveBeenCalledWith("x");
  expect(process.exitCode).toBe(1);
  process.argv = argv;
  stdout.mockRestore();
});
