## MODIFIED Requirements

### Requirement: Last Assistant Message Derivation
When `{last_message}` or `{last_sentence}` are used, the system SHALL derive them from the last assistant (LLM) message for the relevant session.

When deriving `{last_sentence}`, the system SHALL treat newlines as separators and return the last non-empty line/sentence-like segment.

When deriving `{last_sentence}`, the system SHALL treat `.`, `!`, and `?` as sentence terminators only when they appear to end a sentence (e.g. followed by whitespace/newline/end-of-string), so dots inside tokens like filenames (e.g. `README.md`) do not split sentences.

#### Scenario: Completion includes last sentence
- **WHEN** `messages.complete` includes `{last_sentence}` and the session has at least one assistant message
- **THEN** `{last_sentence}` renders to the last sentence from the most recent assistant message

#### Scenario: Newlines separate last sentence
- **WHEN** the last assistant message contains multiple lines separated by newlines and the final line has no trailing punctuation
- **THEN** `{last_sentence}` renders to the trimmed final line text

#### Scenario: Filenames do not split sentences
- **WHEN** the last assistant message contains a filename like `README.md` within the final sentence
- **THEN** `{last_sentence}` includes the full filename token and does not split at the dot inside the filename
