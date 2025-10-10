# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 全局能力集成

本项目已集成全局自动化开发能力，可使用以下工具加速开发：

### Context Engineering (已启用)
- `/generate-prp [INITIAL.md]` - 从需求文档生成完整的Product Requirements Prompt
- `/execute-prp [PRP-file]` - 自动化执行PRP进行端到端实现
- 📁 命令位置: `.claude/commands/generate-prp.md`, `execute-prp.md`
- 📖 参考: `/Users/cavin/Context-Engineering-Intro`

### BMAD 方法 (可用)
**核心角色命令**:
- `/analyst` - 市场研究和需求分析
- `/architect` - 系统架构设计
- `/pm` - 项目管理规划
- `/dev` - 开发实现
- `/qa` - 质量保证测试

**SuperClaude命令** (17个可用):
- `/sc:implement` - 功能实现（带MCP集成）
- `/sc:test` - 测试执行与报告
- `/sc:analyze` - 代码质量分析
- `/sc:design` - 架构设计
- `/sc:git` - Git操作（智能提交）
- `/sc:workflow` - 从PRD生成实现工作流
- 等17个命令 (详见全局CLAUDE.md)

### MCP 服务器能力 (全局可用)
**数据层** (所有数据库已通过Docker运行):
- PostgreSQL (localhost:5437) - 关系型数据库
- MongoDB (localhost:27018) - 文档型数据库
- Neo4j (localhost:7688/7475) - 图数据库 ⭐ **本项目核心依赖**
- Redis (localhost:6382) - 缓存/KV存储

**AI & 问题解决**:
- Sequential Thinking - 结构化问题分解
- Memory - 知识图谱持久化记忆

**Web & 自动化**:
- Puppeteer - 浏览器自动化
- Firecrawl (localhost:3002) - 自托管数据爬取

**协作 & 文档**:
- Notion - 知识库管理
- Slack - 团队协作
- Feishu (飞书) - 文档编辑与图表生成

**版本控制 & DevOps**:
- GitHub - 代码仓库操作
- GitLab - CI/CD集成

### 自动化开发策略
选择适合任务的策略：

**方案一: Context Engineering驱动** (已使用) ⭐
```bash
# 1. 定义需求 → 创建INITIAL.md
# 2. 生成执行计划 → /generate-prp INITIAL.md
# 3. 自动化实现 → /execute-prp PRPs/feature-name.md
```
适合：需求明确、模式化的功能开发

**方案二: BMAD敏捷开发流**
```bash
/analyst --research "需求"
/architect --design "架构"
/pm --create-prd "功能"
/dev --implement "story"
/qa --test "feature"
```
适合：复杂业务系统、多角色协作

**方案三: SuperClaude快速开发**
```bash
/sc:workflow PRD.md              # 生成工作流
/sc:implement --feature "..."    # 实现功能
/sc:test --coverage              # 测试
/sc:git --commit                 # 提交
```
适合：日常开发任务、快速迭代

**方案四: 混合编排** (推荐大型项目)
```bash
/bmad-orchestrator --workflow "full-stack-development"
# 自动协调BMAD角色 + Context Engineering + MCP工具
```

### 环境配置
**全局配置文件**:
- MCP配置: `~/.mcp.json` (20+服务器)
- 环境变量: `~/.mcp.env` (所有凭证，600权限保护)
- 环境加载: `~/.mcp-load-env.sh`

**项目本地配置** (优先级更高):
- `.mcp.json` (如需项目特定MCP服务器)
- `.env` (项目环境变量)

### 📋 CI/CD 自动化流程

**状态文件体系**:
- `AUTOMATION_PLAN.md` - 开发执行方案，实时更新任务进度
- `PROJECT_STATUS.md` - 项目整体状态，展示完成情况
- `COMPLETION_REPORT.md` - 里程碑完成报告
- `CICD_AUTOMATION.md` - CI/CD自动化流程文档 ⭐ **详细指南**

**自动化原则**:
每次完成任务后，自动同步进展到所有状态文件，确保：
1. ✅ TodoWrite工具跟踪当前任务
2. ✅ AUTOMATION_PLAN.md实时更新进度
3. ✅ PROJECT_STATUS.md同步状态表格
4. ✅ 代码行数自动统计（`wc -l`）
5. ✅ 时间戳自动更新

**快速检查清单** (每次任务完成后):
- [ ] TodoWrite标记completed
- [ ] AUTOMATION_PLAN.md更新"已完成"
- [ ] PROJECT_STATUS.md表格更新✅
- [ ] 代码行数记录
- [ ] 时间戳更新

**详细指南**: 参见 `CICD_AUTOMATION.md` 📖

---

## 项目概述

**Leap Agentic Commerce Platform (ACP)** 是一个集成**生成引擎优化（GEO）**和**代理商务（ACP）**的一体化平台,旨在让品牌在AI时代不仅"被看见",更能"被购买"。

**核心定位**:
- GEO侧: 通过知识图谱+多模态内容生成提升AI Citation率
- Commerce侧: 通过ACP协议实现AI对话中的即时结账能力
- 多租户: 支持多品牌、多项目的统一运营与数据隔离

**目标用户**: 跨境DTC品牌、电商卖家、品牌出海企业

## 项目现状

⚠️ **当前状态**: 早期原型阶段
- 仅包含文档规范和前端UI原型(React组件)
- **尚未实现**后端服务、数据库、API等核心功能
- 主要文件:
  - `leap_acp_prd.md` - 产品需求文档
  - `leap_acp_dev_guide.md` - 开发指南
  - `leap-acp-portal.tsx` - 前端UI原型(单文件组件)

## 架构概览

### 整体分层
```
接入层: API Gateway / ACP Gateway / CDN
  ↓
应用层: GEO Services / Commerce Services
  ↓
数据层: Neo4j / PostgreSQL / Redis / S3
  ↓
基础设施: K8s / Kafka / Monitoring / Logging
```

### 核心技术栈(规划)

| 层次 | 技术选型 |
|------|---------|
| 后端框架 | FastAPI (Python 3.11+) |
| 异步任务 | Celery 5.3+ + Redis |
| 图数据库 | Neo4j 5.x |
| 关系数据库 | PostgreSQL 15+ |
| 缓存 | Redis 7.x |
| 消息队列 | Kafka 3.x / RabbitMQ |
| 对象存储 | S3 / MinIO |
| 前端框架 | React 18+ + TypeScript 5+ |
| UI组件库 | Tailwind CSS 3+ + shadcn/ui |
| 容器编排 | Kubernetes |
| 监控追踪 | Prometheus + Grafana + OpenTelemetry |
| 日志 | ELK Stack / Loki |
| CI/CD | GitHub Actions |

## 核心服务划分

### GEO侧服务
- `data-collector-service` - 多平台数据采集(YouTube/Reddit/Quora/Medium等)
- `faq-clustering-service` - FAQ意图聚类与热点识别
- `knowledge-graph-service` - Neo4j知识图谱管理(产品/特性/场景/问题/用户群/竞品/Offer)
- `content-generator-service` - 基于LLM的多模态内容生成(视频脚本/长文/问答/对比/FAQ)
- `content-scoring-service` - 内容质量评分(相关性/可读性/SEO/原创性)
- `distribution-service` - 多平台内容自动分发
- `analytics-service` - 效果监测与归因分析

### Commerce侧服务
- `commerce-gateway` - ACP协议网关(验签/幂等/重放防护/速率限制)
- `order-orchestrator` - 订单编排SAGA状态机(风控→校验→授权→商家下单→捕获→履约)
- `payment-adapter` - 支付聚合层(Stripe共享支付令牌/Delegated Payments)
- `offer-catalog-service` - 基于知识图谱生成可售Offer视图
- `merchant-adapter-service` - 商家适配(Shopify/Etsy/自建OMS)
- `fulfillment-service` - 履约物流管理
- `consent-service` - 用户同意管理与数据最小化

### 共享服务
- `auth-service` - 认证授权(OIDC单点登录/2FA)
- `tenant-service` - 多租户管理与RBAC
- `notification-service` - 通知服务
- `audit-service` - 审计日志

## 关键数据模型

### 知识图谱Schema (Neo4j)

**节点类型**:
```cypher
(:Product {id, name, sku, category, brand, description})
(:Feature {id, name, type, value, description})
(:Scenario {id, name, description, tags[]})
(:Problem {id, description, severity, frequency})
(:UserGroup {id, name, demographics{}, behavior{}})
(:Competitor {id, brand, product, price_range})
(:Offer {offer_id, sku, merchant_id, price, currency, availability,
         stock_level, valid_from, valid_until, region})
(:Merchant {merchant_id, name, platform, mor, commission_rate})
(:Content {content_id, type, platform, url, status, score})
```

**关系类型**:
```cypher
-[:HAS_FEATURE {confidence}]->
-[:SOLVES {effectiveness}]->
-[:APPLIES_TO {relevance}]->
-[:TARGETS {priority}]->
-[:COMPARES_WITH {comparison_type}]->
-[:HAS_OFFER]->
-[:SOLD_BY]->
-[:GENERATED_FROM]->
```

### 交易数据模型 (PostgreSQL)

**核心表**:
- `tenants` - 租户表(tenant_id, name, settings)
- `brands` - 品牌表(brand_id, tenant_id, name, logo_url)
- `orders` - 订单表(acp_order_id, user_hash, merchant_id, offer_id, quantity, amount, state)
- `payments` - 支付表(order_id, provider, auth_id, capture_id, risk_score)
- `fulfillments` - 履约表(order_id, carrier, tracking_no, ship_to, status)
- `consent_audit` - 同意审计表(user_hash, step, fields_shared[], acp_request_id)
- `contents` - 内容表(content_id, type, title, body, score, status)
- `content_distributions` - 内容分发记录表
- `content_metrics` - 性能指标表(impressions, clicks, conversions)

## 核心业务流程

### 订单状态机(SAGA)
```
CREATED → RISK_CHECK → VALIDATE_OFFER →
PAYMENT_AUTHORIZE → MERCHANT_ORDER → CAPTURE →
FULFILLING → CLOSED/REFUNDED/CANCELLED
```

**补偿事务**:
- 商家下单失败 → 释放支付授权
- 支付捕获失败 → 取消商家订单 + 退款
- 风控失败/Offer失效 → 订单取消

### 从"问题"到"下单"的完整链路
1. **发现**: 用户在ChatGPT询问产品相关问题
2. **推荐**: AI基于知识图谱产出推荐,展示可购Offer + Buy按钮
3. **同意与校验**: ACP网关验证请求,记录用户同意,二次校验价格/库存/区域
4. **支付授权**: 使用共享支付令牌仅授权指定金额+商家
5. **商家下单**: 调用Shopify/Etsy等平台创建订单
6. **支付捕获**: 按策略捕获(即时/发货后)
7. **履约通知**: 同步状态,追踪物流,异常补偿
8. **归因闭环**: 串联Citation→Offer→Order转化路径

## API接口规范

### RESTful设计原则
- 版本控制: `/api/v1/...` 或 `/acp/v1/...`
- 资源命名: 使用复数名词
- HTTP方法: GET(查询), POST(创建), PUT(更新), DELETE(删除)
- 标准响应格式:
```python
{
  "success": bool,
  "message": str,
  "data": Any,
  "errors": Dict,
  "meta": Dict  # {page, per_page, total} for pagination
}
```

### 核心API端点

**ACP接口** (`commerce-gateway`):
```
POST /acp/v1/orders.create    # 创建订单
GET  /acp/v1/orders.status    # 查询订单状态
POST /acp/v1/orders.cancel    # 取消订单
```

**知识图谱API**:
```
POST   /api/v1/graph/entities           # 创建实体
GET    /api/v1/graph/entities/{id}      # 获取实体
PUT    /api/v1/graph/entities/{id}      # 更新实体
DELETE /api/v1/graph/entities/{id}      # 删除实体
POST   /api/v1/graph/relationships      # 创建关系
POST   /api/v1/graph/query              # 执行Cypher查询
```

**内容API**:
```
POST   /api/v1/content/generate         # 生成内容
GET    /api/v1/content/{id}             # 获取内容
PUT    /api/v1/content/{id}             # 更新内容
POST   /api/v1/content/{id}/score       # 评分内容
POST   /api/v1/content/{id}/publish     # 发布内容
```

**Offer Catalog**:
```
GET    /api/v1/offers                   # 查询报价(支持product_id/region筛选)
POST   /api/v1/offers                   # 创建报价
PUT    /api/v1/offers/{id}              # 更新报价
```

## 开发环境搭建(规划)

### 前置要求
- Python 3.11+
- Node.js 18+
- Docker Desktop
- PostgreSQL 15+
- Redis 7+
- Neo4j 5+

### 快速启动(待实现)
```bash
# 1. 克隆项目
git clone <repo-url>
cd leapacp

# 2. 配置环境变量
cp .env.example .env
# 编辑.env填入数据库连接、API密钥等

# 3. 启动基础设施(Docker Compose推荐)
docker-compose up -d  # 启动PostgreSQL/Neo4j/Redis/Kafka

# 4. 后端服务
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head  # 数据库迁移
uvicorn main:app --reload --port 8000

# 5. 前端
cd frontend
npm install
npm run dev  # 访问 http://localhost:3000
```

## 测试策略

### 单元测试
- 使用 `pytest` 和 `pytest-asyncio`
- 测试覆盖率目标: ≥80%
- 关键模块必须有测试: GraphService, OrderOrchestrator, ContentGenerator

### 集成测试
- 测试订单完整流程(风控→授权→下单→履约)
- 测试知识图谱CRUD + Cypher查询
- 测试支付适配器(Stripe沙箱)

### E2E测试
- 使用 Playwright
- 测试关键用户旅程(内容生成→审核→发布, ACP订单创建→完成)

### 运行测试
```bash
# 后端单元测试
cd backend
pytest tests/ --cov=. --cov-report=html

# 前端测试
cd frontend
npm run test

# E2E测试
npm run test:e2e
```

## 代码规范

### Python (PEP 8)
- 4空格缩进,每行≤120字符
- 函数/方法: `snake_case`
- 类: `PascalCase`
- 常量: `UPPER_SNAKE_CASE`
- 类型注解强制使用

### TypeScript/JavaScript
- 2空格缩进,使用单引号
- 函数/变量: `camelCase`
- 组件/类: `PascalCase`
- 接口: `IInterfaceName`
- 类型: `TTypeName`

### Git工作流
**分支策略**:
- `main` - 生产环境
- `develop` - 开发环境
- `feature/*` - 功能分支
- `hotfix/*` - 紧急修复

**提交规范** (Conventional Commits):
```
feat: 添加内容生成API
fix: 修复订单状态机bug
docs: 更新API文档
style: 格式化代码
refactor: 重构图谱服务
test: 添加单元测试
chore: 更新依赖
```

## 安全与合规要求

- **数据传输**: TLS 1.3加密
- **敏感数据**: 加密存储,脱敏展示
- **PII保护**: 最小化共享原则,同意留痕
- **风控策略**: 设备指纹/IP信誉/地址黑名单/频率限制
- **合规**: GDPR/CCPA/PCI DSS/SOC 2
- **漏洞修复SLA**: Critical<24h, High<7天

## 性能要求

| 指标 | 目标 |
|------|------|
| API响应时间(P95) | <500ms |
| API响应时间(P99) | <1s |
| 网关吞吐量 | ≥10000 QPS |
| 订单处理时长 | <5s |
| 知识图谱查询 | <100ms |
| 页面加载时间 | <2s |
| 系统可用性 | ≥99.9% |

## 观测性

### 分布式追踪
- 使用OpenTelemetry
- Trace ID传递(`acp_request_id`)
- 跨服务调用链可视化

### 日志管理
- 结构化日志(JSON格式)
- 日志聚合: ELK Stack / Loki
- 日志级别: DEBUG/INFO/WARNING/ERROR/CRITICAL

### 监控指标
- Prometheus采集 + Grafana可视化
- 业务指标: 订单数/支付成功率/履约时长/AI Citation率
- 系统指标: CPU/内存/网络/数据库连接池

### 健康检查
- `/health` - 服务健康端点
- `/ready` - 就绪检查(依赖服务可用性)
- SLO定义与自动降级

## 实施路线图

### Phase 1: 核心基础 (W1-W4)
- [ ] 搭建Neo4j知识图谱基础
- [ ] 实现基础数据采集(3个数据源)
- [ ] 开发内容生成MVP(2种类型)
- [ ] 搭建commerce-gateway + order-orchestrator骨架
- [ ] 接入Stripe沙箱环境
- [ ] PostgreSQL/Redis部署与初始化
- [ ] 完成1笔端到端测试订单

### Phase 2: 功能增强 (W5-W8)
- [ ] 扩展数据源至8+平台
- [ ] 扩展内容类型至6种
- [ ] 实现多平台自动分发
- [ ] 完善订单编排所有状态
- [ ] 增加Shopify/Etsy适配器
- [ ] 建立效果监测仪表盘
- [ ] 实现基础风控规则
- [ ] 知识图谱节点≥500个

### Phase 3: 产品化 (W9-W12)
- [ ] 实现多租户管理系统
- [ ] 开发RBAC权限系统
- [ ] 建立财务对账系统
- [ ] 完善归因分析系统
- [ ] 性能优化(缓存/索引)
- [ ] 完整告警体系与应急预案
- [ ] API文档与运维手册
- [ ] 知识图谱节点≥1000个
- [ ] 订单成功率≥95%

## 关键风险与缓解

| 风险 | 缓解措施 |
|------|---------|
| 价格/库存不同步导致下单失败 | 下单前二次校验 + 价格保护策略 + 自动补偿 |
| ACP协议变更 | 版本适配层设计 + 契约测试 + 快速响应机制 |
| 支付集成复杂度 | 充分沙箱测试 + 分阶段集成 + 专家咨询 |
| 知识图谱质量不达标 | 建立质量评估体系 + 人工审核 + 渐进式优化 |
| 合规问题 | 法务审核 + 合规咨询 + 定期审计 |

## 参考文档

项目文档:
- `leap_acp_prd.md` - 产品需求文档
- `leap_acp_dev_guide.md` - 开发指南
- `leap_acp_user_guide.md` - 用户指南
- `leap_agentic_commerce_platform.md` - 平台白皮书

外部资源:
- [OpenAI ACP规范文档](https://platform.openai.com/docs/guides/agentic-commerce)
- [Stripe Connect文档](https://stripe.com/docs/connect)
- [Neo4j图数据库最佳实践](https://neo4j.com/docs/)
- [GDPR合规指南](https://gdpr.eu/)
- [PCI DSS标准](https://www.pcisecuritystandards.org/)

## 术语表

- **GEO** - Generation Engine Optimization, 生成引擎优化
- **ACP** - Agentic Commerce Protocol, 代理商务协议
- **MOR** - Merchant of Record, 记录商家
- **Offer** - 可售报价视图(价格/库存/商家/区域)
- **SAGA** - 分布式事务模式,用于订单编排
- **PII** - Personally Identifiable Information, 个人可识别信息
- **Citation** - AI在推荐时引用品牌/产品的行为
- **3DS** - 3D Secure, 信用卡在线支付安全认证

## 开发提示

⚠️ **重要**:
- 这是一个全新项目,大部分功能尚未实现
- 开始开发前请先搭建完整的开发环境(数据库/消息队列等)
- 遵循文档中定义的架构和API规范
- 安全和合规是硬性要求,不可妥协
- 所有代码必须经过Code Review
- 关键模块必须有充分的测试覆盖

如需添加新功能,请先:
1. 在PRD中确认需求范围
2. 更新架构设计文档
3. 定义API契约
4. 编写测试用例
5. 实现功能
6. 完成Code Review
7. 部署与监控
