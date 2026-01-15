import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { TemplateContext } from "../src/template"
import { renderNotificationMessage } from "../src/notification-message"

describe("renderNotificationMessage", () => {
  it("renders a message using the template renderer", async () => {
    const context: TemplateContext = { key: "value" }
    const contextBuilder = async () => context

    let capturedTemplate: string | null = null
    let capturedContext: TemplateContext | null = null
    const renderer = (template: string, ctx?: TemplateContext) => {
      capturedTemplate = template
      if (ctx) {
        capturedContext = ctx
      }
      return "rendered"
    }

    const result = await renderNotificationMessage({
      template: "Hello {key}",
      contextOptions: {},
      buildContext: contextBuilder,
      render: renderer,
    })

    assert.strictEqual(result, "rendered")
    assert.strictEqual(capturedTemplate, "Hello {key}")
    assert.ok(capturedContext)
    assert.deepStrictEqual(capturedContext, context)
  })

  it("falls back to the raw template when context building fails", async () => {
    const builder = async () => {
      throw new Error("context failure")
    }

    const result = await renderNotificationMessage({
      template: "Fallback",
      buildContext: builder,
    })

    assert.strictEqual(result, "Fallback")
  })

  it("falls back when rendering throws", async () => {
    const builder = async () => ({ key: "value" })
    const renderer = () => {
      throw new Error("render failure")
    }

    const result = await renderNotificationMessage({
      template: "Fallback",
      buildContext: builder,
      render: renderer,
    })

    assert.strictEqual(result, "Fallback")
  })
})
