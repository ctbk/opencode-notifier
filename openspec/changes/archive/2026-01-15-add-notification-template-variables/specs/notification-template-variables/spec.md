## ADDED Requirements

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

#### Scenario: Completion includes last sentence
- **WHEN** `messages.complete` includes `{last_sentence}` and the session has at least one assistant message
- **THEN** `{last_sentence}` renders to the last sentence from the most recent assistant message
