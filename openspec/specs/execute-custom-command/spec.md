# execute-custom-command Specification

## Purpose
TBD - created by archiving change add-custom-command-notification. Update Purpose after archive.
## Requirements
### Requirement: Custom Command Configuration
The system SHALL allow an optional global `command` configuration with `enabled` (boolean), `path` (string), `args` (array of strings), and optional `minDuration` (number of seconds).

If provided, `command.minDuration` values that are `<= 0` SHALL be treated as disabled (i.e., no minimum-time gating).

#### Scenario: Configuration provided
- **WHEN** a user sets `command.enabled` to true with a valid `path`
- **THEN** the configuration is loaded and stored for execution

#### Scenario: Minimum duration configured
- **WHEN** a user sets `command.minDuration` to a number greater than 0
- **THEN** the configuration is loaded and the minimum duration is available for gating command execution

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

Derivation of `{last_message}` and `{last_sentence}` MUST follow `openspec/specs/notification-template-variables/spec.md`.

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

### Requirement: Command Failure Handling
The system MUST treat command execution as best-effort and SHALL NOT block or prevent sound or notification delivery when the command fails.

#### Scenario: Command fails
- **WHEN** the command exits with an error
- **THEN** the sound and notification flows still execute

