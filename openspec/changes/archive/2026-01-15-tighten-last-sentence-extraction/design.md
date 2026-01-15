## Context
`{last_sentence}` is derived from the most recent assistant message text. The current implementation uses a broad regex that splits on any `.`, `!`, or `?`, which incorrectly breaks on dots in filenames/URLs and does not respect line breaks (newlines).

## Goals / Non-Goals
- Goals:
  - Improve `{last_sentence}` accuracy for filenames like `README.md`.
  - Treat newlines as meaningful separators (common in markdown-style assistant messages).
  - Keep implementation straightforward and dependency-free.
- Non-Goals:
  - Full natural-language sentence segmentation.
  - Language-specific punctuation rules or abbreviation handling beyond the minimal heuristic.

## Decisions
- **Decision: Line-first extraction**
  - First, split the message on newlines, taking the last non-empty line/segment.
  - Rationale: matches the user request (newlines separate sentences) and aligns with common assistant formatting.

- **Decision: Conservative terminator rule for `.`**
  - Within the chosen paragraph, consider `.`, `!`, `?` as sentence terminators only when followed by whitespace/newline/end-of-string (optionally after closing quotes/brackets).
  - Rationale: avoids splitting inside tokens such as `README.md`, `example.com`, or version-like strings.

## Risks / Trade-offs
- Some edge cases (abbreviations like `e.g.`) may not split as expected. This is acceptable because `{last_sentence}` is a best-effort signal for notifications.

## Open Questions
- None (proposal assumes sentence terminators require trailing whitespace/end; this is the minimal rule that satisfies the requested examples).
