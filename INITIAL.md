# INITIAL: Knowledge Graph Service - Core Implementation

## FEATURE

Implement the foundational Knowledge Graph Service for the Leap Agentic Commerce Platform. This service will manage entities and relationships in Neo4j graph database, providing the semantic foundation for both GEO (content generation) and Commerce (offer catalog) capabilities.

### Core Requirements

**1. Neo4j Database Setup & Connection**
- Establish Neo4j database connection with proper configuration
- Implement connection pooling and error handling
- Support for both local development and production environments
- Health check endpoint for database connectivity

**2. Entity Management**
- Support CRUD operations for 8 entity types:
  - Product (id, name, sku, category, brand, description)
  - Feature (id, name, type, value, description)
  - Scenario (id, name, description, tags[])
  - Problem (id, description, severity, frequency)
  - UserGroup (id, name, demographics{}, behavior{})
  - Competitor (id, brand, product, price_range)
  - Offer (offer_id, sku, merchant_id, price, currency, availability, stock_level, valid_from, valid_until, region)
  - Merchant (merchant_id, name, platform, mor, commission_rate)

**3. Relationship Management**
- Support for 8 relationship types with properties:
  - HAS_FEATURE {confidence: float}
  - SOLVES {effectiveness: float}
  - APPLIES_TO {relevance: float}
  - TARGETS {priority: int}
  - COMPARES_WITH {comparison_type: string}
  - HAS_OFFER
  - SOLD_BY
  - GENERATED_FROM

**4. Query Interface**
- Execute custom Cypher queries with parameter support
- Pre-built query methods for common patterns:
  - Get entity by ID
  - Get entity with relationships (1-3 hops)
  - Search entities by properties
  - Get product context (product + features + scenarios + problems)
- Query response time < 100ms (P95)

**5. API Layer (FastAPI)**
- RESTful API endpoints following the specification in CLAUDE.md:
  - POST /api/v1/graph/entities - Create entity
  - GET /api/v1/graph/entities/{id} - Get entity
  - PUT /api/v1/graph/entities/{id} - Update entity
  - DELETE /api/v1/graph/entities/{id} - Delete entity
  - POST /api/v1/graph/relationships - Create relationship
  - DELETE /api/v1/graph/relationships/{id} - Delete relationship
  - POST /api/v1/graph/query - Execute Cypher query
  - GET /api/v1/graph/search - Search entities
- Standard response format with success/error handling
- Request validation using Pydantic models
- API documentation with Swagger/OpenAPI

**6. Database Schema Initialization**
- Cypher scripts to create constraints and indexes:
  - Unique constraints on entity IDs
  - Indexes on frequently queried properties (sku, category, region)
  - Full-text search index on product names and descriptions
- Schema migration support

**7. Configuration Management**
- Environment-based configuration (.env support)
- Configuration for:
  - Neo4j URI, username, password
  - API server host and port
  - Logging level
  - CORS settings
- Secrets management (no hardcoded credentials)

**8. Error Handling & Logging**
- Structured logging with appropriate levels
- Comprehensive error messages for API responses
- Database connection retry logic
- Transaction rollback on failures

### Success Criteria

- [ ] Neo4j database connection established and tested
- [ ] All 8 entity types can be created, read, updated, deleted
- [ ] All 8 relationship types can be created and queried
- [ ] Custom Cypher queries execute successfully
- [ ] API endpoints respond with correct status codes and data formats
- [ ] Query response time < 100ms for simple queries
- [ ] Database constraints and indexes created
- [ ] Unit tests coverage ≥ 80%
- [ ] Integration tests for end-to-end entity/relationship operations
- [ ] API documentation accessible at /docs
- [ ] Health check endpoint returns database status

---

## EXAMPLES

### 1. Reference Implementation Pattern

Refer to the development guide (`leap_acp_dev_guide.md`) sections:
- **Section 4.1**: Knowledge Graph Service structure and code examples
- **Section 5**: API Interface Specification
- **Section 6**: Database Design (Neo4j Schema)

Key patterns to follow:
```python
# GraphService class structure (from dev guide line 451-567)
class GraphService:
    def __init__(self, uri: str, user: str, password: str)
    def create_entity(self, entity_type: str, properties: Dict) -> str
    def create_relationship(self, from_id: str, to_id: str, rel_type: str, properties: Dict) -> bool
    def query_entity(self, entity_id: str) -> Optional[Dict]
    def query_relationships(self, entity_id: str, rel_type: Optional[str], direction: str) -> List[Dict]
    def execute_cypher(self, query: str, params: Dict) -> List[Dict]
```

### 2. API Route Structure

```python
# FastAPI route structure (from dev guide line 573-660)
@router.post("/entities", response_model=EntityResponse)
async def create_entity(request: EntityCreateRequest, service: GraphService = Depends(get_graph_service))

@router.get("/entities/{entity_id}", response_model=EntityResponse)
async def get_entity(entity_id: str, service: GraphService = Depends(get_graph_service))

@router.post("/query", response_model=QueryResponse)
async def execute_query(request: QueryRequest, service: GraphService = Depends(get_graph_service))
```

### 3. Data Model Examples

From the PRD (`leap_acp_prd.md`) section 6.1 and dev guide section 4.1.2:
```python
class Product(BaseEntity):
    sku: str
    category: str
    brand: str
    price_range: Optional[Dict[str, float]] = None

class Feature(BaseEntity):
    feature_type: str  # material, technology, benefit
    value: Optional[str] = None
    importance_score: float = 0.0

class Offer(BaseEntity):
    offer_id: str
    sku: str
    merchant_id: str
    price: float
    currency: str
    availability: bool
    stock_level: Optional[int]
    valid_from: str
    valid_until: str
    region: str
```

### 4. Neo4j Cypher Examples

From dev guide section 6.2:
```cypher
-- Create unique constraints
CREATE CONSTRAINT product_id IF NOT EXISTS
FOR (p:Product) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT feature_id IF NOT EXISTS
FOR (f:Feature) REQUIRE f.id IS UNIQUE;

-- Create indexes
CREATE INDEX product_sku IF NOT EXISTS
FOR (p:Product) ON (p.sku);

CREATE INDEX product_category IF NOT EXISTS
FOR (p:Product) ON (p.category);

-- Create full-text search index
CREATE FULLTEXT INDEX product_search IF NOT EXISTS
FOR (p:Product) ON EACH [p.name, p.description];
```

### 5. Testing Examples

From dev guide section 8.1:
```python
# Unit test structure
@pytest.fixture
def graph_service():
    return GraphService(uri="bolt://localhost:7687", user="neo4j", password="test")

def test_create_entity(graph_service, mock_driver):
    entity_type = "Product"
    properties = {"id": "prod_123", "name": "Test Product", "sku": "SKU-123"}
    entity_id = graph_service.create_entity(entity_type, properties)
    assert entity_id == "prod_123"

def test_create_relationship(graph_service, mock_driver):
    result = graph_service.create_relationship("prod_123", "feat_456", "HAS_FEATURE", {"confidence": 0.95})
    assert result is True
```

---

## DOCUMENTATION

### Primary Documentation Sources

1. **Project Requirements Document** (`leap_acp_prd.md`)
   - Section 3.1.3: Knowledge Graph Construction (lines 138-180)
   - Section 6.1: Neo4j Schema (lines 874-898)
   - Section 7.3: Knowledge Graph Interface (lines 1074-1093)

2. **Development Guide** (`leap_acp_dev_guide.md`)
   - Section 4.1: Knowledge Graph Service (lines 372-567)
   - Section 5.1: RESTful API Design (lines 1365-1393)
   - Section 6.2: Neo4j Schema Constraints (lines 1678-1702)
   - Section 8.1: Unit Testing (lines 2037-2120)

3. **Platform White Paper** (`leap_agentic_commerce_platform.md`)
   - Section 5: Domain Model (lines 84-97)

4. **CLAUDE.md** (Project guidance)
   - Architecture Overview
   - Core Service Division: `knowledge-graph-service`
   - Data Models: Knowledge Graph Schema (Neo4j)
   - API Interface Specification
   - Testing Strategy

### External Resources

1. **Neo4j Python Driver**
   - Official Documentation: https://neo4j.com/docs/python-manual/current/
   - Connection Management: https://neo4j.com/docs/python-manual/current/session-api/
   - Transaction Functions: https://neo4j.com/docs/python-manual/current/transactions/
   - Cypher Query Language: https://neo4j.com/docs/cypher-manual/current/

2. **FastAPI**
   - Official Documentation: https://fastapi.tiangolo.com/
   - Dependency Injection: https://fastapi.tiangolo.com/tutorial/dependencies/
   - Pydantic Models: https://docs.pydantic.dev/latest/
   - OpenAPI Documentation: https://fastapi.tiangolo.com/tutorial/metadata/

3. **Python Best Practices**
   - Type Hints: https://docs.python.org/3/library/typing.html
   - Async/Await: https://docs.python.org/3/library/asyncio.html
   - Testing with Pytest: https://docs.pytest.org/

### Technology Stack Versions

- Python: 3.11+
- Neo4j: 5.x
- neo4j-driver: latest
- FastAPI: 0.104+
- Pydantic: 2.x
- Pytest: 7.x

---

## OTHER CONSIDERATIONS

### 1. Project Structure

Create the following directory structure:
```
backend/
├── services/
│   └── knowledge-graph/
│       ├── main.py                 # FastAPI application entry
│       ├── config.py               # Configuration management
│       ├── models/
│       │   ├── __init__.py
│       │   ├── entities.py         # Entity Pydantic models
│       │   └── relationships.py    # Relationship models
│       ├── services/
│       │   ├── __init__.py
│       │   └── graph_service.py    # Neo4j operations
│       ├── api/
│       │   ├── __init__.py
│       │   ├── routes.py           # API route definitions
│       │   └── schemas.py          # Request/Response schemas
│       ├── tests/
│       │   ├── __init__.py
│       │   ├── test_graph_service.py
│       │   └── test_api.py
│       ├── scripts/
│       │   └── init_neo4j.py       # Database initialization
│       ├── requirements.txt
│       └── .env.example
```

### 2. Environment Configuration

`.env.example` should include:
```
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
API_HOST=0.0.0.0
API_PORT=8001
LOG_LEVEL=INFO
ENVIRONMENT=development
```

### 3. Dependencies

`requirements.txt` should include:
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
neo4j==5.14.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.1  # for testing
```

### 4. Security Considerations

- Never commit `.env` files with real credentials
- Use environment variables for all sensitive configuration
- Implement input validation for all entity properties
- Sanitize Cypher query parameters to prevent injection
- Add rate limiting for API endpoints (future enhancement)
- Implement authentication/authorization (future enhancement)

### 5. Performance Optimization

- Use connection pooling (neo4j driver default)
- Implement caching for frequently accessed entities (future with Redis)
- Use database transactions for batch operations
- Optimize Cypher queries with proper indexes
- Monitor query execution times and add logging

### 6. Error Handling Strategy

- Database connection errors → Retry with exponential backoff
- Entity not found → Return 404 with clear message
- Validation errors → Return 422 with field-level errors
- Cypher syntax errors → Return 400 with query hint
- Constraint violations → Return 409 with conflict details
- Internal errors → Return 500 with correlation ID for debugging

### 7. Validation Rules

Entity validation:
- All entities must have unique `id` field
- Product `sku` must be alphanumeric with hyphens
- Offer `price` must be positive decimal
- Offer `valid_from` must be before `valid_until`
- Currency codes must be ISO 4217 (3 letters)
- Region codes should follow ISO 3166-1 alpha-2

Relationship validation:
- Both source and target entities must exist before creating relationship
- Confidence/relevance scores must be between 0.0 and 1.0
- Priority must be non-negative integer

### 8. Testing Requirements

Unit tests must cover:
- GraphService class methods (all CRUD operations)
- Entity model validation
- API request/response serialization
- Error handling paths

Integration tests must cover:
- Full entity lifecycle (create → read → update → delete)
- Relationship creation and querying
- Cypher query execution
- API endpoint workflows
- Database constraint enforcement

### 9. Monitoring & Observability

Add logging for:
- All database operations (with execution time)
- API request/response (with correlation ID)
- Errors and exceptions (with stack trace)
- Health check status

Metrics to track:
- Query execution time (P50, P95, P99)
- API response time
- Error rate by endpoint
- Database connection pool status

### 10. Development Workflow

1. Set up local Neo4j database (Docker recommended)
2. Initialize database schema with constraints/indexes
3. Implement GraphService class with unit tests
4. Implement entity/relationship models
5. Implement API routes with request/response schemas
6. Add integration tests
7. Test API endpoints with Swagger UI
8. Document any deviations from specification
9. Ensure test coverage ≥ 80%
10. Verify all success criteria are met

### 11. Future Enhancements (Out of Scope for Phase 1)

- GraphQL API for complex nested queries
- Batch import/export functionality
- Graph visualization endpoints
- Real-time subscriptions for graph changes
- Multi-tenancy support with data isolation
- Advanced search with filters and pagination
- Graph analytics (PageRank, centrality, community detection)
- Backup and restore functionality

### 12. Known Constraints

- This is Phase 1 implementation - focus on core functionality
- No authentication/authorization in Phase 1 (will add in Phase 2)
- No caching layer yet (Redis will be added later)
- Limited to single Neo4j instance (clustering in production)
- No versioning of entities/relationships yet
- English language only for now

---

## Validation Gates

Before proceeding to next phase, verify:

1. **Functional Validation**
   - [ ] Can create all 8 entity types via API
   - [ ] Can create all 8 relationship types
   - [ ] Can query entities with relationships
   - [ ] Can execute custom Cypher queries
   - [ ] API documentation is accessible
   - [ ] Health check endpoint works

2. **Performance Validation**
   - [ ] Simple entity queries return in < 50ms
   - [ ] Complex queries (2-3 hops) return in < 100ms
   - [ ] Can handle 100 concurrent requests

3. **Quality Validation**
   - [ ] All unit tests pass
   - [ ] All integration tests pass
   - [ ] Test coverage ≥ 80%
   - [ ] No critical security vulnerabilities
   - [ ] Code follows PEP 8 style guide
   - [ ] All API endpoints have proper error handling

4. **Data Validation**
   - [ ] Database constraints are enforced
   - [ ] Indexes improve query performance
   - [ ] Full-text search works on products
   - [ ] Duplicate entities are prevented by constraints

5. **Documentation Validation**
   - [ ] README.md explains how to run the service
   - [ ] API documentation is complete and accurate
   - [ ] Environment setup instructions are clear
   - [ ] Example queries are provided
