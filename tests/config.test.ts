import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import os from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { describe, it } from "node:test"
import assert from "node:assert/strict"

describe("loadConfig", () => {
  it("logs a warning and uses defaults on parse failure", async () => {
    const tempHome = mkdtempSync(join(os.tmpdir(), "opencode-config-"))
    const configDir = join(tempHome, ".config", "opencode")
    mkdirSync(configDir, { recursive: true })
    const configPath = join(configDir, "opencode-notifier.json")
    writeFileSync(configPath, "{not: json}")

    const originalWarn = console.warn
    const calls: unknown[][] = []

    console.warn = (...args: unknown[]) => {
      calls.push(args)
    }

    try {
      const configModule = await import(
        `${pathToFileURL(join(process.cwd(), "src", "config")).href}?test-config=${Date.now()}`
      )
      const config = (configModule as typeof import("../src/config")).loadConfig({
        configPath,
      })

      assert.strictEqual(calls.length, 1)
      assert.ok(
        typeof calls[0]?.[0] === "string" &&
          calls[0]?.[0].includes(configPath)
      )
      assert.strictEqual(config.timeout, 5)
    } finally {
      console.warn = originalWarn
    }
  })
})
