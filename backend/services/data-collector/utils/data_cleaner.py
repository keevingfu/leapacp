"""
Data Cleaning Utilities

Content sanitization, validation, and quality filtering
"""
from bs4 import BeautifulSoup
import bleach
import re
from langdetect import detect, LangDetectException
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Spam keywords for filtering
SPAM_KEYWORDS = [
    'buy now', 'click here', 'limited offer', 'act fast',
    'free money', 'work from home', 'make money fast',
    'limited time', 'subscribe now', 'visit our website'
]


class DataCleaner:
    """Content cleaning and validation utility"""

    @staticmethod
    def clean_html(text: str) -> str:
        """
        Remove HTML tags from text

        Args:
            text: Raw HTML text

        Returns:
            Clean text without HTML
        """
        if not text:
            return ""

        # Parse HTML and extract text
        soup = BeautifulSoup(text, 'html.parser')
        clean_text = soup.get_text(separator=' ', strip=True)

        # Remove extra whitespace
        clean_text = re.sub(r'\s+', ' ', clean_text)

        return clean_text.strip()

    @staticmethod
    def sanitize_html(text: str) -> str:
        """
        Sanitize HTML (remove dangerous tags)

        Args:
            text: HTML text

        Returns:
            Sanitized HTML
        """
        # Allow only safe tags
        allowed_tags = ['p', 'b', 'i', 'u', 'strong', 'em', 'a', 'br']
        allowed_attrs = {'a': ['href', 'title']}

        return bleach.clean(
            text,
            tags=allowed_tags,
            attributes=allowed_attrs,
            strip=True
        )

    @staticmethod
    def detect_language(text: str) -> Optional[str]:
        """
        Detect text language

        Args:
            text: Text content

        Returns:
            ISO 639-1 language code or None
        """
        try:
            return detect(text)
        except LangDetectException:
            logger.warning("Language detection failed")
            return None

    @staticmethod
    def is_spam(text: str) -> bool:
        """
        Check if text contains spam keywords

        Args:
            text: Text content

        Returns:
            True if spam detected
        """
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in SPAM_KEYWORDS)

    @staticmethod
    def is_valid_content(text: str, min_length: int = 20, max_length: int = 50000) -> bool:
        """
        Validate content length

        Args:
            text: Content text
            min_length: Minimum character count
            max_length: Maximum character count

        Returns:
            True if valid length
        """
        if not text:
            return False

        text_length = len(text.strip())
        return min_length <= text_length <= max_length

    @classmethod
    def clean_content(cls, text: str, target_lang: str = 'en') -> Optional[str]:
        """
        Complete content cleaning pipeline

        Args:
            text: Raw text content
            target_lang: Target language code

        Returns:
            Clean text or None if invalid
        """
        # Remove HTML
        clean_text = cls.clean_html(text)

        # Validate length
        if not cls.is_valid_content(clean_text):
            logger.debug("Content too short or too long")
            return None

        # Check for spam
        if cls.is_spam(clean_text):
            logger.debug("Spam content detected")
            return None

        # Language detection
        lang = cls.detect_language(clean_text)
        if lang and lang != target_lang:
            logger.debug(f"Wrong language: {lang}, expected {target_lang}")
            return None

        return clean_text
