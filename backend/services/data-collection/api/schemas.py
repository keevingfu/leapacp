"""
API request/response schemas
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, HttpUrl
from models.task import TaskStatus, CollectionMethod


# Request schemas
class ScrapeRequest(BaseModel):
    """Request to scrape a single page"""
    url: HttpUrl = Field(..., description="Target URL to scrape")
    formats: List[str] = Field(default=["markdown"], description="Output formats")
    only_main_content: bool = Field(default=True, description="Extract only main content")
    task_name: Optional[str] = Field(default=None, description="Optional task name")


class SearchRequest(BaseModel):
    """Request to search the web"""
    query: str = Field(..., description="Search query")
    limit: int = Field(default=10, ge=1, le=50, description="Number of results")
    scrape_content: bool = Field(default=True, description="Scrape content from results")
    task_name: Optional[str] = Field(default=None, description="Optional task name")


class CrawlRequest(BaseModel):
    """Request to crawl a website"""
    url: HttpUrl = Field(..., description="Starting URL")
    max_pages: int = Field(default=50, ge=1, le=500, description="Maximum pages to crawl")
    allowed_domains: Optional[List[str]] = Field(default=None, description="Allowed domains")
    exclude_paths: Optional[List[str]] = Field(default=None, description="URL patterns to exclude")
    task_name: Optional[str] = Field(default=None, description="Optional task name")


class MapRequest(BaseModel):
    """Request to map a website"""
    url: HttpUrl = Field(..., description="Website URL to map")
    include_subdomains: bool = Field(default=False, description="Include subdomains")
    limit: Optional[int] = Field(default=None, description="Maximum URLs to discover")
    task_name: Optional[str] = Field(default=None, description="Optional task name")


class TaskStatusRequest(BaseModel):
    """Request to check task status"""
    task_id: str = Field(..., description="Task ID")


# Response schemas
class ApiResponse(BaseModel):
    """Generic API response"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class TaskResponse(BaseModel):
    """Task creation/status response"""
    task_id: str
    status: TaskStatus
    method: CollectionMethod
    progress: float = 0.0
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


class TaskListResponse(BaseModel):
    """List of tasks response"""
    tasks: List[TaskResponse]
    total: int
    page: int = 1
    page_size: int = 20


class CollectionStatsResponse(BaseModel):
    """Collection statistics response"""
    total_tasks: int
    pending_tasks: int
    running_tasks: int
    completed_tasks: int
    failed_tasks: int
    total_items_collected: int
    last_collection_time: Optional[str] = None
