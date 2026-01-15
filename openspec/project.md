# Project Context

## Purpose
OpenCode plugin that plays sounds and sends system notifications when permission is needed, a session completes, or errors occur. Designed to work across macOS, Linux, and Windows.

## Tech Stack
- TypeScript (ESM, strict) targeting Node.js (ES2022)
- Bun build pipeline (`bun build`) and TypeScript typechecking (`tsc --noEmit`)
- OpenCode plugin API (`@opencode-ai/plugin`)
- `node-notifier` for cross-platform notifications with native `osascript` on macOS
- OS sound playback tools (`afplay` on macOS, `paplay`/`aplay`/`mpv`/`ffplay` on Linux, PowerShell SoundPlayer on Windows)

## Project Conventions

### Code Style
- 2-space indentation, double quotes, no semicolons
- Prefer small, single-purpose functions and explicit types
- ESM modules; use `import type` for type-only imports

### Architecture Patterns
- Entry plugin in `src/index.ts` delegates to `config`, `notify`, and `sound` modules
- Configuration read from `~/.config/opencode/opencode-notifier.json` with defaults and per-event overrides
- Debounce logic prevents duplicate notifications/sounds
- OS-specific implementations for notifications and sound playback

### Testing Strategy
- No automated tests currently
- Use `bun run typecheck` for TypeScript validation
- Manual verification in OpenCode and on target OSes for notifications/sounds

### Git Workflow
- GitHub-based workflow with pull requests
- Commit messages generally follow Conventional Commits (`feat:`, `fix:`)

## Domain Context
- OpenCode plugins are configured via `opencode.json`/`opencode.jsonc`
- Supported events: `permission.updated`, `permission.asked`, `session.idle`, `session.error`, and the `permission.ask` hook
- Per-event toggles for sounds/notifications plus customizable messages and sound paths

## Important Constraints
- Must work across macOS, Linux, and Windows with minimal dependencies
- Avoid notification/sound spam (debounce)
- Custom sound paths fall back to bundled sounds if missing

## External Dependencies
- OpenCode plugin runtime (`@opencode-ai/plugin`)
- `node-notifier` and OS notification systems (e.g., `notify-send`, Windows Toaster, macOS `osascript`)
- OS sound players (`afplay`, `paplay`, `aplay`, `mpv`, `ffplay`, PowerShell SoundPlayer)
