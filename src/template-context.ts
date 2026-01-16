import os from "node:os"
import process from "node:process"
import type { PluginInput } from "@opencode-ai/plugin"
import type { TemplateContext } from "./template"

export interface TemplateContextOptions {
  client?: PluginInput["client"]
  hostname?: () => string
  cwd?: () => string
  sessionId?: string
}

export async function buildTemplateContext(
  options: TemplateContextOptions = {}
): Promise<TemplateContext> {
  const { client, hostname, cwd, sessionId } = options

  const sessionTitle = await resolveSessionTitle(client, sessionId)
  const { last_message, last_sentence } = await resolveLastAssistantMessage(client, sessionId)

  return {
    hostname: resolveHostname(hostname),
    working_dir: await resolveWorkingDirectory(client, cwd),
    session_title: sessionTitle,
    last_message,
    last_sentence,
  }
}

function resolveHostname(hostname?: () => string): string {
  const getter = typeof hostname === "function" ? hostname : () => os.hostname()

  try {
    const value = getter()
    if (typeof value === "string" && value.length > 0) {
      return value
    }
  } catch {
    // Best-effort: fallthrough to empty string
  }

  return ""
}

async function resolveWorkingDirectory(
  client?: PluginInput["client"],
  fallbackCwd?: () => string
): Promise<string> {
  const fromOpenCode = await tryGetOpenCodeWorkingDir(client)
  if (fromOpenCode.length > 0) {
    return fromOpenCode
  }

  return resolveFallbackCwd(fallbackCwd)
}

async function resolveSessionTitle(
  client?: PluginInput["client"],
  sessionId?: string
): Promise<string> {
  if (!sessionId || sessionId.length === 0 || !client?.session?.get) {
    return ""
  }

  try {
    const response = await client.session.get({ path: { id: sessionId } })
    const title = response?.data?.title

    if (typeof title === "string" && title.length > 0) {
      return title
    }
  } catch (error) {
    console.debug("[opencode-notifier] Failed to resolve session title.", error)
  }

  return ""
}

async function tryGetOpenCodeWorkingDir(client?: PluginInput["client"]): Promise<string> {
  if (!client?.path?.get) {
    return ""
  }

  try {
    const response = await client.path.get()
    const data = response?.data

    if (typeof data?.directory === "string" && data.directory.length > 0) {
      return data.directory
    }

    if (typeof data?.worktree === "string" && data.worktree.length > 0) {
      return data.worktree
    }
  } catch (error) {
    console.debug("[opencode-notifier] Failed to resolve working directory.", error)
  }

  return ""
}

function resolveFallbackCwd(fallbackCwd?: () => string): string {
  const getter = typeof fallbackCwd === "function" ? fallbackCwd : () => process.cwd()

  try {
    const value = getter()
    if (typeof value === "string" && value.length > 0) {
      return value
    }
  } catch {
    // Best-effort: fallthrough to empty string
  }

  return ""
}

const LAST_SENTENCE_MAX_LENGTH = 200
const LINE_SPLIT_PATTERN = /\r?\n/
const CLOSING_DELIMITERS = new Set([
  '"',
  "'",
  "”",
  "’",
  ")",
  "]",
  "}",
  ">",
  "»",
])

async function resolveLastAssistantMessage(
  client?: PluginInput["client"],
  sessionId?: string
): Promise<{ last_message: string; last_sentence: string }> {
  if (!sessionId || !client?.session?.messages) {
    return { last_message: "", last_sentence: "" }
  }

  try {
    const response = await client.session.messages({
      path: { id: sessionId },
    })

    const messages = Array.isArray(response?.data) ? response.data : []
    for (let index = messages.length - 1; index >= 0; index--) {
      const entry = messages[index]
      if (entry?.info?.role !== "assistant") {
        continue
      }

      const messageText = extractMessageText(entry.parts)
      if (!messageText) {
        continue
      }

      return {
        last_message: messageText,
        last_sentence: extractLastSentence(messageText),
      }
    }
  } catch (error) {
    console.debug("[opencode-notifier] Failed to resolve last assistant message.", error)
  }

  return { last_message: "", last_sentence: "" }
}

function extractMessageText(parts: unknown): string {
  if (!Array.isArray(parts)) {
    return ""
  }

  return parts
    .filter(isTextPart)
    .map((part) => part.text)
    .join("")
    .trim()
}

function isTextPart(part: unknown): part is { type: "text"; text: string } {
  if (typeof part !== "object" || part === null) {
    return false
  }

  const candidate = part as { type?: string; text?: unknown }
  return candidate.type === "text" && typeof candidate.text === "string"
}

function extractLastSentence(value: string): string {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return ""
  }

  const lastLine = getLastNonEmptyLine(trimmed)
  const sentence = getLastSentenceFromLine(lastLine)

  return sentence.slice(0, LAST_SENTENCE_MAX_LENGTH).trim()
}

function getLastNonEmptyLine(value: string): string {
  const lines = value.split(LINE_SPLIT_PATTERN)
  for (let index = lines.length - 1; index >= 0; index--) {
    const candidate = lines[index].trim()
    if (candidate.length > 0) {
      return candidate
    }
  }

  return value
}

function getLastSentenceFromLine(line: string): string {
  let sliceStart = 0

  for (let index = 0; index < line.length; index++) {
    const character = line[index]
    if (!isSentenceTerminator(character)) {
      continue
    }

    let lookahead = index + 1
    while (lookahead < line.length && isClosingDelimiter(line[lookahead])) {
      lookahead++
    }

    if (lookahead === line.length || isWhitespaceCharacter(line[lookahead])) {
      let nextNonWhitespace = lookahead
      while (nextNonWhitespace < line.length && isWhitespaceCharacter(line[nextNonWhitespace])) {
        nextNonWhitespace++
      }

      if (nextNonWhitespace < line.length) {
        sliceStart = nextNonWhitespace
      }
    }
  }

  return line.slice(sliceStart)
}

function isSentenceTerminator(character: string): boolean {
  return character === "." || character === "!" || character === "?"
}

function isClosingDelimiter(character: string): boolean {
  return CLOSING_DELIMITERS.has(character)
}

function isWhitespaceCharacter(character: string | undefined): boolean {
  return typeof character === "string" && /\s/.test(character)
}
