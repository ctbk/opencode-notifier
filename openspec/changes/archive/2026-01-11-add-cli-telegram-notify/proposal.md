# Change: Add CLI parameters to notify.py

## Why
The notify.py script needs to be more flexible and reusable. Currently, it only sends a hardcoded "Hello World!" message when run directly. Adding --event and --message parameters will allow users to send custom messages with context information.

## What Changes
- Remove all unresolved dependencies (utils, requests) from notify.py
- Replace requests with Python's built-in urllib.request for HTTP calls
- Remove log_info usage and replace with Python's logging module
- Add command-line argument parsing to notify.py to accept --event and --message parameters
- Compose the final message by combining event and message (format: "[event] message")
- Use the existing hardcoded Telegram bot token and chat ID for sending
- Update the __main__ block to use the new CLI parameters

## Impact
- Affected specs: New spec `telegram-notify-cli` will be added
- Affected code: `src/notify.py`
- Compatibility: Breaking change (adds required CLI parameters for direct execution)

## Open Questions
- None
