"""
Celery Async Tasks

Background tasks for content collection
"""
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
