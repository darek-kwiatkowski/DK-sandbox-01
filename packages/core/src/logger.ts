import pino from "pino";
import { getEnv } from "./config/env";

// Never log credentials: these paths are replaced with "[Redacted]".
const REDACTED_PATHS = [
  "password",
  "*.password",
  "token",
  "*.token",
  "jwt",
  "*.jwt",
  "authorization",
  "*.authorization",
  "cookie",
  "*.cookie",
  "headers.authorization",
  "headers.cookie",
  "*.headers.authorization",
  "*.headers.cookie",
];

/** Shared structured (JSON) logger; pipe to `pino-pretty` locally if needed. */
export const logger = pino({
  level: getEnv().LOG_LEVEL,
  redact: { paths: REDACTED_PATHS },
  base: { service: "devmentor" },
});
