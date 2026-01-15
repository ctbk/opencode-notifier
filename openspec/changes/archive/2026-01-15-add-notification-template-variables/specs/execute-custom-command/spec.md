## MODIFIED Requirements

### Requirement: Command Execution
The system SHALL execute the configured command for each notifier event when `command.enabled` is true.

The system SHALL substitute template variables in both `command.path` and `command.args[]` before invoking the command.

Supported variables MUST include:
- `{event}`: the notifier event key (e.g. `complete`, `permission`, `error`)
- `{message}`: the final rendered notification message for the event
- `{hostname}`: the hostname where OpenCode is running
- `{working_dir}`: the OpenCode working directory
- `{session_id}`: the OpenCode session ID, when available
- `{session_title}`: the OpenCode session title, when available
- `{last_message}`: the last assistant message text for the session, when available
- `{last_sentence}`: the last sentence of `{last_message}`, when available

When a variable cannot be resolved for an event, the system SHALL substitute an empty string.

#### Scenario: Event triggers command
- **WHEN** a notifier event occurs and `command.enabled` is true
- **THEN** the command is invoked with template variables substituted in both the command path and its arguments

#### Scenario: Command disabled
- **WHEN** a notifier event occurs and `command.enabled` is false or missing
- **THEN** the command is not invoked

#### Scenario: Session-scoped variables are unavailable
- **WHEN** a notifier event occurs that does not include a session identifier
- **THEN** `{session_id}`, `{session_title}`, `{last_message}`, and `{last_sentence}` are substituted as empty strings
