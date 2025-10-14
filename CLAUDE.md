# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Standards

**IMPORTANT**: These language rules MUST be followed at all times:

### User Interaction
- **Language**: Chinese (中文)
- Use Chinese for all communication with the user
- Provide explanations, summaries, and responses in Chinese
- Use Chinese for error messages and status updates shown to user

### Code Generation
- **Language**: English only
- All variable names in English
- All function names in English
- All code comments in English
- Follow standard English naming conventions (camelCase, PascalCase, snake_case)

### UI Elements
- **Language**: English only
- All labels in English
- All buttons in English
- All UI messages in English
- All user-facing text in English

## Project Overview

**Leap Agentic Commerce Platform (ACP)** - An integrated platform combining Generation Engine Optimization (GEO) and Agentic Commerce Protocol (ACP) capabilities.

**Current Status**: Early development phase
- ✅ Frontend: 15 pages + 7 UI components (React + TypeScript + Vite)
- ✅ Backend: 2 services implemented (Knowledge Graph + Data Collector)
- 🚧 Commerce services: Planned but not yet implemented

## Development Commands

### Frontend (Vite + React)

```bash
cd frontend

# Development
npm install                  # Install dependencies
npm run dev                  # Start dev server (http://localhost:5173)
npm run build                # Production build
npm run preview              # Preview production build

# Code Quality
npm run type-check           # TypeScript type checking
npm run lint                 # ESLint check
npm run verify               # Quick verification (~5s)
npm run verify-full          # Full verification (~30-60s)
```

### Backend Services

#### Knowledge Graph Service (Port 8001)
```bash
cd backend/services/knowledge-graph

# Setup
cp .env.example .env         # Copy environment template
# Edit .env with Neo4j credentials
pip install -r requirements.txt

# Development
uvicorn main:app --reload --port 8001

# Testing
pytest tests/ -v             # Run all tests
pytest tests/ --cov=.        # Run with coverage
pytest tests/test_main.py -v  # Run specific test file
```

#### Data Collector Service (Port 8002)
```bash
cd backend/services/data-collector

# Setup
cp .env.example .env         # Copy environment template
# Edit .env with API keys (YouTube, Reddit, etc.)
pip install -r requirements.txt

# Development
uvicorn main:app --reload --port 8002

# Testing
pytest tests/ -v
pytest tests/ --cov=.
```

### Docker Services

```bash
# Neo4j (Graph Database)
docker run -d \
  --name neo4j-leap \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:5.14

# Access Neo4j Browser: http://localhost:7474
```

## Architecture Overview

### Service Architecture

The platform follows a microservices architecture with clear separation between GEO and Commerce capabilities:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vite + React)              │
│                    Port: 5173                           │
└────────────┬────────────────────────────────────────────┘
             │
             │ HTTP/REST
             │
┌────────────┴────────────────────────────────────────────┐
│                    API Gateway Layer                     │
│               (Future: Port 8000)                       │
└──┬──────────────────────────────────────────────────┬───┘
   │                                                   │
   │ GEO Side                                         │ Commerce Side
   │                                                   │
┌──┴────────────────────────┐         ┌──────────────┴──────────────┐
│ Knowledge Graph Service   │         │  Commerce Gateway           │
│ Port: 8001                │         │  (Future: Port 8100)        │
│ - Neo4j graph management  │         │  - ACP protocol handler     │
│ - Entity/relationship CRUD│         │  - Order orchestration      │
└──┬────────────────────────┘         └──────────────┬──────────────┘
   │                                                   │
┌──┴────────────────────────┐         ┌──────────────┴──────────────┐
│ Data Collector Service    │         │  Payment Adapter            │
│ Port: 8002                │         │  (Future: Port 8101)        │
│ - Multi-platform scraping │         │  - Stripe integration       │
│ - YouTube/Reddit/Firecrawl│         │  - Payment authorization    │
└───────────────────────────┘         └─────────────────────────────┘
             │                                         │
             │                                         │
┌────────────┴─────────────────────────────────────────┴──┐
│                    Data Layer                            │
│  Neo4j (7687) | PostgreSQL | Redis | S3                 │
└──────────────────────────────────────────────────────────┘
```

### Data Flow Patterns

#### 1. Knowledge Graph Construction Flow
```
Data Sources → Data Collector → Knowledge Graph Service → Neo4j
    ↓              ↓                      ↓                  ↓
YouTube/Reddit  Scrape/Parse      Create Entities      Store Graph
                                  Create Relationships
```

#### 2. Content Generation Flow (Future)
```
User Request → Frontend → Content Generator → LLM API
                             ↓
                    Knowledge Graph Query
                             ↓
                    Generated Content → Content Library
```

#### 3. Order Processing Flow (Future)
```
AI Agent → Commerce Gateway → Order Orchestrator
              ↓                      ↓
       Verify Request        Risk Check → Validate Offer
                                    ↓
                            Payment Authorize → Merchant Order
                                    ↓
                            Payment Capture → Fulfillment
```

### Key Design Patterns

**1. Service Independence**
- Each service runs independently with its own port
- Services communicate via REST APIs (not yet implemented)
- No direct database sharing between services

**2. Graph-Centric Data Model**
- Core data stored in Neo4j as nodes and relationships
- Node types: Product, Feature, Scenario, Problem, UserGroup, Competitor, Offer
- Relationship types: HAS_FEATURE, SOLVES, APPLIES_TO, TARGETS, etc.

**3. Multi-Tenant Support (Planned)**
- Tenant isolation at data layer
- RBAC for authorization
- Shared infrastructure, isolated data

## Technology Stack

### Frontend
- **Framework**: React 19.1 + TypeScript 5.9
- **Build Tool**: Vite 7.1
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **Router**: React Router DOM 7.9
- **Visualization**: React Flow 11.11 (graphs), Recharts 3.2 (charts)
- **State**: Zustand 5.0, TanStack Query 5.90

### Backend
- **Framework**: FastAPI 0.104 (Python 3.11+)
- **Graph DB**: Neo4j 5.14
- **Testing**: pytest 7.4 + pytest-asyncio + pytest-cov
- **HTTP Client**: httpx 0.25

### Future Services (Not Yet Implemented)
- **Database**: PostgreSQL 15+ (relational data)
- **Cache**: Redis 7.x
- **Queue**: Celery 5.3+ + Kafka/RabbitMQ
- **Storage**: S3 / MinIO
- **Container**: Docker + Kubernetes
- **Monitoring**: Prometheus + Grafana

## API Endpoints

### Knowledge Graph Service (http://localhost:8001)

```python
# Health Check
GET /health

# Entity Management
POST   /api/v1/entities              # Create entity
GET    /api/v1/entities/{id}         # Get entity
PUT    /api/v1/entities/{id}         # Update entity
DELETE /api/v1/entities/{id}         # Delete entity

# Relationship Management
POST   /api/v1/relationships          # Create relationship
GET    /api/v1/relationships/{id}    # Get relationship
DELETE /api/v1/relationships/{id}    # Delete relationship

# Graph Queries
POST   /api/v1/query                 # Execute Cypher query
GET    /api/v1/graph/summary         # Get graph statistics
```

### Data Collector Service (http://localhost:8002)

```python
# Health Check
GET /health

# Collection Tasks
POST   /api/v1/collect/youtube       # Collect from YouTube
POST   /api/v1/collect/reddit        # Collect from Reddit
POST   /api/v1/collect/firecrawl     # Web scraping via Firecrawl
GET    /api/v1/tasks/{task_id}       # Get task status

# Data Management
GET    /api/v1/data/sources          # List data sources
GET    /api/v1/data/stats            # Get collection statistics
```

### Data Collection Service (http://localhost:8003)

```python
# Health Check
GET /health

# Web Scraping Tasks
POST   /api/v1/collection/scrape     # Scrape web content via Firecrawl
GET    /api/v1/collection/tasks/{id} # Get task status
GET    /api/v1/collection/tasks      # List all tasks
GET    /api/v1/collection/stats      # Get collection statistics
```

### ETL Processing Service (http://localhost:8004)

```python
# Health Check
GET /health

# ETL Tasks
POST   /api/v1/etl/process           # Process collected data into Neo4j
GET    /api/v1/etl/tasks/{id}        # Get ETL task status
GET    /api/v1/etl/tasks             # List all ETL tasks
GET    /api/v1/etl/stats             # Get ETL statistics
```

### Scheduler Service (http://localhost:8005)

```python
# Health Check
GET /health

# Schedule Management
POST   /api/v1/scheduler/schedules          # Create schedule
GET    /api/v1/scheduler/schedules/{id}     # Get schedule details
GET    /api/v1/scheduler/schedules          # List all schedules
PUT    /api/v1/scheduler/schedules/{id}     # Update schedule
DELETE /api/v1/scheduler/schedules/{id}     # Delete schedule

# Schedule Control
POST   /api/v1/scheduler/schedules/{id}/pause      # Pause schedule
POST   /api/v1/scheduler/schedules/{id}/resume     # Resume schedule
POST   /api/v1/scheduler/schedules/{id}/trigger    # Manually trigger

# Task Execution History
GET    /api/v1/scheduler/executions/{id}    # Get execution details
GET    /api/v1/scheduler/executions         # List execution history
GET    /api/v1/scheduler/stats              # Get scheduler stats
```

## Data Pipeline Monitoring Dashboard

Access the real-time monitoring dashboard at: http://localhost:5174/data-pipeline-monitor

**Features**:
- Real-time service health monitoring (4 services)
- Pipeline statistics (total tasks, success/failure rates)
- Task execution history with filterable tabs
- Auto-refresh every 10 seconds
- Manual refresh and JSON report generation

## Data Pipeline Quick Start

### Start All Services

```bash
# Terminal 1: Data Collection Service (Port 8003)
cd backend/services/data-collection
source venv/bin/activate
uvicorn main:app --reload --port 8003

# Terminal 2: ETL Processing Service (Port 8004)
cd backend/services/etl-processing
source venv/bin/activate
uvicorn main:app --reload --port 8004

# Terminal 3: Scheduler Service (Port 8005)
cd backend/services/scheduler
source venv/bin/activate
uvicorn main:app --reload --port 8005
```

### Test Pipeline

```bash
# 1. Scrape a web page
curl -X POST http://localhost:8003/api/v1/collection/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'

# 2. Get collection task ID from response, then process with ETL
curl -X POST "http://localhost:8004/api/v1/etl/process?collection_task_id=<task_id>"

# 3. Verify data in Neo4j
curl http://localhost:8001/api/v1/entities

# 4. Create automated schedule (runs daily at midnight)
curl -X POST http://localhost:8005/api/v1/scheduler/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Data Collection",
    "schedule_type": "cron",
    "cron_expression": "0 0 * * *",
    "task_type": "pipeline",
    "task_config": {"url": "https://example.com", "formats": ["markdown"]}
  }'
```

## Neo4j Graph Schema

### Node Types

```cypher
// Product Node
(:Product {
  id: string,
  name: string,
  sku: string,
  category: string,
  brand: string,
  description: string,
  created_at: datetime
})

// Feature Node
(:Feature {
  id: string,
  name: string,
  type: string,
  value: string,
  description: string
})

// Scenario Node
(:Scenario {
  id: string,
  name: string,
  description: string,
  tags: [string]
})

// Problem Node
(:Problem {
  id: string,
  description: string,
  severity: int,      // 1-5
  frequency: int      // occurrence count
})

// User Group Node
(:UserGroup {
  id: string,
  name: string,
  demographics: map,
  behavior: map
})

// Offer Node (Commerce)
(:Offer {
  offer_id: string,
  sku: string,
  merchant_id: string,
  price: decimal,
  currency: string,
  availability: string,
  stock_level: int,
  valid_from: datetime,
  valid_until: datetime
})
```

### Relationship Types

```cypher
// Product has features
(Product)-[:HAS_FEATURE {confidence: float}]->(Feature)

// Product solves problems
(Product)-[:SOLVES {effectiveness: float}]->(Problem)

// Product applies to scenarios
(Product)-[:APPLIES_TO {relevance: float}]->(Scenario)

// Product targets user groups
(Product)-[:TARGETS {priority: int}]->(UserGroup)

// Product has offers
(Product)-[:HAS_OFFER]->(Offer)

// Example Query: Find products for a specific problem
MATCH (p:Product)-[s:SOLVES]->(prob:Problem {id: $problem_id})
WHERE s.effectiveness > 0.7
RETURN p, s, prob
ORDER BY s.effectiveness DESC
```

## Environment Configuration

### Required Environment Variables

#### Knowledge Graph Service (.env)
```bash
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
NEO4J_DATABASE=neo4j
```

#### Data Collector Service (.env)
```bash
# Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# API Keys
YOUTUBE_API_KEY=your_youtube_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
FIRECRAWL_API_URL=http://localhost:3002
FIRECRAWL_API_KEY=fs-test
```

#### Security Best Practices
- ✅ `.env` files are in `.gitignore`
- ✅ Use `.env.example` as template
- ✅ Set file permissions: `chmod 600 .env`
- ❌ Never commit API keys or passwords

## Testing Strategy

### Unit Tests
```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=. --cov-report=html

# Run specific test
pytest tests/test_main.py::test_health_check -v

# Run tests matching pattern
pytest tests/ -k "test_create" -v
```

### Integration Tests
```bash
# Test with real Neo4j (requires Docker running)
pytest tests/integration/ -v

# Test API endpoints
pytest tests/test_api.py -v
```

### Frontend Verification
```bash
cd frontend

# Quick check (5 seconds)
npm run verify

# Full check (30-60 seconds)
npm run verify-full

# E2E page testing with Playwright (20 tests)
node test-app-complete.mjs

# Quick monitor page test
node test-monitor-page.mjs
```

## Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development integration branch
- `feature/*` - New features
- `hotfix/*` - Emergency fixes

### Commit Convention (Conventional Commits)
```bash
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Before Committing
```bash
# Frontend
cd frontend
npm run type-check
npm run lint
npm run verify

# Backend (each service)
cd backend/services/{service-name}
pytest tests/ --cov=.
```

## Troubleshooting

### Frontend Issues

**Port 5173 already in use**
```bash
# Kill existing process
lsof -ti:5173 | xargs kill -9
npm run dev
```

**Type errors**
```bash
npm run type-check
# Fix TypeScript errors in reported files
```

### Backend Issues

**Neo4j connection failed**
```bash
# Check Neo4j is running
docker ps | grep neo4j

# Test connection
curl http://localhost:7474

# Check credentials in .env
cat .env | grep NEO4J
```

**Import errors**
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Verify Python version
python --version  # Should be 3.11+
```

**Port already in use**
```bash
# Find process using port 8001
lsof -ti:8001 | xargs kill -9

# Start service
uvicorn main:app --reload --port 8001
```

## Development Workflow

### 1. Setting Up New Feature

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. For backend service
cd backend/services/{service-name}
cp .env.example .env
# Edit .env with your credentials
pip install -r requirements.txt

# 3. For frontend
cd frontend
npm install
```

### 2. Development Cycle

```bash
# Start services
cd backend/services/knowledge-graph
uvicorn main:app --reload --port 8001 &

cd backend/services/data-collector
uvicorn main:app --reload --port 8002 &

cd frontend
npm run dev
```

### 3. Testing & Verification

```bash
# Backend
pytest tests/ -v --cov=.

# Frontend
npm run verify-full
```

### 4. Commit & Push

```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

## Context Engineering Integration

This project has global Context Engineering and BMAD capabilities available:

### Context Engineering Commands
```bash
/generate-prp INITIAL-feature.md    # Generate Product Requirements Prompt
/execute-prp PRPs/feature.md        # Execute PRP for automated implementation
```

### BMAD Method Commands
```bash
/analyst --research "topic"         # Market research
/architect --design "system"        # Architecture design
/pm --create-prd "feature"          # Project management
/dev --implement "story"            # Development
/qa --test "feature"                # Quality assurance
```

### SuperClaude Commands (17 available)
```bash
/sc:implement --feature "..."       # Feature implementation
/sc:test --coverage                 # Run tests
/sc:analyze --code-quality          # Code analysis
/sc:git --commit                    # Smart commit
```

### MCP Servers (Global)
**Available Tools**:
- Neo4j (localhost:7688) - Graph database ⭐ Core dependency
- MongoDB (localhost:27018) - Document database
- PostgreSQL (localhost:5437) - Relational database
- Redis (localhost:6382) - Cache
- Firecrawl (localhost:3002) - Web scraping
- Notion, Slack, Feishu - Documentation & collaboration
- GitHub, GitLab - Version control
- Sequential Thinking, Memory - AI capabilities

## Project Status

**Current Phase**: Phase 1.3 - Data Pipeline Monitoring Complete ✅
**Last Updated**: 2025-10-14
**Next Phase**: Phase 2.0 - Backend API Integration

### Phase 1.3 Completed (2025-10-14) ✅

#### 🎯 Major Achievements

**1. Data Pipeline Monitor Page**
- ✅ Created comprehensive monitoring dashboard (`DataPipelineMonitor.tsx`)
- ✅ Real-time service health monitoring (4 services: Data Collection, ETL, Neo4j, Scheduler)
- ✅ Pipeline statistics display (total tasks, success/failure rates)
- ✅ Task execution history with tabs (Collection Tasks, ETL Tasks, Neo4j Data)
- ✅ Auto-refresh mechanism (10 seconds interval)
- ✅ Manual refresh and report generation (JSON download)
- ✅ Integrated into navigation under GEO section
- ✅ Route added: `/data-pipeline-monitor`

**2. E2E Testing Enhancements**
- ✅ Extended E2E test suite to 20 tests (was 18)
- ✅ Added Data Pipeline Monitor page navigation test
- ✅ Added interactive test for monitor features:
  - Manual refresh button functionality
  - Tab switching (Collection/ETL/Neo4j tabs)
  - Generate report button presence
  - Service status cards validation
- ✅ All 20 tests passing (100% pass rate, 0 failures, 0 warnings)

**3. Bug Fixes**
- ✅ Fixed critical import error in App.tsx (named vs default export)
- ✅ Updated test selectors for better precision (strict mode compliance)
- ✅ Resolved page rendering issues caused by TypeScript compilation errors

**4. Backend Pipeline Services**
- ✅ Data Collection Service (Port 8003) - Firecrawl web scraping
- ✅ ETL Processing Service (Port 8004) - Data transformation to Neo4j
- ✅ Scheduler Service (Port 8005) - Automated task scheduling
- ✅ All services integrated with monitoring dashboard

### Phase 1.2 Completed (2025-10-14) ✅

#### 🎯 Major Achievements

**1. React Router Migration**
- ✅ Migrated from Zustand state-based navigation to React Router DOM
- ✅ Added `<BrowserRouter>` wrapper in main.tsx
- ✅ Implemented all route definitions in App.tsx
- ✅ Updated Sidebar.tsx to use `<NavLink>` with active state styling
- ✅ Fixed page titles for Shopify GEO and Amazon GEO
- ✅ All pages now accessible via direct URL navigation

**2. CI/CD Automation**
- ✅ Removed GitHub token from git remote URL (security improvement)
- ✅ Configured macOS Keychain for secure credential storage
- ✅ Created `./scripts/auto-deploy.sh` - one-command deployment
- ✅ Created `./scripts/setup-credentials.sh` - credential management helper
- ✅ Set up git post-commit hook with deployment reminders
- ✅ Comprehensive documentation in `scripts/README.md`
- ✅ Automated workflow: `Local Changes → GitHub → Vercel`

**3. Initial E2E Testing Suite**
- ✅ Created comprehensive Playwright test suite (`test-app-complete.mjs`)
- ✅ 18 automated tests covering all pages and interactive features
- ✅ Validates H1 titles, page loading, and interactive elements

**4. Backend API Endpoints**
- ✅ Added GET /api/v1/entities endpoint
- ✅ Added GET /api/v1/relationships endpoint
- ✅ Added GET /api/v1/stats endpoint
- ✅ All endpoints ready for frontend integration

### Completed Features ✅

**Frontend (16 pages + routing)**
- Overview: Dashboard, Analytics
- GEO: Knowledge Graph, Data Collection, **Data Pipeline Monitor**, Content Generation, Content Library
- GEO Workflow: Workflow Dashboard, On-site GEO, Off-site GEO, GEO Monitoring
- Commerce: Shopify GEO, Amazon GEO, Orders, Offers
- System: Settings
- 7 UI components (Button, Card, Badge, Table, Input, Textarea, Tabs)
- React Router URL-based navigation with active states

**Backend Services (5 services)**
- Knowledge Graph Service (Port 8001) - Neo4j integration, CRUD APIs
- Data Collector Service (Port 8002) - YouTube, Reddit, Firecrawl scrapers
- Data Collection Service (Port 8003) - Firecrawl web scraping tasks
- ETL Processing Service (Port 8004) - Data transformation to Neo4j
- Scheduler Service (Port 8005) - Automated task scheduling with cron

**DevOps & Automation**
- Automated deployment scripts with secure credential management
- CI/CD pipeline: Git → GitHub → Vercel
- Comprehensive E2E test suite (20 tests, 100% pass rate)
- Git hooks and automation helpers

**Testing & Quality**
- pytest framework with coverage reporting
- Playwright E2E testing (test-app-complete.mjs, test-monitor-page.mjs)
- TypeScript type checking
- ESLint code quality checks

### Current Status 🎯

**Application State**
- ✅ All 16 pages accessible and working
- ✅ URL routing fully functional
- ✅ No console errors or API errors
- ✅ Interactive features (charts, tabs, view switching, monitoring) working
- ✅ Data pipeline monitoring active with real-time updates
- ✅ All backend services running and integrated
- ✅ Ready for production deployment
- ✅ Automated deployment pipeline active

**Technical Debt**
- ⚠️ Frontend uses mock data (needs backend API integration)
- ⚠️ Some API endpoints return empty data (need Neo4j population)
- ⚠️ No authentication/authorization yet

### Next Phase: Phase 2.0 - Data Pipeline & API Integration 📋

**Priority 1: Data Pipeline Testing & Production Use (Week 1-2)**
1. Real-world Data Collection
   - Configure Firecrawl for target websites (SweetNight competitors)
   - Test web scraping with actual e-commerce sites
   - Set up automated daily/weekly collection schedules
   - Monitor pipeline performance and error rates

2. ETL Pipeline Validation
   - Test data transformation with real scraped content
   - Verify Neo4j entity and relationship creation
   - Optimize ETL processing for large datasets
   - Set up error handling and retry mechanisms

3. Neo4j Data Population
   - Create seed data script for demo purposes
   - Process collected data through ETL pipeline
   - Add sample products, features, scenarios
   - Establish relationships in graph
   - Verify queries return expected data

**Priority 2: Frontend-Backend API Integration (Week 3-4)**
1. Knowledge Graph Integration
   - Connect Knowledge Graph page to Neo4j backend
   - Replace mock data with real graph queries
   - Implement real-time graph visualization
   - Add entity/relationship CRUD operations

2. Dashboard & Analytics Integration
   - Connect Dashboard to Knowledge Graph stats API
   - Integrate real analytics data
   - Implement data validation and type safety
   - Add error handling and loading states

3. Data Collection UI Integration
   - Connect Data Collection page to Collection Service (Port 8003)
   - Enable manual web scraping from UI
   - Show real collection task status
   - Display collection history and statistics

**Priority 3: Content Generation (Week 5-6)**
1. Content Generator Service
   - LLM integration (OpenAI/Anthropic API)
   - Content templates and prompts
   - Knowledge graph query integration
   - Generated content storage

2. Content Library Management
   - CRUD operations for content
   - Version control for generated content
   - Export functionality (Markdown, HTML, JSON)

**Priority 4: Advanced Monitoring (Week 7-8)**
1. Analytics Service Enhancement
   - Usage tracking
   - Performance metrics
   - Content quality scoring
   - ROI calculations

2. Production Monitoring
   - Service health checks
   - Error tracking (Sentry integration)
   - Performance monitoring (Prometheus + Grafana)
   - Logging aggregation
   - Alerting for pipeline failures

**Future Phases**

**Phase 3.0 - Commerce Integration**
- Commerce Gateway (ACP protocol handler)
- Order Orchestrator (SAGA state machine)
- Payment Adapter (Stripe integration)
- Offer Catalog Service
- Merchant Adapter (Shopify/Etsy)

**Phase 4.0 - Multi-tenancy & Auth**
- Multi-tenant management
- RBAC authorization
- User authentication (OAuth, SSO)
- Tenant isolation
- API rate limiting

### How to Deploy

**Quick Deploy (Recommended)**
```bash
# One command to commit, push, and deploy
./scripts/auto-deploy.sh "your commit message"
```

**Manual Workflow**
```bash
git add .
git commit -m "your message"
git push origin main
# Vercel automatically deploys
```

**First Time Setup**
```bash
# Set up GitHub credentials securely
./scripts/setup-credentials.sh
```

### Testing Checklist

Before deploying to production:
```bash
# 1. Run E2E tests
cd frontend
node test-app-complete.mjs

# 2. Verify TypeScript
npm run type-check

# 3. Check linting
npm run lint

# 4. Run backend tests
cd ../backend/services/knowledge-graph
pytest tests/ --cov=.

cd ../data-collector
pytest tests/ --cov=.
```

## Common Issues and Solutions

### React Infinite Loop Prevention

**Problem**: React components causing "Maximum update depth exceeded" error.

**Root Cause**: Using `|| []` to provide default values creates new array references on every render, triggering infinite re-renders.

**Solution**: Wrap in `useMemo` to stabilize references:

```typescript
// ❌ Wrong - creates new array every render
const entities = entitiesResponse?.data || []

// ✅ Correct - stable reference
const entities = useMemo(() => entitiesResponse?.data || [], [entitiesResponse?.data])
```

**Also avoid**: Including setter functions from hooks in `useEffect` dependencies:

```typescript
// ❌ Wrong - causes infinite loop
useEffect(() => {
  setNodes(graphNodes)
}, [graphNodes, setNodes])  // setNodes causes re-render

// ✅ Correct - only depend on data
useEffect(() => {
  setNodes(graphNodes)
}, [graphNodes])
```

### Vite Type Import Errors

**Problem**: Vite throws errors like "does not provide an export named X".

**Root Cause**: Vite's ES module system requires explicit type imports for TypeScript types.

**Solution**: Use `import type` for TypeScript types:

```typescript
// ❌ Wrong
import { QueryClient, DefaultOptions } from '@tanstack/react-query'
import { AxiosInstance, AxiosError } from 'axios'

// ✅ Correct
import { QueryClient } from '@tanstack/react-query'
import type { DefaultOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
```

### Missing Routes

**Problem**: Navigation links don't work, timeout when clicking.

**Root Cause**: Routes not defined in `App.tsx`.

**Solution**: Ensure all navigation items in `Sidebar.tsx` have corresponding routes in `App.tsx`:

```typescript
// App.tsx
<Route path="geo-workflow/dashboard" element={<GeoWorkflowDashboard />} />
<Route path="geo-workflow/onsite" element={<OnsiteGeo />} />
// ... etc
```

## Important Notes

⚠️ **Security**:
- Never commit `.env` files
- Keep API keys in environment variables
- Set `.env` permissions to 600
- Use `.env.example` as template

⚠️ **Neo4j Dependency**:
- Most services require Neo4j running
- Start Neo4j before backend services
- Check connection in `.env` files

⚠️ **Port Allocation**:
- Frontend: 5173
- Knowledge Graph: 8001
- Data Collector: 8002
- Neo4j: 7474 (HTTP), 7687 (Bolt)
- Future services: 8100+ (Commerce), 8000 (Gateway)

## Reference Documentation

- `README.md` - Project overview and quick start
- `leap_acp_prd.md` - Product requirements document
- `leap_acp_dev_guide.md` - Development guide
- `VERIFICATION_GUIDE.md` - Testing and verification
- `PROJECT_STATUS.md` - Implementation status tracking
