import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { formatFinding, listFiles, run, scanText, stripMdxCode, TOKENS_FILE, utilityOf } from "./scan.mjs";

describe("utilityOf", () => {
  it("drops variants but keeps colons inside brackets and parentheses", () => {
    expect(utilityOf("md:hover:bg-primary")).toBe("bg-primary");
    expect(utilityOf("[&_svg:not([class*='size-'])]:size-4")).toBe("size-4");
    expect(utilityOf("w-(--radix-x:y)")).toBe("w-(--radix-x:y)");
    expect(utilityOf("!p-4")).toBe("p-4");
    expect(utilityOf("p-4!")).toBe("p-4");
  });
});

describe("stripMdxCode", () => {
  it("removes inline code and fenced blocks", () => {
    expect(stripMdxCode(["a `bg-zinc-900` b", "```tsx", "bg-zinc-900", "```", "c"])).toEqual(["a  b", "", "", "", "c"]);
  });
});

describe("scanText", () => {
  it("finds literal colours in any notation", () => {
    const rules = scanText('a { color: #fff; b: rgba(0,0,0,.1); c: oklch(1 0 0); d: #a1b2c3d4 }', "x.css").map((f) => f.match);
    expect(rules).toEqual(["rgba(", "oklch(", "#fff", "#a1b2c3d4"]);
  });

  it("ignores anchors and non-colour hashes", () => {
    expect(scanText('<a href="#main-content">x</a> &#123; a/#abc', "x.tsx")).toEqual([]);
  });

  it("finds palette classes, arbitrary values and off-scale spacing with their line", () => {
    const text = 'const a = "bg-zinc-900 hover:text-white/80 border-x-red-500";\nconst b = `p-[13px] gap-1.5 -mt-5 p-4 gap-x-12 m-0 data-[open]:p-2`;';
    expect(scanText(text, "x.tsx")).toEqual([
      { file: "x.tsx", line: 1, rule: "palette-class", match: "bg-zinc-900" },
      { file: "x.tsx", line: 1, rule: "palette-class", match: "hover:text-white/80" },
      { file: "x.tsx", line: 1, rule: "palette-class", match: "border-x-red-500" },
      { file: "x.tsx", line: 2, rule: "arbitrary-value", match: "p-[13px]" },
      { file: "x.tsx", line: 2, rule: "off-scale-spacing", match: "gap-1.5" },
      { file: "x.tsx", line: 2, rule: "off-scale-spacing", match: "-mt-5" },
    ]);
  });

  it("finds raw palette variables outside the tokens file", () => {
    expect(scanText("style={{ color: 'var(--sand-100)', gap: 'var(--space-4)' }}", "x.tsx").map((f) => f.rule)).toEqual([
      "raw-token",
      "raw-token",
    ]);
  });

  it("skips code in MDX prose but not in other files", () => {
    expect(scanText("Avoid `bg-zinc-900`.", "page.mdx")).toEqual([]);
    expect(scanText("Avoid `bg-zinc-900`.", "page.tsx")).toHaveLength(1);
  });
});

describe("files and run", () => {
  let root: string;
  const put = async (path: string, text: string) => {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), text);
  };

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "check-tokens-"));
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("lists scanned extensions and skips generated folders", async () => {
    await put("d/a.tsx", "");
    await put("d/b.png", "");
    await put("d/node_modules/c.ts", "");
    await put("d/public/mockServiceWorker.js", "");
    await put("d/nested/e.mdx", "");
    expect((await listFiles(join(root, "d"))).map((p) => p.slice(root.length + 1)).sort()).toEqual(["d/a.tsx", "d/nested/e.mdx"]);
  });

  it("scans the default targets, skips the tokens file and fails on findings", async () => {
    await put(TOKENS_FILE, ":root { --x: oklch(1 0 0); }");
    await put("packages/ui/src/a.tsx", '<b className="text-white" />');
    await put("packages/ui/stories/s.mdx", "ok");
    await put("packages/ui/.storybook/p.ts", "ok");
    const out: string[] = [];
    expect(await run({ root, targets: [], write: (t: string) => out.push(t) })).toBe(1);
    expect(out).toEqual([
      `${formatFinding({ file: "packages/ui/src/a.tsx", line: 1, rule: "palette-class", match: "text-white" })}\n`,
      "check:tokens: 1 value(s) outside the design tokens (see lekcja-06/tokeny.md).\n",
    ]);
  });

  it("scans only the given targets and passes when clean", async () => {
    await put("only/a.css", ".a { color: var(--foreground); }");
    const out: string[] = [];
    expect(await run({ root, targets: ["only"], write: (t: string) => out.push(t) })).toBe(0);
    expect(out).toEqual(["check:tokens: no values outside the design tokens.\n"]);
  });
});
