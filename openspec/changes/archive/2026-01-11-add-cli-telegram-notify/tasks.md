## 1. Implementation
- [x] 1.1 Remove utils import and replace log_info calls with logging module
- [x] 1.2 Replace requests import with urllib.request
- [x] 1.3 Rewrite send_telegram_message to use urllib.request
- [x] 1.4 Add argparse imports to notify.py
- [x] 1.5 Define --event and --message CLI arguments
- [x] 1.6 Implement message composition combining event and message
- [x] 1.7 Update __main__ block to use CLI parameters instead of hardcoded message

## 2. Validation
- [x] 2.1 Test script with --event and --message parameters
- [x] 2.2 Verify message format: "[event] message"
- [x] 2.3 Confirm Telegram message is sent successfully
