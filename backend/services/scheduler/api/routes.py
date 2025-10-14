"""
API Routes for Scheduler Service
"""

import logging
from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from models.schedule import (
    Schedule,
    ScheduleCreateRequest,
    ScheduleUpdateRequest,
    ScheduleResponse,
    ScheduleListResponse,
    TaskExecutionResponse,
    TaskHistoryResponse,
    ScheduleStatus
)

logger = logging.getLogger(__name__)

# Router instance (will be attached to app in main.py)
router = APIRouter(prefix="/api/v1/scheduler", tags=["scheduler"])

# Global state (will be set by main.py)
cron_scheduler = None
task_queue = None
schedules_db = {}  # In-memory storage for schedules


def set_scheduler_instances(scheduler, queue):
    """Set scheduler and queue instances"""
    global cron_scheduler, task_queue
    cron_scheduler = scheduler
    task_queue = queue


@router.post("/schedules", response_model=ScheduleResponse)
async def create_schedule(request: ScheduleCreateRequest):
    """
    Create a new schedule

    This endpoint creates a new scheduled task based on the provided configuration.

    **Schedule Types:**
    - `cron`: Use cron expression (e.g., "0 0 * * *" for daily at midnight)
    - `interval`: Use interval in seconds
    - `one_time`: Use specific datetime for one-time execution

    **Task Types:**
    - `data_collection`: Collect data from specified URL
    - `etl_processing`: Process existing collection task
    - `pipeline`: Run full pipeline (collection + ETL)
    """
    try:
        # Create schedule object
        schedule = Schedule(
            name=request.name,
            description=request.description,
            schedule_type=request.schedule_type,
            cron_expression=request.cron_expression,
            interval_seconds=request.interval_seconds,
            scheduled_time=request.scheduled_time,
            task_type=request.task_type,
            task_config=request.task_config,
            max_retries=request.max_retries,
            retry_delay=request.retry_delay
        )

        # Store schedule
        schedules_db[schedule.schedule_id] = schedule

        # Define task callback
        async def task_callback(schedule_id: str):
            """Callback function executed by scheduler"""
            schedule_obj = schedules_db.get(schedule_id)
            if schedule_obj:
                await task_queue.enqueue_task(schedule_obj)

        # Add to scheduler
        success = await cron_scheduler.add_schedule(schedule, task_callback)

        if not success:
            raise HTTPException(status_code=500, detail="Failed to add schedule to scheduler")

        # Update next run time
        next_run = cron_scheduler.get_next_run_time(schedule.schedule_id)
        schedule.next_run_at = next_run

        logger.info(f"Schedule created: {schedule.name} ({schedule.schedule_id})")

        return ScheduleResponse(
            schedule=schedule,
            message=f"Schedule created successfully. Next run: {next_run}"
        )

    except Exception as e:
        logger.error(f"Failed to create schedule: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/schedules/{schedule_id}", response_model=ScheduleResponse)
async def get_schedule(schedule_id: str):
    """Get schedule by ID"""
    schedule = schedules_db.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # Update next run time
    next_run = cron_scheduler.get_next_run_time(schedule.schedule_id)
    schedule.next_run_at = next_run

    return ScheduleResponse(schedule=schedule, message="Success")


@router.get("/schedules", response_model=ScheduleListResponse)
async def list_schedules(
    status: Optional[ScheduleStatus] = Query(None, description="Filter by status")
):
    """List all schedules"""
    schedules = list(schedules_db.values())

    # Filter by status if provided
    if status:
        schedules = [s for s in schedules if s.status == status]

    # Update next run times
    for schedule in schedules:
        next_run = cron_scheduler.get_next_run_time(schedule.schedule_id)
        schedule.next_run_at = next_run

    # Count by status
    active = len([s for s in schedules if s.status == ScheduleStatus.ACTIVE])
    paused = len([s for s in schedules if s.status == ScheduleStatus.PAUSED])
    disabled = len([s for s in schedules if s.status == ScheduleStatus.DISABLED])

    return ScheduleListResponse(
        schedules=schedules,
        total=len(schedules),
        active=active,
        paused=paused,
        disabled=disabled
    )


@router.put("/schedules/{schedule_id}", response_model=ScheduleResponse)
async def update_schedule(schedule_id: str, request: ScheduleUpdateRequest):
    """Update an existing schedule"""
    schedule = schedules_db.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # Update fields
    if request.name is not None:
        schedule.name = request.name
    if request.description is not None:
        schedule.description = request.description
    if request.cron_expression is not None:
        schedule.cron_expression = request.cron_expression
    if request.interval_seconds is not None:
        schedule.interval_seconds = request.interval_seconds
    if request.scheduled_time is not None:
        schedule.scheduled_time = request.scheduled_time
    if request.task_config is not None:
        schedule.task_config = request.task_config
    if request.max_retries is not None:
        schedule.max_retries = request.max_retries
    if request.retry_delay is not None:
        schedule.retry_delay = request.retry_delay

    # Handle status change
    if request.status is not None:
        old_status = schedule.status
        schedule.status = request.status

        if old_status == ScheduleStatus.ACTIVE and request.status == ScheduleStatus.PAUSED:
            await cron_scheduler.pause_schedule(schedule_id)
        elif old_status == ScheduleStatus.PAUSED and request.status == ScheduleStatus.ACTIVE:
            await cron_scheduler.resume_schedule(schedule_id)

    schedule.updated_at = schedule.updated_at  # This will be updated by the model

    logger.info(f"Schedule updated: {schedule_id}")

    return ScheduleResponse(schedule=schedule, message="Schedule updated successfully")


@router.delete("/schedules/{schedule_id}")
async def delete_schedule(schedule_id: str):
    """Delete a schedule"""
    schedule = schedules_db.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # Remove from scheduler
    await cron_scheduler.remove_schedule(schedule_id)

    # Remove from storage
    del schedules_db[schedule_id]

    logger.info(f"Schedule deleted: {schedule_id}")

    return {"message": "Schedule deleted successfully", "schedule_id": schedule_id}


@router.post("/schedules/{schedule_id}/pause")
async def pause_schedule(schedule_id: str):
    """Pause a schedule"""
    schedule = schedules_db.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    success = await cron_scheduler.pause_schedule(schedule_id)

    if not success:
        raise HTTPException(status_code=500, detail="Failed to pause schedule")

    schedule.status = ScheduleStatus.PAUSED

    return {"message": "Schedule paused successfully", "schedule_id": schedule_id}


@router.post("/schedules/{schedule_id}/resume")
async def resume_schedule(schedule_id: str):
    """Resume a paused schedule"""
    schedule = schedules_db.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    success = await cron_scheduler.resume_schedule(schedule_id)

    if not success:
        raise HTTPException(status_code=500, detail="Failed to resume schedule")

    schedule.status = ScheduleStatus.ACTIVE

    return {"message": "Schedule resumed successfully", "schedule_id": schedule_id}


@router.post("/schedules/{schedule_id}/trigger", response_model=TaskExecutionResponse)
async def trigger_schedule_manually(schedule_id: str):
    """Manually trigger a schedule (immediate execution)"""
    schedule = schedules_db.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # Enqueue task immediately
    execution = await task_queue.enqueue_task(schedule)

    logger.info(f"Schedule triggered manually: {schedule_id}")

    return TaskExecutionResponse(
        execution=execution,
        message="Task execution triggered manually"
    )


@router.get("/executions/{execution_id}")
async def get_task_execution(execution_id: str):
    """Get task execution details"""
    execution = task_queue.get_execution(execution_id)

    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")

    return execution


@router.get("/executions", response_model=TaskHistoryResponse)
async def get_task_history(
    schedule_id: Optional[str] = Query(None, description="Filter by schedule ID"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum records to return")
):
    """Get task execution history"""
    executions = task_queue.get_history(schedule_id=schedule_id, limit=limit)

    # Count by status
    from models.schedule import TaskStatus
    total = len(executions)
    completed = len([e for e in executions if e.status == TaskStatus.COMPLETED])
    failed = len([e for e in executions if e.status == TaskStatus.FAILED])
    running = len([e for e in executions if e.status == TaskStatus.RUNNING])

    return TaskHistoryResponse(
        executions=executions,
        total=total,
        completed=completed,
        failed=failed,
        running=running
    )


@router.get("/stats")
async def get_scheduler_stats():
    """Get scheduler statistics"""
    scheduler_info = cron_scheduler.get_scheduler_info()
    queue_stats = task_queue.get_stats()

    return {
        "scheduler": scheduler_info,
        "queue": queue_stats,
        "schedules_total": len(schedules_db)
    }
