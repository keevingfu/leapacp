# PRP: Knowledge Graph Service - Core Implementation

**Status**: Ready for Execution
**Complexity**: Medium-High
**Confidence Score**: 8/10
**Estimated Time**: 12-16 hours

---

## Goal

Build a production-ready Knowledge Graph Service as the semantic foundation for the Leap Agentic Commerce Platform. This service will manage entities and relationships in Neo4j, providing REST APIs for GEO (content generation) and Commerce (offer catalog) capabilities.

**End State**:
- Fully functional FastAPI service managing 8 entity types and 8 relationship types in Neo4j
- RESTful API with OpenAPI documentation
- 80%+ test coverage with unit and integration tests
- Query performance < 100ms (P95)
- Ready for integration with content generation and commerce services

---

## Why

- **Business Value**: Enables AI Citation optimization by providing semantic product knowledge
- **Integration**: Serves as single source of truth for product/feature/scenario relationships used by content generation and offer catalog services
- **User Impact**: Powers accurate product recommendations and instant-checkout capabilities in AI conversations
- **Foundation**: Core dependency for 6+ downstream services (content-generator, offer-catalog, analytics, etc.)

---

## What

Build a microservice with:
- Neo4j graph database integration with connection pooling
- 8 entity types (Product, Feature, Scenario, Problem, UserGroup, Competitor, Offer, Merchant)
- 8 relationship types (HAS_FEATURE, SOLVES, APPLIES_TO, TARGETS, COMPARES_WITH, HAS_OFFER, SOLD_BY, GENERATED_FROM)
- REST API endpoints for CRUD operations
- Custom Cypher query execution
- Database schema initialization with constraints and indexes
- Comprehensive error handling and logging
- Health check endpoint
- OpenAPI documentation

### Success Criteria
- [ ] Neo4j connection established with health check
- [ ] All 8 entity types support full CRUD via API
- [ ] All 8 relationship types can be created and queried
- [ ] Custom Cypher queries execute successfully
- [ ] API returns standardized JSON responses
- [ ] Query latency < 100ms for simple queries (< 3 hops)
- [ ] Database constraints prevent duplicate entities
- [ ] Full-text search works on product names/descriptions
- [ ] Unit test coverage ≥ 80%
- [ ] Integration tests verify end-to-end workflows
- [ ] API documentation accessible at /docs
- [ ] Service can start and handle 100 concurrent requests

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Neo4j Python Driver
- url: https://neo4j.com/docs/python-manual/current/
  why: Official driver documentation for connection management, transactions, and query execution
  critical_sections:
    - "Install the driver" (pip install neo4j)
    - "Create a driver instance" (connection management)
    - "Query the database" (session and transaction patterns)

- url: https://neo4j.com/docs/python-manual/current/transactions/
  why: Understand transaction patterns for consistency
  gotcha: Must use session.execute_write() for write operations, not session.run()

- url: https://neo4j.com/docs/cypher-manual/current/
  why: Cypher query language reference for CREATE, MATCH, relationships
  critical_sections:
    - "CREATE" (create nodes and relationships)
    - "MATCH" (query patterns)
    - "WHERE" (filtering)
    - "Constraints" (uniqueness and existence)

# FastAPI Documentation
- url: https://fastapi.tiangolo.com/tutorial/
  why: Core FastAPI patterns for building REST APIs
  critical_sections:
    - "First Steps" (basic app structure)
    - "Path Parameters" (entity ID routing)
    - "Request Body" (Pydantic models)
    - "Dependency Injection" (database connection per request)
    - "Handling Errors" (HTTPException patterns)

- url: https://fastapi.tiangolo.com/tutorial/dependencies/
  why: Learn dependency injection for database connection management
  critical: Use Depends() for graph_service injection in routes

- url: https://docs.pydantic.dev/latest/
  why: Data validation and serialization
  critical_sections:
    - "Models" (defining entity schemas)
    - "Validators" (custom validation logic)
    - "Field Types" (Dict, List, Optional types)

# Project Documentation
- file: CLAUDE.md
  why: Project architecture, service division, data models, API standards, coding conventions
  critical:
    - "Core Service Division: knowledge-graph-service"
    - "Data Models: Knowledge Graph Schema (Neo4j)"
    - "API Interface Specification"
    - "Code Standards: Python PEP 8"

- file: leap_acp_dev_guide.md
  why: Complete implementation examples for GraphService and API routes
  critical_sections:
    - "Section 4.1: Knowledge Graph Service" (lines 372-567) - Complete GraphService implementation
    - "Section 5: API Interface Specification" (lines 1365-1493) - API design patterns
    - "Section 6.2: Neo4j Schema" (lines 1678-1702) - Constraint and index creation
    - "Section 8.1: Unit Testing" (lines 2037-2120) - Test patterns with pytest

- file: leap_acp_prd.md
  why: Business requirements, entity definitions, validation rules
  critical_sections:
    - "Section 3.1.3: Knowledge Graph Construction" (lines 138-180) - Entity types and relationships
    - "Section 6.1: Neo4j Schema" (lines 874-898) - Complete schema definition
    - "Section 7.3: Knowledge Graph Interface" (lines 1074-1093) - API examples

- file: INITIAL.md
  why: Feature requirements, success criteria, validation gates, examples
  critical: Complete feature specification with all requirements

# Testing
- url: https://docs.pytest.org/en/stable/
  why: Testing framework patterns
  critical_sections:
    - "Fixtures" (setup/teardown)
    - "Mocking" (mock Neo4j driver)
    - "Parametrize" (test multiple entity types)
```

### Current Codebase Structure
```bash
.
├── CLAUDE.md                              # Project guidance
├── INITIAL.md                             # Feature requirements
├── leap_acp_dev_guide.md                  # Implementation guide with examples
├── leap_acp_prd.md                        # Product requirements
├── leap_agentic_commerce_platform.md      # Platform whitepaper
└── leap-acp-portal.tsx                    # Frontend prototype (reference only)
```

### Desired Codebase Structure (After Implementation)
```bash
backend/
├── services/
│   └── knowledge-graph/
│       ├── main.py                 # FastAPI app entry point with lifespan events
│       ├── config.py               # Environment config with pydantic-settings
│       ├── models/
│       │   ├── __init__.py
│       │   ├── entities.py         # Entity Pydantic models (Product, Feature, etc.)
│       │   └── relationships.py    # Relationship models
│       ├── services/
│       │   ├── __init__.py
│       │   └── graph_service.py    # Neo4j operations (CRUD, queries)
│       ├── api/
│       │   ├── __init__.py
│       │   ├── routes.py           # FastAPI route definitions
│       │   └── schemas.py          # Request/Response Pydantic schemas
│       ├── tests/
│       │   ├── __init__.py
│       │   ├── conftest.py         # Pytest fixtures
│       │   ├── test_graph_service.py  # Unit tests for GraphService
│       │   └── test_api.py         # Integration tests for API endpoints
│       ├── scripts/
│       │   └── init_neo4j.py       # Database initialization (constraints, indexes)
│       ├── requirements.txt        # Python dependencies
│       ├── .env.example           # Environment variable template
│       └── README.md              # Service-specific documentation
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: Neo4j Python Driver v5.x
# 1. Use session.execute_write() for write operations, NOT session.run()
#    session.run() is for read operations only in managed transactions
with driver.session() as session:
    result = session.execute_write(self._create_entity_tx, entity_type, properties)  # ✅
    result = session.run(create_query, properties)  # ❌ Wrong for writes

# 2. Transaction functions must be static or accept tx as first param
@staticmethod
def _create_entity_tx(tx, entity_type, properties):
    query = f"CREATE (n:{entity_type} $properties) RETURN n.id"
    result = tx.run(query, properties=properties)
    return result.single()["id"]

# 3. Always use parameterized queries to prevent injection
query = f"MATCH (n:{entity_type} {{id: $id}}) RETURN n"  # ✅ Parameterized
result = tx.run(query, id=entity_id)

query = f"MATCH (n:{entity_type} {{id: '{entity_id}'}}) RETURN n"  # ❌ Injection risk

# CRITICAL: FastAPI v0.104+
# 1. Use async def for endpoint functions (better performance)
@router.post("/entities")
async def create_entity(request: EntityCreateRequest):  # ✅ Async
    ...

# 2. Use Depends() for dependency injection (database connections)
def get_graph_service():
    service = GraphService(uri=..., user=..., password=...)
    try:
        yield service
    finally:
        service.close()

@router.get("/entities/{id}")
async def get_entity(
    entity_id: str,
    service: GraphService = Depends(get_graph_service)  # ✅ Injected
):
    ...

# 3. Pydantic models define both validation and serialization
class EntityCreateRequest(BaseModel):
    entity_type: str
    properties: Dict[str, Any]  # Flexible for different entity types

# CRITICAL: Python Type Hints
# Use Optional for nullable fields, Dict/List with type params
from typing import Optional, Dict, List, Any

def query_entity(self, entity_id: str) -> Optional[Dict[str, Any]]:  # ✅ Clear types
    ...

# CRITICAL: Error Handling
# Use specific exceptions, not generic Exception
from fastapi import HTTPException

if not entity:
    raise HTTPException(status_code=404, detail=f"Entity {entity_id} not found")  # ✅

# CRITICAL: Logging
# Use structured logging with appropriate levels
import logging
logger = logging.getLogger(__name__)

logger.info(f"Creating entity: {entity_type} with id={entity_id}")  # Info for normal ops
logger.error(f"Database connection failed: {e}", exc_info=True)     # Error with stack trace

# GOTCHA: Neo4j node labels must be strings without special characters
# Use entity type directly as label (Product, Feature, etc.)
query = f"CREATE (n:{entity_type} $properties)"  # entity_type = "Product" ✅
# Not: entity_type = "Product-Item" or "Product & Feature" ❌
```

---

## Implementation Blueprint

### Phase 1: Project Setup & Configuration

**Task 1: Create project structure and dependencies**
```bash
# Create directory structure
mkdir -p backend/services/knowledge-graph/{models,services,api,tests,scripts}
touch backend/services/knowledge-graph/{models,services,api,tests}/__init__.py

# Create requirements.txt
cat > backend/services/knowledge-graph/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
neo4j==5.14.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.1
EOF

# Create .env.example
cat > backend/services/knowledge-graph/.env.example << 'EOF'
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password_here
API_HOST=0.0.0.0
API_PORT=8001
LOG_LEVEL=INFO
ENVIRONMENT=development
EOF
```

**Task 2: Implement Configuration Management**

CREATE `backend/services/knowledge-graph/config.py`:
```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Neo4j Configuration
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"

    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8001
    API_TITLE: str = "Knowledge Graph Service"
    API_VERSION: str = "1.0.0"

    # Logging
    LOG_LEVEL: str = "INFO"
    ENVIRONMENT: str = "development"

_settings = None

def get_settings() -> Settings:
    """Get cached settings instance"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
```

---

### Phase 2: Data Models

**Task 3: Define Entity Models**

CREATE `backend/services/knowledge-graph/models/entities.py`:
```python
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from enum import Enum
from datetime import datetime

class EntityType(str, Enum):
    """Supported entity types"""
    PRODUCT = "Product"
    FEATURE = "Feature"
    SCENARIO = "Scenario"
    PROBLEM = "Problem"
    USER_GROUP = "UserGroup"
    COMPETITOR = "Competitor"
    OFFER = "Offer"
    MERCHANT = "Merchant"

class BaseEntity(BaseModel):
    """Base entity with common fields"""
    id: str = Field(..., description="Unique entity identifier")
    name: str = Field(..., description="Entity name")
    description: Optional[str] = Field(None, description="Entity description")
    created_at: Optional[str] = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: Optional[str] = Field(default_factory=lambda: datetime.utcnow().isoformat())

class Product(BaseEntity):
    """Product entity"""
    sku: str = Field(..., description="Stock keeping unit")
    category: str = Field(..., description="Product category")
    brand: str = Field(..., description="Brand name")
    price_range: Optional[Dict[str, float]] = Field(None, description="Min/max price")

class Feature(BaseEntity):
    """Feature entity"""
    feature_type: str = Field(..., description="Feature type: material, technology, benefit")
    value: Optional[str] = Field(None, description="Feature value")
    importance_score: float = Field(default=0.0, ge=0.0, le=1.0, description="Importance score 0-1")

class Scenario(BaseEntity):
    """Scenario entity"""
    tags: List[str] = Field(default_factory=list, description="Scenario tags")

class Problem(BaseEntity):
    """Problem entity"""
    severity: str = Field(..., description="Problem severity: low, medium, high")
    frequency: str = Field(..., description="Problem frequency: rare, common, frequent")

class UserGroup(BaseEntity):
    """User group entity"""
    demographics: Dict[str, Any] = Field(default_factory=dict, description="Demographic data")
    behavior: Dict[str, Any] = Field(default_factory=dict, description="Behavior data")

class Competitor(BaseEntity):
    """Competitor entity"""
    brand: str = Field(..., description="Competitor brand")
    product: str = Field(..., description="Competitor product")
    price_range: Optional[Dict[str, float]] = Field(None, description="Price range")

class Offer(BaseEntity):
    """Offer entity"""
    offer_id: str = Field(..., description="Offer identifier")
    sku: str = Field(..., description="Product SKU")
    merchant_id: str = Field(..., description="Merchant identifier")
    price: float = Field(..., gt=0, description="Offer price")
    currency: str = Field(..., min_length=3, max_length=3, description="ISO 4217 currency code")
    availability: bool = Field(..., description="Availability status")
    stock_level: Optional[int] = Field(None, ge=0, description="Stock level")
    valid_from: str = Field(..., description="Valid from datetime ISO 8601")
    valid_until: str = Field(..., description="Valid until datetime ISO 8601")
    region: str = Field(..., min_length=2, max_length=2, description="ISO 3166-1 alpha-2 region code")

class Merchant(BaseEntity):
    """Merchant entity"""
    merchant_id: str = Field(..., description="Merchant identifier")
    platform: str = Field(..., description="Platform: shopify, etsy, custom")
    mor: bool = Field(default=False, description="Merchant of record")
    commission_rate: Optional[float] = Field(None, ge=0.0, le=1.0, description="Commission rate 0-1")
```

**Task 4: Define Relationship Models**

CREATE `backend/services/knowledge-graph/models/relationships.py`:
```python
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from enum import Enum

class RelationshipType(str, Enum):
    """Supported relationship types"""
    HAS_FEATURE = "HAS_FEATURE"
    SOLVES = "SOLVES"
    APPLIES_TO = "APPLIES_TO"
    TARGETS = "TARGETS"
    COMPARES_WITH = "COMPARES_WITH"
    HAS_OFFER = "HAS_OFFER"
    SOLD_BY = "SOLD_BY"
    GENERATED_FROM = "GENERATED_FROM"

class BaseRelationship(BaseModel):
    """Base relationship model"""
    from_id: str = Field(..., description="Source entity ID")
    to_id: str = Field(..., description="Target entity ID")
    rel_type: RelationshipType = Field(..., description="Relationship type")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Relationship properties")

class HasFeature(BaseRelationship):
    """Product HAS_FEATURE Feature"""
    rel_type: RelationshipType = RelationshipType.HAS_FEATURE
    confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="Confidence score")

class Solves(BaseRelationship):
    """Feature SOLVES Problem"""
    rel_type: RelationshipType = RelationshipType.SOLVES
    effectiveness: float = Field(default=1.0, ge=0.0, le=1.0, description="Effectiveness score")

class AppliesTo(BaseRelationship):
    """Product APPLIES_TO Scenario"""
    rel_type: RelationshipType = RelationshipType.APPLIES_TO
    relevance: float = Field(default=1.0, ge=0.0, le=1.0, description="Relevance score")

class Targets(BaseRelationship):
    """Product TARGETS UserGroup"""
    rel_type: RelationshipType = RelationshipType.TARGETS
    priority: int = Field(default=1, ge=1, description="Priority ranking")
```

---

### Phase 3: Core Service Layer

**Task 5: Implement GraphService**

CREATE `backend/services/knowledge-graph/services/graph_service.py`:

PATTERN: Follow the complete implementation from `leap_acp_dev_guide.md` Section 4.1.3 (lines 442-567)

Key methods to implement:
```python
from neo4j import GraphDatabase
from typing import List, Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)

class GraphService:
    """Neo4j graph database service"""

    def __init__(self, uri: str, user: str, password: str):
        """Initialize Neo4j driver with connection pooling"""
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        logger.info(f"Connected to Neo4j at {uri}")

    def close(self):
        """Close driver connection"""
        self.driver.close()
        logger.info("Neo4j connection closed")

    def health_check(self) -> bool:
        """Verify database connectivity"""
        try:
            with self.driver.session() as session:
                result = session.run("RETURN 1 as test")
                return result.single()["test"] == 1
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False

    def create_entity(self, entity_type: str, properties: Dict[str, Any]) -> str:
        """
        Create entity node in Neo4j

        CRITICAL: Use session.execute_write() for write operations
        GOTCHA: Must validate entity_type to prevent injection
        """
        # Validation implementation
        # Transaction implementation following guide pattern
        pass

    def create_relationship(
        self,
        from_id: str,
        to_id: str,
        rel_type: str,
        properties: Dict[str, Any] = {}
    ) -> bool:
        """Create relationship between entities"""
        # Implementation following guide
        pass

    def query_entity(self, entity_id: str) -> Optional[Dict[str, Any]]:
        """Query entity by ID"""
        pass

    def update_entity(self, entity_id: str, properties: Dict[str, Any]) -> bool:
        """Update entity properties"""
        pass

    def delete_entity(self, entity_id: str) -> bool:
        """Delete entity and its relationships"""
        pass

    def delete_relationship(self, from_id: str, to_id: str, rel_type: str) -> bool:
        """Delete specific relationship"""
        pass

    def query_relationships(
        self,
        entity_id: str,
        rel_type: Optional[str] = None,
        direction: str = "outgoing"
    ) -> List[Dict[str, Any]]:
        """Query entity relationships"""
        pass

    def search_entities(
        self,
        entity_type: Optional[str] = None,
        search_text: Optional[str] = None,
        properties: Optional[Dict[str, Any]] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Search entities by type, text, or properties"""
        pass

    def execute_cypher(self, query: str, params: Dict[str, Any] = {}) -> List[Dict[str, Any]]:
        """Execute custom Cypher query"""
        # CRITICAL: Validate query safety (no DROP, DELETE CASCADE, etc. in production)
        pass

    @staticmethod
    def _create_entity_tx(tx, entity_type: str, properties: Dict[str, Any]):
        """Transaction function for creating entity"""
        query = f"CREATE (n:{entity_type} $properties) RETURN n.id as id"
        result = tx.run(query, properties=properties)
        return result.single()["id"]

    # Add other static transaction functions following the pattern
```

---

### Phase 4: API Layer

**Task 6: Define API Schemas**

CREATE `backend/services/knowledge-graph/api/schemas.py`:
```python
from pydantic import BaseModel, Field
from typing import Optional, Any, Dict, List

class EntityCreateRequest(BaseModel):
    """Request to create entity"""
    entity_type: str = Field(..., description="Entity type")
    properties: Dict[str, Any] = Field(..., description="Entity properties")

class EntityUpdateRequest(BaseModel):
    """Request to update entity"""
    properties: Dict[str, Any] = Field(..., description="Properties to update")

class EntityResponse(BaseModel):
    """Entity response"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

class RelationshipCreateRequest(BaseModel):
    """Request to create relationship"""
    from_id: str = Field(..., description="Source entity ID")
    to_id: str = Field(..., description="Target entity ID")
    rel_type: str = Field(..., description="Relationship type")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Relationship properties")

class RelationshipResponse(BaseModel):
    """Relationship response"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

class QueryRequest(BaseModel):
    """Cypher query request"""
    query: str = Field(..., description="Cypher query")
    params: Dict[str, Any] = Field(default_factory=dict, description="Query parameters")

class QueryResponse(BaseModel):
    """Query response"""
    success: bool
    message: str
    results: List[Dict[str, Any]] = Field(default_factory=list)
    count: int = 0

class SearchRequest(BaseModel):
    """Entity search request"""
    entity_type: Optional[str] = None
    search_text: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None
    limit: int = Field(default=100, ge=1, le=1000)

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    database: str
    timestamp: str
```

**Task 7: Implement API Routes**

CREATE `backend/services/knowledge-graph/api/routes.py`:

PATTERN: Follow `leap_acp_dev_guide.md` Section 4.1.4 (lines 573-660)

```python
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
    """Dependency: Provide GraphService instance"""
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
    """Health check endpoint"""
    is_healthy = service.health_check()
    return HealthResponse(
        status="healthy" if is_healthy else "unhealthy",
        database="neo4j",
        timestamp=datetime.utcnow().isoformat()
    )

@router.post("/entities", response_model=EntityResponse, status_code=status.HTTP_201_CREATED)
async def create_entity(
    request: EntityCreateRequest,
    service: GraphService = Depends(get_graph_service)
):
    """Create new entity"""
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
    except Exception as e:
        logger.error(f"Failed to create entity: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/entities/{entity_id}", response_model=EntityResponse)
async def get_entity(
    entity_id: str,
    service: GraphService = Depends(get_graph_service)
):
    """Get entity by ID"""
    entity = service.query_entity(entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail=f"Entity {entity_id} not found")
    return EntityResponse(success=True, message="Entity retrieved", data=entity)

@router.put("/entities/{entity_id}", response_model=EntityResponse)
async def update_entity(
    entity_id: str,
    request: EntityUpdateRequest,
    service: GraphService = Depends(get_graph_service)
):
    """Update entity"""
    # Verify entity exists
    if not service.query_entity(entity_id):
        raise HTTPException(status_code=404, detail=f"Entity {entity_id} not found")

    success = service.update_entity(entity_id, request.properties)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update entity")

    return EntityResponse(success=True, message="Entity updated", data={"id": entity_id})

@router.delete("/entities/{entity_id}", response_model=EntityResponse)
async def delete_entity(
    entity_id: str,
    service: GraphService = Depends(get_graph_service)
):
    """Delete entity"""
    success = service.delete_entity(entity_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Entity {entity_id} not found")
    return EntityResponse(success=True, message="Entity deleted", data={"id": entity_id})

@router.post("/relationships", response_model=RelationshipResponse, status_code=status.HTTP_201_CREATED)
async def create_relationship(
    request: RelationshipCreateRequest,
    service: GraphService = Depends(get_graph_service)
):
    """Create relationship between entities"""
    # Verify both entities exist
    if not service.query_entity(request.from_id):
        raise HTTPException(status_code=404, detail=f"Source entity {request.from_id} not found")
    if not service.query_entity(request.to_id):
        raise HTTPException(status_code=404, detail=f"Target entity {request.to_id} not found")

    success = service.create_relationship(
        from_id=request.from_id,
        to_id=request.to_id,
        rel_type=request.rel_type,
        properties=request.properties
    )

    if not success:
        raise HTTPException(status_code=400, detail="Failed to create relationship")

    return RelationshipResponse(success=True, message="Relationship created")

@router.delete("/relationships", response_model=RelationshipResponse)
async def delete_relationship(
    from_id: str,
    to_id: str,
    rel_type: str,
    service: GraphService = Depends(get_graph_service)
):
    """Delete relationship"""
    success = service.delete_relationship(from_id, to_id, rel_type)
    if not success:
        raise HTTPException(status_code=404, detail="Relationship not found")
    return RelationshipResponse(success=True, message="Relationship deleted")

@router.post("/query", response_model=QueryResponse)
async def execute_query(
    request: QueryRequest,
    service: GraphService = Depends(get_graph_service)
):
    """Execute custom Cypher query"""
    try:
        results = service.execute_cypher(query=request.query, params=request.params)
        return QueryResponse(
            success=True,
            message="Query executed",
            results=results,
            count=len(results)
        )
    except Exception as e:
        logger.error(f"Query execution failed: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/search", response_model=QueryResponse)
async def search_entities(
    request: SearchRequest,
    service: GraphService = Depends(get_graph_service)
):
    """Search entities"""
    results = service.search_entities(
        entity_type=request.entity_type,
        search_text=request.search_text,
        properties=request.properties,
        limit=request.limit
    )
    return QueryResponse(
        success=True,
        message="Search completed",
        results=results,
        count=len(results)
    )
```

**Task 8: Create FastAPI Application**

CREATE `backend/services/knowledge-graph/main.py`:
```python
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
    """Application lifespan events"""
    logger.info("Starting Knowledge Graph Service")
    yield
    logger.info("Shutting down Knowledge Graph Service")

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

# Include routers
app.include_router(router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Knowledge Graph Service",
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
```

---

### Phase 5: Database Initialization

**Task 9: Create Database Initialization Script**

CREATE `backend/services/knowledge-graph/scripts/init_neo4j.py`:
```python
"""
Initialize Neo4j database with constraints and indexes
Run this script once after database setup
"""
from neo4j import GraphDatabase
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import get_settings

def init_database():
    """Create constraints and indexes"""
    settings = get_settings()
    driver = GraphDatabase.driver(
        settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
    )

    constraints = [
        # Unique constraints on entity IDs
        "CREATE CONSTRAINT product_id IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE",
        "CREATE CONSTRAINT feature_id IF NOT EXISTS FOR (f:Feature) REQUIRE f.id IS UNIQUE",
        "CREATE CONSTRAINT scenario_id IF NOT EXISTS FOR (s:Scenario) REQUIRE s.id IS UNIQUE",
        "CREATE CONSTRAINT problem_id IF NOT EXISTS FOR (p:Problem) REQUIRE p.id IS UNIQUE",
        "CREATE CONSTRAINT usergroup_id IF NOT EXISTS FOR (u:UserGroup) REQUIRE u.id IS UNIQUE",
        "CREATE CONSTRAINT competitor_id IF NOT EXISTS FOR (c:Competitor) REQUIRE c.id IS UNIQUE",
        "CREATE CONSTRAINT offer_id IF NOT EXISTS FOR (o:Offer) REQUIRE o.offer_id IS UNIQUE",
        "CREATE CONSTRAINT merchant_id IF NOT EXISTS FOR (m:Merchant) REQUIRE m.merchant_id IS UNIQUE",
    ]

    indexes = [
        # Indexes on frequently queried properties
        "CREATE INDEX product_sku IF NOT EXISTS FOR (p:Product) ON (p.sku)",
        "CREATE INDEX product_category IF NOT EXISTS FOR (p:Product) ON (p.category)",
        "CREATE INDEX product_brand IF NOT EXISTS FOR (p:Product) ON (p.brand)",
        "CREATE INDEX offer_region IF NOT EXISTS FOR (o:Offer) ON (o.region)",
        "CREATE INDEX offer_merchant IF NOT EXISTS FOR (o:Offer) ON (o.merchant_id)",
    ]

    fulltext_indexes = [
        # Full-text search on product names and descriptions
        "CREATE FULLTEXT INDEX product_search IF NOT EXISTS FOR (p:Product) ON EACH [p.name, p.description]",
    ]

    with driver.session() as session:
        print("Creating constraints...")
        for constraint in constraints:
            try:
                session.run(constraint)
                print(f"✓ {constraint.split('FOR')[1].split('REQUIRE')[0].strip()}")
            except Exception as e:
                print(f"✗ Failed: {e}")

        print("\nCreating indexes...")
        for index in indexes:
            try:
                session.run(index)
                print(f"✓ {index.split('FOR')[1].strip()}")
            except Exception as e:
                print(f"✗ Failed: {e}")

        print("\nCreating full-text indexes...")
        for ft_index in fulltext_indexes:
            try:
                session.run(ft_index)
                print(f"✓ Full-text search enabled")
            except Exception as e:
                print(f"✗ Failed: {e}")

    driver.close()
    print("\n✅ Database initialization complete!")

if __name__ == "__main__":
    init_database()
```

---

### Phase 6: Testing

**Task 10: Create Test Configuration**

CREATE `backend/services/knowledge-graph/tests/conftest.py`:
```python
import pytest
from unittest.mock import Mock, MagicMock
from services.graph_service import GraphService

@pytest.fixture
def mock_neo4j_driver():
    """Mock Neo4j driver"""
    driver = Mock()
    session = MagicMock()
    driver.session.return_value.__enter__.return_value = session
    driver.session.return_value.__exit__.return_value = None
    return driver, session

@pytest.fixture
def graph_service(mock_neo4j_driver, monkeypatch):
    """GraphService with mocked driver"""
    driver, session = mock_neo4j_driver

    # Mock GraphDatabase.driver to return our mock
    monkeypatch.setattr("neo4j.GraphDatabase.driver", lambda *args, **kwargs: driver)

    service = GraphService(
        uri="bolt://localhost:7687",
        user="neo4j",
        password="test"
    )
    service._session = session  # Attach for test assertions
    return service

@pytest.fixture
def sample_product():
    """Sample product entity"""
    return {
        "id": "prod_123",
        "name": "Cool Mattress Queen",
        "description": "Gel-infused memory foam mattress",
        "sku": "MAT-COOL-QUEEN",
        "category": "Mattresses",
        "brand": "SweetNight"
    }

@pytest.fixture
def sample_feature():
    """Sample feature entity"""
    return {
        "id": "feat_456",
        "name": "Gel-infused Memory Foam",
        "description": "Advanced cooling technology",
        "feature_type": "material",
        "importance_score": 0.9
    }
```

**Task 11: Create Unit Tests**

CREATE `backend/services/knowledge-graph/tests/test_graph_service.py`:

PATTERN: Follow `leap_acp_dev_guide.md` Section 8.1 (lines 2037-2120)

```python
import pytest
from services.graph_service import GraphService
from unittest.mock import Mock, MagicMock

def test_create_entity(graph_service, sample_product, mock_neo4j_driver):
    """Test entity creation"""
    driver, session = mock_neo4j_driver

    # Mock transaction result
    mock_result = Mock()
    mock_result.single.return_value = {"id": sample_product["id"]}
    session.execute_write.return_value = sample_product["id"]

    # Execute
    entity_id = graph_service.create_entity("Product", sample_product)

    # Assert
    assert entity_id == sample_product["id"]
    session.execute_write.assert_called_once()

def test_create_relationship(graph_service, mock_neo4j_driver):
    """Test relationship creation"""
    driver, session = mock_neo4j_driver
    session.execute_write.return_value = True

    # Execute
    result = graph_service.create_relationship(
        from_id="prod_123",
        to_id="feat_456",
        rel_type="HAS_FEATURE",
        properties={"confidence": 0.95}
    )

    # Assert
    assert result is True
    session.execute_write.assert_called_once()

def test_query_entity(graph_service, sample_product, mock_neo4j_driver):
    """Test entity query"""
    driver, session = mock_neo4j_driver

    # Mock query result
    mock_result = Mock()
    mock_record = Mock()
    mock_record.__getitem__ = lambda self, key: sample_product
    mock_result.single.return_value = mock_record
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

def test_delete_entity(graph_service, mock_neo4j_driver):
    """Test entity deletion"""
    driver, session = mock_neo4j_driver
    session.execute_write.return_value = True

    result = graph_service.delete_entity("prod_123")

    assert result is True

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
```

**Task 12: Create Integration Tests**

CREATE `backend/services/knowledge-graph/tests/test_api.py`:
```python
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

def test_health_check(mock_graph_service):
    """Test health check endpoint"""
    mock_graph_service.health_check.return_value = True

    response = client.get("/api/v1/graph/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "neo4j"

def test_create_entity(mock_graph_service):
    """Test create entity endpoint"""
    mock_graph_service.create_entity.return_value = "prod_123"

    response = client.post("/api/v1/graph/entities", json={
        "entity_type": "Product",
        "properties": {
            "id": "prod_123",
            "name": "Test Product",
            "sku": "TEST-001"
        }
    })

    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == "prod_123"

def test_get_entity(mock_graph_service):
    """Test get entity endpoint"""
    mock_graph_service.query_entity.return_value = {
        "id": "prod_123",
        "name": "Test Product"
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
```

**Task 13: Create README**

CREATE `backend/services/knowledge-graph/README.md`:
```markdown
# Knowledge Graph Service

Neo4j-based knowledge graph service for Leap Agentic Commerce Platform.

## Quick Start

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Neo4j credentials
   ```

3. **Initialize database**:
   ```bash
   python scripts/init_neo4j.py
   ```

4. **Run service**:
   ```bash
   python main.py
   ```

5. **Access API docs**:
   - Swagger UI: http://localhost:8001/docs
   - ReDoc: http://localhost:8001/redoc

## Running Tests

```bash
# All tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=. --cov-report=html

# Specific test file
pytest tests/test_graph_service.py -v
```

## API Examples

### Create Product Entity
```bash
curl -X POST http://localhost:8001/api/v1/graph/entities \
  -H "Content-Type: application/json" \
  -d '{
    "entity_type": "Product",
    "properties": {
      "id": "prod_123",
      "name": "Cool Mattress Queen",
      "sku": "MAT-COOL-QUEEN",
      "category": "Mattresses",
      "brand": "SweetNight"
    }
  }'
```

### Create Relationship
```bash
curl -X POST http://localhost:8001/api/v1/graph/relationships \
  -H "Content-Type: application/json" \
  -d '{
    "from_id": "prod_123",
    "to_id": "feat_456",
    "rel_type": "HAS_FEATURE",
    "properties": {"confidence": 0.95}
  }'
```

### Query Entity
```bash
curl http://localhost:8001/api/v1/graph/entities/prod_123
```

## Development

### Project Structure
```
knowledge-graph/
├── main.py              # FastAPI app
├── config.py            # Configuration
├── models/              # Pydantic models
├── services/            # Business logic
├── api/                 # API routes
├── tests/               # Tests
└── scripts/             # Utilities
```

### Adding New Entity Type

1. Add enum to `models/entities.py`
2. Create Pydantic model
3. Add constraint to `scripts/init_neo4j.py`
4. Update tests

## Troubleshooting

**Connection refused**: Ensure Neo4j is running on bolt://localhost:7687
**Authentication failed**: Verify NEO4J_USER and NEO4J_PASSWORD in .env
**Constraint violation**: Entity ID already exists, use unique IDs
```

---

## Validation Loop

### Level 1: Setup Validation
```bash
# Verify Python version
python --version  # Expected: Python 3.11+

# Install dependencies
cd backend/services/knowledge-graph
pip install -r requirements.txt

# Verify Neo4j connection (update .env first)
python -c "from neo4j import GraphDatabase; driver = GraphDatabase.driver('bolt://localhost:7687', auth=('neo4j', 'password')); driver.verify_connectivity(); print('✓ Neo4j connected')"

# Initialize database
python scripts/init_neo4j.py
# Expected: "✅ Database initialization complete!"
```

### Level 2: Unit Tests
```bash
# Run all unit tests
pytest tests/test_graph_service.py -v

# Expected output:
# test_create_entity PASSED
# test_create_relationship PASSED
# test_query_entity PASSED
# test_query_entity_not_found PASSED
# test_delete_entity PASSED
# test_health_check_success PASSED
# test_health_check_failure PASSED

# If failing: Read error message, fix code, re-run
# Common issues:
# - Mock not returning expected value
# - Incorrect method signature
# - Missing import
```

### Level 3: Integration Tests
```bash
# Run integration tests
pytest tests/test_api.py -v

# Expected output:
# test_health_check PASSED
# test_create_entity PASSED
# test_get_entity PASSED
# test_get_entity_not_found PASSED
# test_create_relationship PASSED
# test_execute_query PASSED

# If failing: Check mock setup, API route signatures
```

### Level 4: Manual API Testing
```bash
# Start the service
python main.py

# In another terminal, test health check
curl http://localhost:8001/api/v1/graph/health
# Expected: {"status":"healthy","database":"neo4j","timestamp":"..."}

# Test create entity
curl -X POST http://localhost:8001/api/v1/graph/entities \
  -H "Content-Type: application/json" \
  -d '{"entity_type":"Product","properties":{"id":"prod_test","name":"Test Product","sku":"TEST-001","category":"Test","brand":"Test"}}'
# Expected: {"success":true,"message":"Entity created successfully",...}

# Test get entity
curl http://localhost:8001/api/v1/graph/entities/prod_test
# Expected: {"success":true,"data":{"id":"prod_test","name":"Test Product",...}}

# Test create relationship
curl -X POST http://localhost:8001/api/v1/graph/relationships \
  -H "Content-Type: application/json" \
  -d '{"from_id":"prod_test","to_id":"feat_test","rel_type":"HAS_FEATURE","properties":{"confidence":0.9}}'
# Expected: {"success":true,"message":"Relationship created"}

# Access API docs
open http://localhost:8001/docs
# Verify: All endpoints listed, can execute test requests
```

### Level 5: Performance Testing
```bash
# Test query performance
time curl http://localhost:8001/api/v1/graph/entities/prod_test
# Expected: Response time < 100ms

# Test concurrent requests (requires apache-bench or similar)
ab -n 100 -c 10 http://localhost:8001/api/v1/graph/health
# Expected: All requests succeed, no errors
```

### Level 6: Coverage Report
```bash
# Generate coverage report
pytest tests/ --cov=. --cov-report=html --cov-report=term

# Expected:
# coverage ≥ 80%
# All critical paths covered (create, read, update, delete, query)

# Open HTML report
open htmlcov/index.html
```

---

## Final Validation Checklist

### Functional Requirements
- [ ] Neo4j database connection works
- [ ] Health check endpoint returns correct status
- [ ] Can create all 8 entity types (Product, Feature, Scenario, Problem, UserGroup, Competitor, Offer, Merchant)
- [ ] Can create all 8 relationship types
- [ ] Can query entity by ID
- [ ] Can update entity properties
- [ ] Can delete entity and its relationships
- [ ] Can execute custom Cypher queries
- [ ] Can search entities by type/text/properties
- [ ] API returns standardized responses (success/error format)

### Performance Requirements
- [ ] Simple entity query < 50ms
- [ ] Complex query (2-3 hops) < 100ms
- [ ] Service handles 100 concurrent health check requests
- [ ] No memory leaks during extended operation

### Quality Requirements
- [ ] All unit tests pass (7+ tests)
- [ ] All integration tests pass (6+ tests)
- [ ] Test coverage ≥ 80%
- [ ] No Python linting errors (if using ruff/pylint)
- [ ] Type hints present on all functions
- [ ] Logging statements at appropriate levels

### Data Integrity
- [ ] Database constraints prevent duplicate entity IDs
- [ ] Cannot create relationship if source/target doesn't exist
- [ ] Indexes improve query performance (verify with EXPLAIN in Neo4j Browser)
- [ ] Full-text search returns relevant products

### Documentation
- [ ] README.md explains setup and usage
- [ ] API documentation accessible at /docs
- [ ] All API endpoints have descriptions
- [ ] Example curl commands work

### Error Handling
- [ ] 404 returned for non-existent entities
- [ ] 400 returned for invalid Cypher queries
- [ ] 500 returned for database errors
- [ ] Error messages are clear and actionable
- [ ] Exceptions are logged with stack traces

---

## Anti-Patterns to Avoid

### Neo4j Specific
- ❌ Don't use session.run() for write operations - use session.execute_write()
- ❌ Don't construct Cypher with string concatenation - use parameters
- ❌ Don't forget to close driver connection - use try/finally or context manager
- ❌ Don't query large result sets without LIMIT clause
- ❌ Don't create nodes without checking for existing ID (use MERGE or check first)

### FastAPI Specific
- ❌ Don't use sync functions in async endpoints without await
- ❌ Don't create database connection per request without pooling - use Depends()
- ❌ Don't return Python exceptions to client - use HTTPException
- ❌ Don't skip input validation - use Pydantic models
- ❌ Don't hardcode configuration - use environment variables

### General
- ❌ Don't commit .env files with credentials
- ❌ Don't skip tests to make progress faster
- ❌ Don't use broad exception catching (except Exception) without logging
- ❌ Don't ignore failing tests - fix them immediately
- ❌ Don't skip schema initialization - run init_neo4j.py first

---

## Known Limitations & Future Enhancements

### Current Limitations
- Single Neo4j instance (no clustering)
- No authentication/authorization on API endpoints
- No caching layer (Redis will be added in Phase 2)
- No graph analytics functions (PageRank, centrality)
- No batch import/export functionality
- English language only
- No entity versioning

### Phase 2 Enhancements
- Add JWT authentication
- Implement RBAC with multi-tenancy
- Add Redis caching for frequently accessed entities
- Implement GraphQL API for complex nested queries
- Add batch operations (bulk import/export)
- Add graph visualization endpoints
- Add real-time subscriptions (WebSocket)

---

## Confidence Score: 8/10

### Why 8/10?
**Strengths**:
- ✅ Comprehensive documentation from PRD and dev guide
- ✅ Clear implementation examples in dev guide
- ✅ Well-defined data models and API contracts
- ✅ Neo4j and FastAPI are well-documented libraries
- ✅ Detailed validation gates and success criteria
- ✅ Test patterns provided from dev guide

**Risk Factors** (-2 points):
- ⚠️ No existing codebase to reference (greenfield project)
- ⚠️ Neo4j driver v5 transaction patterns must be followed precisely
- ⚠️ First microservice - establishes patterns for future services
- ⚠️ Integration testing requires actual Neo4j instance

**Mitigation**:
- Follow dev guide examples exactly
- Test each component before moving to next phase
- Use validation loops after each task
- Leverage comprehensive documentation

---

## Success Metrics

After implementation, this service should:
1. Handle 100+ entity/relationship operations per second
2. Serve as foundation for 6+ downstream services
3. Support content generation with <100ms product context queries
4. Enable instant offer catalog queries for commerce gateway
5. Provide GraphQL-ready data model for future enhancements

This PRP provides sufficient context for one-pass implementation success. The implementation should proceed phase-by-phase, validating at each level before continuing.
