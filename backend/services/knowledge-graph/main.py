"""
Knowledge Graph Service - FastAPI Application

Main application entry point for the Knowledge Graph microservice
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from config import get_settings
from api.routes import router
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
    logger.info("Starting Knowledge Graph Service")
    logger.info(f"Neo4j URI: {settings.NEO4J_URI}")
    logger.info(f"API Host: {settings.API_HOST}:{settings.API_PORT}")
    yield
    logger.info("Shutting down Knowledge Graph Service")


# Create FastAPI application
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="Knowledge Graph Service for Leap Agentic Commerce Platform",
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


# Include API router
app.include_router(router)


@app.get("/")
async def root():
    """
    Root endpoint

    Returns:
        Service information
    """
    return {
        "service": "Knowledge Graph Service",
        "version": settings.API_VERSION,
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=(settings.ENVIRONMENT == "development"),
        log_level=settings.LOG_LEVEL.lower()
    )
