# Change: Add minimum duration for custom command execution

## Why
Some prompts complete very quickly (e.g., accidental runs). Users want to avoid triggering downstream automation for these short executions while keeping existing notifications/sounds unchanged.

## What Changes
- Add optional `command.minDuration` (seconds) to the notifier configuration.
- For every notifier event, skip executing the custom command when the elapsed prompt execution time is known to be less than `command.minDuration`.
- If the elapsed time cannot be determined, run the command (best-effort), preserving existing behavior.
- Preserve current behavior when `command.minDuration` is missing or `<= 0`.

## Impact
- Affected specs: `execute-custom-command`
- Affected code: `src/config.ts`, `src/index.ts`, `src/command.ts`, `README.md`
- Compatibility: Backwards compatible (default behavior unchanged)

## Open Questions
- None
