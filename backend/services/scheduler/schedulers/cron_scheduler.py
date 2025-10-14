"""
Cron Scheduler Implementation
Uses APScheduler for managing scheduled tasks
"""

import logging
from typing import Dict, Optional, Callable
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.asyncio import AsyncIOExecutor

from models.schedule import Schedule, ScheduleType, ScheduleStatus

logger = logging.getLogger(__name__)


class CronScheduler:
    """Cron-based task scheduler using APScheduler"""

    def __init__(self, timezone: str = "UTC"):
        """
        Initialize the scheduler

        Args:
            timezone: Timezone for schedule execution
        """
        # Configure job stores and executors
        jobstores = {
            'default': MemoryJobStore()
        }
        executors = {
            'default': AsyncIOExecutor()
        }
        job_defaults = {
            'coalesce': True,  # Combine missed executions into one
            'max_instances': 1,  # Only one instance of a job at a time
            'misfire_grace_time': 300  # 5 minutes grace period for missed jobs
        }

        self.scheduler = AsyncIOScheduler(
            jobstores=jobstores,
            executors=executors,
            job_defaults=job_defaults,
            timezone=timezone
        )
        self.jobs: Dict[str, str] = {}  # schedule_id -> job_id mapping
        self.task_callbacks: Dict[str, Callable] = {}  # schedule_id -> callback mapping

        logger.info(f"CronScheduler initialized with timezone: {timezone}")

    async def start(self):
        """Start the scheduler"""
        if not self.scheduler.running:
            self.scheduler.start()
            logger.info("Scheduler started")

    async def shutdown(self):
        """Shutdown the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown(wait=False)
            logger.info("Scheduler shut down")

    async def add_schedule(
        self,
        schedule: Schedule,
        task_callback: Callable
    ) -> bool:
        """
        Add a new schedule

        Args:
            schedule: Schedule configuration
            task_callback: Async function to execute

        Returns:
            True if schedule added successfully
        """
        try:
            # Check if schedule already exists
            if schedule.schedule_id in self.jobs:
                logger.warning(f"Schedule {schedule.schedule_id} already exists")
                return False

            # Skip if schedule is not active
            if schedule.status != ScheduleStatus.ACTIVE:
                logger.info(f"Schedule {schedule.schedule_id} is not active, skipping")
                return False

            # Determine trigger based on schedule type
            trigger = self._create_trigger(schedule)
            if trigger is None:
                logger.error(f"Failed to create trigger for schedule {schedule.schedule_id}")
                return False

            # Add job to scheduler
            job = self.scheduler.add_job(
                func=task_callback,
                trigger=trigger,
                id=schedule.schedule_id,
                name=schedule.name,
                replace_existing=True,
                kwargs={"schedule_id": schedule.schedule_id}
            )

            self.jobs[schedule.schedule_id] = job.id
            self.task_callbacks[schedule.schedule_id] = task_callback

            # Update next run time
            next_run = job.next_run_time
            logger.info(
                f"Schedule added: {schedule.name} ({schedule.schedule_id}), "
                f"next run: {next_run}"
            )

            return True

        except Exception as e:
            logger.error(f"Failed to add schedule {schedule.schedule_id}: {e}")
            return False

    async def remove_schedule(self, schedule_id: str) -> bool:
        """
        Remove a schedule

        Args:
            schedule_id: ID of the schedule to remove

        Returns:
            True if schedule removed successfully
        """
        try:
            if schedule_id not in self.jobs:
                logger.warning(f"Schedule {schedule_id} not found")
                return False

            job_id = self.jobs[schedule_id]
            self.scheduler.remove_job(job_id)

            del self.jobs[schedule_id]
            del self.task_callbacks[schedule_id]

            logger.info(f"Schedule removed: {schedule_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to remove schedule {schedule_id}: {e}")
            return False

    async def pause_schedule(self, schedule_id: str) -> bool:
        """
        Pause a schedule

        Args:
            schedule_id: ID of the schedule to pause

        Returns:
            True if schedule paused successfully
        """
        try:
            if schedule_id not in self.jobs:
                logger.warning(f"Schedule {schedule_id} not found")
                return False

            job_id = self.jobs[schedule_id]
            self.scheduler.pause_job(job_id)

            logger.info(f"Schedule paused: {schedule_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to pause schedule {schedule_id}: {e}")
            return False

    async def resume_schedule(self, schedule_id: str) -> bool:
        """
        Resume a paused schedule

        Args:
            schedule_id: ID of the schedule to resume

        Returns:
            True if schedule resumed successfully
        """
        try:
            if schedule_id not in self.jobs:
                logger.warning(f"Schedule {schedule_id} not found")
                return False

            job_id = self.jobs[schedule_id]
            self.scheduler.resume_job(job_id)

            logger.info(f"Schedule resumed: {schedule_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to resume schedule {schedule_id}: {e}")
            return False

    def get_next_run_time(self, schedule_id: str) -> Optional[datetime]:
        """
        Get next run time for a schedule

        Args:
            schedule_id: ID of the schedule

        Returns:
            Next run time or None
        """
        try:
            if schedule_id not in self.jobs:
                return None

            job_id = self.jobs[schedule_id]
            job = self.scheduler.get_job(job_id)

            return job.next_run_time if job else None

        except Exception as e:
            logger.error(f"Failed to get next run time for {schedule_id}: {e}")
            return None

    def _create_trigger(self, schedule: Schedule):
        """
        Create trigger based on schedule type

        Args:
            schedule: Schedule configuration

        Returns:
            Trigger object or None
        """
        try:
            if schedule.schedule_type == ScheduleType.CRON:
                if not schedule.cron_expression:
                    logger.error("Cron expression is required for CRON schedule type")
                    return None

                # Parse cron expression (format: minute hour day month day_of_week)
                parts = schedule.cron_expression.split()
                if len(parts) != 5:
                    logger.error(f"Invalid cron expression: {schedule.cron_expression}")
                    return None

                return CronTrigger(
                    minute=parts[0],
                    hour=parts[1],
                    day=parts[2],
                    month=parts[3],
                    day_of_week=parts[4]
                )

            elif schedule.schedule_type == ScheduleType.INTERVAL:
                if not schedule.interval_seconds or schedule.interval_seconds <= 0:
                    logger.error("Valid interval_seconds is required for INTERVAL schedule type")
                    return None

                return IntervalTrigger(seconds=schedule.interval_seconds)

            elif schedule.schedule_type == ScheduleType.ONE_TIME:
                if not schedule.scheduled_time:
                    logger.error("Scheduled time is required for ONE_TIME schedule type")
                    return None

                return DateTrigger(run_date=schedule.scheduled_time)

            else:
                logger.error(f"Unknown schedule type: {schedule.schedule_type}")
                return None

        except Exception as e:
            logger.error(f"Failed to create trigger: {e}")
            return None

    def get_scheduler_info(self) -> Dict:
        """
        Get scheduler information

        Returns:
            Dictionary with scheduler info
        """
        jobs = self.scheduler.get_jobs()

        return {
            "running": self.scheduler.running,
            "total_jobs": len(jobs),
            "job_ids": [job.id for job in jobs],
            "next_run_times": {
                job.id: job.next_run_time.isoformat() if job.next_run_time else None
                for job in jobs
            }
        }
