"""
Task Data Models

Pydantic models for collection tasks
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from models.content import SourcePlatform


class TaskStatus(str, Enum):
    """Collection task status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class CollectionTask(BaseModel):
    """Collection task model"""
    task_id: str = Field(..., description="Celery task ID")
    platform: SourcePlatform
    keywords: List[str]
    tenant_id: str
    brand_id: str
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    items_collected: int = 0
    error_message: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "task_id": "celery_task_123",
                "platform": "reddit",
                "keywords": ["mattress", "cooling"],
                "tenant_id": "tenant_001",
                "brand_id": "brand_sweetnight",
                "status": "running",
                "items_collected": 45
            }
        }
