## Context
The notifier currently supports sounds and system notifications. Users want a single global command to run alongside existing notifications when events fire, enabling local automation.

## Goals / Non-Goals
- Goals: add a global custom command that runs on every notifier event with context arguments.
- Goals: keep execution cross-platform and minimal dependencies.
- Non-Goals: per-event command customization, advanced templating, or long-running process management.

## Decisions
- Decision: add `command` configuration with `enabled`, `path`, and optional `args` array.
- Decision: substitute `{event}` and `{message}` tokens inside `args` before execution.
- Decision: execute the command directly (no shell) using a child process API like `execFile`/`spawn` for safety.
- Alternatives considered: a single command string with shell interpolation (rejected for security and quoting issues).

## Risks / Trade-offs
- Running local commands increases security risk; configuration remains opt-in and disabled by default.
- Long-running commands could overlap events; execution will be fire-and-forget with no blocking of notifications.

## Migration Plan
- None; command execution is disabled by default and additive.

## Open Questions
- Should we provide a timeout or maximum runtime for custom commands?
