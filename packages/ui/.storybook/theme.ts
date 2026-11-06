export type ThemeName = "light" | "dark";

/**
 * Applies the theme to the document root, so portalled overlays (dialogs, menus,
 * popovers) rendered outside the story get it too.
 */
export function applyTheme(theme: ThemeName, root: HTMLElement = document.documentElement): void {
  root.classList.toggle("dark", theme === "dark");
}
