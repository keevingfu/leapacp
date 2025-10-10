"""
Unit Tests for GraphService

Tests core graph database operations with mocked Neo4j driver
"""
import pytest
from services.graph_service import GraphService
from unittest.mock import Mock, MagicMock


def test_create_entity(graph_service, sample_product, mock_neo4j_driver):
    """Test entity creation"""
    driver, session = mock_neo4j_driver

    # Mock transaction result
    session.execute_write.return_value = sample_product["id"]

    # Execute
    entity_id = graph_service.create_entity("Product", sample_product)

    # Assert
    assert entity_id == sample_product["id"]
    session.execute_write.assert_called_once()


def test_create_entity_invalid_type(graph_service):
    """Test entity creation with invalid type"""
    with pytest.raises(ValueError, match="Invalid entity type"):
        graph_service.create_entity("InvalidType", {"id": "test_123"})


def test_create_entity_missing_id(graph_service):
    """Test entity creation without ID"""
    with pytest.raises(ValueError, match="must include 'id' field"):
        graph_service.create_entity("Product", {"name": "Test"})


def test_create_relationship(graph_service, sample_relationship, mock_neo4j_driver):
    """Test relationship creation"""
    driver, session = mock_neo4j_driver
    session.execute_write.return_value = True

    # Execute
    result = graph_service.create_relationship(
        from_id=sample_relationship["from_id"],
        to_id=sample_relationship["to_id"],
        rel_type=sample_relationship["rel_type"],
        properties=sample_relationship["properties"]
    )

    # Assert
    assert result is True
    session.execute_write.assert_called_once()


def test_create_relationship_invalid_type(graph_service):
    """Test relationship creation with invalid type"""
    with pytest.raises(ValueError, match="Invalid relationship type"):
        graph_service.create_relationship(
            from_id="prod_123",
            to_id="feat_456",
            rel_type="INVALID_TYPE"
        )


def test_query_entity(graph_service, sample_product, mock_neo4j_driver):
    """Test entity query"""
    driver, session = mock_neo4j_driver

    # Mock query result
    session.execute_read.return_value = sample_product

    # Execute
    result = graph_service.query_entity("prod_123")

    # Assert
    assert result == sample_product
    session.execute_read.assert_called_once()


def test_query_entity_not_found(graph_service, mock_neo4j_driver):
    """Test query for non-existent entity"""
    driver, session = mock_neo4j_driver
    session.execute_read.return_value = None

    result = graph_service.query_entity("nonexistent")

    assert result is None


def test_update_entity(graph_service, mock_neo4j_driver):
    """Test entity update"""
    driver, session = mock_neo4j_driver
    session.execute_write.return_value = True

    result = graph_service.update_entity(
        "prod_123",
        {"name": "Updated Product", "price": 199.99}
    )

    assert result is True
    session.execute_write.assert_called_once()


def test_delete_entity(graph_service, mock_neo4j_driver):
    """Test entity deletion"""
    driver, session = mock_neo4j_driver
    session.execute_write.return_value = True

    result = graph_service.delete_entity("prod_123")

    assert result is True
    session.execute_write.assert_called_once()


def test_delete_entity_not_found(graph_service, mock_neo4j_driver):
    """Test deleting non-existent entity"""
    driver, session = mock_neo4j_driver
    session.execute_write.return_value = False

    result = graph_service.delete_entity("nonexistent")

    assert result is False


def test_delete_relationship(graph_service, mock_neo4j_driver):
    """Test relationship deletion"""
    driver, session = mock_neo4j_driver
    session.execute_write.return_value = True

    result = graph_service.delete_relationship(
        from_id="prod_123",
        to_id="feat_456",
        rel_type="HAS_FEATURE"
    )

    assert result is True
    session.execute_write.assert_called_once()


def test_query_relationships(graph_service, mock_neo4j_driver):
    """Test querying entity relationships"""
    driver, session = mock_neo4j_driver

    # Mock relationship results
    mock_relationships = [
        {
            "direction": "outgoing",
            "type": "HAS_FEATURE",
            "properties": {"confidence": 0.95},
            "target": {"id": "feat_456", "name": "Cool Feature"}
        }
    ]
    session.execute_read.return_value = mock_relationships

    # Execute
    result = graph_service.query_relationships(
        entity_id="prod_123",
        rel_type="HAS_FEATURE",
        direction="outgoing"
    )

    # Assert
    assert len(result) == 1
    assert result[0]["type"] == "HAS_FEATURE"
    session.execute_read.assert_called_once()


def test_search_entities(graph_service, mock_neo4j_driver):
    """Test entity search"""
    driver, session = mock_neo4j_driver

    # Mock search results
    mock_entities = [
        {"id": "prod_123", "name": "Product 1"},
        {"id": "prod_456", "name": "Product 2"}
    ]
    session.execute_read.return_value = mock_entities

    # Execute
    result = graph_service.search_entities(
        entity_type="Product",
        search_text="Product",
        limit=10
    )

    # Assert
    assert len(result) == 2
    session.execute_read.assert_called_once()


def test_execute_cypher(graph_service, mock_neo4j_driver):
    """Test custom Cypher query execution"""
    driver, session = mock_neo4j_driver

    # Mock query result
    mock_result = MagicMock()
    mock_record1 = {"product": "Test Product 1"}
    mock_record2 = {"product": "Test Product 2"}
    mock_result.__iter__ = Mock(return_value=iter([mock_record1, mock_record2]))
    session.run.return_value = mock_result

    # Execute
    result = graph_service.execute_cypher(
        query="MATCH (p:Product) RETURN p.name as product",
        params={}
    )

    # Assert
    assert len(result) == 2
    session.run.assert_called_once()


def test_execute_cypher_dangerous_query(graph_service):
    """Test that dangerous queries are rejected"""
    with pytest.raises(ValueError, match="dangerous operation"):
        graph_service.execute_cypher("DROP DATABASE", {})


def test_health_check_success(graph_service, mock_neo4j_driver):
    """Test successful health check"""
    driver, session = mock_neo4j_driver

    mock_result = Mock()
    mock_result.single.return_value = {"test": 1}
    session.run.return_value = mock_result

    result = graph_service.health_check()

    assert result is True


def test_health_check_failure(graph_service, mock_neo4j_driver):
    """Test failed health check"""
    driver, session = mock_neo4j_driver
    session.run.side_effect = Exception("Connection failed")

    result = graph_service.health_check()

    assert result is False


def test_close(graph_service):
    """Test closing service connection"""
    # Should not raise exception
    graph_service.close()
    assert True
