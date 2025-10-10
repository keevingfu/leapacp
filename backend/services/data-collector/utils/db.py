"""
MongoDB Connection Management

Provides async MongoDB client and collection access using Motor driver
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import get_settings
import logging

logger = logging.getLogger(__name__)


class MongoDB:
    """MongoDB connection manager with async support"""

    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

    @classmethod
    async def connect(cls):
        """
        Connect to MongoDB and create indexes

        Creates Motor async client and initializes database indexes
        """
        settings = get_settings()
        cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
        cls.db = cls.client[settings.MONGODB_DB_NAME]

        # Create indexes for performance
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
        """
        Create database indexes for performance

        Indexes:
        - Compound index on (tenant_id, collected_at) for tenant-specific queries
        - Index on (source_platform, processed) for filtering
        - Text index on (title, body) for full-text search
        """
        # Get raw_content collection
        raw_content = cls.db['raw_content']

        # Compound index for tenant-specific queries (most common)
        await raw_content.create_index([
            ("tenant_id", 1),
            ("collected_at", -1)
        ])

        # Index for platform and processing status filtering
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
        """
        Get collection by name

        Args:
            name: Collection name

        Returns:
            AsyncIOMotorCollection
        """
        return cls.db[name]
