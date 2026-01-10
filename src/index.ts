import type { Plugin, PluginInput } from "@opencode-ai/plugin"
import { loadConfig, isEventSoundEnabled, isEventNotificationEnabled, getMessage, getSoundPath } from "./config"
import type { EventType, NotifierConfig } from "./config"
import { sendNotification } from "./notify"
import { playSound } from "./sound"
import { runCommand } from "./command"

async function handleEvent(
  config: NotifierConfig,
  eventType: EventType
): Promise<void> {
  const promises: Promise<void>[] = []

  const message = getMessage(config, eventType)

  if (isEventNotificationEnabled(config, eventType)) {
    promises.push(sendNotification(message, config.timeout))
  }

  if (isEventSoundEnabled(config, eventType)) {
    const customSoundPath = getSoundPath(config, eventType)
    promises.push(playSound(eventType, customSoundPath))
  }

  runCommand(config, eventType, message)

  await Promise.allSettled(promises)
}

async function getSessionDuration(
  client: PluginInput["client"],
  sessionID: string
): Promise<number> {
  try {
    const response = await client.session.get({ path: { id: sessionID } })
    if (response.data) {
      const session = response.data
      const createdAt = session.time.created
      const updatedAt = session.time.updated
      // Duration in seconds (timestamps are in milliseconds)
      return (updatedAt - createdAt) / 1000
    }
  } catch {
    // If we can't fetch the session, assume duration is 0
  }
  return 0
}

export const NotifierPlugin: Plugin = async ({ client }) => {
  const config = loadConfig()

  return {
    event: async ({ event }) => {
      // @deprecated: Old permission system (OpenCode v1.0.223 and earlier)
      // Uses permission.updated event - will be removed in future version
      if (event.type === "permission.updated") {
        await handleEvent(config, "permission")
      }

      // New permission system (OpenCode v1.0.224+)
      // Uses permission.asked event
      if ((event as any).type === "permission.asked") {
        await handleEvent(config, "permission")
      }

      if (event.type === "session.idle") {
        // Only notify if session duration exceeds minDuration
        if (config.minDuration > 0) {
          const sessionID = event.properties.sessionID
          const duration = await getSessionDuration(client, sessionID)
          if (duration < config.minDuration) {
            return
          }
        }
        await handleEvent(config, "complete")
      }

      if (event.type === "session.error") {
        await handleEvent(config, "error")
      }
    },
    "permission.ask": async () => {
      await handleEvent(config, "permission")
    },
  }
}

export default NotifierPlugin
