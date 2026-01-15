## 1. Implementation
- [x] 1.1 Add helper to determine if `sessionID` belongs to a child session (via `client.session.get` and `parentID`)
- [x] 1.2 Update `session.idle` handling to skip `complete` when session has `parentID`
- [x] 1.3 Ensure `permission.*` and `session.error` behavior stays unchanged

## 2. Validation
- [x] 2.1 Run `bun run typecheck`
- [x] 2.2 Manual verification:
  - [x] Main session completion triggers "complete" notification/sound/command
  - [x] Subagent completion does not trigger "complete" notification/sound/command
  - [x] Error events still notify as before

## 3. Release Notes
- [x] 3.1 Note behavior change: subagent completion no longer triggers "complete" notification/sound/command
