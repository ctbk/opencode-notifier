# Change: Add template variables for notification messages and commands

## Why
Users want richer, context-aware notifications and downstream automations. Today the notifier only supports static message strings and only substitutes `{event}` and `{message}` for custom command execution.

This makes it hard to include useful runtime context such as the session title, the last assistant response, or the working directory in system notifications and command arguments.

## What Changes
- Add a template-variable system that can be used in:
  - `messages.<event>` (system notification body)
  - `command.path` and `command.args[]`
- Provide a set of built-in template variables that resolve from best-effort runtime context:
  - `{event}`
  - `{hostname}`
  - `{working_dir}`
  - `{session_id}`
  - `{session_title}`
  - `{last_message}` (last assistant message text)
  - `{last_sentence}` (last sentence of last assistant message)
- Keep best-effort behavior:
  - Notification/sound delivery MUST NOT be blocked by failures to resolve template variables.
  - When a variable cannot be resolved (e.g., `permission.*` events), it resolves to an empty string.

## Impact
- Affected specs:
  - `execute-custom-command` (expand substitution variables and document substitution in both `path` and `args`)
  - `notification-template-variables` (new delta)
- Affected code (expected): `src/index.ts`, `src/config.ts`, `src/command.ts`, `src/notify.ts`, plus new shared templating helper module
- Compatibility:
  - Backwards compatible: existing configs that use `{event}` / `{message}` continue to work.
  - Any new variables are opt-in.

## Open Questions
- Should unresolved variables render as an empty string or remain as the original `{token}` text?
- Should `{last_message}` include only assistant messages (LLM output), or can it fall back to any last message when no assistant message exists?
- Do we need a max length / truncation strategy for `{last_message}` to prevent overly large notification text or command arguments?
