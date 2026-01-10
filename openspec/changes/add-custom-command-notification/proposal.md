# Change: Add custom command notifications

## Why
Users want to trigger local scripts or integrations when notifier events occur, beyond just sounds and system notifications.

## What Changes
- Add a global custom command configuration with path, args, and enable flag.
- Execute the custom command for each notifier event with event and message context.
- Treat command execution as best-effort so sounds/notifications still fire.
- Document the configuration and examples.

## Impact
- Affected specs: execute-custom-command
- Affected code: `src/config.ts`, `src/index.ts`, `src/notify.ts` (or new `src/command.ts`), `README.md`
