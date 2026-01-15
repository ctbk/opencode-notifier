# Change: Notify on completion only for main sessions

## Why
Subagent runs (Task tool) create child sessions that also emit `session.idle`, causing duplicate “complete” notifications and sound/command spam.

## What Changes
- Treat OpenCode `session.idle` as “complete” only when the session is a primary/main session.
- Suppress “complete” handling for child (subagent) sessions (i.e., sessions with `parentID`) across all bound actions (notification, sound, and command).
- Keep existing behavior for non-complete events (`permission.*`, `session.error`).

## Impact
- Affected specs: `session-complete-notify` (new delta)
- Affected code: `src/index.ts` (filter `session.idle` by session metadata)
- Behavior change: Users will no longer receive “complete” notifications when a subagent finishes.

## Background / References
- Current plugin maps `session.idle` → `complete` (`src/index.ts:139-141`).
- OpenCode models subagents as sessions with `parentID` and filters those out in its own UI notifications.
- See `FINDINGS.md` for the full analysis and file references.
