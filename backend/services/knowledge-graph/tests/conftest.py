"""
Pytest Configuration and Fixtures

Provides shared test fixtures for unit and integration tests
"""
import pytest
from unittest.mock import Mock, MagicMock, patch
from services.graph_service import GraphService


@pytest.fixture
def mock_neo4j_driver():
    """
    Mock Neo4j driver for unit testing

    Returns:
        tuple: (mock_driver, mock_session)
    """
    driver = Mock()
    session = MagicMock()

    # Configure session context manager behavior
    driver.session.return_value.__enter__.return_value = session
    driver.session.return_value.__exit__.return_value = None

    return driver, session


@pytest.fixture
def graph_service(mock_neo4j_driver, monkeypatch):
    """
    GraphService instance with mocked driver

    Args:
        mock_neo4j_driver: Mock driver fixture
        monkeypatch: pytest monkeypatch fixture

    Returns:
        GraphService: Service instance with mocked driver
    """
    driver, session = mock_neo4j_driver

    # Patch GraphDatabase.driver to return mock
    monkeypatch.setattr(
        "neo4j.GraphDatabase.driver",
        lambda *args, **kwargs: driver
    )

    service = GraphService(
        uri="bolt://localhost:7687",
        user="neo4j",
        password="test"
    )

    # Attach session for test assertions
    service._session = session

    return service


@pytest.fixture
def sample_product():
    """
    Sample product entity data

    Returns:
        dict: Product properties
    """
    return {
        "id": "prod_123",
        "name": "Cool Mattress Queen",
        "description": "Gel-infused memory foam mattress",
        "sku": "MAT-COOL-QUEEN",
        "category": "Mattresses",
        "brand": "SweetNight",
        "price_range": {"min": 299.99, "max": 399.99}
    }


@pytest.fixture
def sample_feature():
    """
    Sample feature entity data

    Returns:
        dict: Feature properties
    """
    return {
        "id": "feat_456",
        "name": "Gel-infused Memory Foam",
        "description": "Advanced cooling technology",
        "feature_type": "material",
        "importance_score": 0.9
    }


@pytest.fixture
def sample_relationship():
    """
    Sample relationship data

    Returns:
        dict: Relationship properties
    """
    return {
        "from_id": "prod_123",
        "to_id": "feat_456",
        "rel_type": "HAS_FEATURE",
        "properties": {"confidence": 0.95}
    }
