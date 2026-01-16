import os from "os"
import { execFile } from "child_process"
import notifier from "node-notifier"

const NOTIFICATION_TITLE = "OpenCode"
const DEBOUNCE_MS = 1000
const SECONDS_TO_MS = 1000

function escapeAppleScriptString(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
}

const platform = os.type()

type NotificationCallback = (error: Error | null, response: string, metadata?: unknown) => void

interface NotificationOptions {
  title: string
  message: string
  timeout: number
  icon?: string
}

interface PlatformNotifier {
  notify(notification: NotificationOptions, callback?: NotificationCallback): void
}

let platformNotifier: PlatformNotifier | undefined

if (platform === "Linux" || platform.match(/BSD$/)) {
  const { NotifySend } = notifier
  platformNotifier = new NotifySend({ withFallback: false })
} else if (platform === "Windows_NT") {
  const { WindowsToaster } = notifier
  platformNotifier = new WindowsToaster({ withFallback: false })
} else if (platform !== "Darwin") {
  platformNotifier = notifier
}

const lastNotificationTime: Record<string, number> = {}

export async function sendNotification(
  message: string,
  timeout: number
): Promise<void> {
  const now = Date.now()
  if (lastNotificationTime[message] && now - lastNotificationTime[message] < DEBOUNCE_MS) {
    return
  }
  lastNotificationTime[message] = now

  if (platform === "Darwin") {
    return new Promise((resolve) => {
      const escapedMessage = escapeAppleScriptString(message)
      const escapedTitle = escapeAppleScriptString(NOTIFICATION_TITLE)
      const script = `display notification "${escapedMessage}" with title "${escapedTitle}"`

      const child = execFile("osascript", ["-e", script], () => {
        resolve()
      })

      if (timeout > 0) {
        const killTimer = setTimeout(() => {
          child.kill()
        }, timeout * SECONDS_TO_MS)

        child.on("exit", () => {
          clearTimeout(killTimer)
        })
      }

      child.on("error", () => {
        resolve()
      })
    })
  }

  return new Promise((resolve) => {
    if (!platformNotifier) {
      resolve()
      return
    }

    const notificationOptions: NotificationOptions = {
      title: NOTIFICATION_TITLE,
      message: message,
      timeout: timeout,
      icon: undefined,
    }

    const callback: NotificationCallback = (error) => {
      if (error) console.error(error)
      resolve()
    }

    platformNotifier.notify(notificationOptions, callback)
  })
}
