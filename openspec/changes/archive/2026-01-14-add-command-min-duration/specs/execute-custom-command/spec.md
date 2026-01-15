## MODIFIED Requirements

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
The system SHALL execute the configured command for each notifier event when `command.enabled` is true, substituting `{event}` and `{message}` tokens in `args` before invoking the command.

If `command.minDuration` is enabled and the elapsed prompt execution time is known to be less than `command.minDuration`, the system SHALL NOT invoke the command.

If the elapsed prompt execution time cannot be determined, the system SHALL execute the command as though no minimum duration was configured.

#### Scenario: Event triggers command
- **WHEN** a notifier event occurs and `command.enabled` is true
- **THEN** the command is invoked with `{event}` and `{message}` substituted in the arguments

#### Scenario: Command disabled
- **WHEN** a notifier event occurs and `command.enabled` is false or missing
- **THEN** the command is not invoked

#### Scenario: Event below minimum duration
- **WHEN** a notifier event occurs and the elapsed prompt execution time is less than `command.minDuration`
- **THEN** the command is not invoked

#### Scenario: Event meets minimum duration
- **WHEN** a notifier event occurs and the elapsed prompt execution time is greater than or equal to `command.minDuration`
- **THEN** the command is invoked
