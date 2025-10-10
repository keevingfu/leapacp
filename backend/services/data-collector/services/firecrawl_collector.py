"""
Firecrawl Web Scraper

Scrape web pages using self-hosted Firecrawl service
"""
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
