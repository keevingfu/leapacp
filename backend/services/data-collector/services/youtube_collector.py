"""
YouTube Content Collector

Collect videos and metadata from YouTube Data API v3
"""
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
