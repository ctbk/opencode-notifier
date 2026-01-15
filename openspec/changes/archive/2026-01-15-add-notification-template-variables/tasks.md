## 1. Implementation (TDD)
- [x] 1.1 Add a pure template renderer module (no OpenCode calls)
- [x] 1.2 Add unit tests for renderer behavior (tokens, unknown tokens, missing values)
- [x] 1.3 Add context builder that derives `{hostname}` and `{working_dir}`
- [x] 1.4 Add best-effort session enrichment for `{session_title}`
- [x] 1.5 Add best-effort message enrichment for `{last_message}` and `{last_sentence}`
- [x] 1.6 Apply template rendering to `messages.<event>` before sending notifications
- [x] 1.7 Apply template rendering to `command.path` and `command.args[]`

## 2. Documentation
- [x] 2.1 Update `README.md` with the supported template variables and examples
- [x] 2.2 Add a short note about best-effort resolution and when variables are empty

## 3. Validation
- [x] 3.1 Run `bun run typecheck`
- [x] 3.2 Manual verification in OpenCode:
  - [x] system notification includes `{hostname}` and `{working_dir}`
  - [x] completion notification includes `{session_title}`
  - [x] completion notification includes `{last_sentence}`
  - [x] custom command receives substituted args for these variables
