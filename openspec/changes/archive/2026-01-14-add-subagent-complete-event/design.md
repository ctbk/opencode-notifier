## Context
OpenCode publishes `session.idle` whenever any session reaches idle. Subagents created by the Task tool run in separate (child) sessions, linked via `Session.parentID`.

This plugin currently differentiates main vs subagent sessions by looking up session metadata and only firing its internal `complete` event when the session is **not** a child session.

## Goals / Non-Goals
- Goals:
  - Provide a separate notifier event (`subagent_complete`) for child session completion.
  - Allow configuring sound, system notification, message, and sound path independently from `complete`.
  - Keep current default behavior unchanged (no new notifications by default).
- Non-Goals:
  - Changing how permission/error events are filtered.
  - Adding per-event command configuration (command remains global).

## Decisions
- Decision: Map `session.idle` to one of two notifier events.
  - Primary session (no `parentID`) → `complete`
  - Child session (`parentID` present) → `subagent_complete`
  - Rationale: OpenCode’s bus event does not encode main vs subagent; session metadata is the authoritative signal.

- Decision: Default `subagent_complete` to fully disabled.
  - Rationale: existing users may use Task/subagents frequently; enabling by default would reintroduce notification/sound spam.

- Decision: Keep event naming as `subagent_complete`.
  - Rationale: existing event keys use simple identifiers (`permission`, `complete`, `error`). Underscore naming is clear, JSON-friendly, and matches the user request.

## Risks / Trade-offs
- More configuration surface area (additional event key). Mitigation: keep it optional and default-off.
- Potential confusion between “subagent completed” vs “main session completed”. Mitigation: keep clear defaults/messages and document examples.

## Migration Plan
- No migration required.
- Users who want this behavior add `events.subagent_complete` plus optional `messages.subagent_complete` / `sounds.subagent_complete`.

## Open Questions
- Should `subagent_complete` support a short alias at the root (e.g. `"subagent_complete": true`) like existing `complete`/`error`?
  - Proposal assumes yes for consistency, but it can be scoped to `events.subagent_complete` only if preferred.
