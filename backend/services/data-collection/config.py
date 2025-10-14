"""
Configuration management for Data Collection Service
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""

    # Service info
    SERVICE_NAME: str = "Data Collection Service"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8003

    # Firecrawl (Self-hosted on Docker Desktop)
    FIRECRAWL_API_URL: str = "http://localhost:3002"
    FIRECRAWL_API_KEY: str = "fs-test"

    # Redis for task queue
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6382
    REDIS_PASSWORD: str = "claude_redis_2025"
    REDIS_DB: int = 0

    # Neo4j (for validation and metadata storage)
    NEO4J_URI: str = "bolt://localhost:7688"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "claude_neo4j_2025"
    NEO4J_DATABASE: str = "neo4j"

    # Collection settings
    MAX_CONCURRENT_TASKS: int = 5
    DEFAULT_TIMEOUT: int = 30
    MAX_RETRY_ATTEMPTS: int = 3

    # Data storage
    RAW_DATA_DIR: str = "./data/raw"
    PROCESSED_DATA_DIR: str = "./data/processed"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
