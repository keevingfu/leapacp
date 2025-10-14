"""
Task Queue Management
Manages task execution, history, and retry logic
"""

import logging
import asyncio
import httpx
from typing import Dict, List, Optional
from datetime import datetime
from collections import deque

from config import Config
from models.schedule import (
    Schedule,
    TaskExecution,
    TaskType,
    TaskStatus
)

logger = logging.getLogger(__name__)


class TaskQueue:
    """
    Task queue manager for executing scheduled tasks
    """

    def __init__(self):
        """Initialize task queue"""
        self.queue: deque = deque(maxlen=Config.QUEUE_MAX_SIZE)
        self.history: deque = deque(maxlen=Config.TASK_HISTORY_LIMIT)
        self.running_tasks: Dict[str, TaskExecution] = {}

        self.http_client = httpx.AsyncClient(timeout=120.0)

        logger.info("TaskQueue initialized")

    async def enqueue_task(
        self,
        schedule: Schedule
    ) -> TaskExecution:
        """
        Enqueue a new task for execution

        Args:
            schedule: Schedule that triggered the task

        Returns:
            TaskExecution object
        """
        execution = TaskExecution(
            schedule_id=schedule.schedule_id,
            task_type=schedule.task_type,
            task_config=schedule.task_config,
            max_retries=schedule.max_retries,
            status=TaskStatus.PENDING
        )

        self.queue.append(execution)
        self.history.append(execution)

        logger.info(f"Task enqueued: {execution.execution_id} (type: {execution.task_type})")

        # Start execution immediately in background
        asyncio.create_task(self._execute_task(execution, schedule))

        return execution

    async def _execute_task(
        self,
        execution: TaskExecution,
        schedule: Schedule
    ):
        """
        Execute a task

        Args:
            execution: Task execution record
            schedule: Associated schedule
        """
        try:
            # Update status to running
            execution.status = TaskStatus.RUNNING
            execution.started_at = datetime.utcnow()
            self.running_tasks[execution.execution_id] = execution

            logger.info(f"Executing task: {execution.execution_id}")

            # Execute based on task type
            if execution.task_type == TaskType.DATA_COLLECTION:
                result = await self._execute_data_collection(execution)

            elif execution.task_type == TaskType.ETL_PROCESSING:
                result = await self._execute_etl_processing(execution)

            elif execution.task_type == TaskType.PIPELINE:
                result = await self._execute_pipeline(execution)

            else:
                raise ValueError(f"Unknown task type: {execution.task_type}")

            # Update execution record
            execution.status = TaskStatus.COMPLETED
            execution.completed_at = datetime.utcnow()
            execution.duration_seconds = (
                execution.completed_at - execution.started_at
            ).total_seconds()
            execution.result = result

            logger.info(
                f"Task completed: {execution.execution_id} "
                f"(duration: {execution.duration_seconds:.2f}s)"
            )

        except Exception as e:
            logger.error(f"Task failed: {execution.execution_id}, error: {e}")

            execution.status = TaskStatus.FAILED
            execution.error_message = str(e)
            execution.completed_at = datetime.utcnow()

            # Retry logic
            if execution.retry_count < execution.max_retries:
                execution.retry_count += 1
                logger.info(
                    f"Retrying task {execution.execution_id} "
                    f"(attempt {execution.retry_count}/{execution.max_retries})"
                )

                # Wait before retry
                await asyncio.sleep(schedule.retry_delay)

                # Reset status and retry
                execution.status = TaskStatus.PENDING
                execution.error_message = None
                await self._execute_task(execution, schedule)

        finally:
            # Remove from running tasks
            if execution.execution_id in self.running_tasks:
                del self.running_tasks[execution.execution_id]

    async def _execute_data_collection(
        self,
        execution: TaskExecution
    ) -> Dict:
        """
        Execute data collection task

        Args:
            execution: Task execution record

        Returns:
            Result dictionary
        """
        url = f"{Config.DATA_COLLECTION_URL}/api/v1/collection/scrape"

        payload = execution.task_config

        logger.info(f"Calling data collection API: {url}")

        response = await self.http_client.post(url, json=payload)
        response.raise_for_status()

        data = response.json()
        task_id = data.get("task_id")

        execution.collection_task_id = task_id

        # Wait for completion
        status_url = f"{Config.DATA_COLLECTION_URL}/api/v1/collection/tasks/{task_id}"

        while True:
            await asyncio.sleep(5)  # Poll every 5 seconds

            status_response = await self.http_client.get(status_url)
            status_response.raise_for_status()

            status_data = status_response.json()

            if status_data.get("status") == "completed":
                logger.info(f"Data collection completed: {task_id}")
                return {
                    "collection_task_id": task_id,
                    "status": "completed",
                    "result": status_data.get("result")
                }

            elif status_data.get("status") == "failed":
                raise Exception(f"Data collection failed: {status_data.get('error_message')}")

    async def _execute_etl_processing(
        self,
        execution: TaskExecution
    ) -> Dict:
        """
        Execute ETL processing task

        Args:
            execution: Task execution record

        Returns:
            Result dictionary
        """
        # Get collection task ID from config
        collection_task_id = execution.task_config.get("collection_task_id")

        if not collection_task_id:
            raise ValueError("collection_task_id is required for ETL processing")

        url = f"{Config.ETL_PROCESSING_URL}/api/v1/etl/process"

        params = {
            "collection_task_id": collection_task_id,
            "task_name": execution.task_config.get("task_name", "Scheduled ETL Task")
        }

        logger.info(f"Calling ETL processing API: {url}")

        response = await self.http_client.post(url, params=params)
        response.raise_for_status()

        data = response.json()
        task_id = data.get("task_id")

        execution.etl_task_id = task_id

        # Wait for completion
        status_url = f"{Config.ETL_PROCESSING_URL}/api/v1/etl/tasks/{task_id}"

        while True:
            await asyncio.sleep(5)  # Poll every 5 seconds

            status_response = await self.http_client.get(status_url)
            status_response.raise_for_status()

            status_data = status_response.json()

            if status_data.get("status") == "completed":
                logger.info(f"ETL processing completed: {task_id}")
                return {
                    "etl_task_id": task_id,
                    "status": "completed",
                    "result": status_data.get("result")
                }

            elif status_data.get("status") == "failed":
                raise Exception(f"ETL processing failed: {status_data.get('error_message')}")

    async def _execute_pipeline(
        self,
        execution: TaskExecution
    ) -> Dict:
        """
        Execute full pipeline (collection + ETL)

        Args:
            execution: Task execution record

        Returns:
            Result dictionary
        """
        # Step 1: Data collection
        collection_result = await self._execute_data_collection(execution)

        collection_task_id = collection_result.get("collection_task_id")

        # Step 2: ETL processing
        execution.task_config["collection_task_id"] = collection_task_id

        etl_result = await self._execute_etl_processing(execution)

        return {
            "collection": collection_result,
            "etl": etl_result,
            "status": "completed"
        }

    def get_execution(self, execution_id: str) -> Optional[TaskExecution]:
        """
        Get task execution by ID

        Args:
            execution_id: Execution ID

        Returns:
            TaskExecution or None
        """
        # Check running tasks first
        if execution_id in self.running_tasks:
            return self.running_tasks[execution_id]

        # Check history
        for execution in self.history:
            if execution.execution_id == execution_id:
                return execution

        return None

    def get_history(
        self,
        schedule_id: Optional[str] = None,
        limit: int = 100
    ) -> List[TaskExecution]:
        """
        Get task execution history

        Args:
            schedule_id: Filter by schedule ID (optional)
            limit: Maximum number of records to return

        Returns:
            List of task executions
        """
        executions = list(self.history)

        if schedule_id:
            executions = [
                e for e in executions
                if e.schedule_id == schedule_id
            ]

        # Return most recent first
        executions.reverse()

        return executions[:limit]

    def get_stats(self) -> Dict:
        """
        Get task queue statistics

        Returns:
            Dictionary with statistics
        """
        history_list = list(self.history)

        return {
            "queue_size": len(self.queue),
            "running_tasks": len(self.running_tasks),
            "history_total": len(history_list),
            "history_completed": len([e for e in history_list if e.status == TaskStatus.COMPLETED]),
            "history_failed": len([e for e in history_list if e.status == TaskStatus.FAILED]),
            "history_cancelled": len([e for e in history_list if e.status == TaskStatus.CANCELLED])
        }

    async def shutdown(self):
        """Shutdown task queue"""
        await self.http_client.aclose()
        logger.info("TaskQueue shut down")
