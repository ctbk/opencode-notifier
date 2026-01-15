## MODIFIED Requirements

### Requirement: Command Execution
The system SHALL execute the configured command for each notifier event when `command.enabled` is true, substituting `{event}` and `{message}` tokens in `args` before invoking the command.

#### Scenario: Subagent completion triggers command
- **WHEN** a `subagent_complete` notifier event occurs and `command.enabled` is true
- **THEN** the command is invoked with `{event}` substituted as `subagent_complete` and `{message}` substituted as the resolved message
