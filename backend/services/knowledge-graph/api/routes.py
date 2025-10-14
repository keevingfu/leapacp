"""
API Routes

FastAPI route definitions for Knowledge Graph Service
"""
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from .schemas import (
    EntityCreateRequest, EntityUpdateRequest, EntityResponse,
    RelationshipCreateRequest, RelationshipResponse,
    QueryRequest, QueryResponse, SearchRequest, HealthResponse
)
from services.graph_service import GraphService
from config import get_settings
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/graph", tags=["knowledge-graph"])


def get_graph_service():
    """
    Dependency: Provide GraphService instance

    Yields:
        GraphService: Configured service instance

    Note: Uses try/finally to ensure connection cleanup
    """
    settings = get_settings()
    service = GraphService(
        uri=settings.NEO4J_URI,
        user=settings.NEO4J_USER,
        password=settings.NEO4J_PASSWORD
    )
    try:
        yield service
    finally:
        service.close()


@router.get("/health", response_model=HealthResponse)
async def health_check(service: GraphService = Depends(get_graph_service)):
    """
    Health check endpoint

    Returns:
        HealthResponse: Service health status
    """
    is_healthy = service.health_check()
    return HealthResponse(
        status="healthy" if is_healthy else "unhealthy",
        database="neo4j",
        timestamp=datetime.utcnow().isoformat()
    )


@router.get("/entities", response_model=QueryResponse)
async def list_entities(
    search: Optional[str] = None,
    entity_type: Optional[str] = None,
    limit: int = 100,
    service: GraphService = Depends(get_graph_service)
):
    """
    List all entities with optional search and filtering

    Args:
        search: Optional search text to filter entities
        entity_type: Optional entity type filter
        limit: Maximum number of entities to return (default: 100)

    Returns:
        QueryResponse: List of entities matching criteria
    """
    try:
        results = service.search_entities(
            entity_type=entity_type,
            search_text=search,
            properties=None,
            limit=limit
        )
        return QueryResponse(
            success=True,
            message="Entities retrieved successfully",
            results=results,
            count=len(results)
        )
    except Exception as e:
        logger.error(f"Failed to list entities: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/entities", response_model=EntityResponse, status_code=status.HTTP_201_CREATED)
async def create_entity(
    request: EntityCreateRequest,
    service: GraphService = Depends(get_graph_service)
):
    """
    Create new entity

    Args:
        request: Entity creation request with type and properties

    Returns:
        EntityResponse: Created entity details

    Raises:
        HTTPException: 400 if validation fails, 500 if creation fails
    """
    try:
        entity_id = service.create_entity(
            entity_type=request.entity_type,
            properties=request.properties
        )
        return EntityResponse(
            success=True,
            message="Entity created successfully",
            data={"id": entity_id, "entity_type": request.entity_type}
        )
    except ValueError as e:
        logger.warning(f"Invalid entity creation request: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create entity: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/entities/{entity_id}", response_model=EntityResponse)
async def get_entity(
    entity_id: str,
    service: GraphService = Depends(get_graph_service)
):
    """
    Get entity by ID

    Args:
        entity_id: Entity identifier

    Returns:
        EntityResponse: Entity data

    Raises:
        HTTPException: 404 if entity not found
    """
    entity = service.query_entity(entity_id)
    if not entity:
        raise HTTPException(
            status_code=404,
            detail=f"Entity {entity_id} not found"
        )
    return EntityResponse(
        success=True,
        message="Entity retrieved successfully",
        data=entity
    )


@router.put("/entities/{entity_id}", response_model=EntityResponse)
async def update_entity(
    entity_id: str,
    request: EntityUpdateRequest,
    service: GraphService = Depends(get_graph_service)
):
    """
    Update entity properties

    Args:
        entity_id: Entity identifier
        request: Update request with properties

    Returns:
        EntityResponse: Update confirmation

    Raises:
        HTTPException: 404 if entity not found, 500 if update fails
    """
    # Verify entity exists
    if not service.query_entity(entity_id):
        raise HTTPException(
            status_code=404,
            detail=f"Entity {entity_id} not found"
        )

    success = service.update_entity(entity_id, request.properties)
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to update entity"
        )

    return EntityResponse(
        success=True,
        message="Entity updated successfully",
        data={"id": entity_id}
    )


@router.delete("/entities/{entity_id}", response_model=EntityResponse)
async def delete_entity(
    entity_id: str,
    service: GraphService = Depends(get_graph_service)
):
    """
    Delete entity and its relationships

    Args:
        entity_id: Entity identifier

    Returns:
        EntityResponse: Deletion confirmation

    Raises:
        HTTPException: 404 if entity not found
    """
    success = service.delete_entity(entity_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Entity {entity_id} not found"
        )
    return EntityResponse(
        success=True,
        message="Entity deleted successfully",
        data={"id": entity_id}
    )


@router.get("/relationships", response_model=QueryResponse)
async def list_relationships(
    limit: int = 100,
    service: GraphService = Depends(get_graph_service)
):
    """
    List all relationships

    Args:
        limit: Maximum number of relationships to return (default: 100)

    Returns:
        QueryResponse: List of all relationships
    """
    try:
        # Execute Cypher query to get all relationships with their nodes
        query = """
        MATCH (source)-[r]->(target)
        RETURN
            id(r) as id,
            source.id as source_id,
            labels(source)[0] as source_type,
            type(r) as type,
            target.id as target_id,
            labels(target)[0] as target_type,
            properties(r) as properties
        LIMIT $limit
        """
        results = service.execute_cypher(query, {"limit": limit})

        return QueryResponse(
            success=True,
            message="Relationships retrieved successfully",
            results=results,
            count=len(results)
        )
    except Exception as e:
        logger.error(f"Failed to list relationships: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/relationships", response_model=RelationshipResponse, status_code=status.HTTP_201_CREATED)
async def create_relationship(
    request: RelationshipCreateRequest,
    service: GraphService = Depends(get_graph_service)
):
    """
    Create relationship between entities

    Args:
        request: Relationship creation request

    Returns:
        RelationshipResponse: Creation confirmation

    Raises:
        HTTPException: 404 if entities not found, 400 if creation fails
    """
    # Verify both entities exist
    if not service.query_entity(request.from_id):
        raise HTTPException(
            status_code=404,
            detail=f"Source entity {request.from_id} not found"
        )
    if not service.query_entity(request.to_id):
        raise HTTPException(
            status_code=404,
            detail=f"Target entity {request.to_id} not found"
        )

    try:
        success = service.create_relationship(
            from_id=request.from_id,
            to_id=request.to_id,
            rel_type=request.rel_type,
            properties=request.properties
        )

        if not success:
            raise HTTPException(
                status_code=400,
                detail="Failed to create relationship"
            )

        return RelationshipResponse(
            success=True,
            message="Relationship created successfully"
        )
    except ValueError as e:
        logger.warning(f"Invalid relationship creation request: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create relationship: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/relationships", response_model=RelationshipResponse)
async def delete_relationship(
    from_id: str,
    to_id: str,
    rel_type: str,
    service: GraphService = Depends(get_graph_service)
):
    """
    Delete relationship between entities

    Args:
        from_id: Source entity ID
        to_id: Target entity ID
        rel_type: Relationship type

    Returns:
        RelationshipResponse: Deletion confirmation

    Raises:
        HTTPException: 404 if relationship not found
    """
    success = service.delete_relationship(from_id, to_id, rel_type)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Relationship not found"
        )
    return RelationshipResponse(
        success=True,
        message="Relationship deleted successfully"
    )


@router.post("/query", response_model=QueryResponse)
async def execute_query(
    request: QueryRequest,
    service: GraphService = Depends(get_graph_service)
):
    """
    Execute custom Cypher query

    Args:
        request: Query request with Cypher string and parameters

    Returns:
        QueryResponse: Query results

    Raises:
        HTTPException: 400 if query is invalid or contains dangerous operations
    """
    try:
        results = service.execute_cypher(
            query=request.query,
            params=request.params
        )
        return QueryResponse(
            success=True,
            message="Query executed successfully",
            results=results,
            count=len(results)
        )
    except ValueError as e:
        logger.warning(f"Dangerous query rejected: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Query execution failed: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/search", response_model=QueryResponse)
async def search_entities(
    request: SearchRequest,
    service: GraphService = Depends(get_graph_service)
):
    """
    Search entities by type, text, or properties

    Args:
        request: Search request with filters

    Returns:
        QueryResponse: Search results

    Raises:
        HTTPException: 500 if search fails
    """
    try:
        results = service.search_entities(
            entity_type=request.entity_type,
            search_text=request.search_text,
            properties=request.properties,
            limit=request.limit
        )
        return QueryResponse(
            success=True,
            message="Search completed successfully",
            results=results,
            count=len(results)
        )
    except Exception as e:
        logger.error(f"Search failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats", response_model=QueryResponse)
async def get_graph_stats(
    service: GraphService = Depends(get_graph_service)
):
    """
    Get graph statistics

    Returns:
        QueryResponse: Graph statistics including node and relationship counts
    """
    try:
        # Execute Cypher queries to get stats
        node_count_query = "MATCH (n) RETURN count(n) as total_nodes"
        rel_count_query = "MATCH ()-[r]->() RETURN count(r) as total_relationships"
        node_types_query = """
        MATCH (n)
        RETURN labels(n)[0] as type, count(*) as count
        ORDER BY count DESC
        """

        node_count_result = service.execute_cypher(node_count_query, {})
        rel_count_result = service.execute_cypher(rel_count_query, {})
        node_types_result = service.execute_cypher(node_types_query, {})

        stats = {
            "total_nodes": node_count_result[0]["total_nodes"] if node_count_result else 0,
            "total_relationships": rel_count_result[0]["total_relationships"] if rel_count_result else 0,
            "node_types": node_types_result
        }

        return QueryResponse(
            success=True,
            message="Stats retrieved successfully",
            results=[stats],
            count=1
        )
    except Exception as e:
        logger.error(f"Failed to get stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
