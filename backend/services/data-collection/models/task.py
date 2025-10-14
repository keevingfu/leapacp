"""
Data collection task models
"""
from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from uuid import uuid4


class TaskStatus(str, Enum):
    """Task execution status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class CollectionMethod(str, Enum):
    """Data collection method"""
    FIRECRAWL_SCRAPE = "firecrawl_scrape"
    FIRECRAWL_SEARCH = "firecrawl_search"
    FIRECRAWL_CRAWL = "firecrawl_crawl"
    FIRECRAWL_MAP = "firecrawl_map"
    PYTHON_CRAWLER = "python_crawler"


class CollectionTask(BaseModel):
    """Data collection task"""

    task_id: str = Field(default_factory=lambda: str(uuid4()))
    name: str = Field(..., description="Task name")
    method: CollectionMethod = Field(..., description="Collection method")

    # Task parameters
    params: Dict[str, Any] = Field(default_factory=dict, description="Method-specific parameters")

    # Status tracking
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    progress: float = Field(default=0.0, ge=0.0, le=100.0, description="Progress percentage")

    # Results
    result: Optional[Dict[str, Any]] = Field(default=None, description="Task result data")
    error: Optional[str] = Field(default=None, description="Error message if failed")

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Metadata
    metadata: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        use_enum_values = True


class DataSource(BaseModel):
    """Data source configuration"""

    source_id: str = Field(default_factory=lambda: str(uuid4()))
    name: str = Field(..., description="Source name")
    url: str = Field(..., description="Source URL or pattern")
    method: CollectionMethod = Field(..., description="Collection method")

    # Collection settings
    enabled: bool = Field(default=True)
    frequency: Optional[str] = Field(default=None, description="Cron expression for scheduled collection")
    max_pages: Optional[int] = Field(default=50, description="Maximum pages to crawl")

    # Filters and selectors
    selectors: Dict[str, str] = Field(default_factory=dict, description="CSS/XPath selectors")
    filters: List[str] = Field(default_factory=list, description="Filter patterns")

    # Metadata
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CollectionResult(BaseModel):
    """Collection result wrapper"""

    task_id: str
    success: bool
    items_collected: int
    data: List[Dict[str, Any]] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)
    duration_seconds: float
    metadata: Dict[str, Any] = Field(default_factory=dict)
