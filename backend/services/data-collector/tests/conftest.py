"""
Pytest Configuration and Fixtures

Shared test fixtures for unit and integration tests
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from motor.motor_asyncio import AsyncIOMotorClient
from models.content import RawContent, SourcePlatform, ContentType, Author, Metadata
from datetime import datetime


@pytest.fixture
def sample_reddit_content():
    """Sample Reddit content"""
    return RawContent(
        content_id="reddit_test123",
        source_platform=SourcePlatform.REDDIT,
        source_url="https://reddit.com/r/test/comments/123",
        content_type=ContentType.POST,
        title="Test Post",
        body="This is a test post about mattresses",
        author=Author(id="user1", name="TestUser", reputation=100),
        metadata=Metadata(
            published_at=datetime.utcnow(),
            likes_count=50,
            comments_count=10,
            tags=["test"]
        ),
        tenant_id="tenant_001",
        brand_id="brand_001",
        product_keywords=["mattress"]
    )


@pytest.fixture
def mock_mongodb():
    """Mock MongoDB client"""
    mock_client = AsyncMock(spec=AsyncIOMotorClient)
    mock_db = AsyncMock()
    mock_collection = AsyncMock()

    mock_client.__getitem__.return_value = mock_db
    mock_db.__getitem__.return_value = mock_collection

    return mock_client, mock_db, mock_collection


@pytest.fixture
def mock_reddit():
    """Mock PRAW Reddit client"""
    mock = Mock()
    mock_submission = Mock()
    mock_submission.id = "test123"
    mock_submission.title = "Test Title"
    mock_submission.selftext = "Test body"
    mock_submission.permalink = "/r/test/comments/123"
    mock_submission.score = 50
    mock_submission.num_comments = 10
    mock_submission.created_utc = datetime.utcnow().timestamp()

    mock_author = Mock()
    mock_author.link_karma = 100
    mock_submission.author = mock_author

    mock_subreddit = Mock()
    mock_subreddit.display_name = "test"
    mock_submission.subreddit = mock_subreddit

    mock.subreddit.return_value.search.return_value = [mock_submission]

    return mock


@pytest.fixture
def mock_youtube():
    """Mock YouTube API client"""
    mock = Mock()
    mock_response = {
        'items': [
            {
                'id': {'videoId': 'test_video_123'},
                'snippet': {
                    'title': 'Test Video',
                    'description': 'Test description about mattresses',
                    'channelId': 'channel_123',
                    'channelTitle': 'Test Channel',
                    'publishedAt': '2025-10-09T10:00:00Z',
                    'tags': ['test', 'mattress']
                }
            }
        ]
    }

    mock.search.return_value.list.return_value.execute.return_value = mock_response
    return mock
