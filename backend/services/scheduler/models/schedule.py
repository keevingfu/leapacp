"""
Schedule and Task Models for Scheduler Service
"""

from enum import Enum
from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field
from uuid import uuid4


class ScheduleType(str, Enum):
    """Type of schedule"""
    CRON = "cron"
    INTERVAL = "interval"
    ONE_TIME = "one_time"


class TaskType(str, Enum):
    """Type of task to execute"""
    DATA_COLLECTION = "data_collection"
    ETL_PROCESSING = "etl_processing"
    PIPELINE = "pipeline"  # Collection + ETL


class TaskStatus(str, Enum):
    """Status of a task execution"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ScheduleStatus(str, Enum):
    """Status of a schedule"""
    ACTIVE = "active"
    PAUSED = "paused"
    DISABLED = "disabled"


class Schedule(BaseModel):
    """Schedule configuration"""
    schedule_id: str = Field(default_factory=lambda: str(uuid4()))
    name: str = Field(..., description="Schedule name")
    description: Optional[str] = Field(None, description="Schedule description")

    schedule_type: ScheduleType = Field(..., description="Type of schedule")
    cron_expression: Optional[str] = Field(None, description="Cron expression (for CRON type)")
    interval_seconds: Optional[int] = Field(None, description="Interval in seconds (for INTERVAL type)")
    scheduled_time: Optional[datetime] = Field(None, description="Scheduled execution time (for ONE_TIME type)")

    task_type: TaskType = Field(..., description="Type of task to execute")
    task_config: Dict[str, Any] = Field(default_factory=dict, description="Task configuration parameters")

    status: ScheduleStatus = Field(default=ScheduleStatus.ACTIVE, description="Schedule status")

    max_retries: int = Field(default=3, description="Maximum retry attempts on failure")
    retry_delay: int = Field(default=60, description="Delay between retries in seconds")

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Daily Data Collection",
                "description": "Collect data from specified URLs every day at midnight",
                "schedule_type": "cron",
                "cron_expression": "0 0 * * *",
                "task_type": "data_collection",
                "task_config": {
                    "url": "https://example.com",
                    "formats": ["markdown"]
                },
                "status": "active",
                "max_retries": 3,
                "retry_delay": 60
            }
        }


class TaskExecution(BaseModel):
    """Record of a task execution"""
    execution_id: str = Field(default_factory=lambda: str(uuid4()))
    schedule_id: str = Field(..., description="Associated schedule ID")

    task_type: TaskType = Field(..., description="Type of task")
    task_config: Dict[str, Any] = Field(default_factory=dict, description="Task configuration")

    status: TaskStatus = Field(default=TaskStatus.PENDING, description="Execution status")

    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[float] = None

    retry_count: int = Field(default=0, description="Number of retry attempts")
    max_retries: int = Field(default=3, description="Maximum retry attempts")

    result: Optional[Dict[str, Any]] = Field(None, description="Task execution result")
    error_message: Optional[str] = Field(None, description="Error message if failed")

    # External task IDs
    collection_task_id: Optional[str] = None
    etl_task_id: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "execution_id": "exec-123",
                "schedule_id": "sched-456",
                "task_type": "pipeline",
                "status": "completed",
                "duration_seconds": 12.5,
                "retry_count": 0,
                "result": {
                    "collection_status": "completed",
                    "etl_status": "completed",
                    "entities_created": 10
                }
            }
        }


class ScheduleCreateRequest(BaseModel):
    """Request to create a new schedule"""
    name: str
    description: Optional[str] = None
    schedule_type: ScheduleType
    cron_expression: Optional[str] = None
    interval_seconds: Optional[int] = None
    scheduled_time: Optional[datetime] = None
    task_type: TaskType
    task_config: Dict[str, Any] = Field(default_factory=dict)
    max_retries: int = 3
    retry_delay: int = 60


class ScheduleUpdateRequest(BaseModel):
    """Request to update a schedule"""
    name: Optional[str] = None
    description: Optional[str] = None
    cron_expression: Optional[str] = None
    interval_seconds: Optional[int] = None
    scheduled_time: Optional[datetime] = None
    task_config: Optional[Dict[str, Any]] = None
    status: Optional[ScheduleStatus] = None
    max_retries: Optional[int] = None
    retry_delay: Optional[int] = None


class ScheduleResponse(BaseModel):
    """Response for schedule operations"""
    schedule: Schedule
    message: str = "Success"


class TaskExecutionResponse(BaseModel):
    """Response for task execution operations"""
    execution: TaskExecution
    message: str = "Task execution started"


class ScheduleListResponse(BaseModel):
    """Response for list schedules"""
    schedules: List[Schedule]
    total: int
    active: int
    paused: int
    disabled: int


class TaskHistoryResponse(BaseModel):
    """Response for task execution history"""
    executions: List[TaskExecution]
    total: int
    completed: int
    failed: int
    running: int
