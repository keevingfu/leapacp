"""
Unit Tests for Data Cleaner

Test content cleaning and validation functions
"""
import pytest
from utils.data_cleaner import DataCleaner


def test_clean_html():
    """Test HTML tag removal"""
    html_text = "<p>This is a <strong>test</strong> with <a href='#'>links</a></p>"
    result = DataCleaner.clean_html(html_text)
    assert result == "This is a test with links"
    assert "<" not in result
    assert ">" not in result


def test_clean_html_empty():
    """Test empty HTML"""
    result = DataCleaner.clean_html("")
    assert result == ""


def test_clean_html_extra_whitespace():
    """Test extra whitespace removal"""
    html_text = "<p>This   has    extra   spaces</p>"
    result = DataCleaner.clean_html(html_text)
    assert result == "This has extra spaces"


def test_detect_language_english():
    """Test English language detection"""
    text = "This is a long enough English text to detect the language correctly"
    lang = DataCleaner.detect_language(text)
    assert lang == "en"


def test_is_spam_detected():
    """Test spam keyword detection"""
    spam_text = "Click here to buy now! Limited offer!"
    assert DataCleaner.is_spam(spam_text) is True


def test_is_spam_clean():
    """Test non-spam text"""
    clean_text = "This is a normal post about mattresses"
    assert DataCleaner.is_spam(clean_text) is False


def test_is_valid_content_too_short():
    """Test content too short"""
    short_text = "Too short"
    assert DataCleaner.is_valid_content(short_text, min_length=20) is False


def test_is_valid_content_valid():
    """Test valid content length"""
    valid_text = "This is a valid content with enough characters to pass validation"
    assert DataCleaner.is_valid_content(valid_text, min_length=20) is True


def test_clean_content_pipeline():
    """Test complete cleaning pipeline"""
    html_text = "<p>This is a valid English content about mattresses with enough length</p>"
    result = DataCleaner.clean_content(html_text, target_lang='en')
    assert result is not None
    assert "mattresses" in result
    assert "<" not in result


def test_clean_content_pipeline_spam():
    """Test cleaning pipeline filters spam"""
    spam_html = "<p>Click here to buy now! This is spam content with enough length</p>"
    result = DataCleaner.clean_content(spam_html, target_lang='en')
    assert result is None
