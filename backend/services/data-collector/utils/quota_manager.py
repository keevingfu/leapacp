"""
API Quota Management

Track API usage and prevent rate limit violations
"""
from typing import Dict
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class QuotaManager:
    """API quota tracking and management"""

    def __init__(self):
        # In-memory quota tracking (use Redis in production for distributed systems)
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
