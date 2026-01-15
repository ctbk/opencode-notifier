import assert from "node:assert/strict"
import type { ChildProcessWithoutNullStreams } from "node:child_process"
import { describe, it } from "node:test"
import { runCommand } from "../src/command"
import type { CommandSpawnOptions, CommandSpawner } from "../src/command"
import type { NotifierConfig } from "../src/config"

const baseConfig: NotifierConfig = {
  sound: false,
  notification: false,
  timeout: 5,
  command: {
    enabled: true,
    path: "",
    minDuration: 0,
  },
  events: {
    permission: { sound: false, notification: false },
    complete: { sound: false, notification: false },
    subagent_complete: { sound: false, notification: false },
    error: { sound: false, notification: false },
  },
  messages: {
    permission: "permission",
    complete: "complete",
    subagent_complete: "subagent",
    error: "error",
  },
  sounds: {
    permission: null,
    complete: null,
    subagent_complete: null,
    error: null,
  },
}

type SpawnCapture = {
  command?: string
  args?: string[]
  options?: CommandSpawnOptions
}

function createConfig(path: string, args?: string[]): NotifierConfig {
  return {
    ...baseConfig,
    command: {
      ...baseConfig.command,
      path,
      args,
    },
  }
}

function createSpawnMock(capture: SpawnCapture) {
  return ((_command: string, _args: string[], options: CommandSpawnOptions) => {
    capture.command = _command
    capture.args = _args
    capture.options = options

    const stub = {
      on: () => stub,
      unref: () => {},
    } as unknown as ChildProcessWithoutNullStreams

    return stub
  }) as CommandSpawner
}

describe("runCommand", () => {
  it("renders templated path and args", () => {
    const capture: SpawnCapture = {}
    const config = createConfig("/bin/{event}", ["{message}", "--dir", "{hostname}"])

    runCommand(config, "complete", "Done {event}", {
      context: {
        event: "complete",
        message: "Done complete",
        hostname: "test-host",
      },
      spawnProcess: createSpawnMock(capture),
    })

    assert.strictEqual(capture.command, "/bin/complete")
    assert.deepStrictEqual(capture.args, ["Done complete", "--dir", "test-host"])
  })

  it("replaces missing tokens with empty strings", () => {
    const capture: SpawnCapture = {}
    const config = createConfig("cmd {missing}", ["{missing}", "{event}"])

    runCommand(config, "permission", "Need access", {
      context: {
        event: "permission",
        message: "Need access",
      },
      spawnProcess: createSpawnMock(capture),
    })

    assert.strictEqual(capture.command, "cmd ")
    assert.deepStrictEqual(capture.args, ["", "permission"])
  })
})
