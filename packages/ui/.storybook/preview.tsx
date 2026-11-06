import type { Decorator, Preview } from "@storybook/react-vite";
import { mswLoader } from "msw-storybook-addon/csf3";
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";
import { addons } from "storybook/preview-api";

import "./preview.css";
import { applyTheme, type ThemeName } from "./theme";

// Docs pages without stories get the toolbar theme too (decorators run only for stories).
const channel = addons.getChannel();
const onGlobals = ({ globals }: { globals: Record<string, unknown> }) =>
  applyTheme(globals.theme === "dark" ? "dark" : "light");
channel.on(SET_GLOBALS, onGlobals);
channel.on(GLOBALS_UPDATED, onGlobals);

const withTheme: Decorator = (Story, context) => {
  applyTheme((context.globals.theme as ThemeName | undefined) ?? "light");
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Colour theme, applied to <html>",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [withTheme],
  // API calls in stories are answered by MSW handlers declared per story (parameters.msw).
  loaders: [mswLoader()],
  parameters: {
    // Accessibility violations fail story tests (WCAG 2.2 AA rules of axe-core).
    a11y: { test: "error" },
    layout: "padded",
    controls: { expanded: true },
    viewport: {
      options: {
        narrow: { name: "320 px", styles: { width: "320px", height: "720px" } },
        tablet: { name: "768 px", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "1440 px", styles: { width: "1440px", height: "900px" } },
      },
    },
    options: {
      storySort: {
        order: ["Design system", ["Start here"], "Foundations", "Primitives", "Product", "Patterns", "Screens"],
      },
    },
  },
};

export default preview;
