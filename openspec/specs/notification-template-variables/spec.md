# notification-template-variables Specification

## Purpose
TBD - created by archiving change add-notification-template-variables. Update Purpose after archive.
## Requirements
### Requirement: Message Template Rendering
The system SHALL treat each configured `messages.<event>` value as a template and render it into a final message string before sending a system notification.

#### Scenario: Message template contains variables
- **WHEN** the user configures `messages.complete` as "OpenCode ({hostname}) finished: {session_title}"
- **THEN** the system notification body contains the rendered values for `{hostname}` and `{session_title}`

### Requirement: Supported Template Variables
The system SHALL support the following template variables inside `messages.<event>`:
- `{event}`: the notifier event key (e.g. `complete`, `permission`, `error`)
- `{hostname}`: the hostname where OpenCode is running
- `{working_dir}`: the OpenCode working directory
- `{session_id}`: the OpenCode session ID, when available
- `{session_title}`: the OpenCode session title, when available
- `{last_message}`: the last assistant message text for the session, when available
- `{last_sentence}`: the last sentence of `{last_message}`, when available

When a variable cannot be resolved for an event, the system SHALL substitute an empty string.

#### Scenario: Permission event without session context
- **WHEN** a `permission` notifier event is processed
- **THEN** `{session_id}`, `{session_title}`, `{last_message}`, and `{last_sentence}` are substituted as empty strings

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

