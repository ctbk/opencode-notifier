import unittest
from unittest.mock import patch, Mock
from src.notify import send_telegram_message


class TestSendTelegramMessage(unittest.TestCase):
    """Tests for send_telegram_message function."""

    def test_successful_message_send(self):
        """Should return True when Telegram API returns 200 OK."""
        # Create a mock response
        mock_response = Mock()
        mock_response.status = 200
        mock_response.read.return_value = b'{"ok":true}'

        with patch('urllib.request.urlopen', return_value=mock_response) as mock_urlopen:
            result = send_telegram_message('test_token', '123456', 'Test message')

            # Verify the result
            self.assertTrue(result)

            # Verify the correct URL was called
            call_args = mock_urlopen.call_args[0][0]
            self.assertIn('https://api.telegram.org/bottest_token/sendMessage', call_args)
            self.assertIn('chat_id=123456', call_args)
            self.assertIn('text=Test+message', call_args)

    def test_failed_message_send_non_200(self):
        """Should return False when Telegram API returns non-200 status."""
        # Create a mock response with error status
        mock_response = Mock()
        mock_response.status = 400

        with patch('urllib.request.urlopen', return_value=mock_response):
            result = send_telegram_message('test_token', '123456', 'Test message')

            self.assertFalse(result)

    def test_failed_message_send_exception(self):
        """Should return False when network error occurs."""
        with patch('urllib.request.urlopen', side_effect=Exception('Network error')):
            result = send_telegram_message('test_token', '123456', 'Test message')

            self.assertFalse(result)


if __name__ == '__main__':
    unittest.main()
