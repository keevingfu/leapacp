"""
Unit Tests for Reddit Collector

Test Reddit content collection
"""
import pytest
from services.reddit_collector import RedditCollector
from unittest.mock import patch
from models.content import SourcePlatform


@pytest.mark.asyncio
async def test_collect_reddit_posts(mock_reddit, sample_reddit_content):
    """Test Reddit post collection"""

    with patch('praw.Reddit', return_value=mock_reddit):
        collector = RedditCollector()

        results = await collector.collect_posts(
            keywords=["mattress"],
            tenant_id="tenant_001",
            brand_id="brand_001",
            limit=10
        )

        assert len(results) > 0
        assert results[0].source_platform == SourcePlatform.REDDIT
        assert "test" in results[0].title.lower()


@pytest.mark.asyncio
async def test_collect_reddit_posts_empty(mock_reddit):
    """Test Reddit collection with no results"""

    mock_reddit.subreddit.return_value.search.return_value = []

    with patch('praw.Reddit', return_value=mock_reddit):
        collector = RedditCollector()

        results = await collector.collect_posts(
            keywords=["nonexistent"],
            tenant_id="tenant_001",
            brand_id="brand_001",
            limit=10
        )

        assert len(results) == 0
