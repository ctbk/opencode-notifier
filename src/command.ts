import { spawn } from "child_process"
import type { EventType, NotifierConfig } from "./config"
import { renderTemplate } from "./template"
import type { TemplateContext } from "./template"

export type CommandSpawnOptions = {
  stdio: "ignore"
  detached: true
}

export type CommandSpawner = (
  command: string,
  args: string[],
  options: CommandSpawnOptions
) => ReturnType<typeof spawn>

const defaultSpawnProcess: CommandSpawner = (command, args, options) =>
  spawn(command, args, options)

export interface RunCommandOptions {
  context?: TemplateContext
  render?: typeof renderTemplate
  spawnProcess?: CommandSpawner
  logger?: Pick<typeof console, "error">
}

export function runCommand(
  config: NotifierConfig,
  event: EventType,
  message: string,
  options?: RunCommandOptions
): void {
  if (!config.command.enabled || !config.command.path) {
    return
  }

  const {
    context: providedContext = {},
    render = renderTemplate,
    spawnProcess = defaultSpawnProcess,
    logger = console,
  } = options ?? {}

  const templateContext: TemplateContext = {
    event,
    message,
    ...providedContext,
  }

  const args = (config.command.args ?? []).map((arg) => render(arg, templateContext))
  const command = render(config.command.path, templateContext)

  const proc = spawnProcess(command, args, {
    stdio: "ignore",
    detached: true,
  })

  const commandDetails = `${command} ${args.join(" ")}`.trim()

  proc.on("error", (error: Error) => {
    logger.error(`[opencode-notifier] Failed to execute command: ${error.message}`)
    logger.error(`[opencode-notifier] Command: ${commandDetails}`)
  })

  proc.on("exit", (code, signal) => {
    if (code && code !== 0) {
      logger.error(`[opencode-notifier] Command exited with code ${code}.`)
      logger.error(`[opencode-notifier] Command: ${commandDetails}`)
      return
    }

    if (signal) {
      logger.error(`[opencode-notifier] Command terminated with signal ${signal}.`)
      logger.error(`[opencode-notifier] Command: ${commandDetails}`)
    }
  })

  proc.unref()
}
