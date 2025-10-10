"""
Celery Application Configuration

Configure Celery with Redis broker for async task processing
"""
from celery import Celery
from config import get_settings

settings = get_settings()

# Create Celery app
app = Celery(
    'data_collector',
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Configuration
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes hard limit
    task_soft_time_limit=25 * 60,  # 25 minutes warning
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

# Auto-discover tasks
app.autodiscover_tasks(['tasks'])
