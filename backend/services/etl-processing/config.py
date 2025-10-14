"""ETL Processing Service Configuration"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""

    # Service info
    SERVICE_NAME: str = "ETL Processing Service"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8004

    # Data Collection Service
    DATA_COLLECTION_URL: str = "http://localhost:8003"

    # Neo4j (Knowledge Graph)
    NEO4J_URI: str = "bolt://localhost:7688"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "claude_neo4j_2025"
    NEO4J_DATABASE: str = "neo4j"

    # Redis for task queue
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6382
    REDIS_PASSWORD: str = "claude_redis_2025"
    REDIS_DB: int = 0

    # ETL settings
    MAX_CONCURRENT_TASKS: int = 5
    DEFAULT_TIMEOUT: int = 60
    MAX_RETRY_ATTEMPTS: int = 3

    # Processing settings
    BATCH_SIZE: int = 100
    ENTITY_CONFIDENCE_THRESHOLD: float = 0.7
    RELATIONSHIP_CONFIDENCE_THRESHOLD: float = 0.6

    # NLP Model
    SPACY_MODEL: str = "en_core_web_sm"

    # Data storage
    PROCESSED_DATA_DIR: str = "./data/processed"
    LOGS_DIR: str = "./logs"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
