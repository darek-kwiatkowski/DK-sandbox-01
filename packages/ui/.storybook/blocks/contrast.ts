// WCAG 2.x contrast measured from the CSS custom properties the browser resolves.
// Docs-only helper: it is not exported from @devmentor/ui.

export type Rgb = readonly [number, number, number];

/** Parses an OKLCH colour string (with optional alpha) as resolved by the browser. */
export function parseOklch(value: string): { l: number; c: number; h: number; alpha: number } | null {
  const match = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/.exec(value);
  if (!match) return null;
  const num = (raw: string) => (raw.endsWith("%") ? Number.parseFloat(raw) / 100 : Number.parseFloat(raw));
  return { l: num(match[1]), c: Number(match[2]), h: Number(match[3]), alpha: match[4] ? num(match[4]) : 1 };
}

/** OKLCH to linear sRGB (Björn Ottosson's matrices), clipped to the gamut. */
export function oklchToLinearRgb(l: number, c: number, h: number): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clip = (x: number) => Math.min(1, Math.max(0, x));
  return [
    clip(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    clip(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    clip(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  ];
}

const encode = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const decode = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);

/** Composites `top` with `alpha` over `bottom` in gamma-encoded sRGB, as browsers do. */
export function blend(top: Rgb, bottom: Rgb, alpha: number): Rgb {
  return top.map((t, i) => decode(alpha * encode(t) + (1 - alpha) * encode(bottom[i]))) as unknown as Rgb;
}

export const luminance = ([r, g, b]: Rgb) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Reads a resolved custom property from an element and converts it to linear sRGB. */
export function readColor(element: Element, token: string): { rgb: Rgb; alpha: number } | null {
  const parsed = parseOklch(getComputedStyle(element).getPropertyValue(token));
  return parsed ? { rgb: oklchToLinearRgb(parsed.l, parsed.c, parsed.h), alpha: parsed.alpha } : null;
}
