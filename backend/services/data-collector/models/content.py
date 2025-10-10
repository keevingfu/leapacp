"""
Content Data Models

Pydantic models for collected content matching MongoDB schema
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class SourcePlatform(str, Enum):
    """Supported data source platforms"""
    REDDIT = "reddit"
    YOUTUBE = "youtube"
    MEDIUM = "medium"
    QUORA = "quora"
    FIRECRAWL = "firecrawl"


class ContentType(str, Enum):
    """Content type classification"""
    POST = "post"
    COMMENT = "comment"
    REVIEW = "review"
    ARTICLE = "article"
    VIDEO = "video"


class Sentiment(str, Enum):
    """Sentiment classification"""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"


class ProcessingStatus(str, Enum):
    """Content processing status"""
    PENDING = "pending"
    PROCESSED = "processed"
    FAILED = "failed"


class Author(BaseModel):
    """Content author information"""
    id: str
    name: str
    reputation: Optional[int] = 0


class Metadata(BaseModel):
    """Content metadata"""
    published_at: datetime
    likes_count: int = 0
    comments_count: int = 0
    tags: List[str] = []
    sentiment: Optional[Sentiment] = None


class RawContent(BaseModel):
    """Raw collected content model"""
    content_id: str = Field(..., description="Unique content identifier")
    source_platform: SourcePlatform
    source_url: str
    content_type: ContentType
    title: str
    body: str
    author: Author
    metadata: Metadata
    tenant_id: str
    brand_id: str
    product_keywords: List[str] = []
    collected_at: datetime = Field(default_factory=datetime.utcnow)
    processed: bool = False
    processing_status: ProcessingStatus = ProcessingStatus.PENDING

    class Config:
        json_schema_extra = {
            "example": {
                "content_id": "reddit_abc123",
                "source_platform": "reddit",
                "source_url": "https://reddit.com/r/mattresses/comments/abc123",
                "content_type": "post",
                "title": "Looking for cooling mattress recommendations",
                "body": "I sleep hot and need a mattress that stays cool...",
                "author": {
                    "id": "user123",
                    "name": "SleepyUser",
                    "reputation": 450
                },
                "metadata": {
                    "published_at": "2025-10-09T10:00:00Z",
                    "likes_count": 25,
                    "comments_count": 10,
                    "tags": ["mattress", "cooling"],
                    "sentiment": "neutral"
                },
                "tenant_id": "tenant_001",
                "brand_id": "brand_sweetnight",
                "product_keywords": ["mattress", "cooling", "gel foam"]
            }
        }
