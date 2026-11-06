import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// Every story runs as a test in Chromium: render, play function and axe checks
// (a11y.test = "error"). STORYBOOK_THEME runs the suite in the light or dark theme.
const theme = process.env.STORYBOOK_THEME === "dark" ? "dark" : "light";

export default defineConfig({
  plugins: [storybookTest({ configDir: ".storybook", initialGlobals: { theme } })],
  publicDir: ".storybook/public",
  // Pre-bundled up front: discovering them mid-run makes Vite reload and fail the first run.
  optimizeDeps: {
    include: ["class-variance-authority", "cn", "lucide-react", "radix-ui", "storybook/test", "msw", "msw-storybook-addon/csf3"],
  },
  test: {
    name: `storybook-${theme}`,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
