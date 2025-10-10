"""
Data Collector Service - FastAPI Application

Main application entry point for data collection microservice
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from config import get_settings
from api.routes import router
from utils.db import MongoDB
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events

    Handles startup and shutdown operations
    """
    logger.info("Starting Data Collector Service")

    # Connect to MongoDB
    await MongoDB.connect()

    yield

    # Cleanup
    await MongoDB.close()
    logger.info("Shutting down Data Collector Service")


# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="Data Collector Service for Leap Agentic Commerce Platform",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include router
app.include_router(router)


@app.get("/")
async def root():
    """
    Root endpoint

    Returns:
        Service information
    """
    return {
        "service": "Data Collector Service",
        "version": settings.API_VERSION,
        "status": "running",
        "docs": "/docs"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=(settings.ENVIRONMENT == "development"),
        log_level=settings.LOG_LEVEL.lower()
    )
