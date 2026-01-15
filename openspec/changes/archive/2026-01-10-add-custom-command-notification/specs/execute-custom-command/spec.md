## ADDED Requirements

### Requirement: Custom Command Configuration
The system SHALL allow an optional global `command` configuration with `enabled` (boolean), `path` (string), and `args` (array of strings).

#### Scenario: Configuration provided
- **WHEN** a user sets `command.enabled` to true with a valid `path`
- **THEN** the configuration is loaded and stored for execution

### Requirement: Command Execution
The system SHALL execute the configured command for each notifier event when `command.enabled` is true, substituting `{event}` and `{message}` tokens in `args` before invoking the command.

#### Scenario: Event triggers command
- **WHEN** a notifier event occurs and `command.enabled` is true
- **THEN** the command is invoked with `{event}` and `{message}` substituted in the arguments

#### Scenario: Command disabled
- **WHEN** a notifier event occurs and `command.enabled` is false or missing
- **THEN** the command is not invoked

### Requirement: Command Failure Handling
The system MUST treat command execution as best-effort and SHALL NOT block or prevent sound or notification delivery when the command fails.

#### Scenario: Command fails
- **WHEN** the command exits with an error
- **THEN** the sound and notification flows still execute
