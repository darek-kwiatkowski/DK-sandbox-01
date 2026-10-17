import { z } from "zod";

// AUTH_SECRET signs session JWTs (HS256): at least 32 random bytes, e.g.
// `openssl rand -base64 48`. Optional until the auth concept issues sessions;
// requireSession fails closed when it is missing.
const MIN_AUTH_SECRET_BYTES = 32;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  AUTH_SECRET: z
    .string()
    .refine((value) => Buffer.byteLength(value, "utf8") >= MIN_AUTH_SECRET_BYTES, {
      message: `AUTH_SECRET must be at least ${MIN_AUTH_SECRET_BYTES} bytes`,
    })
    .optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

/** Validated server environment. Parsed on first use, so `next build` does not need runtime secrets. */
export function getEnv(): Env {
  cached ??= envSchema.parse(process.env);
  return cached;
}

/** Test helper: forget the cached environment after changing `process.env`. */
export function resetEnvCache(): void {
  cached = undefined;
}
