## 1. Implementation
- [x] 1.1 Extend `CommandConfig` with `minDuration` and parse it from config
- [x] 1.2 Determine elapsed prompt execution time
- [x] 1.3 Gate `runCommand` for all events when elapsed < `command.minDuration`
- [x] 1.4 Update README configuration docs

## 2. Validation
- [x] 2.1 Run `bun run typecheck`
- [x] 2.2 Run `bun run build` (or equivalent)
- [x] 2.3 Manual smoke test in OpenCode (short vs long sessions)
