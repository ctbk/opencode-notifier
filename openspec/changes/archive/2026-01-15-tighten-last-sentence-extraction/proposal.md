# Change: Tighten last-sentence extraction for assistant messages

## Why
Notifications and commands can include `{last_sentence}`, but the current sentence-splitting treats any `.` as a sentence boundary. This causes incorrect results for common tokens like filenames (e.g. `README.md`) and ignores message boundaries where users separate thoughts with newlines.

## What Changes
- Treat newlines as sentence separators when deriving `{last_sentence}` (including empty lines).
- Treat `.` as a sentence terminator only when it appears to end a sentence (e.g. followed by whitespace/end), so dots inside tokens like `README.md` do not split sentences.
- Keep the existing max-length behavior (truncate derived `{last_sentence}` to 200 characters).

## Impact
- Affected specs: `openspec/specs/notification-template-variables/spec.md`, `openspec/specs/execute-custom-command/spec.md`.
- Affected code (expected): `src/template-context.ts` (the `{last_sentence}` extraction helper) and associated tests.
- User-visible behavior: `{last_sentence}` becomes more stable/accurate in notifications and custom commands.
