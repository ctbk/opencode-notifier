# session-complete-notify Specification

## Purpose
TBD - created by archiving change update-complete-notify-main-only. Update Purpose after archive.
## Requirements
### Requirement: Primary Session Completion Notifications
The system SHALL trigger the notifier "complete" event only for primary OpenCode sessions, including all bound actions (notification, sound, and command).

#### Scenario: Primary session reaches idle
- **GIVEN** an OpenCode `session.idle` event for a session with no `parentID`
- **WHEN** the notifier plugin processes the event
- **THEN** it triggers the notifier `complete` event actions

#### Scenario: Child (subagent) session reaches idle
- **GIVEN** an OpenCode `session.idle` event for a session with a `parentID`
- **WHEN** the notifier plugin processes the event
- **THEN** it SHALL NOT trigger notifier `complete` event actions

#### Scenario: Session metadata unavailable
- **GIVEN** an OpenCode `session.idle` event but the session metadata cannot be fetched
- **WHEN** the notifier plugin processes the event
- **THEN** it SHALL treat the session as primary and trigger notifier `complete` event actions

