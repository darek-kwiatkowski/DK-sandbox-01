import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
// Execute the JavaScript entry point through Node: .bin shims are shell scripts
// on Unix and .cmd files on Windows, neither is a portable execFile target.
const BIN = resolve("node_modules/agent-browser/bin/agent-browser.js");
const COMMAND_TIMEOUT_MS = 30_000;

type Envelope<T> = { success: boolean; data: T; error: string | null };

/** Thin typed wrapper around the agent-browser CLI (`--json`), one isolated session per instance. */
export class AgentBrowser {
  constructor(private readonly session: string) {}

  /** Runs one command and returns its `data`; a failed command rejects with the CLI's error message. */
  async run<T = unknown>(...args: string[]): Promise<T> {
    let stdout: string;
    try {
      ({ stdout } = await run(process.execPath, [BIN, "--session", this.session, "--json", ...args], { timeout: COMMAND_TIMEOUT_MS, windowsHide: true }));
    } catch (error) {
      // The CLI exits non-zero on failure but still prints the JSON envelope.
      stdout = (error as { stdout?: string }).stdout ?? "";
      if (!stdout) {
        throw error;
      }
    }
    const envelope = JSON.parse(stdout) as Envelope<T>;
    if (!envelope.success) {
      throw new Error(`agent-browser ${args.join(" ")}: ${envelope.error}`);
    }
    return envelope.data;
  }

  open(url: string) {
    return this.run("open", url);
  }

  waitForText(text: string) {
    return this.run("wait", "--text", text);
  }

  async text(selector: string): Promise<string> {
    return (await this.run<{ text: string }>("get", "text", selector)).text;
  }

  async pageErrors(): Promise<unknown[]> {
    return (await this.run<{ errors: unknown[] }>("errors")).errors;
  }

  close() {
    return this.run("close");
  }
}
