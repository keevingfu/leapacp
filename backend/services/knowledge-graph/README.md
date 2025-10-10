# Knowledge Graph Service

Neo4j-based knowledge graph service for Leap Agentic Commerce Platform.

## Overview

The Knowledge Graph Service provides semantic product knowledge management for the Leap ACP platform, supporting:
- 8 entity types: Product, Feature, Scenario, Problem, UserGroup, Competitor, Offer, Merchant
- 8 relationship types: HAS_FEATURE, SOLVES, APPLIES_TO, TARGETS, COMPARES_WITH, HAS_OFFER, SOLD_BY, GENERATED_FROM
- RESTful API with FastAPI and OpenAPI documentation
- Full-text search capabilities
- Custom Cypher query execution

## Quick Start

### Prerequisites

- Python 3.11+
- Neo4j 5.x database running on bolt://localhost:7687
- pip package manager

### Installation

1. **Install dependencies**:
   ```bash
   cd backend/services/knowledge-graph
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

5. **Access API documentation**:
   - Swagger UI: http://localhost:8001/docs
   - ReDoc: http://localhost:8001/redoc

## API Endpoints

### Health Check

```bash
curl http://localhost:8001/api/v1/graph/health
```

### Create Entity

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
      "brand": "SweetNight",
      "description": "Gel-infused memory foam mattress"
    }
  }'
```

### Query Entity

```bash
curl http://localhost:8001/api/v1/graph/entities/prod_123
```

### Update Entity

```bash
curl -X PUT http://localhost:8001/api/v1/graph/entities/prod_123 \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "name": "Updated Mattress Name",
      "price_range": {"min": 299.99, "max": 399.99}
    }
  }'
```

### Delete Entity

```bash
curl -X DELETE http://localhost:8001/api/v1/graph/entities/prod_123
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

### Delete Relationship

```bash
curl -X DELETE "http://localhost:8001/api/v1/graph/relationships?from_id=prod_123&to_id=feat_456&rel_type=HAS_FEATURE"
```

### Execute Custom Query

```bash
curl -X POST http://localhost:8001/api/v1/graph/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "MATCH (p:Product)-[r:HAS_FEATURE]->(f:Feature) RETURN p.name, f.name LIMIT 10",
    "params": {}
  }'
```

### Search Entities

```bash
curl -X POST http://localhost:8001/api/v1/graph/search \
  -H "Content-Type: application/json" \
  -d '{
    "entity_type": "Product",
    "search_text": "mattress",
    "properties": {"category": "Mattresses"},
    "limit": 50
  }'
```

## Running Tests

### All Tests

```bash
pytest tests/ -v
```

### Unit Tests Only

```bash
pytest tests/test_graph_service.py -v
```

### Integration Tests Only

```bash
pytest tests/test_api.py -v
```

### With Coverage Report

```bash
pytest tests/ --cov=. --cov-report=html --cov-report=term
open htmlcov/index.html
```

## Project Structure

```
knowledge-graph/
├── main.py                  # FastAPI application entry point
├── config.py                # Environment configuration
├── models/                  # Pydantic data models
│   ├── entities.py          # Entity types (Product, Feature, etc.)
│   └── relationships.py     # Relationship types
├── services/                # Business logic
│   └── graph_service.py     # Neo4j operations
├── api/                     # API layer
│   ├── schemas.py           # Request/Response models
│   └── routes.py            # API endpoints
├── tests/                   # Test suite
│   ├── conftest.py          # Test fixtures
│   ├── test_graph_service.py # Unit tests
│   └── test_api.py          # Integration tests
├── scripts/                 # Utility scripts
│   └── init_neo4j.py        # Database initialization
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
└── README.md                # This file
```

## Entity Types

- **Product**: Sellable products with SKU, category, brand
- **Feature**: Product features (material, technology, benefit)
- **Scenario**: Use cases and application scenarios
- **Problem**: Pain points and problems solved
- **UserGroup**: Target customer segments
- **Competitor**: Competing products
- **Offer**: Specific product offers with pricing
- **Merchant**: Sellers and platforms

## Relationship Types

- **HAS_FEATURE**: Product → Feature
- **SOLVES**: Feature → Problem
- **APPLIES_TO**: Product → Scenario
- **TARGETS**: Product → UserGroup
- **COMPARES_WITH**: Product → Competitor
- **HAS_OFFER**: Product → Offer
- **SOLD_BY**: Offer → Merchant
- **GENERATED_FROM**: Content → Product

## Development

### Adding New Entity Type

1. Add enum value to `models/entities.py`
2. Create Pydantic model class
3. Add constraint to `scripts/init_neo4j.py`
4. Update validation in `services/graph_service.py`
5. Add tests

### Environment Variables

```bash
# Neo4j Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# API Configuration
API_HOST=0.0.0.0
API_PORT=8001
API_TITLE=Knowledge Graph Service
API_VERSION=1.0.0

# Logging
LOG_LEVEL=INFO
ENVIRONMENT=development
```

## Troubleshooting

### Connection Refused

Ensure Neo4j is running:
```bash
# Check if Neo4j is running
docker ps | grep neo4j
# Or if using local Neo4j
neo4j status
```

### Authentication Failed

Verify credentials in `.env`:
```bash
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_actual_password
```

### Constraint Violation

Entity ID already exists. Use unique IDs for new entities or update existing ones:
```bash
# Query to check existing entity
curl http://localhost:8001/api/v1/graph/entities/your_entity_id
```

### Import Errors

Ensure you're in the correct directory:
```bash
cd backend/services/knowledge-graph
export PYTHONPATH=$PWD:$PYTHONPATH
```

## Performance

- Simple entity queries: < 50ms
- Complex queries (2-3 hops): < 100ms
- Concurrent requests: Handles 100+ simultaneous requests
- Database indexes optimize common queries

## Security

- Parameterized queries prevent Cypher injection
- Dangerous query keywords blocked (DROP, DELETE ALL)
- Entity type validation prevents label injection
- CORS configured (adjust for production)
- Environment-based configuration

## Integration

This service is designed to integrate with:
- **Content Generator Service**: Provides product context for AI content
- **Offer Catalog Service**: Product-offer relationship management
- **Analytics Service**: Graph-based product analytics
- **FAQ Clustering Service**: Problem-solution mapping

## API Documentation

Full interactive API documentation available at:
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Support

For issues or questions:
1. Check this README
2. Review API documentation at /docs
3. Examine test files for usage examples
4. Check Neo4j Browser at http://localhost:7474

## License

Part of Leap Agentic Commerce Platform
