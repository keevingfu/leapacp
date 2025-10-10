"""
API Routes

FastAPI endpoint definitions for Data Collector Service
"""
from fastapi import APIRouter, HTTPException, Depends, status, Header
from typing import List, Optional
from .schemas import (
    TaskCreateRequest, TaskResponse, TaskStatusResponse,
    ContentQueryRequest, ContentResponse,
    QuotaResponse, HealthResponse
)
from tasks.celery_tasks import (
    collect_reddit_task,
    collect_youtube_task,
    scrape_urls_task
)
from utils.quota_manager import QuotaManager
from utils.db import MongoDB
from celery.result import AsyncResult
from datetime import datetime
from models.content import SourcePlatform
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/collector", tags=["data-collector"])

# Shared quota manager
quota_manager = QuotaManager()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Check MongoDB
        collection = MongoDB.get_collection('raw_content')
        await collection.find_one()
        mongo_status = "healthy"
    except:
        mongo_status = "unhealthy"

    return HealthResponse(
        status="healthy" if mongo_status == "healthy" else "degraded",
        mongodb=mongo_status,
        redis="healthy",  # Assume healthy if Celery working
        timestamp=datetime.utcnow().isoformat()
    )


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(request: TaskCreateRequest):
    """
    Create collection task

    Dispatches async Celery task to collect content
    """
    try:
        # Dispatch appropriate task based on platform
        if request.platform == SourcePlatform.REDDIT:
            task = collect_reddit_task.delay(
                keywords=request.keywords,
                tenant_id=request.tenant_id,
                brand_id=request.brand_id,
                limit=request.limit or 100
            )
        elif request.platform == SourcePlatform.YOUTUBE:
            task = collect_youtube_task.delay(
                keywords=request.keywords,
                tenant_id=request.tenant_id,
                brand_id=request.brand_id,
                max_results=min(request.limit or 10, 50)  # YouTube limit
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Platform {request.platform} not supported yet"
            )

        return TaskResponse(
            success=True,
            message="Collection task created",
            data={
                "task_id": task.id,
                "platform": request.platform,
                "status": "pending"
            }
        )

    except Exception as e:
        logger.error(f"Task creation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(task_id: str):
    """Query task status"""
    try:
        result = AsyncResult(task_id)

        if result.ready():
            if result.successful():
                task_result = result.result
                return TaskStatusResponse(
                    task_id=task_id,
                    status="completed",
                    items_collected=task_result.get('items_collected', 0),
                    error_message=None
                )
            else:
                return TaskStatusResponse(
                    task_id=task_id,
                    status="failed",
                    items_collected=0,
                    error_message=str(result.result)
                )
        else:
            return TaskStatusResponse(
                task_id=task_id,
                status="running",
                items_collected=0,
                error_message=None
            )

    except Exception as e:
        logger.error(f"Task status query failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/content", response_model=ContentResponse)
async def query_content(
    tenant_id: str,
    platform: Optional[SourcePlatform] = None,
    limit: int = 100,
    skip: int = 0
):
    """
    Query collected content

    Returns paginated content for tenant
    """
    try:
        collection = MongoDB.get_collection('raw_content')

        # Build query
        query = {"tenant_id": tenant_id}
        if platform:
            query["source_platform"] = platform

        # Execute query with pagination
        cursor = collection.find(query).skip(skip).limit(limit).sort("collected_at", -1)

        documents = []
        async for doc in cursor:
            # Convert ObjectId to string
            doc['_id'] = str(doc['_id'])
            documents.append(doc)

        # Get total count
        total_count = await collection.count_documents(query)

        return ContentResponse(
            success=True,
            count=total_count,
            data=documents
        )

    except Exception as e:
        logger.error(f"Content query failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/quota", response_model=List[QuotaResponse])
async def get_quota_status():
    """Get API quota status for all platforms"""
    try:
        platforms = ['reddit', 'youtube']
        statuses = []

        for platform in platforms:
            status_dict = quota_manager.get_quota_status(platform)
            if 'error' not in status_dict:
                statuses.append(QuotaResponse(**status_dict))

        return statuses

    except Exception as e:
        logger.error(f"Quota status query failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
