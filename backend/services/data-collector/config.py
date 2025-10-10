"""
Configuration management for Data Collector Service
Uses pydantic-settings for environment variable support
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # MongoDB Configuration
    MONGODB_URI: str = "mongodb://claude:claude_mongo_2025@localhost:27018/claude_dev"
    MONGODB_DB_NAME: str = "leap_acp"

    # Redis Configuration (Celery broker)
    REDIS_URL: str = "redis://:claude_redis_2025@localhost:6382/0"

    # Reddit API Configuration
    REDDIT_CLIENT_ID: str = ""
    REDDIT_CLIENT_SECRET: str = ""
    REDDIT_USER_AGENT: str = "LeapACP/1.0"

    # YouTube Data API
    YOUTUBE_API_KEY: str = ""

    # Firecrawl (Self-Hosted)
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
    """Get cached settings instance"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
