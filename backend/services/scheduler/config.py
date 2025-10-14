"""
Configuration for Scheduler Service
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Scheduler service configuration"""

    # Service configuration
    SERVICE_NAME = "Scheduler Service"
    SERVICE_VERSION = "1.0.0"
    SERVICE_PORT = 8005

    # External service URLs
    DATA_COLLECTION_URL = os.getenv("DATA_COLLECTION_URL", "http://localhost:8003")
    ETL_PROCESSING_URL = os.getenv("ETL_PROCESSING_URL", "http://localhost:8004")

    # Scheduler configuration
    SCHEDULER_TIMEZONE = os.getenv("SCHEDULER_TIMEZONE", "UTC")
    MAX_RETRY_ATTEMPTS = int(os.getenv("MAX_RETRY_ATTEMPTS", "3"))
    RETRY_DELAY_SECONDS = int(os.getenv("RETRY_DELAY_SECONDS", "60"))

    # Task queue configuration
    QUEUE_MAX_SIZE = int(os.getenv("QUEUE_MAX_SIZE", "100"))
    TASK_HISTORY_LIMIT = int(os.getenv("TASK_HISTORY_LIMIT", "1000"))

    # Database (optional - for persistent schedule storage)
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./scheduler.db")

    @classmethod
    def validate(cls):
        """Validate configuration"""
        errors = []

        if not cls.DATA_COLLECTION_URL:
            errors.append("DATA_COLLECTION_URL is not set")

        if not cls.ETL_PROCESSING_URL:
            errors.append("ETL_PROCESSING_URL is not set")

        if cls.MAX_RETRY_ATTEMPTS < 0:
            errors.append("MAX_RETRY_ATTEMPTS must be >= 0")

        if cls.RETRY_DELAY_SECONDS < 0:
            errors.append("RETRY_DELAY_SECONDS must be >= 0")

        if cls.QUEUE_MAX_SIZE <= 0:
            errors.append("QUEUE_MAX_SIZE must be > 0")

        return errors

# Validate configuration on import
validation_errors = Config.validate()
if validation_errors:
    print(f"⚠️  Configuration validation warnings:")
    for error in validation_errors:
        print(f"  - {error}")
