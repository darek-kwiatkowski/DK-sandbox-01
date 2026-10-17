import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));

// Single .env for the whole monorepo, in the repository root.
loadEnvConfig(workspaceRoot);

const nextConfig: NextConfig = {
  turbopack: {
    root: workspaceRoot,
  },
  outputFileTracingRoot: workspaceRoot,
  // MikroORM loads drivers/extensions dynamically; it must not be bundled.
  // (@mikro-orm/core and pg are already on Next's built-in list.)
  serverExternalPackages: ["@mikro-orm/postgresql", "@mikro-orm/sql", "@mikro-orm/migrations"],
};

export default nextConfig;
