# subagent-complete-notify Specification

## Purpose
TBD - created by archiving change add-subagent-complete-event. Update Purpose after archive.
## Requirements
### Requirement: Subagent completion event
The system SHALL expose a notifier event type named `subagent_complete` that corresponds to a subagent (child session) completing its work.

#### Scenario: Child session reaches idle
- **WHEN** OpenCode emits `session.idle` for a session whose metadata has `parentID` present
- **THEN** the system triggers the notifier event `subagent_complete`

#### Scenario: Primary session reaches idle
- **WHEN** OpenCode emits `session.idle` for a session whose metadata has no `parentID`
- **THEN** the system SHALL NOT trigger `subagent_complete`

### Requirement: Configurable subagent completion behavior
The system SHALL allow users to configure subagent completion behavior independently from the primary-session `complete` event, including:
- enabling/disabling `sound` for `subagent_complete`
- enabling/disabling system `notification` for `subagent_complete`
- configuring the notification message for `subagent_complete`
- configuring the custom sound path for `subagent_complete`

#### Scenario: Sound only for subagent completion
- **WHEN** `events.subagent_complete.sound` is enabled and `events.subagent_complete.notification` is disabled
- **THEN** the system plays the configured `subagent_complete` sound and does not send a system notification

#### Scenario: Notification only for subagent completion
- **WHEN** `events.subagent_complete.notification` is enabled and `events.subagent_complete.sound` is disabled
- **THEN** the system sends a system notification with the configured `subagent_complete` message and does not play a sound

### Requirement: Default subagent completion is disabled
The system SHALL default `subagent_complete` to disabled for both sound and notification unless explicitly configured.

#### Scenario: No user config for subagent_complete
- **WHEN** the user has not configured `subagent_complete`
- **THEN** `events.subagent_complete.sound` is false and `events.subagent_complete.notification` is false

