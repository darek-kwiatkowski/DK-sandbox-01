// Entry point of `npm run setup`; the logic lives in ./setup/installer.mjs.
import { resolve } from "node:path";
import { createContext, runSetup } from "./setup/installer.mjs";

process.exitCode = await runSetup(createContext(resolve(import.meta.dirname, ".."), process.env));
