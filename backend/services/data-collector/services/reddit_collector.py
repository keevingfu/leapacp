"""
Reddit Content Collector

Collect content from Reddit using PRAW API
"""
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
                        id=str(submission.author) if submission.author else "deleted",
                        name=str(submission.author) if submission.author else "deleted",
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
