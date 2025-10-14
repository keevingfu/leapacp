"""ETL Processing API Routes"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict
import httpx
from datetime import datetime

from config import get_settings
from models.etl_task import ETLTask, TaskStatus, ProcessingStage, ProcessedData
from processors.text_processor import TextProcessor
from processors.neo4j_client import Neo4jClient

router = APIRouter(prefix="/api/v1/etl", tags=["etl"])

# In-memory task storage
tasks_store: Dict[str, ETLTask] = {}

# Global instances
text_processor = TextProcessor()
neo4j_client = Neo4jClient()


async def process_collection_task(etl_task: ETLTask):
    """Background task to process data from collection service"""
    try:
        etl_task.status = TaskStatus.EXTRACTING
        etl_task.stage = ProcessingStage.EXTRACT
        etl_task.started_at = datetime.utcnow()
        etl_task.progress = 10.0

        # 1. Fetch data from Data Collection Service
        settings = get_settings()
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{settings.DATA_COLLECTION_URL}/api/v1/collection/tasks/{etl_task.collection_task_id}"
            )

            if response.status_code != 200:
                raise Exception(f"Failed to fetch collection task: {response.status_code}")

            collection_data = response.json()

            if collection_data["status"] != "completed":
                raise Exception("Collection task not completed")

            raw_content = collection_data["result"]["content"]

        etl_task.progress = 30.0

        # 2. Transform - Extract entities and relationships
        etl_task.status = TaskStatus.TRANSFORMING
        etl_task.stage = ProcessingStage.TRANSFORM

        # Get markdown content
        raw_text = raw_content.get("markdown", "")

        # Clean text
        cleaned_text = text_processor.clean_markdown(raw_text)
        cleaned_text = text_processor.clean_text(cleaned_text)

        # Extract entities
        entities = text_processor.extract_entities_simple(cleaned_text)
        etl_task.extracted_count = len(entities)

        # Extract relationships
        relationships = text_processor.extract_relationships_simple(cleaned_text, entities)
        etl_task.transformed_count = len(relationships)

        etl_task.progress = 60.0

        # 3. Load - Save to Neo4j
        etl_task.status = TaskStatus.LOADING
        etl_task.stage = ProcessingStage.LOAD

        # Load entities
        entity_result = await neo4j_client.load_entities(entities)
        etl_task.loaded_count += entity_result.entities_created

        # Load relationships
        rel_result = await neo4j_client.load_relationships(relationships)
        etl_task.loaded_count += rel_result.relationships_created

        # Store processed data
        etl_task.result = ProcessedData(
            raw_text=raw_text,
            cleaned_text=cleaned_text,
            entities=entities,
            relationships=relationships,
            metadata={
                "entities_loaded": entity_result.entities_created,
                "relationships_loaded": rel_result.relationships_created
            }
        )

        etl_task.progress = 100.0
        etl_task.status = TaskStatus.COMPLETED
        etl_task.completed_at = datetime.utcnow()

    except Exception as e:
        etl_task.status = TaskStatus.FAILED
        etl_task.error = str(e)
        etl_task.completed_at = datetime.utcnow()


@router.post("/process")
async def create_etl_task(
    collection_task_id: str,
    task_name: str = None,
    background_tasks: BackgroundTasks = None
):
    """Create ETL processing task"""
    task = ETLTask(
        name=task_name or f"ETL Process {collection_task_id}",
        collection_task_id=collection_task_id
    )

    tasks_store[task.task_id] = task

    # Start processing in background
    background_tasks.add_task(process_collection_task, task)

    return {
        "task_id": task.task_id,
        "status": task.status,
        "stage": task.stage,
        "progress": task.progress
    }


@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Get ETL task status"""
    if task_id not in tasks_store:
        raise HTTPException(status_code=404, detail="Task not found")

    task = tasks_store[task_id]

    return {
        "task_id": task.task_id,
        "name": task.name,
        "status": task.status,
        "stage": task.stage,
        "progress": task.progress,
        "extracted_count": task.extracted_count,
        "transformed_count": task.transformed_count,
        "loaded_count": task.loaded_count,
        "error": task.error,
        "created_at": task.created_at.isoformat(),
        "started_at": task.started_at.isoformat() if task.started_at else None,
        "completed_at": task.completed_at.isoformat() if task.completed_at else None
    }


@router.get("/tasks")
async def list_tasks(page: int = 1, page_size: int = 20):
    """List all ETL tasks"""
    all_tasks = list(tasks_store.values())
    start = (page - 1) * page_size
    end = start + page_size

    tasks_page = all_tasks[start:end]

    return {
        "tasks": [
            {
                "task_id": t.task_id,
                "name": t.name,
                "status": t.status,
                "progress": t.progress,
                "created_at": t.created_at.isoformat()
            }
            for t in tasks_page
        ],
        "total": len(all_tasks),
        "page": page,
        "page_size": page_size
    }


@router.get("/stats")
async def get_stats():
    """Get ETL processing statistics"""
    all_tasks = list(tasks_store.values())

    return {
        "total_tasks": len(all_tasks),
        "pending_tasks": len([t for t in all_tasks if t.status == TaskStatus.PENDING]),
        "extracting_tasks": len([t for t in all_tasks if t.status == TaskStatus.EXTRACTING]),
        "transforming_tasks": len([t for t in all_tasks if t.status == TaskStatus.TRANSFORMING]),
        "loading_tasks": len([t for t in all_tasks if t.status == TaskStatus.LOADING]),
        "completed_tasks": len([t for t in all_tasks if t.status == TaskStatus.COMPLETED]),
        "failed_tasks": len([t for t in all_tasks if t.status == TaskStatus.FAILED]),
        "total_entities_extracted": sum([t.extracted_count for t in all_tasks]),
        "total_entities_loaded": sum([t.loaded_count for t in all_tasks])
    }
