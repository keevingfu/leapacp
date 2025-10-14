"""ETL Processing Service - Main Application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import get_settings
from api.routes import router as etl_router
from processors.neo4j_client import Neo4jClient

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global Neo4j client
neo4j_client = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    global neo4j_client
    settings = get_settings()

    logger.info(f"Starting {settings.SERVICE_NAME} v{settings.VERSION}")
    logger.info(f"Data Collection Service: {settings.DATA_COLLECTION_URL}")
    logger.info(f"Neo4j URI: {settings.NEO4J_URI}")

    # Initialize Neo4j client
    neo4j_client = Neo4jClient()
    await neo4j_client.connect()
    logger.info("Neo4j client connected")

    yield

    # Cleanup
    if neo4j_client:
        await neo4j_client.close()
        logger.info("Neo4j client disconnected")

    logger.info(f"Shutting down {settings.SERVICE_NAME}")


app = FastAPI(
    title="ETL Processing Service",
    description="Data extraction, transformation, and loading service",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(etl_router)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    settings = get_settings()

    # Check Neo4j connection
    neo4j_healthy = False
    if neo4j_client:
        neo4j_healthy = await neo4j_client.health_check()

    return {
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "status": "healthy" if neo4j_healthy else "degraded",
        "neo4j_connected": neo4j_healthy,
        "data_collection_url": settings.DATA_COLLECTION_URL
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "ETL Processing Service",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }
