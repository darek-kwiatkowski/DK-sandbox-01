import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Architecture boundaries from AGENTS.md and .ai/docs/engineering-standards.md:
// app -> core -> db, ui importable by app only, @mikro-orm/* only inside db.
// Flat config does not merge one rule across overlapping `files` globs (the
// last match wins), so each scope lists every restriction that applies to it.
const STANDARDS = "(AGENTS.md, .ai/docs/engineering-standards.md)";
const noFrameworksInCore = {
  group: ["next", "next/*", "react", "react/*", "react-dom", "react-dom/*"],
  message: `@devmentor/core holds business rules and must not import Next/React ${STANDARDS}.`,
};
const ormOnlyInDb = {
  group: ["@mikro-orm/*"],
  message: `Only @devmentor/db imports @mikro-orm/*; use the types it re-exports ${STANDARDS}.`,
};
const noAppOrUiInCore = {
  group: ["@devmentor/app", "@devmentor/app/*", "@devmentor/ui", "@devmentor/ui/*"],
  message: `@devmentor/core may depend only on @devmentor/db ${STANDARDS}.`,
};
const dbIsALeaf = {
  group: ["@devmentor/*", "next", "next/*", "react", "react-dom"],
  message: `@devmentor/db holds persistence only and depends on no other workspace package ${STANDARDS}.`,
};
const uiIsStandalone = {
  group: ["@devmentor/app", "@devmentor/app/*", "@devmentor/core", "@devmentor/core/*", "@devmentor/db", "@devmentor/db/*", "@mikro-orm/*"],
  message: `@devmentor/ui is presentation only and must not import other workspace packages ${STANDARDS}.`,
};
const appGoesThroughCore = {
  group: ["@devmentor/db", "@devmentor/db/*"],
  message: `@devmentor/app reaches data only through @devmentor/core services (withScope) ${STANDARDS}.`,
};
const noPanelPrimitivesOnMarketing = {
  group: ["@devmentor/ui/components/ui/*", "@devmentor/ui/backend/*"],
  message: `Marketing pages use plain Tailwind; shadcn primitives and backend panel blocks are for /backend ${STANDARDS}.`,
};

const restrictImports = (files, ...patterns) => ({
  files,
  rules: { "@typescript-eslint/no-restricted-imports": ["error", { patterns }] },
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      next: { rootDir: "packages/app/" },
    },
  },
  {
    files: ["packages/**/*.{js,jsx,mjs,ts,tsx,mts}"],
    rules: {
      "import/no-relative-packages": "error",
      // Checked against the nearest package.json, i.e. the importing package.
      "import/no-extraneous-dependencies": [
        "error",
        { devDependencies: ["**/*.config.{js,mjs,ts}", "**/*.test.{ts,tsx}"] },
      ],
    },
  },
  {
    files: ["packages/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      // Use the shared pino logger from @devmentor/core instead.
      "no-console": "error",
    },
  },
  {
    files: ["packages/app/**/*.{ts,tsx}", "packages/ui/**/*.{ts,tsx}"],
    ignores: ["packages/ui/src/backend/api/apiCall.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: `Call the API through apiCall/apiCallOrThrow from @devmentor/ui/backend/api ${STANDARDS}.` },
      ],
    },
  },
  {
    files: ["packages/app/src/app/**/route.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "TryStatement", message: `Route handlers use apiHandler/makeCrudRoute instead of try/catch ${STANDARDS}.` },
      ],
    },
  },
  restrictImports(["packages/core/**/*.{ts,tsx}"], noFrameworksInCore, ormOnlyInDb, noAppOrUiInCore),
  restrictImports(["packages/db/**/*.{ts,tsx}"], dbIsALeaf),
  restrictImports(["packages/ui/**/*.{ts,tsx}"], uiIsStandalone),
  restrictImports(["packages/app/**/*.{ts,tsx}"], ormOnlyInDb, appGoesThroughCore),
  restrictImports(["packages/app/src/app/(marketing)/**/*.{ts,tsx}"], ormOnlyInDb, appGoesThroughCore, noPanelPrimitivesOnMarketing),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
    ".ai/**",
  ]),
]);

export default eslintConfig;
