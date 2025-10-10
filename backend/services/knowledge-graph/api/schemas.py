"""
API Request/Response Schemas

Pydantic models for API request and response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, Any, Dict, List


class EntityCreateRequest(BaseModel):
    """Request to create entity"""
    entity_type: str = Field(..., description="Entity type (e.g., Product, Feature)")
    properties: Dict[str, Any] = Field(..., description="Entity properties including 'id'")


class EntityUpdateRequest(BaseModel):
    """Request to update entity"""
    properties: Dict[str, Any] = Field(..., description="Properties to update")


class EntityResponse(BaseModel):
    """Entity response"""
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Response message")
    data: Optional[Dict[str, Any]] = Field(None, description="Entity data")


class RelationshipCreateRequest(BaseModel):
    """Request to create relationship"""
    from_id: str = Field(..., description="Source entity ID")
    to_id: str = Field(..., description="Target entity ID")
    rel_type: str = Field(..., description="Relationship type (e.g., HAS_FEATURE)")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Relationship properties")


class RelationshipResponse(BaseModel):
    """Relationship response"""
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Response message")
    data: Optional[Dict[str, Any]] = Field(None, description="Relationship data")


class QueryRequest(BaseModel):
    """Cypher query request"""
    query: str = Field(..., description="Cypher query string")
    params: Dict[str, Any] = Field(default_factory=dict, description="Query parameters")


class QueryResponse(BaseModel):
    """Query response"""
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Response message")
    results: List[Dict[str, Any]] = Field(default_factory=list, description="Query results")
    count: int = Field(default=0, description="Number of results")


class SearchRequest(BaseModel):
    """Entity search request"""
    entity_type: Optional[str] = Field(None, description="Entity type filter")
    search_text: Optional[str] = Field(None, description="Text search on name/description")
    properties: Optional[Dict[str, Any]] = Field(None, description="Property filters")
    limit: int = Field(default=100, ge=1, le=1000, description="Maximum results")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status (healthy/unhealthy)")
    database: str = Field(..., description="Database type")
    timestamp: str = Field(..., description="Timestamp ISO 8601 format")
