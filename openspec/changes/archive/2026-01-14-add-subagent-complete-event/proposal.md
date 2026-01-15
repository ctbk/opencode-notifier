# Change: Add configurable subagent completion notifications

## Why
Today the plugin only triggers the internal `complete` event for *primary* (main) OpenCode sessions. When a subagent finishes (child session reaching idle), the plugin intentionally does nothing.

Users want distinct behavior for subagent completion: e.g. a different sound (and no system notification) for subagent completion, while keeping sound + system notification for main completion.

## What Changes
- Add a new notifier configuration event key: `subagent_complete`.
- Trigger `subagent_complete` when OpenCode emits `session.idle` for a **child** session (i.e. session has a `parentID`).
- Keep existing `complete` behavior for **primary** sessions unchanged.
- Allow configuring `subagent_complete` per-event behavior:
  - notification type(s): `sound` and/or system `notification`.
  - message: `messages.subagent_complete`.
  - sound: `sounds.subagent_complete`.
- Default `subagent_complete` to **disabled** to avoid behavior changes and notification spam.

## Impact
- Affected specs:
  - `execute-custom-command` (command can now fire for `subagent_complete` events too)
  - `subagent-complete-notify` (new delta)
- Affected code (expected): `src/index.ts`, `src/config.ts`, `README.md`
- Backward compatibility:
  - Existing configs continue to work.
  - Default behavior remains unchanged unless users opt into `subagent_complete`.
