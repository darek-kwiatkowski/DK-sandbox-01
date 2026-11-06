// Finds values that bypass the design tokens (packages/ui/src/styles/tokens.css):
// literal colours, Tailwind palette classes, arbitrary Tailwind values, spacing
// steps outside the approved scale and raw palette variables.
// Sources: lekcja-06/tokeny.md and .ai/specs/2026-11-06-design-system-storybook.md.
import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

/**
 * @typedef {{ file: string, line: number, rule: string, match: string }} Finding
 * @typedef {{ root: string, targets: string[], write: (text: string) => void }} RunOptions
 */

/** Directories of the design system, scanned when no paths are given. */
export const DEFAULT_TARGETS = ["packages/ui/src", "packages/ui/stories", "packages/ui/.storybook"];

/** The only file allowed to hold literal values. */
export const TOKENS_FILE = "packages/ui/src/styles/tokens.css";

const SCANNED_EXTENSIONS = new Set([".ts", ".tsx", ".css", ".mdx", ".mjs", ".js"]);
const SKIPPED_DIRECTORIES = new Set(["node_modules", "public", "storybook-static"]);

const COLOUR_FUNCTION = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/gi;
const HEX_COLOUR = /(?<![\w&/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const COLOUR_UTILITY =
  "bg|text|border(?:-[trblxyse])?|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|divide|shadow|accent|caret|placeholder";
const PALETTE_CLASS = new RegExp(`^-?(?:${COLOUR_UTILITY})-(?:(?:${PALETTE})-(?:50|[1-9]00|950)|white|black)(?:/\\d+)?$`);
const ARBITRARY_VALUE = /^-?[a-z][a-z0-9-]*-\[.+\]$/;
const SPACING_UTILITY = /^-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy])-(\d+(?:\.\d+)?)$/;
/** Tailwind steps of the approved scale: 4, 8, 12, 16, 24, 32, 48 px (tokeny.md). */
export const ALLOWED_SPACING_STEPS = new Set(["0", "1", "2", "3", "4", "6", "8", "12"]);
const RAW_VARIABLE = /var\(--(?:sand|ochre|red|space)-\d+\)/g;

/**
 * Splits `md:hover:bg-x` into variants and the utility, ignoring colons inside brackets.
 * @param {string} token
 * @returns {string}
 */
export function utilityOf(token) {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < token.length; i += 1) {
    const char = token[i];
    if (char === "[" || char === "(") depth += 1;
    else if (char === "]" || char === ")") depth -= 1;
    else if (char === ":" && depth === 0) start = i + 1;
  }
  return token.slice(start).replace(/^!|!$/g, "");
}

/**
 * Removes inline code and fenced code blocks from MDX prose, where rules quote forbidden examples.
 * @param {string[]} lines
 * @returns {string[]}
 */
export function stripMdxCode(lines) {
  let fenced = false;
  return lines.map((line) => {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      return "";
    }
    return fenced ? "" : line.replace(/`[^`]*`/g, "");
  });
}

/**
 * @param {string} line
 * @returns {{ rule: string, match: string }[]}
 */
function classFindings(line) {
  /** @type {{ rule: string, match: string }[]} */
  const findings = [];
  for (const raw of line.split(/[\s"'`{}]+/)) {
    if (!raw) continue;
    const utility = utilityOf(raw);
    if (PALETTE_CLASS.test(utility)) findings.push({ rule: "palette-class", match: raw });
    else if (ARBITRARY_VALUE.test(utility)) findings.push({ rule: "arbitrary-value", match: raw });
    else {
      const spacing = SPACING_UTILITY.exec(utility);
      if (spacing && !ALLOWED_SPACING_STEPS.has(spacing[1])) findings.push({ rule: "off-scale-spacing", match: raw });
    }
  }
  return findings;
}

/**
 * Returns every finding in one file's text.
 * @param {string} text
 * @param {string} file
 * @returns {Finding[]}
 */
export function scanText(text, file) {
  const original = text.split("\n");
  const lines = extname(file) === ".mdx" ? stripMdxCode(original) : original;
  /** @type {Finding[]} */
  const findings = [];
  lines.forEach((line, index) => {
    /** @param {string} rule @param {string} match */
    const at = (rule, match) => findings.push({ file, line: index + 1, rule, match });
    for (const m of line.matchAll(COLOUR_FUNCTION)) at("colour-literal", m[0]);
    for (const m of line.matchAll(HEX_COLOUR)) at("colour-literal", m[0]);
    for (const m of line.matchAll(RAW_VARIABLE)) at("raw-token", m[0]);
    for (const f of classFindings(line)) at(f.rule, f.match);
  });
  return findings;
}

/**
 * Lists scanned files under a directory, skipping generated and vendored folders.
 * @param {string} directory
 * @returns {Promise<string[]>}
 */
export async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  /** @type {string[]} */
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name)) files.push(...(await listFiles(path)));
    } else if (SCANNED_EXTENSIONS.has(extname(entry.name))) {
      files.push(path);
    }
  }
  return files;
}

/** @param {Finding} f */
export const formatFinding = (f) => `${f.file}:${f.line}  ${f.rule}  ${f.match}`;

/**
 * Scans the targets, prints findings and returns the process exit code.
 * @param {RunOptions} options
 * @returns {Promise<number>}
 */
export async function run({ root, targets, write }) {
  /** @type {Finding[]} */
  const findings = [];
  for (const target of targets.length > 0 ? targets : DEFAULT_TARGETS) {
    for (const path of await listFiles(join(root, target))) {
      const file = relative(root, path);
      if (file === TOKENS_FILE) continue;
      findings.push(...scanText(await readFile(path, "utf8"), file));
    }
  }
  for (const finding of findings) write(`${formatFinding(finding)}\n`);
  write(
    findings.length === 0
      ? "check:tokens: no values outside the design tokens.\n"
      : `check:tokens: ${findings.length} value(s) outside the design tokens (see lekcja-06/tokeny.md).\n`,
  );
  return findings.length === 0 ? 0 : 1;
}
