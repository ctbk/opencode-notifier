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

  proc.on("error", (error: Error) => {
    console.error(`[opencode-notifier] Failed to execute command: ${error.message}`)
    console.error(`[opencode-notifier] Command: ${command} ${args.join(" ")}`)
  })

  proc.unref()
}
