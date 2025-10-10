"""
API Request/Response Schemas

Pydantic models for FastAPI endpoints
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from models.content import SourcePlatform
from models.task import TaskStatus


class TaskCreateRequest(BaseModel):
    """Create collection task request"""
    platform: SourcePlatform
    keywords: List[str] = Field(..., min_length=1, max_length=10)
    tenant_id: str
    brand_id: str
    limit: Optional[int] = 100

    class Config:
        json_schema_extra = {
            "example": {
                "platform": "reddit",
                "keywords": ["mattress", "cooling"],
                "tenant_id": "tenant_001",
                "brand_id": "brand_sweetnight",
                "limit": 100
            }
        }


class TaskResponse(BaseModel):
    """Task response"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None


class TaskStatusResponse(BaseModel):
    """Task status response"""
    task_id: str
    status: TaskStatus
    items_collected: int
    error_message: Optional[str] = None


class ContentQueryRequest(BaseModel):
    """Query content request"""
    tenant_id: str
    platform: Optional[SourcePlatform] = None
    limit: int = Field(default=100, le=1000)
    skip: int = Field(default=0, ge=0)


class ContentResponse(BaseModel):
    """Content query response"""
    success: bool
    count: int
    data: List[Dict[str, Any]]


class QuotaResponse(BaseModel):
    """API quota status response"""
    platform: str
    daily_limit: int
    used_today: int
    remaining: int
    percentage_used: float
    warning: bool


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    mongodb: str
    redis: str
    timestamp: str
