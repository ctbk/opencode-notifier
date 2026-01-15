## 1. Specification
- [x] 1.1 Validate config shape for `subagent_complete` (events/messages/sounds)
- [x] 1.2 Confirm defaults keep subagent notifications disabled

## 2. Implementation
- [x] 2.1 Extend `EventType` to include `subagent_complete`
- [x] 2.2 Extend config loader to parse `subagent_complete` overrides
- [x] 2.3 Emit `subagent_complete` on `session.idle` for child sessions
- [x] 2.4 Ensure sound/notification/command handling works for new event

## 3. Documentation
- [x] 3.1 Update `README.md` configuration examples to include `subagent_complete`
- [x] 3.2 Add example showing different main vs subagent behaviors

## 4. Validation
- [x] 4.1 Run `bun run typecheck`
- [x] 4.2 Manual check: main session idle triggers `complete`
- [x] 4.3 Manual check: child session idle triggers `subagent_complete` only when enabled
- [x] 4.4 Manual check: custom sound path fallback still works for `subagent_complete`
