## Context
The notifier currently resolves a static `messages.<event>` string and sends it as the system notification body. For custom commands, it substitutes `{event}` and `{message}` in `command.path` and `command.args[]`.

OpenCode event payloads (notably `session.idle`) typically only carry `sessionID`, so the plugin must fetch session and message metadata to enrich notifications. This repository already uses `client.session.get` best-effort for:
- identifying child sessions (`parentID`)
- calculating elapsed duration for `command.minDuration`

## Goals / Non-Goals
- Goals:
  - Support template variables in notification message text and custom command arguments.
  - Make common runtime context available: host, working directory, session title, last assistant response.
  - Preserve best-effort behavior: failures to resolve templates must not block notifications/sounds.
  - Keep configuration backwards compatible.
- Non-Goals:
  - Add a new configuration file format.
  - Introduce complex templating language (conditionals/loops).
  - Change the OS notification title (currently fixed to "OpenCode").

## Decisions
- Decision: Introduce a single template renderer shared by notifications and commands.
  - Rationale: avoids two substitution implementations and keeps tokens consistent.

- Decision: Best-effort context enrichment.
  - If `session_id` is available for an event, fetch `session_title` via `client.session.get`.
  - Fetch `last_message` via session message listing and select the last assistant message.
  - If any lookup fails, resolve affected variables to empty string.

- Decision: Working directory source.
  - Prefer the OpenCode-reported working directory (via the OpenCode API) when available.
  - Fall back to process working directory for environments where the API is not reachable.

- Decision: Minimal sentence extraction.
  - Compute `{last_sentence}` using a lightweight heuristic (split on sentence-ending punctuation).
  - Apply a sanity char limit on the sentence length, truncating it if longer than that.
  - Do not add a heavy NLP dependency.

## Alternatives Considered
- Add separate config fields for each “kind” of notification text.
  - Rejected: users want composability and the ability to format their own messages.

- Keep templating limited to commands.
  - Rejected: the primary user value is in notification text itself.

- Make all context resolution mandatory.
  - Rejected: would introduce brittleness and could suppress notifications.

## Risks / Trade-offs
- Additional API calls on `session.idle` and `session.error`.
  - Mitigation: best-effort, and only perform lookups when templates contain variables that require them.

- Large message bodies.
  - Mitigation: rely on OS truncation initially; consider adding truncation options later.

## Migration Plan
- No migration required.
- Existing tokens `{event}` and `{message}` continue to work.
- New tokens are optional.

## Open Questions
- Exact behavior for unresolved variables (empty string vs keep literal token).
- Any need for escaping literal braces (e.g., `{{` / `}}`).
