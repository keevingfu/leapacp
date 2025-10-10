# PRP: Data Collector Service - Multi-Platform Content Aggregation

**Status**: Ready for Execution
**Complexity**: High
**Confidence Score**: 7.5/10
**Estimated Time**: 16-24 hours (3-4 days)

---

## Goal

Build a production-ready Data Collector Service as the **data ingestion foundation** for the Leap Agentic Commerce Platform's GEO (Generation Engine Optimization) capabilities. This service will automatically collect user-generated content (UGC) from multiple online platforms to feed the knowledge graph and content generation systems.

**End State**:
- Fully functional FastAPI service with Celery task queue integration
- Support for ≥3 data sources (Reddit, YouTube, Firecrawl for web scraping)
- MongoDB-based content storage with async operations
- REST API for task management and content retrieval
- API quota management and rate limiting
- 80%+ test coverage
- Ready for integration with knowledge-graph-service

---

## Why

- **Business Value**: Enables automated discovery of user questions, pain points, and product discussions across the web
- **Integration**: Feeds raw content to knowledge-graph-service for entity extraction and FAQ clustering
- **User Impact**: Powers data-driven content generation that addresses real user needs
- **Foundation**: Core dependency for content-generator-service, faq-clustering-service, and analytics-service
- **Scale**: Replaces manual content research with automated multi-platform monitoring

---

## What

Build a microservice with:
- **Multi-platform collectors**: Reddit (PRAW), YouTube (API), Firecrawl (web scraping)
- **Async task queue**: Celery + Redis for scheduled and on-demand collection
- **Data storage**: MongoDB with Motor (async driver) for raw content
- **Data cleaning**: HTML sanitization, language detection, spam filtering
- **API quota management**: Track usage, prevent rate limiting, rotate keys
- **REST API**: Task CRUD, manual triggers, content queries, health checks
- **Knowledge graph integration**: Entity extraction and API calls to knowledge-graph-service
- **Multi-tenant support**: Tenant/brand-level data isolation

### Success Criteria
- [ ] MongoDB connection established with Motor async driver
- [ ] Celery workers can execute collection tasks
- [ ] Reddit collector successfully fetches posts/comments via PRAW
- [ ] YouTube collector fetches video metadata/comments
- [ ] Firecrawl collector scrapes web pages (Medium, forums)
- [ ] All collected content stored in MongoDB with proper schema
- [ ] API endpoints for task management working
- [ ] API quota tracking prevents rate limit violations
- [ ] Data cleaning removes HTML/spam effectively
- [ ] Knowledge-graph-service integration works (entity extraction → API call)
- [ ] Multi-tenant data isolation verified (tenant_id filtering)
- [ ] Unit test coverage ≥ 80%
- [ ] Integration tests verify end-to-end workflows
- [ ] Service handles 10+ concurrent collection tasks
- [ ] API documentation accessible at /docs

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Core Technologies

# MongoDB Motor (Async Driver)
- url: https://motor.readthedocs.io/en/stable/
  why: Official async MongoDB driver for Python, required for FastAPI async operations
  critical_sections:
    - "Tutorial: Using Motor With asyncio" (async/await patterns)
    - "Motor and asyncio.Event Loop" (event loop integration)
    - "motor.motor_asyncio.AsyncIOMotorClient" (client creation)
    - "Bulk Write Operations" (efficient batch inserts)
  gotcha: Motor operations return coroutines - always use await

- url: https://motor.readthedocs.io/en/stable/tutorial-asyncio.html#getting-a-collection
  why: Collection access patterns
  critical: |
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['database_name']
    collection = db['collection_name']

# Celery with Redis
- url: https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html
  why: Distributed task queue for async collection jobs
  critical_sections:
    - "Choosing a Broker" (Redis configuration)
    - "Application" (Celery app setup)
    - "Calling Tasks" (delay, apply_async)
    - "Retrying" (automatic retry on failure)

- url: https://docs.celeryq.dev/en/stable/userguide/tasks.html#retrying
  why: Task retry patterns for network failures
  critical: |
    @app.task(bind=True, max_retries=3)
    def my_task(self):
        try:
            # task logic
        except Exception as exc:
            raise self.retry(exc=exc, countdown=2 ** self.request.retries)

- url: https://docs.celeryq.dev/en/stable/userguide/configuration.html
  why: Celery configuration best practices
  critical: task_time_limit, task_serializer, result_backend

# Reddit API (PRAW)
- url: https://praw.readthedocs.io/en/stable/
  why: Reddit API wrapper for Python
  critical_sections:
    - "Getting Started" (OAuth setup)
    - "Code Overview: Reddit Instance" (praw.Reddit initialization)
    - "Obtaining Submissions" (subreddit.new(), subreddit.search())
    - "Comment Extraction" (submission.comments)

- url: https://praw.readthedocs.io/en/stable/getting_started/quick_start.html
  why: Authentication and rate limiting
  gotcha: Reddit has 60 requests/minute limit - PRAW handles this automatically with sleep

- url: https://www.reddit.com/dev/api#GET_search
  why: Search API parameters (q, sort, time_filter)
  critical: Search supports boolean operators (AND, OR, NOT)

# YouTube Data API v3
- url: https://developers.google.com/youtube/v3/getting-started
  why: Official YouTube API for video/comment data
  critical_sections:
    - "API Key" (authentication)
    - "Quota usage" (10,000 units/day default)
    - "Search: list" (video search)
    - "CommentThreads: list" (comment retrieval)

- url: https://developers.google.com/youtube/v3/docs/search/list
  why: Search API parameters
  critical: q (query), maxResults (1-50), order (relevance, date, viewCount)

- url: https://developers.google.com/youtube/v3/determine_quota_cost
  why: Understand quota costs
  gotcha: search costs 100 units, commentThreads costs 1 unit per request

# Firecrawl (Self-Hosted)
- url: http://localhost:3002/api-docs
  why: Local Firecrawl instance for web scraping
  critical_sections:
    - POST /v1/scrape (single page scraping)
    - POST /v1/crawl (site crawling)
    - markdown conversion
  gotcha: Self-hosted = unlimited usage, but respect robots.txt

# Data Cleaning & NLP
- url: https://pypi.org/project/beautifulsoup4/
  why: HTML parsing and cleaning
  critical: bs4.get_text() removes HTML tags

- url: https://pypi.org/project/langdetect/
  why: Language detection for content filtering
  usage: langdetect.detect(text) returns ISO 639-1 code

- url: https://pypi.org/project/bleach/
  why: HTML sanitization (security)
  critical: bleach.clean() removes unsafe HTML

# FastAPI & Pydantic (Same as knowledge-graph)
- url: https://fastapi.tiangolo.com/tutorial/
  why: Core FastAPI patterns (already proven in knowledge-graph-service)

- url: https://docs.pydantic.dev/latest/
  why: Data validation and serialization

# httpx (Async HTTP Client)
- url: https://www.python-httpx.org/
  why: Call knowledge-graph-service API (async)
  critical: |
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data)

# Project Documentation
- file: backend/services/knowledge-graph/
  why: Proven service architecture pattern
  critical:
    - config.py (pydantic-settings pattern)
    - main.py (FastAPI lifespan, CORS, uvicorn)
    - services/graph_service.py (service layer pattern)
    - api/routes.py (Depends() for dependency injection)
    - tests/conftest.py (pytest fixtures)

- file: CLAUDE.md
  why: Project architecture, coding standards, multi-tenant requirements
  critical:
    - "Core Service Division: data-collector-service"
    - "API Interface Specification" (REST standards)
    - "Code Standards: Python PEP 8"
    - "Multi-tenant Architecture" (tenant_id propagation)

- file: INITIAL-data-collector.md
  why: Complete feature requirements, validation gates, MongoDB schema
  critical: All sections

- file: leap_acp_dev_guide.md
  why: Implementation examples and patterns
  critical_sections:
    - Section on data collection strategies
    - Multi-tenant data isolation patterns
```

### Current Codebase Structure
```bash
.
├── CLAUDE.md                              # Project guidance
├── INITIAL-data-collector.md              # Feature requirements
├── backend/
│   └── services/
│       └── knowledge-graph/               # Reference service ⭐
│           ├── main.py
│           ├── config.py
│           ├── models/
│           ├── services/
│           ├── api/
│           └── tests/
└── PRPs/
    └── knowledge-graph-service.md         # Reference PRP
```

### Desired Codebase Structure (After Implementation)
```bash
backend/
└── services/
    └── data-collector/
        ├── main.py                        # FastAPI app entry point
        ├── celery_app.py                  # Celery configuration
        ├── config.py                      # Environment config (pydantic-settings)
        ├── models/
        │   ├── __init__.py
        │   ├── content.py                 # Content data models (Pydantic)
        │   └── task.py                    # Collection task models
        ├── services/
        │   ├── __init__.py
        │   ├── collector_service.py       # Core orchestration service
        │   ├── reddit_collector.py        # Reddit (PRAW) collector
        │   ├── youtube_collector.py       # YouTube API collector
        │   └── firecrawl_collector.py     # Firecrawl web scraper
        ├── tasks/
        │   ├── __init__.py
        │   └── celery_tasks.py            # Celery async tasks
        ├── utils/
        │   ├── __init__.py
        │   ├── quota_manager.py           # API quota tracking
        │   ├── data_cleaner.py            # HTML/text sanitization
        │   └── db.py                      # MongoDB async connection
        ├── api/
        │   ├── __init__.py
        │   ├── routes.py                  # FastAPI route definitions
        │   └── schemas.py                 # Request/Response schemas
        ├── tests/
        │   ├── __init__.py
        │   ├── conftest.py                # Pytest fixtures
        │   ├── test_collector_service.py  # Unit tests
        │   ├── test_reddit_collector.py   # Reddit collector tests
        │   ├── test_api.py                # Integration tests
        │   └── test_celery_tasks.py       # Task execution tests
        ├── requirements.txt               # Python dependencies
        ├── .env.example                   # Environment variable template
        └── README.md                      # Service documentation
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: MongoDB Motor - Async Driver Patterns
# 1. Motor returns coroutines - ALWAYS use await
collection = db['raw_content']
result = await collection.insert_one(document)  # ✅
result = collection.insert_one(document)        # ❌ Returns coroutine object

# 2. Motor client should be created at startup, reused across requests
# DO NOT create new client per request (connection pool exhaustion)
# Pattern: Create in lifespan event, store as app state
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.mongo_client = AsyncIOMotorClient(MONGODB_URI)
    app.state.db = app.state.mongo_client[DB_NAME]
    yield
    # Shutdown
    app.state.mongo_client.close()

def get_db():
    """Dependency for MongoDB collection"""
    return app.state.db  # Reuse existing client

# 3. Cursor iteration requires async for
cursor = collection.find({"tenant_id": tenant_id})
async for document in cursor:  # ✅
    process(document)

# 4. Bulk operations for efficiency
operations = [InsertOne(doc) for doc in documents]
result = await collection.bulk_write(operations)  # ✅ Fast
for doc in documents:
    await collection.insert_one(doc)  # ❌ Slow (N queries)

# CRITICAL: Celery with Redis
# 1. Task functions must be importable at worker startup
# Define tasks in tasks/celery_tasks.py, import from celery_app
from celery_app import app

@app.task(bind=True, max_retries=3)
def collect_reddit(self, keywords: list, tenant_id: str):
    # Implementation
    pass

# 2. Start worker with: celery -A celery_app worker --loglevel=info
# The module name must match celery_app.py

# 3. Exponential backoff for retries
@app.task(bind=True, max_retries=3)
def my_task(self):
    try:
        # risky operation
    except Exception as exc:
        # Wait 2^retry_count seconds: 2, 4, 8
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)

# 4. Task timeout configuration (prevent hanging)
app.conf.task_time_limit = 30 * 60  # 30 minutes hard limit
app.conf.task_soft_time_limit = 25 * 60  # 25 minutes warning

# CRITICAL: Reddit PRAW
# 1. PRAW automatically handles rate limiting with sleep
# Reddit limit: 60 requests/minute
# PRAW sleeps when approaching limit - DON'T manually sleep

reddit = praw.Reddit(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    user_agent=USER_AGENT
)

# 2. Limit results to prevent long-running tasks
subreddit = reddit.subreddit('all')
for submission in subreddit.search('mattress', limit=100):  # ✅ Limited
    # Process submission

# 3. Comment trees can be huge - limit depth
submission.comments.replace_more(limit=0)  # Don't fetch "more comments"
for comment in submission.comments.list()[:50]:  # Limit to 50
    # Process comment

# CRITICAL: YouTube API Quota
# 1. Track quota usage to prevent daily limit exhaustion
# search.list costs 100 units, 10,000 units/day = 100 searches max
# Store quota_used in MongoDB or Redis, reset daily

# 2. Use videoCategory parameter to filter by topic
# Category 22 = "People & Blogs", 26 = "Howto & Style"

# 3. Check quotaExceeded error and gracefully degrade
try:
    response = youtube.search().list(...).execute()
except HttpError as e:
    if e.resp.status == 403 and 'quotaExceeded' in str(e):
        # Log warning, pause collection, send alert
        logger.error("YouTube quota exceeded")
        return {"status": "quota_exceeded"}

# CRITICAL: Firecrawl Self-Hosted
# 1. Firecrawl returns markdown - no HTML parsing needed
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(
        'http://localhost:3002/v1/scrape',
        json={'url': 'https://example.com'},
        headers={'Authorization': 'Bearer fs-test'}
    )
    markdown_content = response.json()['markdown']  # Already clean

# 2. Respect robots.txt and crawl-delay
# Firecrawl respects robots.txt automatically

# CRITICAL: Multi-tenant Data Isolation
# 1. ALWAYS include tenant_id in MongoDB queries
# NEVER: collection.find({})
# ALWAYS: collection.find({"tenant_id": tenant_id})

async def get_content(tenant_id: str, limit: int = 100):
    cursor = collection.find({"tenant_id": tenant_id}).limit(limit)
    return [doc async for doc in cursor]

# 2. Add tenant_id index for query performance
await collection.create_index([("tenant_id", 1), ("collected_at", -1)])

# 3. Validate tenant_id in API layer (use Depends)
async def verify_tenant(tenant_id: str = Header(...)):
    # Validate tenant exists and user has permission
    return tenant_id

# CRITICAL: FastAPI + Motor Integration
# 1. Don't use synchronous pymongo with FastAPI async endpoints
# from pymongo import MongoClient  # ❌ Blocks event loop
# from motor.motor_asyncio import AsyncIOMotorClient  # ✅ Async

# 2. Use lifespan events for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create MongoDB client, Celery app
    app.state.mongo = AsyncIOMotorClient(MONGODB_URI)
    app.state.db = app.state.mongo[DB_NAME]
    logger.info("MongoDB connected")
    yield
    # Shutdown: Close connections
    app.state.mongo.close()
    logger.info("MongoDB disconnected")

# CRITICAL: Data Cleaning
# 1. BeautifulSoup for HTML removal
from bs4 import BeautifulSoup

def clean_html(text: str) -> str:
    soup = BeautifulSoup(text, 'html.parser')
    return soup.get_text(separator=' ', strip=True)

# 2. Language detection for filtering
from langdetect import detect

try:
    lang = detect(text)
    if lang != 'en':  # Filter non-English
        return None
except:
    return None  # If detection fails, skip

# 3. Spam detection (simple keyword filtering)
SPAM_KEYWORDS = ['buy now', 'click here', 'limited offer']
if any(kw in text.lower() for kw in SPAM_KEYWORDS):
    return None  # Skip spam
```

---

## Implementation Blueprint

### Phase 1: Project Structure & Dependencies (Day 1 Morning)

**Goal**: Set up project skeleton and install dependencies

```yaml
Task 1.1: Create directory structure
  CREATE: backend/services/data-collector/
  MIRROR: knowledge-graph service structure
  DIRECTORIES:
    - models/
    - services/
    - tasks/
    - utils/
    - api/
    - tests/

Task 1.2: Create requirements.txt
  CREATE: requirements.txt
  DEPENDENCIES:
    - fastapi==0.109.0
    - uvicorn[standard]==0.27.0
    - pydantic==2.5.3
    - pydantic-settings==2.1.0
    - motor==3.3.2              # MongoDB async driver
    - celery==5.3.4             # Task queue
    - redis==5.0.1              # Celery broker
    - praw==7.7.1               # Reddit API
    - google-api-python-client==2.112.0  # YouTube API
    - httpx==0.26.0             # Async HTTP client
    - beautifulsoup4==4.12.2    # HTML cleaning
    - langdetect==1.0.9         # Language detection
    - bleach==6.1.0             # HTML sanitization
    - pytest==7.4.4
    - pytest-asyncio==0.23.3
    - pytest-mock==3.12.0

Task 1.3: Create .env.example
  CREATE: .env.example
  PATTERN: Copy from knowledge-graph .env.example
  MODIFY: Add MongoDB, Redis, API keys
```

### Phase 2: Configuration & Database Connection (Day 1 Afternoon)

**Goal**: Set up configuration management and MongoDB connection

```python
# Task 2.1: Create config.py
# File: backend/services/data-collector/config.py
# PATTERN: MIRROR knowledge-graph/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings"""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # MongoDB Configuration
    MONGODB_URI: str = "mongodb://claude:claude_mongo_2025@localhost:27018/claude_dev"
    MONGODB_DB_NAME: str = "leap_acp"

    # Redis Configuration (Celery broker)
    REDIS_URL: str = "redis://:claude_redis_2025@localhost:6382/0"

    # API Keys (from ~/.mcp.env)
    REDDIT_CLIENT_ID: str = ""
    REDDIT_CLIENT_SECRET: str = ""
    REDDIT_USER_AGENT: str = "LeapACP/1.0"

    YOUTUBE_API_KEY: str = ""

    FIRECRAWL_API_URL: str = "http://localhost:3002"
    FIRECRAWL_API_KEY: str = "fs-test"

    # Knowledge Graph Service
    KNOWLEDGE_GRAPH_URL: str = "http://localhost:8001"

    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8002
    API_TITLE: str = "Data Collector Service"
    API_VERSION: str = "1.0.0"

    # Logging
    LOG_LEVEL: str = "INFO"
    ENVIRONMENT: str = "development"

# Singleton pattern for settings
_settings = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings


# Task 2.2: Create MongoDB connection utility
# File: backend/services/data-collector/utils/db.py
# PURPOSE: Provide async MongoDB client and collections

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import get_settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    """MongoDB connection manager"""

    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

    @classmethod
    async def connect(cls):
        """Connect to MongoDB"""
        settings = get_settings()
        cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
        cls.db = cls.client[settings.MONGODB_DB_NAME]

        # Create indexes
        await cls.create_indexes()

        logger.info(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")

    @classmethod
    async def close(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed")

    @classmethod
    async def create_indexes(cls):
        """Create database indexes for performance"""
        # raw_content collection indexes
        raw_content = cls.db['raw_content']

        # Compound index for tenant-specific queries
        await raw_content.create_index([
            ("tenant_id", 1),
            ("collected_at", -1)
        ])

        # Index for source platform filtering
        await raw_content.create_index([
            ("source_platform", 1),
            ("processed", 1)
        ])

        # Text index for content search
        await raw_content.create_index([
            ("title", "text"),
            ("body", "text")
        ])

        logger.info("MongoDB indexes created")

    @classmethod
    def get_collection(cls, name: str):
        """Get collection by name"""
        return cls.db[name]
```

### Phase 3: Data Models (Day 1 Evening)

**Goal**: Define Pydantic models for content and tasks

```python
# Task 3.1: Create content models
# File: backend/services/data-collector/models/content.py
# PURPOSE: Content data models matching MongoDB schema

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


# Task 3.2: Create task models
# File: backend/services/data-collector/models/task.py
# PURPOSE: Collection task models

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class TaskStatus(str, Enum):
    """Collection task status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class CollectionTask(BaseModel):
    """Collection task model"""
    task_id: str = Field(..., description="Celery task ID")
    platform: SourcePlatform
    keywords: List[str]
    tenant_id: str
    brand_id: str
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    items_collected: int = 0
    error_message: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "task_id": "celery_task_123",
                "platform": "reddit",
                "keywords": ["mattress", "cooling"],
                "tenant_id": "tenant_001",
                "brand_id": "brand_sweetnight",
                "status": "running",
                "items_collected": 45
            }
        }
```

### Phase 4: Data Cleaning Utilities (Day 2 Morning)

**Goal**: Implement content sanitization and validation

```python
# Task 4.1: Create data cleaner
# File: backend/services/data-collector/utils/data_cleaner.py
# PURPOSE: Clean and validate collected content

from bs4 import BeautifulSoup
import bleach
import re
from langdetect import detect, LangDetectException
import logging

logger = logging.getLogger(__name__)

# Spam keywords
SPAM_KEYWORDS = [
    'buy now', 'click here', 'limited offer', 'act fast',
    'free money', 'work from home', 'make money fast'
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


# Task 4.2: Create quota manager
# File: backend/services/data-collector/utils/quota_manager.py
# PURPOSE: Track API quota usage and prevent violations

from typing import Dict
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class QuotaManager:
    """API quota tracking and management"""

    def __init__(self):
        # In-memory quota tracking (use Redis in production)
        self.quotas: Dict[str, Dict] = {}

    def init_platform_quota(self, platform: str, daily_limit: int):
        """
        Initialize platform quota limits

        Args:
            platform: Platform name (e.g., 'youtube')
            daily_limit: Daily request limit
        """
        self.quotas[platform] = {
            'daily_limit': daily_limit,
            'used_today': 0,
            'last_reset': datetime.utcnow().date()
        }

    def check_quota(self, platform: str, cost: int = 1) -> bool:
        """
        Check if quota available

        Args:
            platform: Platform name
            cost: Request cost (default 1)

        Returns:
            True if quota available
        """
        if platform not in self.quotas:
            logger.warning(f"Quota not initialized for {platform}")
            return True  # Allow if not tracked

        quota = self.quotas[platform]

        # Reset quota if new day
        today = datetime.utcnow().date()
        if quota['last_reset'] != today:
            quota['used_today'] = 0
            quota['last_reset'] = today

        # Check if enough quota
        remaining = quota['daily_limit'] - quota['used_today']

        if remaining < cost:
            logger.error(f"Quota exceeded for {platform}: {remaining} remaining")
            return False

        return True

    def consume_quota(self, platform: str, cost: int = 1):
        """
        Consume quota

        Args:
            platform: Platform name
            cost: Request cost
        """
        if platform in self.quotas:
            self.quotas[platform]['used_today'] += cost
            logger.debug(f"Consumed {cost} quota for {platform}")

    def get_quota_status(self, platform: str) -> Dict:
        """
        Get quota status

        Args:
            platform: Platform name

        Returns:
            Quota status dict
        """
        if platform not in self.quotas:
            return {'error': 'Platform not tracked'}

        quota = self.quotas[platform]
        remaining = quota['daily_limit'] - quota['used_today']
        percentage_used = (quota['used_today'] / quota['daily_limit']) * 100

        return {
            'platform': platform,
            'daily_limit': quota['daily_limit'],
            'used_today': quota['used_today'],
            'remaining': remaining,
            'percentage_used': round(percentage_used, 2),
            'warning': percentage_used >= 80
        }
```

### Phase 5: Platform Collectors (Day 2)

**Goal**: Implement collectors for Reddit, YouTube, Firecrawl

```python
# Task 5.1: Reddit collector
# File: backend/services/data-collector/services/reddit_collector.py
# PURPOSE: Collect content from Reddit using PRAW

import praw
from typing import List, Dict, Any
from datetime import datetime
import logging
from models.content import RawContent, SourcePlatform, ContentType, Author, Metadata, Sentiment
from utils.data_cleaner import DataCleaner
from config import get_settings

logger = logging.getLogger(__name__)

class RedditCollector:
    """Reddit content collector using PRAW"""

    def __init__(self):
        settings = get_settings()
        self.reddit = praw.Reddit(
            client_id=settings.REDDIT_CLIENT_ID,
            client_secret=settings.REDDIT_CLIENT_SECRET,
            user_agent=settings.REDDIT_USER_AGENT
        )
        self.cleaner = DataCleaner()

    async def collect_posts(
        self,
        keywords: List[str],
        tenant_id: str,
        brand_id: str,
        limit: int = 100
    ) -> List[RawContent]:
        """
        Collect Reddit posts by keywords

        Args:
            keywords: Search keywords
            tenant_id: Tenant identifier
            brand_id: Brand identifier
            limit: Max results per keyword

        Returns:
            List of RawContent objects
        """
        results = []
        search_query = ' OR '.join(keywords)

        try:
            # Search across all subreddits
            subreddit = self.reddit.subreddit('all')

            for submission in subreddit.search(
                query=search_query,
                sort='new',
                time_filter='month',
                limit=limit
            ):
                # Clean title and body
                title = self.cleaner.clean_html(submission.title)
                body = self.cleaner.clean_html(submission.selftext)

                # Skip if spam or invalid
                clean_body = self.cleaner.clean_content(body) if body else title
                if not clean_body:
                    continue

                # Create content object
                content = RawContent(
                    content_id=f"reddit_{submission.id}",
                    source_platform=SourcePlatform.REDDIT,
                    source_url=f"https://reddit.com{submission.permalink}",
                    content_type=ContentType.POST,
                    title=title,
                    body=clean_body,
                    author=Author(
                        id=str(submission.author),
                        name=str(submission.author),
                        reputation=submission.author.link_karma if submission.author else 0
                    ),
                    metadata=Metadata(
                        published_at=datetime.fromtimestamp(submission.created_utc),
                        likes_count=submission.score,
                        comments_count=submission.num_comments,
                        tags=[submission.subreddit.display_name],
                        sentiment=None  # Can add sentiment analysis later
                    ),
                    tenant_id=tenant_id,
                    brand_id=brand_id,
                    product_keywords=keywords
                )

                results.append(content)
                logger.debug(f"Collected Reddit post: {submission.id}")

            logger.info(f"Collected {len(results)} Reddit posts for keywords: {keywords}")
            return results

        except Exception as e:
            logger.error(f"Reddit collection failed: {e}", exc_info=True)
            raise


# Task 5.2: YouTube collector
# File: backend/services/data-collector/services/youtube_collector.py
# PURPOSE: Collect YouTube video metadata and comments

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from typing import List, Dict, Any
from datetime import datetime
import logging
from models.content import RawContent, SourcePlatform, ContentType, Author, Metadata
from utils.data_cleaner import DataCleaner
from utils.quota_manager import QuotaManager
from config import get_settings

logger = logging.getLogger(__name__)

class YouTubeCollector:
    """YouTube content collector using official API"""

    def __init__(self, quota_manager: QuotaManager):
        settings = get_settings()
        self.youtube = build('youtube', 'v3', developerKey=settings.YOUTUBE_API_KEY)
        self.cleaner = DataCleaner()
        self.quota_manager = quota_manager

        # Initialize quota (10,000 units/day)
        self.quota_manager.init_platform_quota('youtube', 10000)

    async def collect_videos(
        self,
        keywords: List[str],
        tenant_id: str,
        brand_id: str,
        max_results: int = 10
    ) -> List[RawContent]:
        """
        Search and collect YouTube videos

        Args:
            keywords: Search keywords
            tenant_id: Tenant identifier
            brand_id: Brand identifier
            max_results: Max videos to retrieve

        Returns:
            List of RawContent objects
        """
        results = []
        search_query = ' '.join(keywords)

        # Check quota (search costs 100 units)
        if not self.quota_manager.check_quota('youtube', 100):
            logger.error("YouTube quota exceeded")
            raise Exception("YouTube API quota exceeded")

        try:
            # Search for videos
            request = self.youtube.search().list(
                q=search_query,
                part='snippet',
                type='video',
                maxResults=max_results,
                order='relevance'
            )
            response = request.execute()

            # Consume quota
            self.quota_manager.consume_quota('youtube', 100)

            for item in response.get('items', []):
                snippet = item['snippet']
                video_id = item['id']['videoId']

                # Clean description
                description = self.cleaner.clean_content(snippet['description'])
                if not description:
                    continue

                content = RawContent(
                    content_id=f"youtube_{video_id}",
                    source_platform=SourcePlatform.YOUTUBE,
                    source_url=f"https://youtube.com/watch?v={video_id}",
                    content_type=ContentType.VIDEO,
                    title=snippet['title'],
                    body=description,
                    author=Author(
                        id=snippet['channelId'],
                        name=snippet['channelTitle'],
                        reputation=0
                    ),
                    metadata=Metadata(
                        published_at=datetime.fromisoformat(snippet['publishedAt'].replace('Z', '+00:00')),
                        likes_count=0,
                        comments_count=0,
                        tags=snippet.get('tags', []),
                        sentiment=None
                    ),
                    tenant_id=tenant_id,
                    brand_id=brand_id,
                    product_keywords=keywords
                )

                results.append(content)

            logger.info(f"Collected {len(results)} YouTube videos")
            return results

        except HttpError as e:
            if e.resp.status == 403 and 'quotaExceeded' in str(e):
                logger.error("YouTube quota exceeded (API error)")
                raise Exception("YouTube quota exceeded")
            else:
                logger.error(f"YouTube API error: {e}", exc_info=True)
                raise


# Task 5.3: Firecrawl collector
# File: backend/services/data-collector/services/firecrawl_collector.py
# PURPOSE: Scrape web pages using Firecrawl

import httpx
from typing import List, Optional
from datetime import datetime
import logging
from models.content import RawContent, SourcePlatform, ContentType, Author, Metadata
from utils.data_cleaner import DataCleaner
from config import get_settings

logger = logging.getLogger(__name__)

class FirecrawlCollector:
    """Web scraping using Firecrawl (self-hosted)"""

    def __init__(self):
        settings = get_settings()
        self.api_url = settings.FIRECRAWL_API_URL
        self.api_key = settings.FIRECRAWL_API_KEY
        self.cleaner = DataCleaner()

    async def scrape_url(
        self,
        url: str,
        tenant_id: str,
        brand_id: str,
        keywords: List[str]
    ) -> Optional[RawContent]:
        """
        Scrape single URL

        Args:
            url: Target URL
            tenant_id: Tenant identifier
            brand_id: Brand identifier
            keywords: Associated keywords

        Returns:
            RawContent or None if failed
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f'{self.api_url}/v1/scrape',
                    json={'url': url},
                    headers={'Authorization': f'Bearer {self.api_key}'}
                )

                if response.status_code != 200:
                    logger.error(f"Firecrawl error: {response.status_code}")
                    return None

                data = response.json()
                markdown_content = data.get('markdown', '')

                # Clean content
                clean_content = self.cleaner.clean_content(markdown_content)
                if not clean_content:
                    return None

                # Extract title (first line of markdown)
                title = markdown_content.split('\n')[0].replace('#', '').strip()

                content = RawContent(
                    content_id=f"firecrawl_{hash(url)}",
                    source_platform=SourcePlatform.FIRECRAWL,
                    source_url=url,
                    content_type=ContentType.ARTICLE,
                    title=title,
                    body=clean_content,
                    author=Author(
                        id="unknown",
                        name="Web Content",
                        reputation=0
                    ),
                    metadata=Metadata(
                        published_at=datetime.utcnow(),
                        likes_count=0,
                        comments_count=0,
                        tags=[],
                        sentiment=None
                    ),
                    tenant_id=tenant_id,
                    brand_id=brand_id,
                    product_keywords=keywords
                )

                logger.info(f"Scraped URL: {url}")
                return content

        except Exception as e:
            logger.error(f"Firecrawl scraping failed for {url}: {e}", exc_info=True)
            return None
```

### Phase 6: Celery Tasks (Day 3 Morning)

**Goal**: Create async collection tasks

```python
# Task 6.1: Celery app configuration
# File: backend/services/data-collector/celery_app.py
# PURPOSE: Configure Celery with Redis broker

from celery import Celery
from config import get_settings

settings = get_settings()

# Create Celery app
app = Celery(
    'data_collector',
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Configuration
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes hard limit
    task_soft_time_limit=25 * 60,  # 25 minutes warning
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

# Auto-discover tasks
app.autodiscover_tasks(['tasks'])


# Task 6.2: Collection tasks
# File: backend/services/data-collector/tasks/celery_tasks.py
# PURPOSE: Async collection task definitions

from celery_app import app
from services.reddit_collector import RedditCollector
from services.youtube_collector import YouTubeCollector
from services.firecrawl_collector import FirecrawlCollector
from utils.quota_manager import QuotaManager
from utils.db import MongoDB
from typing import List, Dict
import logging
import asyncio

logger = logging.getLogger(__name__)

# Shared quota manager
quota_manager = QuotaManager()


@app.task(bind=True, max_retries=3)
def collect_reddit_task(
    self,
    keywords: List[str],
    tenant_id: str,
    brand_id: str,
    limit: int = 100
) -> Dict:
    """
    Celery task: Collect Reddit content

    Args:
        keywords: Search keywords
        tenant_id: Tenant ID
        brand_id: Brand ID
        limit: Max results

    Returns:
        Task result dict
    """
    try:
        # Run async function in sync context
        collector = RedditCollector()

        # Create event loop for async operation
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            # Collect content
            contents = loop.run_until_complete(
                collector.collect_posts(keywords, tenant_id, brand_id, limit)
            )

            # Connect to MongoDB
            loop.run_until_complete(MongoDB.connect())

            # Save to database
            collection = MongoDB.get_collection('raw_content')

            if contents:
                documents = [content.dict() for content in contents]
                result = loop.run_until_complete(
                    collection.insert_many(documents)
                )
                logger.info(f"Inserted {len(result.inserted_ids)} Reddit posts")

            return {
                'status': 'success',
                'platform': 'reddit',
                'items_collected': len(contents),
                'keywords': keywords
            }

        finally:
            loop.run_until_complete(MongoDB.close())
            loop.close()

    except Exception as exc:
        logger.error(f"Reddit collection failed: {exc}", exc_info=True)

        # Retry with exponential backoff
        raise self.retry(
            exc=exc,
            countdown=2 ** self.request.retries
        )


@app.task(bind=True, max_retries=3)
def collect_youtube_task(
    self,
    keywords: List[str],
    tenant_id: str,
    brand_id: str,
    max_results: int = 10
) -> Dict:
    """Celery task: Collect YouTube content"""
    try:
        collector = YouTubeCollector(quota_manager)

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            # Collect videos
            contents = loop.run_until_complete(
                collector.collect_videos(keywords, tenant_id, brand_id, max_results)
            )

            # Connect and save
            loop.run_until_complete(MongoDB.connect())
            collection = MongoDB.get_collection('raw_content')

            if contents:
                documents = [content.dict() for content in contents]
                result = loop.run_until_complete(
                    collection.insert_many(documents)
                )
                logger.info(f"Inserted {len(result.inserted_ids)} YouTube videos")

            return {
                'status': 'success',
                'platform': 'youtube',
                'items_collected': len(contents),
                'keywords': keywords
            }

        finally:
            loop.run_until_complete(MongoDB.close())
            loop.close()

    except Exception as exc:
        logger.error(f"YouTube collection failed: {exc}", exc_info=True)
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


@app.task(bind=True, max_retries=3)
def scrape_urls_task(
    self,
    urls: List[str],
    tenant_id: str,
    brand_id: str,
    keywords: List[str]
) -> Dict:
    """Celery task: Scrape URLs with Firecrawl"""
    try:
        collector = FirecrawlCollector()

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            # Scrape all URLs
            tasks = [
                collector.scrape_url(url, tenant_id, brand_id, keywords)
                for url in urls
            ]
            contents = loop.run_until_complete(asyncio.gather(*tasks))

            # Filter out None results
            valid_contents = [c for c in contents if c is not None]

            # Save to database
            loop.run_until_complete(MongoDB.connect())
            collection = MongoDB.get_collection('raw_content')

            if valid_contents:
                documents = [content.dict() for content in valid_contents]
                result = loop.run_until_complete(
                    collection.insert_many(documents)
                )
                logger.info(f"Inserted {len(result.inserted_ids)} scraped pages")

            return {
                'status': 'success',
                'platform': 'firecrawl',
                'items_collected': len(valid_contents),
                'urls_scraped': len(urls)
            }

        finally:
            loop.run_until_complete(MongoDB.close())
            loop.close()

    except Exception as exc:
        logger.error(f"Firecrawl scraping failed: {exc}", exc_info=True)
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
```

### Phase 7: FastAPI Application (Day 3 Afternoon)

**Goal**: Create REST API endpoints

```python
# Task 7.1: API schemas
# File: backend/services/data-collector/api/schemas.py
# PURPOSE: Request/Response Pydantic models
# PATTERN: MIRROR knowledge-graph/api/schemas.py

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from models.content import SourcePlatform, TaskStatus

class TaskCreateRequest(BaseModel):
    """Create collection task request"""
    platform: SourcePlatform
    keywords: List[str] = Field(..., min_length=1, max_length=10)
    tenant_id: str
    brand_id: str
    limit: Optional[int] = 100

    class Config:
        json_schema_extra = {
            "example": {
                "platform": "reddit",
                "keywords": ["mattress", "cooling"],
                "tenant_id": "tenant_001",
                "brand_id": "brand_sweetnight",
                "limit": 100
            }
        }

class TaskResponse(BaseModel):
    """Task response"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

class TaskStatusResponse(BaseModel):
    """Task status response"""
    task_id: str
    status: TaskStatus
    items_collected: int
    error_message: Optional[str] = None

class ContentQueryRequest(BaseModel):
    """Query content request"""
    tenant_id: str
    platform: Optional[SourcePlatform] = None
    limit: int = Field(default=100, le=1000)
    skip: int = Field(default=0, ge=0)

class ContentResponse(BaseModel):
    """Content query response"""
    success: bool
    count: int
    data: List[Dict[str, Any]]

class QuotaResponse(BaseModel):
    """API quota status response"""
    platform: str
    daily_limit: int
    used_today: int
    remaining: int
    percentage_used: float
    warning: bool

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    mongodb: str
    redis: str
    timestamp: str


# Task 7.2: API routes
# File: backend/services/data-collector/api/routes.py
# PURPOSE: FastAPI endpoint definitions
# PATTERN: MIRROR knowledge-graph/api/routes.py

from fastapi import APIRouter, HTTPException, Depends, status, Header
from typing import List, Optional
from .schemas import (
    TaskCreateRequest, TaskResponse, TaskStatusResponse,
    ContentQueryRequest, ContentResponse,
    QuotaResponse, HealthResponse
)
from tasks.celery_tasks import (
    collect_reddit_task,
    collect_youtube_task,
    scrape_urls_task
)
from utils.quota_manager import QuotaManager
from utils.db import MongoDB
from celery.result import AsyncResult
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/collector", tags=["data-collector"])

# Shared quota manager
quota_manager = QuotaManager()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Check MongoDB
        collection = MongoDB.get_collection('raw_content')
        await collection.find_one()
        mongo_status = "healthy"
    except:
        mongo_status = "unhealthy"

    return HealthResponse(
        status="healthy" if mongo_status == "healthy" else "degraded",
        mongodb=mongo_status,
        redis="healthy",  # Assume healthy if Celery working
        timestamp=datetime.utcnow().isoformat()
    )


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(request: TaskCreateRequest):
    """
    Create collection task

    Dispatches async Celery task to collect content
    """
    try:
        # Dispatch appropriate task based on platform
        if request.platform == SourcePlatform.REDDIT:
            task = collect_reddit_task.delay(
                keywords=request.keywords,
                tenant_id=request.tenant_id,
                brand_id=request.brand_id,
                limit=request.limit or 100
            )
        elif request.platform == SourcePlatform.YOUTUBE:
            task = collect_youtube_task.delay(
                keywords=request.keywords,
                tenant_id=request.tenant_id,
                brand_id=request.brand_id,
                max_results=min(request.limit or 10, 50)  # YouTube limit
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Platform {request.platform} not supported yet"
            )

        return TaskResponse(
            success=True,
            message="Collection task created",
            data={
                "task_id": task.id,
                "platform": request.platform,
                "status": "pending"
            }
        )

    except Exception as e:
        logger.error(f"Task creation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(task_id: str):
    """Query task status"""
    try:
        result = AsyncResult(task_id)

        if result.ready():
            if result.successful():
                task_result = result.result
                return TaskStatusResponse(
                    task_id=task_id,
                    status=TaskStatus.COMPLETED,
                    items_collected=task_result.get('items_collected', 0),
                    error_message=None
                )
            else:
                return TaskStatusResponse(
                    task_id=task_id,
                    status=TaskStatus.FAILED,
                    items_collected=0,
                    error_message=str(result.result)
                )
        else:
            return TaskStatusResponse(
                task_id=task_id,
                status=TaskStatus.RUNNING,
                items_collected=0,
                error_message=None
            )

    except Exception as e:
        logger.error(f"Task status query failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/content", response_model=ContentResponse)
async def query_content(
    tenant_id: str,
    platform: Optional[SourcePlatform] = None,
    limit: int = 100,
    skip: int = 0
):
    """
    Query collected content

    Returns paginated content for tenant
    """
    try:
        collection = MongoDB.get_collection('raw_content')

        # Build query
        query = {"tenant_id": tenant_id}
        if platform:
            query["source_platform"] = platform

        # Execute query with pagination
        cursor = collection.find(query).skip(skip).limit(limit).sort("collected_at", -1)

        documents = []
        async for doc in cursor:
            # Convert ObjectId to string
            doc['_id'] = str(doc['_id'])
            documents.append(doc)

        # Get total count
        total_count = await collection.count_documents(query)

        return ContentResponse(
            success=True,
            count=total_count,
            data=documents
        )

    except Exception as e:
        logger.error(f"Content query failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/quota", response_model=List[QuotaResponse])
async def get_quota_status():
    """Get API quota status for all platforms"""
    try:
        platforms = ['reddit', 'youtube']
        statuses = []

        for platform in platforms:
            status_dict = quota_manager.get_quota_status(platform)
            if 'error' not in status_dict:
                statuses.append(QuotaResponse(**status_dict))

        return statuses

    except Exception as e:
        logger.error(f"Quota status query failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# Task 7.3: Main FastAPI app
# File: backend/services/data-collector/main.py
# PURPOSE: Application entry point
# PATTERN: MIRROR knowledge-graph/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from config import get_settings
from api.routes import router
from utils.db import MongoDB
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("Starting Data Collector Service")

    # Connect to MongoDB
    await MongoDB.connect()

    yield

    # Cleanup
    await MongoDB.close()
    logger.info("Shutting down Data Collector Service")


# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="Data Collector Service for Leap Agentic Commerce Platform",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include router
app.include_router(router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Data Collector Service",
        "version": settings.API_VERSION,
        "status": "running",
        "docs": "/docs"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=(settings.ENVIRONMENT == "development"),
        log_level=settings.LOG_LEVEL.lower()
    )
```

### Phase 8: Testing (Day 4)

**Goal**: Comprehensive test coverage

```python
# Task 8.1: Test fixtures
# File: backend/services/data-collector/tests/conftest.py
# PURPOSE: Shared pytest fixtures
# PATTERN: MIRROR knowledge-graph/tests/conftest.py

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


# Task 8.2: Unit tests
# File: backend/services/data-collector/tests/test_reddit_collector.py
# PURPOSE: Test Reddit collector

import pytest
from services.reddit_collector import RedditCollector
from unittest.mock import patch

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


# Task 8.3: Integration tests
# File: backend/services/data-collector/tests/test_api.py
# PURPOSE: Test API endpoints

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test health endpoint"""
    response = client.get("/api/v1/collector/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "mongodb" in data

def test_create_reddit_task():
    """Test task creation"""
    response = client.post(
        "/api/v1/collector/tasks",
        json={
            "platform": "reddit",
            "keywords": ["test"],
            "tenant_id": "tenant_001",
            "brand_id": "brand_001",
            "limit": 10
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["success"] == True
    assert "task_id" in data["data"]
```

---

## Validation Loop

### Level 1: Syntax & Dependencies
```bash
# Install dependencies
cd backend/services/data-collector
pip install -r requirements.txt

# Python syntax check
python -m py_compile **/*.py

# Expected: No syntax errors
```

### Level 2: MongoDB Connection Test
```bash
# Test MongoDB connection
python -c "
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def test():
    client = AsyncIOMotorClient('mongodb://claude:claude_mongo_2025@localhost:27018/claude_dev')
    db = client['leap_acp']
    result = await db.command('ping')
    print('MongoDB connected:', result)

asyncio.run(test())
"

# Expected: MongoDB connected: {'ok': 1.0}
```

### Level 3: Unit Tests
```bash
# Run unit tests
pytest tests/test_reddit_collector.py -v
pytest tests/test_data_cleaner.py -v

# Expected: All tests pass
```

### Level 4: Celery Worker Test
```bash
# Start Celery worker
celery -A celery_app worker --loglevel=info

# In another terminal, trigger test task
python -c "
from tasks.celery_tasks import collect_reddit_task
result = collect_reddit_task.delay(['test'], 'tenant_001', 'brand_001', 10)
print('Task ID:', result.id)
"

# Expected: Worker logs show task execution
```

### Level 5: Integration Tests
```bash
# Start FastAPI service
python main.py

# In another terminal, test endpoints
curl http://localhost:8002/docs  # Should show OpenAPI UI

curl -X POST http://localhost:8002/api/v1/collector/tasks \
  -H "Content-Type: application/json" \
  -d '{"platform":"reddit","keywords":["mattress"],"tenant_id":"tenant_001","brand_id":"brand_001"}'

# Expected: {"success": true, "data": {"task_id": "...", ...}}
```

### Level 6: End-to-End Test
```bash
# Full workflow test
pytest tests/test_api.py::test_e2e_collection -v

# Expected: Collection → Storage → Retrieval works
```

### Level 7: Performance Test
```bash
# Test concurrent tasks
python -c "
from tasks.celery_tasks import collect_reddit_task
tasks = [collect_reddit_task.delay(['test'], 'tenant_001', 'brand_001', 10) for _ in range(10)]
print(f'Created {len(tasks)} tasks')
"

# Expected: All 10 tasks complete successfully
```

---

## Final Validation Checklist

- [ ] All dependencies installed: `pip list`
- [ ] MongoDB connection working
- [ ] Redis connection working
- [ ] Celery worker starts without errors
- [ ] Reddit collector fetches posts
- [ ] YouTube collector fetches videos
- [ ] Firecrawl scraper works
- [ ] Data cleaned properly (no HTML, spam filtered)
- [ ] MongoDB stores content with correct schema
- [ ] API endpoints return correct responses
- [ ] Quota tracking prevents violations
- [ ] Unit tests pass: `pytest tests/ -v --cov=.`
- [ ] Test coverage ≥ 80%: `pytest --cov-report=html`
- [ ] Integration tests pass
- [ ] FastAPI docs accessible at /docs
- [ ] Health check returns healthy status
- [ ] Service handles 10+ concurrent tasks

---

## Anti-Patterns to Avoid

- ❌ Don't use synchronous pymongo with FastAPI async (use Motor)
- ❌ Don't create new MongoDB client per request (connection pool exhaustion)
- ❌ Don't forget tenant_id in MongoDB queries (data isolation breach)
- ❌ Don't skip quota checks (API rate limit violations)
- ❌ Don't ignore data cleaning (spam/HTML in database)
- ❌ Don't hardcode API keys (use environment variables)
- ❌ Don't fetch unlimited results (long-running tasks)
- ❌ Don't skip error handling in Celery tasks (unhandled exceptions)
- ❌ Don't use sync functions in async context (event loop blocking)
- ❌ Don't forget retry logic (network failures)

---

## Confidence Score Breakdown

**7.5/10 Confidence**

**Strengths (+)**:
- ✅ Clear requirements and well-defined scope
- ✅ Proven architecture pattern (knowledge-graph-service)
- ✅ Comprehensive documentation links provided
- ✅ Known gotchas documented
- ✅ All dependencies available (MongoDB, Redis, PRAW, YouTube API)
- ✅ Validation gates are executable

**Risks (-)**:
- ⚠️ Celery async task integration complexity (asyncio + Celery)
- ⚠️ Motor async patterns less familiar than sync pymongo
- ⚠️ Multiple external APIs (Reddit, YouTube) - network reliability
- ⚠️ Data quality variance across platforms
- ⚠️ API quota management complexity

**Mitigation**:
- Celery: Use proven asyncio.run() pattern in tasks
- Motor: Follow official docs closely, test connection early
- APIs: Implement comprehensive error handling + retries
- Data quality: Robust cleaning pipeline with validation
- Quota: Start with conservative limits, monitor closely

---

**Estimated Implementation Time**: 16-24 hours (3-4 days with testing)

**Next Steps After Completion**:
1. User validation: Run collection tasks with real API keys
2. Verify MongoDB data quality
3. Test knowledge-graph-service integration
4. Monitor API quota usage
5. Tune performance (concurrent tasks, batch sizes)
