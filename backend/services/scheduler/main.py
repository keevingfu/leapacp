"""
Scheduler Service Main Application
FastAPI service for managing scheduled tasks
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import Config
from schedulers.cron_scheduler import CronScheduler
from schedulers.task_queue import TaskQueue
from api import routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Global instances
cron_scheduler: CronScheduler = None
task_queue: TaskQueue = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown
    """
    global cron_scheduler, task_queue

    # Startup
    logger.info(f"Starting {Config.SERVICE_NAME} v{Config.SERVICE_VERSION}")
    logger.info(f"Data Collection URL: {Config.DATA_COLLECTION_URL}")
    logger.info(f"ETL Processing URL: {Config.ETL_PROCESSING_URL}")

    # Initialize scheduler and queue
    cron_scheduler = CronScheduler(timezone=Config.SCHEDULER_TIMEZONE)
    task_queue = TaskQueue()

    # Set instances in routes module
    routes.set_scheduler_instances(cron_scheduler, task_queue)

    # Start scheduler
    await cron_scheduler.start()

    logger.info("Application startup complete")

    yield

    # Shutdown
    logger.info("Shutting down application...")

    await cron_scheduler.shutdown()
    await task_queue.shutdown()

    logger.info("Application shutdown complete")


# Create FastAPI app
app = FastAPI(
    title=Config.SERVICE_NAME,
    version=Config.SERVICE_VERSION,
    description="Scheduler service for managing scheduled data collection and ETL tasks",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes.router)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    scheduler_info = cron_scheduler.get_scheduler_info() if cron_scheduler else {}
    queue_stats = task_queue.get_stats() if task_queue else {}

    return {
        "service": Config.SERVICE_NAME,
        "version": Config.SERVICE_VERSION,
        "status": "healthy",
        "scheduler_running": scheduler_info.get("running", False),
        "data_collection_url": Config.DATA_COLLECTION_URL,
        "etl_processing_url": Config.ETL_PROCESSING_URL,
        "scheduler_info": scheduler_info,
        "queue_stats": queue_stats
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=Config.SERVICE_PORT,
        reload=True
    )
