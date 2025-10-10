# Leap Agentic Commerce Platform 开发文档

## 文档信息

| 项目 | 内容 |
|---|---|
| 文档名称 | Leap Agentic Commerce Platform 开发文档 |
| 版本 | v1.0 |
| 创建日期 | 2025-10-09 |
| 适用对象 | 后端开发、前端开发、DevOps工程师 |
| 技术栈 | FastAPI, React, Neo4j, PostgreSQL, Redis, Kafka |

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [开发环境搭建](#3-开发环境搭建)
4. [核心模块开发](#4-核心模块开发)
5. [API接口规范](#5-api接口规范)
6. [数据库设计](#6-数据库设计)
7. [前端开发指南](#7-前端开发指南)
8. [测试指南](#8-测试指南)
9. [部署运维](#9-部署运维)
10. [开发规范](#10-开发规范)

---

## 1. 项目概述

### 1.1 系统简介

Leap Agentic Commerce Platform 是一个集成生成引擎优化（GEO）和代理商务（ACP）的一体化平台，采用微服务架构，支持多租户、高并发、高可用。

### 1.2 核心技术栈

**后端**
- FastAPI 0.104+ (Python 3.11+)
- Celery 5.3+ (异步任务)
- Neo4j 5.x (图数据库)
- PostgreSQL 15+ (关系数据库)
- Redis 7.x (缓存与队列)
- Kafka 3.x (消息队列)

**前端**
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- shadcn/ui

**基础设施**
- Docker & Kubernetes
- Prometheus & Grafana (监控)
- OpenTelemetry (追踪)
- ELK Stack (日志)

### 1.3 项目结构

```
leap-acp/
├── backend/
│   ├── services/
│   │   ├── api-gateway/          # API网关
│   │   ├── commerce-gateway/     # ACP网关
│   │   ├── knowledge-graph/      # 知识图谱服务
│   │   ├── content-generator/    # 内容生成服务
│   │   ├── order-orchestrator/   # 订单编排服务
│   │   ├── payment-adapter/      # 支付适配服务
│   │   ├── merchant-adapter/     # 商家适配服务
│   │   └── analytics/            # 分析服务
│   ├── shared/
│   │   ├── models/               # 共享数据模型
│   │   ├── utils/                # 工具函数
│   │   ├── config/               # 配置管理
│   │   └── middleware/           # 中间件
│   └── workers/
│       ├── data-collector/       # 数据采集worker
│       ├── content-processor/    # 内容处理worker
│       └── order-processor/      # 订单处理worker
├── frontend/
│   ├── src/
│   │   ├── components/           # React组件
│   │   ├── pages/                # 页面
│   │   ├── hooks/                # 自定义Hooks
│   │   ├── services/             # API服务层
│   │   ├── store/                # 状态管理
│   │   └── utils/                # 工具函数
│   └── public/
├── infrastructure/
│   ├── k8s/                      # Kubernetes配置
│   ├── docker/                   # Docker配置
│   ├── terraform/                # IaC配置
│   └── monitoring/               # 监控配置
├── scripts/
│   ├── setup/                    # 环境搭建脚本
│   ├── migration/                # 数据迁移脚本
│   └── deploy/                   # 部署脚本
└── docs/
    ├── api/                      # API文档
    ├── architecture/             # 架构文档
    └── development/              # 开发文档
```

---

## 2. 技术架构

### 2.1 整体架构

采用分层微服务架构：

```
┌─────────────────────────────────────────┐
│        接入层 (Access Layer)             │
│  API Gateway / ACP Gateway / CDN        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        应用层 (Service Layer)            │
│  GEO Services / Commerce Services       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         数据层 (Data Layer)              │
│  Neo4j / PostgreSQL / Redis / S3        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      基础设施层 (Infrastructure)         │
│  K8s / Kafka / Monitoring / Logging     │
└─────────────────────────────────────────┘
```

### 2.2 服务划分

**GEO相关服务**
- `data-collector-service`: 数据采集
- `knowledge-graph-service`: 知识图谱管理
- `content-generator-service`: 内容生成
- `content-scoring-service`: 内容评分
- `distribution-service`: 多平台分发
- `analytics-service`: 效果分析

**Commerce相关服务**
- `commerce-gateway`: ACP协议网关
- `order-orchestrator`: 订单编排
- `payment-adapter`: 支付适配
- `offer-catalog-service`: 报价目录
- `merchant-adapter-service`: 商家适配
- `fulfillment-service`: 履约管理

**共享服务**
- `auth-service`: 认证授权
- `tenant-service`: 租户管理
- `notification-service`: 通知服务
- `audit-service`: 审计服务

### 2.3 通信方式

**同步通信**
- HTTP/REST API (FastAPI)
- GraphQL (知识图谱查询)

**异步通信**
- Kafka (事件总线)
- RabbitMQ (任务队列)
- Redis Pub/Sub (实时通知)

---

## 3. 开发环境搭建

### 3.1 前置要求

**必需软件**
- Python 3.11+
- Node.js 18+
- Docker Desktop
- Git
- Redis 7+
- PostgreSQL 15+
- Neo4j 5+

**推荐IDE**
- VS Code (推荐插件见附录)
- PyCharm Professional
- WebStorm

### 3.2 快速开始

#### Step 1: 克隆项目

```bash
git clone https://github.com/your-org/leap-acp.git
cd leap-acp
```

#### Step 2: 环境变量配置

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```bash
# 数据库配置
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=leap_acp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

REDIS_URL=redis://localhost:6379/0

# Kafka配置
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# API密钥
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...

# 应用配置
ENVIRONMENT=development
LOG_LEVEL=DEBUG
```

#### Step 3: 安装依赖

**后端依赖**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**前端依赖**

```bash
cd frontend
npm install
```

#### Step 4: 数据库初始化

**PostgreSQL**

```bash
# 创建数据库
createdb leap_acp

# 运行迁移
cd backend
alembic upgrade head
```

**Neo4j**

```bash
# 启动Neo4j
neo4j start

# 运行初始化脚本
python scripts/init_neo4j.py
```

#### Step 5: 启动服务

**启动后端服务**

```bash
# 启动API Gateway
cd backend/services/api-gateway
uvicorn main:app --reload --port 8000

# 启动其他服务（开新终端）
cd backend/services/knowledge-graph
uvicorn main:app --reload --port 8001

# 启动Celery Worker
cd backend/workers
celery -A tasks worker --loglevel=info
```

**启动前端**

```bash
cd frontend
npm run dev
```

访问：http://localhost:3000

### 3.3 使用Docker Compose（推荐）

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

`docker-compose.yml` 示例：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: leap_acp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  neo4j:
    image: neo4j:5.13
    environment:
      NEO4J_AUTH: neo4j/password
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4j_data:/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

volumes:
  postgres_data:
  neo4j_data:
```

---

## 4. 核心模块开发

### 4.1 知识图谱服务 (Knowledge Graph Service)

#### 4.1.1 项目结构

```
knowledge-graph/
├── main.py              # FastAPI应用入口
├── models/
│   ├── entities.py      # 实体模型
│   └── relationships.py # 关系模型
├── services/
│   ├── graph_service.py # 图谱操作服务
│   └── query_service.py # 查询服务
├── api/
│   ├── routes.py        # 路由定义
│   └── schemas.py       # Pydantic模型
└── tests/
```

#### 4.1.2 实体模型定义

```python
# models/entities.py
from typing import Optional, Dict, List
from pydantic import BaseModel
from enum import Enum

class EntityType(str, Enum):
    PRODUCT = "product"
    FEATURE = "feature"
    SCENARIO = "scenario"
    PROBLEM = "problem"
    USER_GROUP = "user_group"
    COMPETITOR = "competitor"
    OFFER = "offer"

class BaseEntity(BaseModel):
    id: str
    type: EntityType
    name: str
    description: Optional[str] = None
    properties: Dict = {}
    created_at: str
    updated_at: str

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

#### 4.1.3 图谱操作服务

```python
# services/graph_service.py
from neo4j import GraphDatabase
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class GraphService:
    def __init__(self, uri: str, user: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
    
    def close(self):
        self.driver.close()
    
    def create_entity(self, entity_type: str, properties: Dict) -> str:
        """创建实体节点"""
        with self.driver.session() as session:
            result = session.execute_write(
                self._create_entity_tx, entity_type, properties
            )
            return result
    
    @staticmethod
    def _create_entity_tx(tx, entity_type: str, properties: Dict):
        query = f"""
        CREATE (n:{entity_type} $properties)
        RETURN n.id as id
        """
        result = tx.run(query, properties=properties)
        return result.single()["id"]
    
    def create_relationship(
        self, 
        from_id: str, 
        to_id: str, 
        rel_type: str,
        properties: Dict = {}
    ) -> bool:
        """创建关系"""
        with self.driver.session() as session:
            result = session.execute_write(
                self._create_relationship_tx,
                from_id, to_id, rel_type, properties
            )
            return result
    
    @staticmethod
    def _create_relationship_tx(tx, from_id, to_id, rel_type, properties):
        query = f"""
        MATCH (a {{id: $from_id}})
        MATCH (b {{id: $to_id}})
        CREATE (a)-[r:{rel_type} $properties]->(b)
        RETURN r
        """
        result = tx.run(
            query, 
            from_id=from_id, 
            to_id=to_id, 
            properties=properties
        )
        return result.single() is not None
    
    def query_entity(self, entity_id: str) -> Optional[Dict]:
        """查询实体"""
        with self.driver.session() as session:
            result = session.execute_read(
                self._query_entity_tx, entity_id
            )
            return result
    
    @staticmethod
    def _query_entity_tx(tx, entity_id: str):
        query = """
        MATCH (n {id: $entity_id})
        RETURN n
        """
        result = tx.run(query, entity_id=entity_id)
        record = result.single()
        if record:
            return dict(record["n"])
        return None
    
    def query_relationships(
        self, 
        entity_id: str, 
        rel_type: Optional[str] = None,
        direction: str = "outgoing"
    ) -> List[Dict]:
        """查询实体的关系"""
        with self.driver.session() as session:
            result = session.execute_read(
                self._query_relationships_tx,
                entity_id, rel_type, direction
            )
            return result
    
    @staticmethod
    def _query_relationships_tx(tx, entity_id, rel_type, direction):
        if direction == "outgoing":
            rel_pattern = f"-[r:{rel_type if rel_type else ''}]->"
        elif direction == "incoming":
            rel_pattern = f"<-[r:{rel_type if rel_type else ''}]-"
        else:  # both
            rel_pattern = f"-[r:{rel_type if rel_type else ''}]-"
        
        query = f"""
        MATCH (a {{id: $entity_id}}){rel_pattern}(b)
        RETURN type(r) as rel_type, properties(r) as rel_props, b
        """
        result = tx.run(query, entity_id=entity_id)
        return [
            {
                "rel_type": record["rel_type"],
                "rel_props": dict(record["rel_props"]),
                "target": dict(record["b"])
            }
            for record in result
        ]
    
    def execute_cypher(self, query: str, params: Dict = {}) -> List[Dict]:
        """执行自定义Cypher查询"""
        with self.driver.session() as session:
            result = session.run(query, **params)
            return [dict(record) for record in result]
```

#### 4.1.4 API路由定义

```python
# api/routes.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from .schemas import (
    EntityCreateRequest, EntityResponse,
    RelationshipCreateRequest, RelationshipResponse,
    QueryRequest, QueryResponse
)
from services.graph_service import GraphService
from config import get_settings

router = APIRouter(prefix="/api/v1/graph", tags=["knowledge-graph"])

def get_graph_service():
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

@router.post("/entities", response_model=EntityResponse)
async def create_entity(
    request: EntityCreateRequest,
    service: GraphService = Depends(get_graph_service)
):
    """创建实体节点"""
    try:
        entity_id = service.create_entity(
            entity_type=request.entity_type,
            properties=request.properties
        )
        return EntityResponse(
            id=entity_id,
            entity_type=request.entity_type,
            message="Entity created successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/entities/{entity_id}", response_model=EntityResponse)
async def get_entity(
    entity_id: str,
    service: GraphService = Depends(get_graph_service)
):
    """查询实体"""
    entity = service.query_entity(entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return EntityResponse(**entity)

@router.post("/relationships", response_model=RelationshipResponse)
async def create_relationship(
    request: RelationshipCreateRequest,
    service: GraphService = Depends(get_graph_service)
):
    """创建关系"""
    success = service.create_relationship(
        from_id=request.from_id,
        to_id=request.to_id,
        rel_type=request.rel_type,
        properties=request.properties
    )
    if not success:
        raise HTTPException(status_code=400, detail="Failed to create relationship")
    return RelationshipResponse(message="Relationship created successfully")

@router.post("/query", response_model=QueryResponse)
async def execute_query(
    request: QueryRequest,
    service: GraphService = Depends(get_graph_service)
):
    """执行Cypher查询"""
    try:
        results = service.execute_cypher(
            query=request.query,
            params=request.params
        )
        return QueryResponse(
            results=results,
            count=len(results)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

### 4.2 订单编排服务 (Order Orchestrator)

#### 4.2.1 SAGA状态机实现

```python
# services/order_orchestrator.py
from enum import Enum
from typing import Dict, Optional, Callable
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class OrderState(str, Enum):
    CREATED = "created"
    RISK_CHECK = "risk_check"
    VALIDATE_OFFER = "validate_offer"
    PAYMENT_AUTHORIZE = "payment_authorize"
    MERCHANT_ORDER = "merchant_order"
    CAPTURE = "capture"
    FULFILLING = "fulfilling"
    CLOSED = "closed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class OrderEvent(str, Enum):
    CREATE = "create"
    RISK_CHECK_PASS = "risk_check_pass"
    RISK_CHECK_FAIL = "risk_check_fail"
    OFFER_VALID = "offer_valid"
    OFFER_INVALID = "offer_invalid"
    PAYMENT_AUTHORIZED = "payment_authorized"
    PAYMENT_FAILED = "payment_failed"
    MERCHANT_CREATED = "merchant_created"
    MERCHANT_FAILED = "merchant_failed"
    CAPTURED = "captured"
    CAPTURE_FAILED = "capture_failed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCEL = "cancel"
    REFUND = "refund"

class OrderStateMachine:
    """订单状态机"""
    
    # 状态转换表
    TRANSITIONS = {
        OrderState.CREATED: {
            OrderEvent.CREATE: OrderState.RISK_CHECK
        },
        OrderState.RISK_CHECK: {
            OrderEvent.RISK_CHECK_PASS: OrderState.VALIDATE_OFFER,
            OrderEvent.RISK_CHECK_FAIL: OrderState.CANCELLED
        },
        OrderState.VALIDATE_OFFER: {
            OrderEvent.OFFER_VALID: OrderState.PAYMENT_AUTHORIZE,
            OrderEvent.OFFER_INVALID: OrderState.CANCELLED
        },
        OrderState.PAYMENT_AUTHORIZE: {
            OrderEvent.PAYMENT_AUTHORIZED: OrderState.MERCHANT_ORDER,
            OrderEvent.PAYMENT_FAILED: OrderState.CANCELLED
        },
        OrderState.MERCHANT_ORDER: {
            OrderEvent.MERCHANT_CREATED: OrderState.CAPTURE,
            OrderEvent.MERCHANT_FAILED: OrderState.REFUNDED
        },
        OrderState.CAPTURE: {
            OrderEvent.CAPTURED: OrderState.FULFILLING,
            OrderEvent.CAPTURE_FAILED: OrderState.REFUNDED
        },
        OrderState.FULFILLING: {
            OrderEvent.SHIPPED: OrderState.FULFILLING,
            OrderEvent.DELIVERED: OrderState.CLOSED,
            OrderEvent.REFUND: OrderState.REFUNDED
        }
    }
    
    def __init__(self, initial_state: OrderState = OrderState.CREATED):
        self.state = initial_state
        self.history = [(initial_state, datetime.utcnow())]
    
    def can_transition(self, event: OrderEvent) -> bool:
        """检查是否可以进行状态转换"""
        return event in self.TRANSITIONS.get(self.state, {})
    
    def transition(self, event: OrderEvent) -> Optional[OrderState]:
        """执行状态转换"""
        if not self.can_transition(event):
            logger.warning(
                f"Invalid transition: {self.state} -> {event}"
            )
            return None
        
        new_state = self.TRANSITIONS[self.state][event]
        logger.info(
            f"State transition: {self.state} -> {new_state} (event: {event})"
        )
        self.state = new_state
        self.history.append((new_state, datetime.utcnow()))
        return new_state

class OrderOrchestrator:
    """订单编排器"""
    
    def __init__(
        self,
        db_service,
        risk_service,
        offer_service,
        payment_service,
        merchant_service,
        event_bus
    ):
        self.db = db_service
        self.risk = risk_service
        self.offer = offer_service
        self.payment = payment_service
        self.merchant = merchant_service
        self.event_bus = event_bus
    
    async def create_order(self, order_data: Dict) -> Dict:
        """创建订单并启动编排"""
        # 1. 创建订单记录
        order_id = await self.db.create_order(order_data)
        state_machine = OrderStateMachine()
        
        # 2. 发布订单创建事件
        await self.event_bus.publish("order.created", {
            "order_id": order_id,
            "state": state_machine.state
        })
        
        # 3. 开始编排流程
        try:
            # 风控检查
            await self._risk_check(order_id, order_data, state_machine)
            
            # Offer校验
            await self._validate_offer(order_id, order_data, state_machine)
            
            # 支付授权
            await self._authorize_payment(order_id, order_data, state_machine)
            
            # 商家下单
            await self._create_merchant_order(order_id, order_data, state_machine)
            
            # 支付捕获
            await self._capture_payment(order_id, order_data, state_machine)
            
            return {
                "order_id": order_id,
                "state": state_machine.state,
                "message": "Order created successfully"
            }
        
        except Exception as e:
            logger.error(f"Order orchestration failed: {str(e)}")
            await self._handle_failure(order_id, state_machine, str(e))
            raise
    
    async def _risk_check(
        self, 
        order_id: str, 
        order_data: Dict, 
        sm: OrderStateMachine
    ):
        """风控检查"""
        logger.info(f"[{order_id}] Starting risk check")
        sm.transition(OrderEvent.CREATE)
        
        risk_result = await self.risk.check(
            user_hash=order_data.get("user_hash"),
            ip_address=order_data.get("ip_address"),
            device_id=order_data.get("device_id"),
            amount=order_data.get("amount")
        )
        
        if risk_result["risk_score"] > 0.8:
            sm.transition(OrderEvent.RISK_CHECK_FAIL)
            await self.db.update_order(order_id, {
                "state": sm.state,
                "risk_score": risk_result["risk_score"],
                "risk_reason": risk_result.get("reason")
            })
            raise Exception(f"Risk check failed: {risk_result.get('reason')}")
        
        sm.transition(OrderEvent.RISK_CHECK_PASS)
        await self.db.update_order(order_id, {
            "state": sm.state,
            "risk_score": risk_result["risk_score"]
        })
        await self.event_bus.publish("order.risk_checked", {
            "order_id": order_id,
            "risk_score": risk_result["risk_score"]
        })
    
    async def _validate_offer(
        self, 
        order_id: str, 
        order_data: Dict, 
        sm: OrderStateMachine
    ):
        """校验Offer"""
        logger.info(f"[{order_id}] Validating offer")
        
        offer_result = await self.offer.validate(
            offer_id=order_data.get("offer_id"),
            quantity=order_data.get("quantity"),
            region=order_data.get("region")
        )
        
        if not offer_result["valid"]:
            sm.transition(OrderEvent.OFFER_INVALID)
            await self.db.update_order(order_id, {
                "state": sm.state,
                "offer_invalid_reason": offer_result.get("reason")
            })
            raise Exception(f"Offer validation failed: {offer_result.get('reason')}")
        
        # 检查价格是否变化
        if offer_result["price"] != order_data.get("amount"):
            logger.warning(f"[{order_id}] Price changed from {order_data.get('amount')} to {offer_result['price']}")
            # 这里可以实现价格保护逻辑
        
        sm.transition(OrderEvent.OFFER_VALID)
        await self.db.update_order(order_id, {"state": sm.state})
        await self.event_bus.publish("order.validated", {
            "order_id": order_id
        })
    
    async def _authorize_payment(
        self, 
        order_id: str, 
        order_data: Dict, 
        sm: OrderStateMachine
    ):
        """支付授权"""
        logger.info(f"[{order_id}] Authorizing payment")
        
        try:
            payment_result = await self.payment.authorize(
                token=order_data.get("payment_token"),
                amount=order_data.get("amount"),
                currency=order_data.get("currency"),
                merchant_id=order_data.get("merchant_id")
            )
            
            sm.transition(OrderEvent.PAYMENT_AUTHORIZED)
            await self.db.create_payment(order_id, {
                "provider": payment_result["provider"],
                "auth_id": payment_result["auth_id"],
                "amount": order_data.get("amount"),
                "currency": order_data.get("currency"),
                "auth_status": "success"
            })
            await self.db.update_order(order_id, {"state": sm.state})
            await self.event_bus.publish("order.authorized", {
                "order_id": order_id,
                "auth_id": payment_result["auth_id"]
            })
        
        except Exception as e:
            sm.transition(OrderEvent.PAYMENT_FAILED)
            await self.db.update_order(order_id, {
                "state": sm.state,
                "payment_error": str(e)
            })
            raise
    
    async def _create_merchant_order(
        self, 
        order_id: str, 
        order_data: Dict, 
        sm: OrderStateMachine
    ):
        """创建商家订单"""
        logger.info(f"[{order_id}] Creating merchant order")
        
        try:
            merchant_result = await self.merchant.create_order(
                merchant_id=order_data.get("merchant_id"),
                sku=order_data.get("sku"),
                quantity=order_data.get("quantity"),
                shipping_address=order_data.get("shipping_address")
            )
            
            sm.transition(OrderEvent.MERCHANT_CREATED)
            await self.db.update_order(order_id, {
                "state": sm.state,
                "merchant_order_id": merchant_result["order_id"]
            })
            await self.event_bus.publish("order.merchant_created", {
                "order_id": order_id,
                "merchant_order_id": merchant_result["order_id"]
            })
        
        except Exception as e:
            sm.transition(OrderEvent.MERCHANT_FAILED)
            await self.db.update_order(order_id, {
                "state": sm.state,
                "merchant_error": str(e)
            })
            # 触发补偿：释放支付授权
            await self._compensate_payment(order_id)
            raise
    
    async def _capture_payment(
        self, 
        order_id: str, 
        order_data: Dict, 
        sm: OrderStateMachine
    ):
        """捕获支付"""
        logger.info(f"[{order_id}] Capturing payment")
        
        # 获取授权信息
        payment_info = await self.db.get_payment(order_id)
        
        try:
            capture_result = await self.payment.capture(
                auth_id=payment_info["auth_id"],
                amount=order_data.get("amount")
            )
            
            sm.transition(OrderEvent.CAPTURED)
            await self.db.update_payment(order_id, {
                "capture_id": capture_result["capture_id"],
                "capture_status": "success"
            })
            await self.db.update_order(order_id, {"state": sm.state})
            await self.event_bus.publish("order.captured", {
                "order_id": order_id,
                "capture_id": capture_result["capture_id"]
            })
        
        except Exception as e:
            sm.transition(OrderEvent.CAPTURE_FAILED)
            await self.db.update_order(order_id, {
                "state": sm.state,
                "capture_error": str(e)
            })
            # 触发补偿：取消商家订单 + 退款
            await self._compensate_merchant_order(order_id)
            await self._refund_payment(order_id)
            raise
    
    async def _handle_failure(
        self, 
        order_id: str, 
        sm: OrderStateMachine, 
        error: str
    ):
        """处理订单失败"""
        logger.error(f"[{order_id}] Order failed: {error}")
        await self.db.update_order(order_id, {
            "state": OrderState.CANCELLED,
            "error_message": error
        })
        await self.event_bus.publish("order.failed", {
            "order_id": order_id,
            "error": error
        })
    
    async def _compensate_payment(self, order_id: str):
        """补偿：释放支付授权"""
        logger.info(f"[{order_id}] Compensating payment authorization")
        payment_info = await self.db.get_payment(order_id)
        await self.payment.cancel_authorization(payment_info["auth_id"])
    
    async def _compensate_merchant_order(self, order_id: str):
        """补偿：取消商家订单"""
        logger.info(f"[{order_id}] Compensating merchant order")
        order_info = await self.db.get_order(order_id)
        if order_info.get("merchant_order_id"):
            await self.merchant.cancel_order(
                order_info["merchant_id"],
                order_info["merchant_order_id"]
            )
    
    async def _refund_payment(self, order_id: str):
        """退款"""
        logger.info(f"[{order_id}] Refunding payment")
        payment_info = await self.db.get_payment(order_id)
        if payment_info.get("capture_id"):
            await self.payment.refund(
                capture_id=payment_info["capture_id"],
                amount=payment_info["amount"]
            )
```

---

### 4.3 内容生成服务 (Content Generator)

#### 4.3.1 LLM集成

```python
# services/llm_service.py
from typing import Dict, List, Optional
from openai import AsyncOpenAI
import anthropic
import logging

logger = logging.getLogger(__name__)

class LLMService:
    """LLM服务抽象层"""
    
    def __init__(self, provider: str = "openai"):
        self.provider = provider
        if provider == "openai":
            self.client = AsyncOpenAI()
        elif provider == "anthropic":
            self.client = anthropic.AsyncAnthropic()
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_tokens: int = 2000,
        temperature: float = 0.7,
        **kwargs
    ) -> str:
        """生成内容"""
        if self.provider == "openai":
            return await self._generate_openai(
                prompt, system_prompt, max_tokens, temperature, **kwargs
            )
        elif self.provider == "anthropic":
            return await self._generate_anthropic(
                prompt, system_prompt, max_tokens, temperature, **kwargs
            )
    
    async def _generate_openai(
        self,
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float,
        **kwargs
    ) -> str:
        """使用OpenAI生成"""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = await self.client.chat.completions.create(
            model=kwargs.get("model", "gpt-4"),
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return response.choices[0].message.content
    
    async def _generate_anthropic(
        self,
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float,
        **kwargs
    ) -> str:
        """使用Anthropic生成"""
        response = await self.client.messages.create(
            model=kwargs.get("model", "claude-3-opus-20240229"),
            system=system_prompt or "",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return response.content[0].text
```

#### 4.3.2 内容生成器

```python
# services/content_generator.py
from typing import Dict, List, Optional
from .llm_service import LLMService
from .graph_service import GraphService
import logging

logger = logging.getLogger(__name__)

class ContentGenerator:
    """内容生成器"""
    
    def __init__(self, llm_service: LLMService, graph_service: GraphService):
        self.llm = llm_service
        self.graph = graph_service
    
    async def generate_youtube_script(
        self,
        product_id: str,
        target_audience: str,
        length: str = "medium"
    ) -> Dict:
        """生成YouTube视频脚本"""
        # 1. 从知识图谱获取产品信息
        context = await self._get_product_context(product_id)
        
        # 2. 构建Prompt
        prompt = self._build_youtube_prompt(context, target_audience, length)
        
        # 3. 生成内容
        content = await self.llm.generate(
            prompt=prompt,
            system_prompt=self._get_system_prompt("youtube"),
            max_tokens=2000,
            temperature=0.7
        )
        
        # 4. 评分
        score = await self._score_content(content, "youtube")
        
        return {
            "content": content,
            "score": score,
            "metadata": {
                "product_id": product_id,
                "content_type": "youtube_script",
                "length": length
            }
        }
    
    async def generate_medium_article(
        self,
        product_id: str,
        topic: str,
        length: int = 2000
    ) -> Dict:
        """生成Medium文章"""
        context = await self._get_product_context(product_id)
        
        prompt = f"""
        Write a comprehensive Medium article about {topic} related to {context['product_name']}.
        
        Product Context:
        - Features: {', '.join(context['features'])}
        - Benefits: {', '.join(context['benefits'])}
        - Target Audience: {context['target_audience']}
        
        Requirements:
        - Length: approximately {length} words
        - Include relevant statistics and examples
        - Use engaging storytelling
        - Add actionable insights
        - Format with clear headers and sections
        """
        
        content = await self.llm.generate(
            prompt=prompt,
            system_prompt=self._get_system_prompt("medium"),
            max_tokens=3000
        )
        
        score = await self._score_content(content, "medium")
        
        return {
            "content": content,
            "score": score,
            "metadata": {
                "product_id": product_id,
                "content_type": "medium_article",
                "topic": topic
            }
        }
    
    async def _get_product_context(self, product_id: str) -> Dict:
        """从知识图谱获取产品上下文"""
        # 查询产品及其关系
        query = """
        MATCH (p:Product {id: $product_id})
        OPTIONAL MATCH (p)-[:HAS_FEATURE]->(f:Feature)
        OPTIONAL MATCH (p)-[:SOLVES]->(prob:Problem)
        OPTIONAL MATCH (p)-[:APPLIES_TO]->(s:Scenario)
        OPTIONAL MATCH (p)-[:TARGETS]->(u:UserGroup)
        RETURN p, 
               collect(DISTINCT f.name) as features,
               collect(DISTINCT prob.description) as problems,
               collect(DISTINCT s.name) as scenarios,
               collect(DISTINCT u.name) as user_groups
        """
        
        result = self.graph.execute_cypher(query, {"product_id": product_id})
        
        if not result:
            raise ValueError(f"Product {product_id} not found")
        
        data = result[0]
        return {
            "product_name": data["p"]["name"],
            "product_description": data["p"]["description"],
            "features": data["features"],
            "problems_solved": data["problems"],
            "scenarios": data["scenarios"],
            "target_audience": data["user_groups"]
        }
    
    def _build_youtube_prompt(
        self,
        context: Dict,
        target_audience: str,
        length: str
    ) -> str:
        """构建YouTube脚本Prompt"""
        length_map = {
            "short": "3-5 minutes",
            "medium": "8-10 minutes",
            "long": "15-20 minutes"
        }
        
        return f"""
        Create a YouTube video script for {context['product_name']}.
        
        Product Information:
        - Description: {context['product_description']}
        - Key Features: {', '.join(context['features'])}
        - Problems It Solves: {', '.join(context['problems_solved'])}
        - Best For: {', '.join(context['scenarios'])}
        
        Target Audience: {target_audience}
        Video Length: {length_map.get(length, '8-10 minutes')}
        
        Script Requirements:
        1. Start with a strong hook (first 10 seconds)
        2. Include clear sections: Introduction, Features, Benefits, Use Cases, Conclusion
        3. Add call-to-action
        4. Include suggested B-roll descriptions
        5. Natural, conversational tone
        6. Include timestamps
        
        Format the script with clear markers for:
        [INTRO], [FEATURE 1], [BENEFIT], [USE CASE], [CTA], [OUTRO]
        """
    
    def _get_system_prompt(self, content_type: str) -> str:
        """获取系统Prompt"""
        prompts = {
            "youtube": """You are an expert YouTube content creator specializing in product reviews and tutorials.
            Create engaging, informative scripts that keep viewers watching.
            Use a friendly, authentic tone. Include specific examples and real-world use cases.""",
            
            "medium": """You are a professional content writer for Medium.
            Create in-depth, thoughtful articles that provide genuine value.
            Use clear structure, engaging narratives, and actionable insights.
            Write in a sophisticated yet accessible style.""",
            
            "quora": """You are a helpful expert answering questions on Quora.
            Provide comprehensive, well-researched answers.
            Be authentic, cite sources when relevant, and give practical advice."""
        }
        return prompts.get(content_type, "")
    
    async def _score_content(self, content: str, content_type: str) -> Dict:
        """评分内容质量"""
        # 这里可以实现更复杂的评分逻辑
        scores = {
            "relevance": await self._score_relevance(content),
            "readability": self._score_readability(content),
            "seo": await self._score_seo(content),
            "originality": await self._score_originality(content)
        }
        
        overall = sum(scores.values()) / len(scores)
        
        return {
            "overall": overall,
            "details": scores
        }
    
    async def _score_relevance(self, content: str) -> float:
        """评分相关性"""
        # 使用LLM或其他方法评估内容相关性
        return 0.85  # 示例值
    
    def _score_readability(self, content: str) -> float:
        """评分可读性（Flesch分数）"""
        # 实现Flesch可读性分数计算
        import textstat
        score = textstat.flesch_reading_ease(content)
        return min(score / 100, 1.0)
    
    async def _score_seo(self, content: str) -> float:
        """评分SEO友好度"""
        # 检查关键词密度、标题结构等
        return 0.78  # 示例值
    
    async def _score_originality(self, content: str) -> float:
        """评分原创性"""
        # 可以集成抄袭检测API
        return 0.95  # 示例值
```

---

## 5. API接口规范

### 5.1 RESTful API设计原则

**遵循规范**
- HTTP方法语义：GET(查询)、POST(创建)、PUT(更新)、DELETE(删除)
- 资源命名：使用复数名词，如 `/api/v1/products`
- 版本控制：URL版本 `/api/v1/...`
- 状态码：正确使用HTTP状态码

**标准响应格式**

```python
# schemas/responses.py
from pydantic import BaseModel
from typing import Optional, Any, Dict

class APIResponse(BaseModel):
    """标准API响应"""
    success: bool
    message: str
    data: Optional[Any] = None
    errors: Optional[Dict] = None
    meta: Optional[Dict] = None

class PaginatedResponse(APIResponse):
    """分页响应"""
    data: list
    meta: Dict  # {page, per_page, total, pages}
```

### 5.2 核心API端点

#### 知识图谱API

```python
# 实体相关
POST   /api/v1/graph/entities              # 创建实体
GET    /api/v1/graph/entities/{id}         # 获取实体
PUT    /api/v1/graph/entities/{id}         # 更新实体
DELETE /api/v1/graph/entities/{id}         # 删除实体
GET    /api/v1/graph/entities               # 列出实体

# 关系相关
POST   /api/v1/graph/relationships         # 创建关系
GET    /api/v1/graph/relationships/{id}    # 获取关系
DELETE /api/v1/graph/relationships/{id}    # 删除关系

# 查询相关
POST   /api/v1/graph/query                 # 执行Cypher查询
GET    /api/v1/graph/search                # 搜索实体
```

#### 内容API

```python
# 内容生成
POST   /api/v1/content/generate            # 生成内容
GET    /api/v1/content/{id}                # 获取内容
PUT    /api/v1/content/{id}                # 更新内容
DELETE /api/v1/content/{id}                # 删除内容
GET    /api/v1/content                     # 列出内容

# 内容评分
POST   /api/v1/content/{id}/score          # 评分内容
GET    /api/v1/content/{id}/score          # 获取评分

# 内容审核
POST   /api/v1/content/{id}/review         # 提交审核
PUT    /api/v1/content/{id}/review         # 审核决策

# 内容分发
POST   /api/v1/content/{id}/publish        # 发布内容
DELETE /api/v1/content/{id}/publish        # 下架内容
```

#### ACP商务API

```python
# 订单相关
POST   /acp/v1/orders.create               # 创建订单
GET    /acp/v1/orders.status               # 查询订单状态
POST   /acp/v1/orders.cancel               # 取消订单

# Offer相关
GET    /api/v1/offers                      # 查询Offer
POST   /api/v1/offers                      # 创建Offer
PUT    /api/v1/offers/{id}                 # 更新Offer
DELETE /api/v1/offers/{id}                 # 删除Offer
```

### 5.3 API文档生成

使用FastAPI自动生成OpenAPI文档：

```python
# main.py
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="Leap ACP API",
    description="Leap Agentic Commerce Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Leap ACP API",
        version="1.0.0",
        description="Complete API documentation",
        routes=app.routes,
    )
    
    # 添加自定义信息
    openapi_schema["info"]["contact"] = {
        "name": "API Support",
        "email": "api@leapacp.com"
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

访问文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 6. 数据库设计

### 6.1 PostgreSQL Schema

```sql
-- 租户表
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 品牌表
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    brand_id VARCHAR(32) UNIQUE NOT NULL,
    tenant_id VARCHAR(32) NOT NULL REFERENCES tenants(tenant_id),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_tenant (tenant_id)
);

-- 订单表
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(64) UNIQUE NOT NULL,
    acp_order_id VARCHAR(64) UNIQUE,
    tenant_id VARCHAR(32) NOT NULL,
    brand_id VARCHAR(32) NOT NULL,
    user_hash VARCHAR(64) NOT NULL,
    merchant_id VARCHAR(32) NOT NULL,
    offer_id VARCHAR(64) NOT NULL,
    sku VARCHAR(128) NOT NULL,
    quantity INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    state VARCHAR(32) NOT NULL,
    acp_client VARCHAR(64),
    risk_score DECIMAL(5,2),
    merchant_order_id VARCHAR(128),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_tenant_brand (tenant_id, brand_id),
    INDEX idx_user_hash (user_hash),
    INDEX idx_state (state),
    INDEX idx_created_at (created_at),
    INDEX idx_merchant_order (merchant_order_id)
);

-- 支付表
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    payment_id VARCHAR(64) UNIQUE NOT NULL,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    provider VARCHAR(32) NOT NULL,
    payment_method VARCHAR(32),
    token_ref VARCHAR(128),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    auth_id VARCHAR(64),
    auth_status VARCHAR(32),
    auth_at TIMESTAMP,
    capture_id VARCHAR(64),
    capture_status VARCHAR(32),
    captured_at TIMESTAMP,
    refund_id VARCHAR(64),
    refund_status VARCHAR(32),
    refunded_at TIMESTAMP,
    risk_score DECIMAL(5,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_order (order_id),
    INDEX idx_auth_id (auth_id),
    INDEX idx_capture_id (capture_id)
);

-- 履约表
CREATE TABLE fulfillments (
    id BIGSERIAL PRIMARY KEY,
    fulfillment_id VARCHAR(64) UNIQUE NOT NULL,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    carrier VARCHAR(64),
    tracking_no VARCHAR(128),
    ship_to JSONB NOT NULL,
    status VARCHAR(32) NOT NULL,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_order (order_id),
    INDEX idx_status (status),
    INDEX idx_tracking (tracking_no)
);

-- 同意审计表
CREATE TABLE consent_audit (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    user_hash VARCHAR(64) NOT NULL,
    step VARCHAR(64) NOT NULL,
    fields_shared TEXT[] NOT NULL,
    acp_request_id VARCHAR(64) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    consent_given BOOLEAN NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_hash (user_hash),
    INDEX idx_acp_request (acp_request_id),
    INDEX idx_timestamp (timestamp)
);

-- 内容表
CREATE TABLE contents (
    id BIGSERIAL PRIMARY KEY,
    content_id VARCHAR(64) UNIQUE NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    brand_id VARCHAR(32) NOT NULL,
    content_type VARCHAR(32) NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    score JSONB DEFAULT '{}',
    status VARCHAR(32) NOT NULL,
    reviewed_by VARCHAR(64),
    reviewed_at TIMESTAMP,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_tenant_brand (tenant_id, brand_id),
    INDEX idx_type (content_type),
    INDEX idx_status (status)
);

-- 内容分发记录表
CREATE TABLE content_distributions (
    id BIGSERIAL PRIMARY KEY,
    distribution_id VARCHAR(64) UNIQUE NOT NULL,
    content_id VARCHAR(64) NOT NULL REFERENCES contents(content_id),
    platform VARCHAR(32) NOT NULL,
    platform_id VARCHAR(128),
    platform_url TEXT,
    status VARCHAR(32) NOT NULL,
    error_message TEXT,
    distributed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_content (content_id),
    INDEX idx_platform (platform),
    INDEX idx_status (status)
);

-- 性能指标表
CREATE TABLE content_metrics (
    id BIGSERIAL PRIMARY KEY,
    content_id VARCHAR(64) NOT NULL REFERENCES contents(content_id),
    platform VARCHAR(32) NOT NULL,
    date DATE NOT NULL,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    engagements BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(content_id, platform, date),
    INDEX idx_content (content_id),
    INDEX idx_date (date)
);
```

### 6.2 Neo4j Schema约束

```cypher
-- 创建唯一性约束
CREATE CONSTRAINT product_id IF NOT EXISTS
FOR (p:Product) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT feature_id IF NOT EXISTS
FOR (f:Feature) REQUIRE f.id IS UNIQUE;

CREATE CONSTRAINT offer_id IF NOT EXISTS
FOR (o:Offer) REQUIRE o.offer_id IS UNIQUE;

-- 创建索引
CREATE INDEX product_sku IF NOT EXISTS
FOR (p:Product) ON (p.sku);

CREATE INDEX product_category IF NOT EXISTS
FOR (p:Product) ON (p.category);

CREATE INDEX offer_region IF NOT EXISTS
FOR (o:Offer) ON (o.region);

-- 创建全文索引
CREATE FULLTEXT INDEX product_search IF NOT EXISTS
FOR (p:Product) ON EACH [p.name, p.description];
```

### 6.3 数据迁移 (Alembic)

```python
# alembic/versions/001_initial.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    """创建初始表结构"""
    op.create_table(
        'tenants',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(32), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('settings', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('NOW()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tenant_id')
    )
    
    # 创建其他表...

def downgrade():
    """回滚"""
    op.drop_table('tenants')
    # 删除其他表...
```

运行迁移：

```bash
# 生成新迁移
alembic revision --autogenerate -m "Add new table"

# 执行迁移
alembic upgrade head

# 回滚
alembic downgrade -1
```

---

## 7. 前端开发指南

### 7.1 项目结构

```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ui/             # UI基础组件(shadcn/ui)
│   │   ├── layout/         # 布局组件
│   │   ├── forms/          # 表单组件
│   │   └── charts/         # 图表组件
│   ├── pages/              # 页面组件
│   │   ├── Dashboard/
│   │   ├── Content/
│   │   ├── Orders/
│   │   └── Analytics/
│   ├── hooks/              # 自定义Hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useWebSocket.ts
│   ├── services/           # API服务
│   │   ├── api.ts          # API客户端
│   │   ├── auth.ts
│   │   ├── content.ts
│   │   └── orders.ts
│   ├── store/              # 状态管理(Zustand)
│   │   ├── authStore.ts
│   │   ├── contentStore.ts
│   │   └── orderStore.ts
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript类型
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

### 7.2 API客户端封装

```typescript
// services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          // Token过期，刷新或重定向到登录
          await this.refreshToken();
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken() {
    // 实现Token刷新逻辑
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new APIClient(import.meta.env.VITE_API_BASE_URL);
```

### 7.3 状态管理 (Zustand)

```typescript
// store/contentStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Content {
  id: string;
  title: string;
  body: string;
  type: string;
  status: string;
  score: {
    overall: number;
    details: Record<string, number>;
  };
}

interface ContentState {
  contents: Content[];
  selectedContent: Content | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchContents: () => Promise<void>;
  createContent: (data: Partial<Content>) => Promise<void>;
  updateContent: (id: string, data: Partial<Content>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  setSelectedContent: (content: Content | null) => void;
}

export const useContentStore = create<ContentState>()(
  devtools(
    persist(
      (set, get) => ({
        contents: [],
        selectedContent: null,
        isLoading: false,
        error: null,

        fetchContents: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.get<{ data: Content[] }>('/api/v1/content');
            set({ contents: response.data, isLoading: false });
          } catch (error) {
            set({ error: error.message, isLoading: false });
          }
        },

        createContent: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.post<{ data: Content }>('/api/v1/content', data);
            set((state) => ({
              contents: [...state.contents, response.data],
              isLoading: false,
            }));
          } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
          }
        },

        updateContent: async (id, data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.put<{ data: Content }>(`/api/v1/content/${id}`, data);
            set((state) => ({
              contents: state.contents.map((c) =>
                c.id === id ? response.data : c
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
          }
        },

        deleteContent: async (id) => {
          set({ isLoading: true, error: null });
          try {
            await apiClient.delete(`/api/v1/content/${id}`);
            set((state) => ({
              contents: state.contents.filter((c) => c.id !== id),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
          }
        },

        setSelectedContent: (content) => {
          set({ selectedContent: content });
        },
      }),
      {
        name: 'content-storage',
        partialize: (state) => ({ contents: state.contents }),
      }
    )
  )
);
```

### 7.4 组件示例

```typescript
// pages/Content/ContentList.tsx
import React, { useEffect } from 'react';
import { useContentStore } from '@/store/contentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ContentList: React.FC = () => {
  const { contents, isLoading, error, fetchContents, setSelectedContent } = useContentStore();

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">内容列表</h1>
        <Button onClick={() => setSelectedContent(null)}>创建内容</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((content) => (
          <Card key={content.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="truncate">{content.title}</span>
                <Badge variant={getStatusVariant(content.status)}>
                  {content.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                {content.body.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{content.type}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">
                    评分: {content.score.overall.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

function getStatusVariant(status: string) {
  const variants = {
    draft: 'secondary',
    pending: 'warning',
    approved: 'success',
    rejected: 'destructive',
    published: 'default',
  };
  return variants[status] || 'default';
}
```

---

## 8. 测试指南

### 8.1 单元测试 (Pytest)

```python
# tests/services/test_graph_service.py
import pytest
from services.graph_service import GraphService
from unittest.mock import Mock, patch

@pytest.fixture
def graph_service():
    """创建GraphService实例"""
    return GraphService(
        uri="bolt://localhost:7687",
        user="neo4j",
        password="test"
    )

@pytest.fixture
def mock_driver():
    """Mock Neo4j driver"""
    with patch('neo4j.GraphDatabase.driver') as mock:
        yield mock

def test_create_entity(graph_service, mock_driver):
    """测试创建实体"""
    # Arrange
    entity_type = "Product"
    properties = {
        "id": "prod_123",
        "name": "Test Product",
        "sku": "SKU-123"
    }
    
    # Mock session and transaction
    mock_session = Mock()
    mock_tx = Mock()
    mock_result = Mock()
    mock_result.single.return_value = {"id": "prod_123"}
    
    mock_tx.run.return_value = mock_result
    mock_session.execute_write.return_value = "prod_123"
    mock_driver.return_value.session.return_value.__enter__.return_value = mock_session
    
    # Act
    entity_id = graph_service.create_entity(entity_type, properties)
    
    # Assert
    assert entity_id == "prod_123"
    mock_session.execute_write.assert_called_once()

def test_create_relationship(graph_service, mock_driver):
    """测试创建关系"""
    # Arrange
    from_id = "prod_123"
    to_id = "feat_456"
    rel_type = "HAS_FEATURE"
    properties = {"confidence": 0.95}
    
    # Mock
    mock_session = Mock()
    mock_session.execute_write.return_value = True
    mock_driver.return_value.session.return_value.__enter__.return_value = mock_session
    
    # Act
    result = graph_service.create_relationship(from_id, to_id, rel_type, properties)
    
    # Assert
    assert result is True
    mock_session.execute_write.assert_called_once()

def test_query_entity_not_found(graph_service, mock_driver):
    """测试查询不存在的实体"""
    # Arrange
    entity_id = "nonexistent"
    
    # Mock
    mock_session = Mock()
    mock_session.execute_read.return_value = None
    mock_driver.return_value.session.return_value.__enter__.return_value = mock_session
    
    # Act
    result = graph_service.query_entity(entity_id)
    
    # Assert
    assert result is None
```

### 8.2 集成测试

```python
# tests/integration/test_order_flow.py
import pytest
import asyncio
from services.order_orchestrator import OrderOrchestrator, OrderState

@pytest.mark.asyncio
async def test_complete_order_flow(
    db_service,
    risk_service,
    offer_service,
    payment_service,
    merchant_service,
    event_bus
):
    """测试完整订单流程"""
    # Arrange
    orchestrator = OrderOrchestrator(
        db_service, risk_service, offer_service,
        payment_service, merchant_service, event_bus
    )
    
    order_data = {
        "user_hash": "user_abc123",
        "offer_id": "offer_xyz",
        "sku": "MAT-COOL-QUEEN",
        "quantity": 1,
        "amount": 299.99,
        "currency": "USD",
        "merchant_id": "merch_sweetnight",
        "region": "US",
        "shipping_address": {
            "name": "John Doe",
            "line1": "123 Main St",
            "city": "San Francisco",
            "state": "CA",
            "postal_code": "94102",
            "country": "US"
        },
        "payment_token": "tok_visa_test"
    }
    
    # Act
    result = await orchestrator.create_order(order_data)
    
    # Assert
    assert result["order_id"] is not None
    assert result["state"] in [OrderState.FULFILLING, OrderState.CAPTURE]
    
    # 验证数据库状态
    order = await db_service.get_order(result["order_id"])
    assert order["state"] != OrderState.CANCELLED
    
    # 验证支付记录
    payment = await db_service.get_payment(result["order_id"])
    assert payment["auth_status"] == "success"

@pytest.mark.asyncio
async def test_order_failure_compensation(orchestrator, order_data):
    """测试订单失败补偿"""
    # 模拟商家下单失败
    with patch.object(orchestrator.merchant, 'create_order', side_effect=Exception("Merchant error")):
        # Act & Assert
        with pytest.raises(Exception):
            await orchestrator.create_order(order_data)
        
        # 验证补偿操作
        # 支付授权应该被释放
        # 订单状态应该是CANCELLED
```

### 8.3 前端测试 (Vitest + React Testing Library)

```typescript
// tests/components/ContentList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContentList } from '@/pages/Content/ContentList';
import { useContentStore } from '@/store/contentStore';

// Mock store
jest.mock('@/store/contentStore');

describe('ContentList', () => {
  const mockContents = [
    {
      id: '1',
      title: 'Test Content 1',
      body: 'Test body 1',
      type: 'youtube',
      status: 'draft',
      score: { overall: 85, details: {} },
    },
    {
      id: '2',
      title: 'Test Content 2',
      body: 'Test body 2',
      type: 'medium',
      status: 'published',
      score: { overall: 92, details: {} },
    },
  ];

  beforeEach(() => {
    (useContentStore as jest.Mock).mockReturnValue({
      contents: mockContents,
      isLoading: false,
      error: null,
      fetchContents: jest.fn(),
      setSelectedContent: jest.fn(),
    });
  });

  it('renders content list', async () => {
    render(<ContentList />);

    await waitFor(() => {
      expect(screen.getByText('Test Content 1')).toBeInTheDocument();
      expect(screen.getByText('Test Content 2')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    (useContentStore as jest.Mock).mockReturnValue({
      contents: [],
      isLoading: true,
      error: null,
      fetchContents: jest.fn(),
      setSelectedContent: jest.fn(),
    });

    render(<ContentList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    const errorMessage = 'Failed to fetch contents';
    (useContentStore as jest.Mock).mockReturnValue({
      contents: [],
      isLoading: false,
      error: errorMessage,
      fetchContents: jest.fn(),
      setSelectedContent: jest.fn(),
    });

    render(<ContentList />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('calls setSelectedContent when create button is clicked', async () => {
    const mockSetSelectedContent = jest.fn();
    (useContentStore as jest.Mock).mockReturnValue({
      contents: mockContents,
      isLoading: false,
      error: null,
      fetchContents: jest.fn(),
      setSelectedContent: mockSetSelectedContent,
    });

    render(<ContentList />);
    
    const createButton = screen.getByText('创建内容');
    await userEvent.click(createButton);

    expect(mockSetSelectedContent).toHaveBeenCalledWith(null);
  });
});
```

### 8.4 E2E测试 (Playwright)

```typescript
// e2e/order-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Order Flow', () => {
  test('complete order from ChatGPT', async ({ page }) => {
    // 1. 访问ACP Gateway
    await page.goto('http://localhost:8000/acp/v1/orders.create');

    // 2. 模拟ACP请求
    const response = await page.request.post('/acp/v1/orders.create', {
      data: {
        client_id: 'chatgpt',
        request_id: 'req_test_123',
        items: [
          {
            offer_id: 'offer_xyz',
            quantity: 1,
          },
        ],
        shipping_address: {
          name: 'Test User',
          line1: '123 Test St',
          city: 'Test City',
          state: 'CA',
          postal_code: '12345',
          country: 'US',
        },
        payment_token: 'tok_test',
        consent: {
          data_sharing: true,
          terms_accepted: true,
        },
      },
    });

    // 3. 验证响应
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.order_id).toBeDefined();
    expect(data.status).toBe('processing');

    // 4. 轮询订单状态直到完成
    const orderId = data.order_id;
    let orderStatus = 'processing';
    let retries = 0;
    const maxRetries = 30;

    while (orderStatus === 'processing' && retries < maxRetries) {
      await page.waitForTimeout(2000);
      const statusResponse = await page.request.get(`/acp/v1/orders.status?order_id=${orderId}`);
      const statusData = await statusResponse.json();
      orderStatus = statusData.status;
      retries++;
    }

    // 5. 验证最终状态
    expect(orderStatus).toMatch(/shipped|delivered/);
  });

  test('order cancellation flow', async ({ page }) => {
    // 测试取消订单流程
    // ...
  });
});
```

---

## 9. 部署运维

### 9.1 Docker构建

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建非root用户
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 9.2 Kubernetes部署

```yaml
# k8s/api-gateway-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: leap-acp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: leap-acp/api-gateway:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: NEO4J_URI
          valueFrom:
            secretKeyRef:
              name: neo4j-secret
              key: uri
        - name: POSTGRES_HOST
          valueFrom:
            configMapKeyRef:
              name: database-config
              key: postgres_host
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
  namespace: leap-acp
spec:
  selector:
    app: api-gateway
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

### 9.3 监控配置

```yaml
# monitoring/prometheus-config.yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway-service:8000']
    metrics_path: '/metrics'

  - job_name: 'order-orchestrator'
    static_configs:
      - targets: ['order-orchestrator-service:8000']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'neo4j'
    static_configs:
      - targets: ['neo4j:2004']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### 9.4 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Run tests
        run: |
          cd backend
          pytest tests/ --cov=. --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.DOCKER_REGISTRY }}/api-gateway:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/api-gateway \
            api-gateway=${{ secrets.DOCKER_REGISTRY }}/api-gateway:${{ github.sha }} \
            -n leap-acp
          
          kubectl rollout status deployment/api-gateway -n leap-acp
```

---

## 10. 开发规范

### 10.1 代码规范

**Python (PEP 8)**
- 使用4空格缩进
- 每行最多120字符
- 函数/方法使用蛇形命名：`get_user_info()`
- 类使用驼峰命名：`UserService`
- 常量使用大写：`MAX_RETRY_COUNT`

**TypeScript/JavaScript**
- 使用2空格缩进
- 使用单引号
- 函数使用驼峰命名：`getUserInfo()`
- 接口使用大写I前缀：`IUserData`
- 类型使用大写T前缀：`TUserRole`

### 10.2 Git工作流

**分支策略**
- `main`: 生产环境
- `develop`: 开发环境
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复
- `release/*`: 发布分支

**提交规范 (Conventional Commits)**
```
feat: 添加内容生成API
fix: 修复订单状态机bug
docs: 更新API文档
style: 格式化代码
refactor: 重构图谱服务
test: 添加单元测试
chore: 更新依赖
```

### 10.3 Code Review清单

- [ ] 代码符合规范
- [ ] 有充分的单元测试
- [ ] 有适当的注释和文档
- [ ] 没有硬编码的配置
- [ ] 错误处理完善
- [ ] 日志记录合理
- [ ] 性能无明显问题
- [ ] 安全漏洞检查

---

## 附录

### A. VS Code推荐插件

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "neo4j.neo4j-vscode-extension",
    "ms-azuretools.vscode-docker",
    "GitHub.copilot",
    "eamodio.gitlens"
  ]
}
```

### B. 常用命令

```bash
# 后端开发
make dev          # 启动开发服务器
make test         # 运行测试
make lint         # 代码检查
make format       # 代码格式化
make migrate      # 数据库迁移

# 前端开发
npm run dev       # 启动开发服务器
npm run build     # 构建生产版本
npm run test      # 运行测试
npm run lint      # 代码检查

# Docker
docker-compose up -d              # 启动所有服务
docker-compose logs -f service    # 查看服务日志
docker-compose down               # 停止所有服务

# Kubernetes
kubectl get pods -n leap-acp      # 查看Pod
kubectl logs -f pod-name          # 查看日志
kubectl describe pod pod-name     # 查看详情
```

### C. 故障排查

**常见问题**

1. **数据库连接失败**
   - 检查数据库是否启动
   - 验证连接字符串
   - 检查防火墙规则

2. **Neo4j查询慢**
   - 检查是否有适当的索引
   - 优化Cypher查询
   - 增加内存配置

3. **Kafka消息丢失**
   - 检查acks配置
   - 验证消费者offset
   - 检查网络连接

---

**文档版本**：v1.0  
**最后更新**：2025-10-09  
**维护者**：Leap ACP Dev Team  
**联系方式**：dev@leapacp.com