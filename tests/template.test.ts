import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { renderTemplate } from "../src/template"

describe("renderTemplate", () => {
  it("replaces tokens with provided context values", () => {
    const template = "Event {event} occurred in {working_dir}"
    const result = renderTemplate(template, {
      event: "complete",
      working_dir: "/home/stefano/projects",
    })

    assert.strictEqual(result, "Event complete occurred in /home/stefano/projects")
  })

  it("replaces unknown tokens with empty string", () => {
    const template = "Unknown {missing} and {other}"
    const result = renderTemplate(template, { missing: "value" })

    assert.strictEqual(result, "Unknown value and ")
  })

  it("treats nullish values as empty strings while keeping falsy data", () => {
    const template = "{event} {nullValue} {undefinedValue} {zero} {flag}"
    const result = renderTemplate(template, {
      event: "done",
      nullValue: null,
      undefinedValue: undefined,
      zero: 0,
      flag: false,
    })

    assert.strictEqual(result, "done   0 false")
  })
})
