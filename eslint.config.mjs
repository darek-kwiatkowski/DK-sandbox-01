import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Architecture boundaries from AGENTS.md ("Architektura DevMentor").
// Flat config does not merge one rule across overlapping `files` globs (the
// last match wins), so each scope lists every restriction that applies to it.
const noFrameworks = {
  group: ["next", "next/*", "react", "react/*", "react-dom", "react-dom/*", "@mikro-orm/*"],
  message: "@devmentor/core must stay framework-agnostic (AGENTS.md).",
};
const noWorkspacePackagesInCore = {
  group: ["@devmentor/*"],
  message: "@devmentor/core must not depend on other workspace packages (AGENTS.md).",
};
const noUpwardFromDb = {
  group: ["@devmentor/app", "@devmentor/app/*", "@devmentor/ui", "@devmentor/ui/*", "next", "next/*", "react", "react-dom"],
  message: "@devmentor/db may depend only on @devmentor/core and has no UI/Next code (AGENTS.md).",
};
const noDataInUi = {
  group: ["@devmentor/app", "@devmentor/app/*", "@devmentor/core", "@devmentor/core/*", "@devmentor/db", "@devmentor/db/*", "@mikro-orm/*"],
  message: "@devmentor/ui is presentation only and must not depend on other workspace packages (AGENTS.md).",
};
const servicesThroughDi = {
  group: ["@devmentor/db", "@devmentor/db/*"],
  allowTypeImports: true,
  message: "Resolve data services via getRequestScope() from @/server/container, not by importing @devmentor/db (AGENTS.md).",
};
const noShadcnOnFrontend = {
  group: ["@devmentor/ui", "@devmentor/ui/*"],
  message: "Frontend pages use plain Tailwind; shadcn components from @devmentor/ui are for /backend only (AGENTS.md).",
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
  restrictImports(["packages/core/**/*.{ts,tsx}"], noFrameworks, noWorkspacePackagesInCore),
  restrictImports(["packages/db/**/*.{ts,tsx}"], noUpwardFromDb),
  restrictImports(["packages/ui/**/*.{ts,tsx}"], noDataInUi),
  restrictImports(["packages/app/src/app/**/*.{ts,tsx}"], servicesThroughDi),
  restrictImports(["packages/app/src/app/(frontend)/**/*.{ts,tsx}"], servicesThroughDi, noShadcnOnFrontend),
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
