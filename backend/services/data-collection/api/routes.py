"""
API routes for Data Collection Service
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, List
from datetime import datetime
import asyncio

from api.schemas import (
    ScrapeRequest, SearchRequest, CrawlRequest, MapRequest,
    TaskStatusRequest, ApiResponse, TaskResponse, TaskListResponse,
    CollectionStatsResponse
)
from models.task import CollectionTask, TaskStatus, CollectionMethod
from collectors.firecrawl_collector import FirecrawlCollector

router = APIRouter(prefix="/api/v1/collection", tags=["collection"])

# In-memory task storage (replace with Redis/DB in production)
tasks_store: Dict[str, CollectionTask] = {}


# Dependency to get Firecrawl collector
def get_firecrawl_collector() -> FirecrawlCollector:
    return FirecrawlCollector()


async def execute_scrape_task(task: CollectionTask, collector: FirecrawlCollector):
    """Background task to execute scraping"""
    try:
        # Update task status
        task.status = TaskStatus.RUNNING
        task.started_at = datetime.utcnow()
        task.progress = 10.0

        # Execute scraping
        url = task.params.get("url")
        formats = task.params.get("formats", ["markdown"])
        only_main_content = task.params.get("only_main_content", True)

        task.progress = 50.0
        result = await collector.scrape_page(url, formats, only_main_content)

        # Update task with result
        task.result = result
        task.status = TaskStatus.COMPLETED if result.get("success") else TaskStatus.FAILED
        task.error = result.get("error")
        task.progress = 100.0
        task.completed_at = datetime.utcnow()

    except Exception as e:
        task.status = TaskStatus.FAILED
        task.error = str(e)
        task.completed_at = datetime.utcnow()


async def execute_search_task(task: CollectionTask, collector: FirecrawlCollector):
    """Background task to execute web search"""
    try:
        task.status = TaskStatus.RUNNING
        task.started_at = datetime.utcnow()
        task.progress = 10.0

        query = task.params.get("query")
        limit = task.params.get("limit", 10)
        scrape_content = task.params.get("scrape_content", True)

        task.progress = 50.0
        scrape_options = {"formats": ["markdown"]} if scrape_content else None
        result = await collector.search_web(query, limit, scrape_options)

        task.result = result
        task.status = TaskStatus.COMPLETED if result.get("success") else TaskStatus.FAILED
        task.error = result.get("error")
        task.progress = 100.0
        task.completed_at = datetime.utcnow()

    except Exception as e:
        task.status = TaskStatus.FAILED
        task.error = str(e)
        task.completed_at = datetime.utcnow()


async def execute_crawl_task(task: CollectionTask, collector: FirecrawlCollector):
    """Background task to execute site crawling"""
    try:
        task.status = TaskStatus.RUNNING
        task.started_at = datetime.utcnow()
        task.progress = 10.0

        url = task.params.get("url")
        max_pages = task.params.get("max_pages", 50)
        allowed_domains = task.params.get("allowed_domains")
        exclude_paths = task.params.get("exclude_paths")

        # Start crawl
        task.progress = 20.0
        result = await collector.crawl_site(url, max_pages, allowed_domains, exclude_paths)

        if result.get("success"):
            # Poll for completion
            job_id = result.get("job_id")
            task.metadata["job_id"] = job_id

            # Wait for crawl to complete (with timeout)
            max_wait = 300  # 5 minutes
            wait_time = 0
            check_interval = 10

            while wait_time < max_wait:
                await asyncio.sleep(check_interval)
                wait_time += check_interval

                status_result = await collector.check_crawl_status(job_id)
                status = status_result.get("status")

                if status == "completed":
                    task.result = status_result
                    task.status = TaskStatus.COMPLETED
                    task.progress = 100.0
                    task.completed_at = datetime.utcnow()
                    return

                elif status == "failed":
                    task.result = status_result
                    task.status = TaskStatus.FAILED
                    task.error = "Crawl job failed"
                    task.completed_at = datetime.utcnow()
                    return

                # Update progress
                completed = status_result.get("completed_pages", 0)
                total = status_result.get("total_pages", 1)
                task.progress = 20.0 + (completed / total * 70.0)

            # Timeout
            task.status = TaskStatus.FAILED
            task.error = "Crawl job timeout"
            task.completed_at = datetime.utcnow()

        else:
            task.status = TaskStatus.FAILED
            task.error = result.get("error")
            task.completed_at = datetime.utcnow()

    except Exception as e:
        task.status = TaskStatus.FAILED
        task.error = str(e)
        task.completed_at = datetime.utcnow()


async def execute_map_task(task: CollectionTask, collector: FirecrawlCollector):
    """Background task to execute site mapping"""
    try:
        task.status = TaskStatus.RUNNING
        task.started_at = datetime.utcnow()
        task.progress = 10.0

        url = task.params.get("url")
        include_subdomains = task.params.get("include_subdomains", False)
        limit = task.params.get("limit")

        task.progress = 50.0
        result = await collector.map_site(url, include_subdomains, limit)

        task.result = result
        task.status = TaskStatus.COMPLETED if result.get("success") else TaskStatus.FAILED
        task.error = result.get("error")
        task.progress = 100.0
        task.completed_at = datetime.utcnow()

    except Exception as e:
        task.status = TaskStatus.FAILED
        task.error = str(e)
        task.completed_at = datetime.utcnow()


@router.post("/scrape", response_model=TaskResponse)
async def scrape_page(
    request: ScrapeRequest,
    background_tasks: BackgroundTasks
):
    """
    Scrape a single web page

    Returns task information. Use /tasks/{task_id} to check status and results.
    """
    # Create task
    task = CollectionTask(
        name=request.task_name or f"Scrape {request.url}",
        method=CollectionMethod.FIRECRAWL_SCRAPE,
        params={
            "url": str(request.url),
            "formats": request.formats,
            "only_main_content": request.only_main_content
        }
    )

    tasks_store[task.task_id] = task

    # Execute in background
    collector = get_firecrawl_collector()
    background_tasks.add_task(execute_scrape_task, task, collector)

    return TaskResponse(
        task_id=task.task_id,
        status=task.status,
        method=task.method,
        progress=task.progress,
        created_at=task.created_at.isoformat()
    )


@router.post("/search", response_model=TaskResponse)
async def search_web(
    request: SearchRequest,
    background_tasks: BackgroundTasks
):
    """
    Search the web and extract content from results

    Returns task information. Use /tasks/{task_id} to check status and results.
    """
    task = CollectionTask(
        name=request.task_name or f"Search: {request.query}",
        method=CollectionMethod.FIRECRAWL_SEARCH,
        params={
            "query": request.query,
            "limit": request.limit,
            "scrape_content": request.scrape_content
        }
    )

    tasks_store[task.task_id] = task

    collector = get_firecrawl_collector()
    background_tasks.add_task(execute_search_task, task, collector)

    return TaskResponse(
        task_id=task.task_id,
        status=task.status,
        method=task.method,
        progress=task.progress,
        created_at=task.created_at.isoformat()
    )


@router.post("/crawl", response_model=TaskResponse)
async def crawl_site(
    request: CrawlRequest,
    background_tasks: BackgroundTasks
):
    """
    Crawl a website and extract content from multiple pages

    This is a long-running task. Use /tasks/{task_id} to check progress.
    """
    task = CollectionTask(
        name=request.task_name or f"Crawl {request.url}",
        method=CollectionMethod.FIRECRAWL_CRAWL,
        params={
            "url": str(request.url),
            "max_pages": request.max_pages,
            "allowed_domains": request.allowed_domains,
            "exclude_paths": request.exclude_paths
        }
    )

    tasks_store[task.task_id] = task

    collector = get_firecrawl_collector()
    background_tasks.add_task(execute_crawl_task, task, collector)

    return TaskResponse(
        task_id=task.task_id,
        status=task.status,
        method=task.method,
        progress=task.progress,
        created_at=task.created_at.isoformat()
    )


@router.post("/map", response_model=TaskResponse)
async def map_site(
    request: MapRequest,
    background_tasks: BackgroundTasks
):
    """
    Map a website to discover all URLs

    Returns task information. Use /tasks/{task_id} to check status and results.
    """
    task = CollectionTask(
        name=request.task_name or f"Map {request.url}",
        method=CollectionMethod.FIRECRAWL_MAP,
        params={
            "url": str(request.url),
            "include_subdomains": request.include_subdomains,
            "limit": request.limit
        }
    )

    tasks_store[task.task_id] = task

    collector = get_firecrawl_collector()
    background_tasks.add_task(execute_map_task, task, collector)

    return TaskResponse(
        task_id=task.task_id,
        status=task.status,
        method=task.method,
        progress=task.progress,
        created_at=task.created_at.isoformat()
    )


@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task_status(task_id: str):
    """Get task status and results"""
    if task_id not in tasks_store:
        raise HTTPException(status_code=404, detail="Task not found")

    task = tasks_store[task_id]

    return TaskResponse(
        task_id=task.task_id,
        status=task.status,
        method=task.method,
        progress=task.progress,
        result=task.result,
        error=task.error,
        created_at=task.created_at.isoformat(),
        started_at=task.started_at.isoformat() if task.started_at else None,
        completed_at=task.completed_at.isoformat() if task.completed_at else None
    )


@router.get("/tasks", response_model=TaskListResponse)
async def list_tasks(
    page: int = 1,
    page_size: int = 20,
    status: TaskStatus = None
):
    """List all collection tasks with pagination"""
    all_tasks = list(tasks_store.values())

    # Filter by status
    if status:
        all_tasks = [t for t in all_tasks if t.status == status]

    # Sort by created_at descending
    all_tasks.sort(key=lambda t: t.created_at, reverse=True)

    # Pagination
    start = (page - 1) * page_size
    end = start + page_size
    page_tasks = all_tasks[start:end]

    return TaskListResponse(
        tasks=[
            TaskResponse(
                task_id=t.task_id,
                status=t.status,
                method=t.method,
                progress=t.progress,
                error=t.error,
                created_at=t.created_at.isoformat(),
                started_at=t.started_at.isoformat() if t.started_at else None,
                completed_at=t.completed_at.isoformat() if t.completed_at else None
            )
            for t in page_tasks
        ],
        total=len(all_tasks),
        page=page,
        page_size=page_size
    )


@router.get("/stats", response_model=CollectionStatsResponse)
async def get_collection_stats():
    """Get collection statistics"""
    all_tasks = list(tasks_store.values())

    stats = {
        "total_tasks": len(all_tasks),
        "pending_tasks": len([t for t in all_tasks if t.status == TaskStatus.PENDING]),
        "running_tasks": len([t for t in all_tasks if t.status == TaskStatus.RUNNING]),
        "completed_tasks": len([t for t in all_tasks if t.status == TaskStatus.COMPLETED]),
        "failed_tasks": len([t for t in all_tasks if t.status == TaskStatus.FAILED]),
        "total_items_collected": sum([
            len(t.result.get("data", [])) if t.result and "data" in t.result else 0
            for t in all_tasks if t.status == TaskStatus.COMPLETED
        ])
    }

    # Last collection time
    completed_tasks = [t for t in all_tasks if t.status == TaskStatus.COMPLETED and t.completed_at]
    if completed_tasks:
        latest = max(completed_tasks, key=lambda t: t.completed_at)
        stats["last_collection_time"] = latest.completed_at.isoformat()

    return CollectionStatsResponse(**stats)


@router.delete("/tasks/{task_id}", response_model=ApiResponse)
async def delete_task(task_id: str):
    """Delete a task"""
    if task_id not in tasks_store:
        raise HTTPException(status_code=404, detail="Task not found")

    del tasks_store[task_id]

    return ApiResponse(
        success=True,
        message=f"Task {task_id} deleted successfully"
    )
