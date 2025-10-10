"""
Integration Tests for API

Test FastAPI endpoints
"""
import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, AsyncMock

client = TestClient(app)


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert data["service"] == "Data Collector Service"


@patch('api.routes.MongoDB.get_collection')
@pytest.mark.asyncio
async def test_health_check(mock_get_collection):
    """Test health endpoint"""
    mock_collection = AsyncMock()
    mock_collection.find_one.return_value = None
    mock_get_collection.return_value = mock_collection

    response = client.get("/api/v1/collector/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "mongodb" in data


@patch('api.routes.collect_reddit_task')
def test_create_reddit_task(mock_task):
    """Test task creation"""
    mock_task.delay.return_value.id = "test_task_123"

    response = client.post(
        "/api/v1/collector/tasks",
        json={
            "platform": "reddit",
            "keywords": ["test"],
            "tenant_id": "tenant_001",
            "brand_id": "brand_001",
            "limit": 10
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "task_id" in data["data"]


@patch('api.routes.AsyncResult')
def test_get_task_status_completed(mock_async_result):
    """Test task status query - completed"""
    mock_result = mock_async_result.return_value
    mock_result.ready.return_value = True
    mock_result.successful.return_value = True
    mock_result.result = {
        'status': 'success',
        'items_collected': 50
    }

    response = client.get("/api/v1/collector/tasks/test_task_123")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert data["items_collected"] == 50


@patch('api.routes.MongoDB.get_collection')
@pytest.mark.asyncio
async def test_query_content(mock_get_collection):
    """Test content query"""
    mock_collection = AsyncMock()

    # Mock cursor
    mock_cursor = AsyncMock()
    mock_cursor.__aiter__.return_value = iter([
        {
            "_id": "123",
            "content_id": "test_123",
            "title": "Test Content",
            "tenant_id": "tenant_001"
        }
    ])

    mock_collection.find.return_value = mock_cursor
    mock_collection.count_documents.return_value = 1
    mock_get_collection.return_value = mock_collection

    response = client.get("/api/v1/collector/content?tenant_id=tenant_001")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["count"] >= 0
