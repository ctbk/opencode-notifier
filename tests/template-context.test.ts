import assert from "node:assert/strict"
import os from "node:os"
import { describe, it } from "node:test"
import type { PluginInput } from "@opencode-ai/plugin"
import { buildTemplateContext } from "../src/template-context"

describe("buildTemplateContext", () => {
  it("prefers the OpenCode working directory and honors a hostname override", async () => {
    const client = {
      path: {
        get: async () => ({
          data: {
            directory: "/opencode/sample",
          },
        }),
      },
    }

    const context = await buildTemplateContext({
      client: client as unknown as PluginInput["client"],
      hostname: () => "template-host",
    })

    assert.strictEqual(context.working_dir, "/opencode/sample")
    assert.strictEqual(context.hostname, "template-host")
  })

  it("falls back to the process working directory when the OpenCode API fails", async () => {
    const expectedCwd = process.cwd()
    const expectedHostname = os.hostname()

    const client = {
      path: {
        get: async () => {
          throw new Error("unreachable")
        },
      },
    }

    const context = await buildTemplateContext({ client: client as unknown as PluginInput["client"] })

    assert.strictEqual(context.working_dir, expectedCwd)
    assert.strictEqual(context.hostname, expectedHostname)
  })

  it("enriches the context with the session title when available", async () => {
    const client = {
      session: {
        get: async () => ({
          data: {
            title: "Template Session",
          },
        }),
      },
    }

    const context = await buildTemplateContext({
      client: client as unknown as PluginInput["client"],
      sessionId: "session-123",
    })

    assert.strictEqual(context.session_title, "Template Session")
  })

  it("falls back to an empty session title when the lookup fails", async () => {
    const client = {
      session: {
        get: async () => {
          throw new Error("unreachable")
        },
      },
    }

    const context = await buildTemplateContext({
      client: client as unknown as PluginInput["client"],
      sessionId: "session-456",
    })

    assert.strictEqual(context.session_title, "")
  })

  it("enriches the context with the last assistant message and sentence", async () => {
    const trailingSentence = `${"x".repeat(210)}.`
    const client = {
      session: {
        messages: async () => ({
          data: [
            {
              info: { role: "user" },
              parts: [],
            },
            {
              info: { role: "assistant" },
              parts: [
                { type: "text", text: "Irrelevant first sentence. " },
                { type: "text", text: trailingSentence },
              ],
            },
          ],
        }),
      },
    }

    const context = await buildTemplateContext({
      client: client as unknown as PluginInput["client"],
      sessionId: "session-789",
    })

    const expectedLastSentence = trailingSentence.slice(0, 200).trim()

    assert.strictEqual(context.last_message, `Irrelevant first sentence. ${trailingSentence}`)
    assert.strictEqual(context.last_sentence, expectedLastSentence)
  })

  it("defaults last message placeholders to empty strings when message retrieval fails", async () => {
    const client = {
      session: {
        messages: async () => {
          throw new Error("unreachable")
        },
      },
    }

    const context = await buildTemplateContext({
      client: client as unknown as PluginInput["client"],
      sessionId: "session-000",
    })

    assert.strictEqual(context.last_message, "")
    assert.strictEqual(context.last_sentence, "")
  })
})
