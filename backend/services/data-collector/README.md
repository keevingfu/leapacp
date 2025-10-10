# Data Collector Service

Multi-platform content aggregation service for Leap Agentic Commerce Platform

## Overview

Data Collector Service automatically collects user-generated content (UGC) from multiple online platforms to feed the knowledge graph and content generation systems.

## Features

- ✅ Multi-platform collection (Reddit, YouTube, Firecrawl)
- ✅ Async task queue with Celery + Redis
- ✅ MongoDB storage with Motor async driver
- ✅ Data cleaning and validation
- ✅ API quota management
- ✅ Multi-tenant support
- ✅ REST API for task management

## Tech Stack

- **Framework**: FastAPI 0.109.0
- **Task Queue**: Celery 5.3.4 + Redis
- **Database**: MongoDB (Motor 3.3.2)
- **Collection APIs**:
  - PRAW 7.7.1 (Reddit)
  - Google API Client 2.112.0 (YouTube)
  - Firecrawl (self-hosted)
- **Data Processing**: BeautifulSoup4, langdetect, bleach

## Installation

```bash
cd backend/services/data-collector

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

## Configuration

Required environment variables:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=leap_acp

# Redis (Celery)
REDIS_URL=redis://localhost:6379/0

# API Keys
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_secret
YOUTUBE_API_KEY=your_api_key

# Firecrawl (self-hosted)
FIRECRAWL_API_URL=http://localhost:3002
FIRECRAWL_API_KEY=fs-test
```

## Running the Service

### 1. Start FastAPI Server

```bash
python main.py
```

API will be available at `http://localhost:8002`

API docs: `http://localhost:8002/docs`

### 2. Start Celery Worker

```bash
celery -A celery_app worker --loglevel=info
```

## API Endpoints

### Create Collection Task

```bash
POST /api/v1/collector/tasks
```

Request:
```json
{
  "platform": "reddit",
  "keywords": ["mattress", "cooling"],
  "tenant_id": "tenant_001",
  "brand_id": "brand_001",
  "limit": 100
}
```

### Query Task Status

```bash
GET /api/v1/collector/tasks/{task_id}
```

### Query Collected Content

```bash
GET /api/v1/collector/content?tenant_id=tenant_001&platform=reddit&limit=100
```

### Check API Quota

```bash
GET /api/v1/collector/quota
```

### Health Check

```bash
GET /api/v1/collector/health
```

## Data Models

### RawContent Schema

```python
{
  "content_id": str,
  "source_platform": "reddit"|"youtube"|"firecrawl",
  "source_url": str,
  "content_type": "post"|"video"|"article",
  "title": str,
  "body": str,
  "author": {
    "id": str,
    "name": str,
    "reputation": int
  },
  "metadata": {
    "published_at": datetime,
    "likes_count": int,
    "comments_count": int,
    "tags": [str],
    "sentiment": "positive"|"negative"|"neutral"
  },
  "tenant_id": str,
  "brand_id": str,
  "product_keywords": [str],
  "collected_at": datetime,
  "processed": bool
}
```

## Testing

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=. --cov-report=html

# Run specific test file
pytest tests/test_data_cleaner.py -v
```

## Development

### Project Structure

```
backend/services/data-collector/
├── models/              # Data models
│   ├── content.py       # Content models
│   └── task.py          # Task models
├── services/            # Platform collectors
│   ├── reddit_collector.py
│   ├── youtube_collector.py
│   └── firecrawl_collector.py
├── tasks/               # Celery tasks
│   └── celery_tasks.py
├── utils/               # Utilities
│   ├── data_cleaner.py
│   ├── quota_manager.py
│   └── db.py
├── api/                 # FastAPI routes
│   ├── schemas.py
│   └── routes.py
├── tests/               # Tests
├── config.py            # Configuration
├── celery_app.py        # Celery app
├── main.py              # FastAPI app
└── requirements.txt
```

### Adding New Platforms

1. Create collector in `services/new_platform_collector.py`
2. Implement `collect()` method returning `List[RawContent]`
3. Add Celery task in `tasks/celery_tasks.py`
4. Update API routes in `api/routes.py`

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB is running
docker ps | grep mongodb

# Test connection
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; asyncio.run(AsyncIOMotorClient('mongodb://localhost:27017').admin.command('ping'))"
```

### Celery Task Not Executing

```bash
# Check Redis is running
redis-cli ping

# Check Celery worker logs
celery -A celery_app worker --loglevel=debug
```

### API Quota Exceeded

```bash
# Check quota status
curl http://localhost:8002/api/v1/collector/quota

# Reset quota (if needed, modify quota_manager.py)
```

## Performance

- **Concurrent tasks**: Handles 10+ simultaneous collection tasks
- **MongoDB writes**: <100ms per document
- **API response time**: <500ms (P95)

## License

Internal use only - Leap ACP Platform
