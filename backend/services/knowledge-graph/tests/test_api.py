"""
Integration Tests for API Endpoints

Tests FastAPI routes with mocked GraphService
"""
import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock


client = TestClient(app)


@pytest.fixture
def mock_graph_service():
    """Mock GraphService for API tests"""
    with patch("api.routes.get_graph_service") as mock:
        service = MagicMock()
        mock.return_value.__enter__ = lambda self: service
        mock.return_value.__exit__ = lambda self, *args: None
        yield service


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "Knowledge Graph Service"
    assert data["status"] == "running"


def test_health_check(mock_graph_service):
    """Test health check endpoint"""
    mock_graph_service.health_check.return_value = True

    response = client.get("/api/v1/graph/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "neo4j"
    assert "timestamp" in data


def test_health_check_unhealthy(mock_graph_service):
    """Test health check when database is unhealthy"""
    mock_graph_service.health_check.return_value = False

    response = client.get("/api/v1/graph/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "unhealthy"


def test_create_entity(mock_graph_service):
    """Test create entity endpoint"""
    mock_graph_service.create_entity.return_value = "prod_123"

    response = client.post("/api/v1/graph/entities", json={
        "entity_type": "Product",
        "properties": {
            "id": "prod_123",
            "name": "Test Product",
            "sku": "TEST-001",
            "category": "Test",
            "brand": "Test Brand"
        }
    })

    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == "prod_123"


def test_create_entity_validation_error(mock_graph_service):
    """Test create entity with validation error"""
    mock_graph_service.create_entity.side_effect = ValueError("Invalid entity type")

    response = client.post("/api/v1/graph/entities", json={
        "entity_type": "InvalidType",
        "properties": {"id": "test_123"}
    })

    assert response.status_code == 400


def test_get_entity(mock_graph_service):
    """Test get entity endpoint"""
    mock_graph_service.query_entity.return_value = {
        "id": "prod_123",
        "name": "Test Product",
        "sku": "TEST-001"
    }

    response = client.get("/api/v1/graph/entities/prod_123")

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == "prod_123"


def test_get_entity_not_found(mock_graph_service):
    """Test get non-existent entity"""
    mock_graph_service.query_entity.return_value = None

    response = client.get("/api/v1/graph/entities/nonexistent")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_update_entity(mock_graph_service):
    """Test update entity endpoint"""
    mock_graph_service.query_entity.return_value = {"id": "prod_123"}
    mock_graph_service.update_entity.return_value = True

    response = client.put("/api/v1/graph/entities/prod_123", json={
        "properties": {"name": "Updated Product"}
    })

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_update_entity_not_found(mock_graph_service):
    """Test update non-existent entity"""
    mock_graph_service.query_entity.return_value = None

    response = client.put("/api/v1/graph/entities/nonexistent", json={
        "properties": {"name": "Updated"}
    })

    assert response.status_code == 404


def test_delete_entity(mock_graph_service):
    """Test delete entity endpoint"""
    mock_graph_service.delete_entity.return_value = True

    response = client.delete("/api/v1/graph/entities/prod_123")

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_delete_entity_not_found(mock_graph_service):
    """Test delete non-existent entity"""
    mock_graph_service.delete_entity.return_value = False

    response = client.delete("/api/v1/graph/entities/nonexistent")

    assert response.status_code == 404


def test_create_relationship(mock_graph_service):
    """Test create relationship endpoint"""
    mock_graph_service.query_entity.side_effect = [
        {"id": "prod_123"},  # from_id exists
        {"id": "feat_456"}   # to_id exists
    ]
    mock_graph_service.create_relationship.return_value = True

    response = client.post("/api/v1/graph/relationships", json={
        "from_id": "prod_123",
        "to_id": "feat_456",
        "rel_type": "HAS_FEATURE",
        "properties": {"confidence": 0.95}
    })

    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True


def test_create_relationship_source_not_found(mock_graph_service):
    """Test create relationship when source entity doesn't exist"""
    mock_graph_service.query_entity.return_value = None

    response = client.post("/api/v1/graph/relationships", json={
        "from_id": "nonexistent",
        "to_id": "feat_456",
        "rel_type": "HAS_FEATURE",
        "properties": {}
    })

    assert response.status_code == 404
    assert "Source entity" in response.json()["detail"]


def test_create_relationship_target_not_found(mock_graph_service):
    """Test create relationship when target entity doesn't exist"""
    mock_graph_service.query_entity.side_effect = [
        {"id": "prod_123"},  # source exists
        None                 # target doesn't exist
    ]

    response = client.post("/api/v1/graph/relationships", json={
        "from_id": "prod_123",
        "to_id": "nonexistent",
        "rel_type": "HAS_FEATURE",
        "properties": {}
    })

    assert response.status_code == 404
    assert "Target entity" in response.json()["detail"]


def test_delete_relationship(mock_graph_service):
    """Test delete relationship endpoint"""
    mock_graph_service.delete_relationship.return_value = True

    response = client.delete("/api/v1/graph/relationships", params={
        "from_id": "prod_123",
        "to_id": "feat_456",
        "rel_type": "HAS_FEATURE"
    })

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_delete_relationship_not_found(mock_graph_service):
    """Test delete non-existent relationship"""
    mock_graph_service.delete_relationship.return_value = False

    response = client.delete("/api/v1/graph/relationships", params={
        "from_id": "prod_123",
        "to_id": "feat_456",
        "rel_type": "HAS_FEATURE"
    })

    assert response.status_code == 404


def test_execute_query(mock_graph_service):
    """Test custom query endpoint"""
    mock_graph_service.execute_cypher.return_value = [
        {"product": "Test Product 1"},
        {"product": "Test Product 2"}
    ]

    response = client.post("/api/v1/graph/query", json={
        "query": "MATCH (p:Product) RETURN p.name as product",
        "params": {}
    })

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["count"] == 2
    assert len(data["results"]) == 2


def test_execute_query_dangerous(mock_graph_service):
    """Test that dangerous queries are rejected"""
    mock_graph_service.execute_cypher.side_effect = ValueError("dangerous operation: DROP")

    response = client.post("/api/v1/graph/query", json={
        "query": "DROP DATABASE",
        "params": {}
    })

    assert response.status_code == 400


def test_search_entities(mock_graph_service):
    """Test search entities endpoint"""
    mock_graph_service.search_entities.return_value = [
        {"id": "prod_123", "name": "Product 1"},
        {"id": "prod_456", "name": "Product 2"}
    ]

    response = client.post("/api/v1/graph/search", json={
        "entity_type": "Product",
        "search_text": "Product",
        "limit": 100
    })

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["count"] == 2


def test_search_entities_with_properties(mock_graph_service):
    """Test search with property filters"""
    mock_graph_service.search_entities.return_value = [
        {"id": "prod_123", "name": "Cool Mattress", "category": "Mattresses"}
    ]

    response = client.post("/api/v1/graph/search", json={
        "entity_type": "Product",
        "properties": {"category": "Mattresses"},
        "limit": 50
    })

    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 1
