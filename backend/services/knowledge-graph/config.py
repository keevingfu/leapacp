"""
Configuration management for Knowledge Graph Service
Uses pydantic-settings for environment variable support
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Neo4j Configuration
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"

    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8001
    API_TITLE: str = "Knowledge Graph Service"
    API_VERSION: str = "1.0.0"

    # Logging
    LOG_LEVEL: str = "INFO"
    ENVIRONMENT: str = "development"


_settings = None


def get_settings() -> Settings:
    """Get cached settings instance"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
