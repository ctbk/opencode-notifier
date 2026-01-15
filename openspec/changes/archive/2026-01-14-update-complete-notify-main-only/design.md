## Context
The notifier plugin currently triggers its internal `complete` event type on every OpenCode bus event `session.idle`. OpenCode emits `session.idle` for both primary sessions and subagent (child) sessions.

The `session.idle` event payload only includes a `sessionID`, so determining “main vs subagent” requires looking up the session metadata (specifically `parentID`).

## Goals / Non-Goals
- Goals:
  - Only fire the plugin’s “complete” handling for primary sessions.
  - Avoid introducing new user configuration unless clearly necessary.
  - Preserve best-effort behavior (don’t block other event handling on transient lookup failures).
- Non-Goals:
  - Change OpenCode’s event model.
  - Add a new “subagent complete” event type.

## Decisions
- Decision: Filter `session.idle` by session `parentID`.
  - Primary session is defined as a session with no `parentID`.
  - Child session is defined as a session with `parentID`.
- Decision: Best-effort lookup.
  - If session metadata cannot be fetched (network/runtime failure) or `sessionID` is missing, treat the event as primary (continue notifying). This mirrors OpenCode UI behavior where an unknown session does not trip the `parentID` filter.

## Alternatives Considered
- Filter by event payload only: Not possible because `session.idle` does not carry `parentID`.
- Add config flag (e.g., `notifySubagentComplete`): Adds surface area; not requested.
- Suppress notifications if lookup fails: Avoids spam but risks missing main completion notifications.

## Risks / Trade-offs
- Adds an extra `client.session.get` call for `session.idle` events.
  - Mitigation: Only perform the lookup for `session.idle` events; keep it best-effort.

## Open Questions
- None.
