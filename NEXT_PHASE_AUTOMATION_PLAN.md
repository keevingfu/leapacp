# Leap ACP 后续自动化开发计划

**制定时间**: 2025-10-11 01:30
**执行策略**: 前后端集成 + Context Engineering自动化
**预计完成**: 10周（2个月）

---

## 📋 当前状态总结

### ✅ 已完成 (75%)
- **前端应用**: 15个页面，8,000行代码 (100%)
- **后端服务**: 2个核心服务，4,300行代码 (60%)
  - ✅ Knowledge Graph Service
  - ✅ Data Collector Service
- **数据库**: 4个数据库全部运行 (100%)
- **文档体系**: 完整的PRD + 开发指南 (90%)

### 🎯 下一阶段目标
1. 前后端集成（Week 1-2）
2. 新增4个后端服务（Week 3-6）
3. Commerce功能实现（Week 7-8）
4. 部署与运维配置（Week 9-10）

---

## 🚀 Phase 1: 前后端集成 (Week 1-2)

### 目标
将已完成的后端服务与前端页面连接，实现端到端功能演示。

### 任务清单

#### 1.1 状态管理基础设施 (3天)

**任务描述**:
搭建React应用状态管理和API集成基础。

**实施步骤**:
```bash
# 1. 安装依赖
cd frontend
npm install zustand @tanstack/react-query axios

# 2. 创建API客户端
mkdir src/lib/api
touch src/lib/api/client.ts
touch src/lib/api/knowledge-graph.ts
touch src/lib/api/data-collector.ts

# 3. 配置React Query
touch src/lib/react-query.ts

# 4. 创建Zustand stores
mkdir src/stores
touch src/stores/knowledge-graph-store.ts
touch src/stores/data-collector-store.ts
```

**文件结构**:
```
frontend/src/
├── lib/
│   ├── api/
│   │   ├── client.ts           # Axios实例配置
│   │   ├── knowledge-graph.ts  # Knowledge Graph API调用
│   │   └── data-collector.ts   # Data Collector API调用
│   └── react-query.ts          # React Query配置
└── stores/
    ├── knowledge-graph-store.ts
    └── data-collector-store.ts
```

**验证标准**:
- [ ] API客户端可正常发送请求
- [ ] React Query缓存工作正常
- [ ] Zustand状态更新正常
- [ ] 错误处理机制完善

**代码量估算**: ~500行

---

#### 1.2 Knowledge Graph集成 (4天)

**任务描述**:
将Knowledge Graph页面连接到后端API，实现实时图谱可视化。

**功能需求**:
1. **实体管理**:
   - 创建实体（8种类型）
   - 查询实体详情
   - 更新实体属性
   - 删除实体
   - 实时图谱更新

2. **关系管理**:
   - 创建关系
   - 查询关系
   - 删除关系
   - 可视化关系网络

3. **查询功能**:
   - 自定义Cypher查询
   - 全文搜索
   - 查询历史

**API端点**:
- `POST /api/v1/graph/entities` - 创建实体
- `GET /api/v1/graph/entities/{id}` - 获取实体
- `PUT /api/v1/graph/entities/{id}` - 更新实体
- `DELETE /api/v1/graph/entities/{id}` - 删除实体
- `POST /api/v1/graph/relationships` - 创建关系
- `POST /api/v1/graph/query` - 执行查询
- `POST /api/v1/graph/search` - 搜索实体

**实施方式**: 手动开发（需要UI交互调整）

**验证标准**:
- [ ] 可创建所有8种实体类型
- [ ] 图谱实时更新
- [ ] Cypher查询可执行
- [ ] 搜索功能正常
- [ ] 错误提示友好

**代码量估算**: ~800行

---

#### 1.3 Data Collection集成 (3天)

**任务描述**:
将Data Collection页面连接到后端API，实现任务管理。

**功能需求**:
1. **任务创建**:
   - Reddit采集任务
   - YouTube采集任务
   - Firecrawl采集任务
   - 参数配置

2. **任务监控**:
   - 任务状态查询
   - 实时进度更新
   - 错误日志查看

3. **结果管理**:
   - 采集结果预览
   - 数据导出
   - 清洗Pipeline配置

**API端点**:
- `POST /api/v1/collector/tasks` - 创建任务
- `GET /api/v1/collector/tasks/{id}` - 查询任务
- `GET /api/v1/collector/tasks` - 列表任务
- `GET /api/v1/collector/results/{task_id}` - 获取结果
- `GET /api/v1/collector/health` - 健康检查

**实施方式**: 手动开发

**验证标准**:
- [ ] 可创建3种采集任务
- [ ] 任务状态实时更新
- [ ] 结果可正常预览
- [ ] 错误处理完善

**代码量估算**: ~600行

---

#### 1.4 GEO工具数据持久化 (2天)

**任务描述**:
为Shopify GEO和Amazon GEO添加后端数据存储。

**功能需求**:
1. **优化历史记录**:
   - 保存优化配置
   - 记录优化历史
   - 版本对比

2. **数据导出**:
   - 导出到知识图谱
   - 导出为JSON
   - 导出报告

3. **模板管理**:
   - 保存常用模板
   - 快速加载模板

**数据库设计** (MongoDB):
```javascript
// Shopify Optimization
{
  _id: ObjectId,
  user_id: String,
  product_url: String,
  optimization_type: "shopify",
  steps: {
    step1: { audit_results: {...}, completed: true },
    step2: { generated_titles: [...], completed: true },
    // ... step3-10
  },
  created_at: Date,
  updated_at: Date,
  completed: Boolean
}

// Amazon Optimization
{
  _id: ObjectId,
  user_id: String,
  asin: String,
  optimization_type: "amazon",
  steps: {
    step1: { audit_results: {...}, completed: true },
    step2: { generated_titles: [...], completed: true },
    // ... step3-10
  },
  created_at: Date,
  updated_at: Date,
  completed: Boolean
}
```

**API设计**:
- `POST /api/v1/geo/shopify/optimizations` - 保存Shopify优化
- `GET /api/v1/geo/shopify/optimizations` - 获取历史
- `POST /api/v1/geo/amazon/optimizations` - 保存Amazon优化
- `GET /api/v1/geo/amazon/optimizations` - 获取历史

**实施方式**: Context Engineering辅助

**验证标准**:
- [ ] 优化数据可保存
- [ ] 历史记录可查询
- [ ] 导出功能正常

**代码量估算**: ~400行

---

### Phase 1 总结

**总工时**: 12天 (2周)
**总代码量**: ~2,300行
**完成标准**:
- [ ] 前端可连接所有后端API
- [ ] 实时数据更新正常
- [ ] 错误处理完善
- [ ] 端到端demo可用

---

## 🚀 Phase 2: 内容生成服务 (Week 3-4)

### 目标
开发Content Generator Service，实现基于知识图谱的AI内容生成。

### 实施策略
**使用Context Engineering自动化开发**

### 步骤

#### 2.1 需求定义 (1天)

创建 `INITIAL-content-generator.md`:

```markdown
# FEATURE: Content Generator Service

## Core Requirements
基于Neo4j知识图谱上下文，使用LLM生成6种类型的营销内容。

## Key Functionality
1. 产品描述生成（基于Product + Features）
2. FAQ问答生成（基于Problem + Solutions）
3. 对比文章生成（基于Competitor分析）
4. 使用指南生成（基于Scenario + Steps）
5. 视频脚本生成（基于UserGroup + Benefits）
6. 社交媒体文案（短文案优化）

## Technical Requirements
- FastAPI REST API
- OpenAI/Claude API集成
- Neo4j知识图谱查询
- PostgreSQL内容存储
- 内容质量评分算法
- 多模态内容支持

## Success Criteria
- 生成内容质量≥85分
- 响应时间<10秒
- 支持批量生成
- 历史版本管理

## EXAMPLES
参考已有的:
- backend/services/knowledge-graph/
- backend/services/data-collector/

## DOCUMENTATION
- OpenAI API: https://platform.openai.com/docs/api-reference
- Anthropic API: https://docs.anthropic.com/
- Neo4j Python Driver: https://neo4j.com/docs/python-manual/current/

## OTHER CONSIDERATIONS
- API密钥安全管理
- Token消耗优化
- 生成内容合规检查
- 并发控制
```

#### 2.2 生成PRP (0.5天)

```bash
/generate-prp INITIAL-content-generator.md
```

**预期置信度**: 7-8/10

#### 2.3 自动化实现 (7天)

```bash
/execute-prp PRPs/content-generator-service.md
```

**预期输出**:
- 项目结构（models, services, api, tests）
- LLM集成服务
- 内容生成Pipeline
- 质量评分算法
- REST API端点
- 完整测试用例

**代码量估算**: ~2,000行

#### 2.4 前端集成 (3天)

更新Content Generation页面：
- 连接后端API
- 实时生成进度
- 内容预览和编辑
- 质量评分显示
- 版本管理

**代码量估算**: ~500行

### Phase 2 总结

**总工时**: 11.5天 (2周)
**总代码量**: ~2,500行
**完成标准**:
- [ ] 6种内容类型可生成
- [ ] 质量评分≥85分
- [ ] 前端集成完成
- [ ] 测试覆盖率≥75%

---

## 🚀 Phase 3: FAQ聚类服务 (Week 5)

### 目标
开发FAQ Clustering Service，实现FAQ意图识别和热点发现。

### 实施策略
**使用Context Engineering自动化开发**

### 步骤

#### 3.1 需求定义 (0.5天)

创建 `INITIAL-faq-clustering.md`:

```markdown
# FEATURE: FAQ Clustering Service

## Core Requirements
基于采集的FAQ数据，使用NLP技术进行意图聚类和热点发现。

## Key Functionality
1. FAQ意图识别（使用embeddings）
2. 语义相似度聚类
3. 热点问题发现
4. 聚类结果存储到Neo4j
5. Memory MCP持久化

## Technical Requirements
- FastAPI REST API
- Sentence Transformers（embeddings）
- Scikit-learn（聚类算法）
- Neo4j存储聚类结果
- Memory MCP集成

## Success Criteria
- 聚类准确率≥80%
- 热点发现覆盖率≥90%
- 响应时间<5秒

## DOCUMENTATION
- Sentence Transformers: https://www.sbert.net/
- Scikit-learn Clustering: https://scikit-learn.org/stable/modules/clustering.html
```

#### 3.2 PRP生成 + 自动化实现 (5天)

```bash
/generate-prp INITIAL-faq-clustering.md
/execute-prp PRPs/faq-clustering-service.md
```

**代码量估算**: ~1,200行

#### 3.3 前端集成 (1.5天)

更新Data Collection页面添加FAQ分析功能。

**代码量估算**: ~300行

### Phase 3 总结

**总工时**: 7天 (1周)
**总代码量**: ~1,500行

---

## 🚀 Phase 4: 报价目录服务 (Week 6)

### 目标
开发Offer Catalog Service，基于知识图谱生成可售报价视图。

### 实施策略
**Context Engineering + 手动优化**

### 功能需求
1. 从知识图谱查询Offer
2. 基于region/merchant筛选
3. 价格/库存实时更新
4. Redis缓存
5. 多币种支持

### 步骤

#### 4.1 需求定义 + PRP (1天)
#### 4.2 自动化实现 (4天)
#### 4.3 前端集成 (2天)

**总工时**: 7天
**总代码量**: ~1,000行

---

## 🚀 Phase 5: 订单编排服务 (Week 7-8)

### 目标
开发Order Orchestrator Service，实现SAGA模式订单状态机。

### 实施策略
**手动开发**（复杂业务逻辑，不适合Context Engineering）

### 功能需求
1. 订单状态机（8个状态）
2. SAGA补偿事务
3. 风控检查
4. 支付授权/捕获
5. 商家订单创建
6. 履约管理

### 关键挑战
- 分布式事务一致性
- 补偿逻辑正确性
- 状态机可靠性
- 性能优化

### 步骤

#### 5.1 架构设计 (2天)
使用 `/architect` 设计状态机和补偿逻辑

#### 5.2 核心实现 (6天)
- 状态机引擎
- SAGA编排器
- 补偿处理器
- 事务日志

#### 5.3 集成测试 (3天)
- 正常流程测试
- 失败场景测试
- 补偿逻辑验证
- 性能测试

#### 5.4 前端集成 (3天)
更新Orders页面显示完整订单流程

**总工时**: 14天 (2周)
**总代码量**: ~2,500行

---

## 🚀 Phase 6: 部署与运维 (Week 9-10)

### 目标
配置生产环境部署和监控体系。

### 任务清单

#### 6.1 Docker容器化 (4天)

**任务**:
- 为7个后端服务创建Dockerfile
- 创建docker-compose.yml
- 配置环境变量管理
- 实现健康检查

**文件清单**:
```
backend/
├── services/
│   ├── knowledge-graph/Dockerfile
│   ├── data-collector/Dockerfile
│   ├── content-generator/Dockerfile
│   ├── faq-clustering/Dockerfile
│   ├── offer-catalog/Dockerfile
│   ├── order-orchestrator/Dockerfile
│   └── api-gateway/Dockerfile
├── docker-compose.yml
└── docker-compose.prod.yml
```

#### 6.2 CI/CD流程 (3天)

**任务**:
- 配置GitHub Actions
- 自动化测试流程
- 自动化部署流程
- 代码质量检查（ESLint, Prettier, Black, mypy）

**文件**:
```
.github/
└── workflows/
    ├── frontend-ci.yml
    ├── backend-ci.yml
    ├── deploy-staging.yml
    └── deploy-production.yml
```

#### 6.3 监控与日志 (4天)

**任务**:
- Prometheus + Grafana监控
- ELK日志聚合
- 告警规则配置
- 性能追踪（Jaeger）

**监控指标**:
- 服务健康状态
- API响应时间
- 错误率
- 数据库性能
- 队列积压

#### 6.4 文档完善 (3天)

**任务**:
- 部署文档
- 运维手册
- API文档更新
- 故障排查指南

**总工时**: 14天 (2周)

---

## 📈 总体时间规划

| Phase | 任务 | 工时 | 起止时间 | 实施方式 |
|-------|------|------|---------|---------|
| Phase 1 | 前后端集成 | 12天 | Week 1-2 | 手动 + Context Engineering |
| Phase 2 | 内容生成服务 | 11.5天 | Week 3-4 | Context Engineering |
| Phase 3 | FAQ聚类服务 | 7天 | Week 5 | Context Engineering |
| Phase 4 | 报价目录服务 | 7天 | Week 6 | Context Engineering |
| Phase 5 | 订单编排服务 | 14天 | Week 7-8 | 手动开发 |
| Phase 6 | 部署与运维 | 14天 | Week 9-10 | 手动配置 |
| **总计** | | **65.5天** | **10周** | **混合模式** |

**实际日历时间**: 约2.5个月（考虑周末和缓冲）

---

## 💡 开发方法选择指南

### Context Engineering适用场景 ✅
- 模式化的CRUD服务
- 清晰的数据模型
- 标准的REST API
- 可预定义的测试用例

**适用服务**:
- ✅ Content Generator Service
- ✅ FAQ Clustering Service
- ✅ Offer Catalog Service
- ✅ GEO数据持久化

**优势**:
- 开发速度快（传统开发的7-10倍）
- 代码质量一致
- 测试覆盖率高
- 文档自动生成

### 手动开发适用场景 🔧
- 复杂业务逻辑
- 需要大量判断
- 高度定制化UI
- 分布式事务

**适用服务**:
- 🔧 Order Orchestrator Service
- 🔧 前后端集成调整
- 🔧 交互式UI优化
- 🔧 部署配置

**最佳实践**:
- 使用BMAD角色分工
- 使用SuperClaude加速
- 增量开发+验证
- 充分测试

---

## 🎯 成功标准

### Phase 1成功标准
- [ ] Knowledge Graph页面实时更新
- [ ] Data Collection任务正常执行
- [ ] GEO工具数据可持久化
- [ ] 端到端demo流畅

### Phase 2成功标准
- [ ] 6种内容类型可生成
- [ ] 生成质量≥85分
- [ ] 响应时间<10秒
- [ ] 前端集成完成

### Phase 3成功标准
- [ ] FAQ聚类准确率≥80%
- [ ] 热点发现覆盖率≥90%
- [ ] 结果可视化

### Phase 4成功标准
- [ ] Offer查询<100ms
- [ ] 缓存命中率>80%
- [ ] 多币种支持

### Phase 5成功标准
- [ ] 订单状态机正确
- [ ] 补偿逻辑可靠
- [ ] 无数据不一致
- [ ] 性能达标

### Phase 6成功标准
- [ ] Docker镜像构建成功
- [ ] CI/CD流水线正常
- [ ] 监控指标完整
- [ ] 文档齐全

---

## 📊 预期成果

### 代码规模
| 模块 | 当前行数 | 新增行数 | 总计 |
|------|---------|---------|------|
| 前端应用 | 8,000 | 2,200 | 10,200 |
| 后端服务 | 4,300 | 7,200 | 11,500 |
| 部署配置 | 0 | 500 | 500 |
| **总计** | **12,300** | **9,900** | **22,200** |

### 功能完成度
- ✅ 前端: 100%
- 🎯 后端: 60% → 95%
- 🎯 集成: 0% → 100%
- 🎯 部署: 0% → 90%

### 项目完成度
**当前**: 75% → **目标**: 95%

---

## 🔗 相关文档

- `PROJECT_STATUS.md` - 项目当前状态
- `AUTOMATION_PLAN.md` - 原始自动化计划
- `CLAUDE.md` - 项目配置
- `leap_acp_prd.md` - 产品需求

---

## 📞 立即开始

### Step 1: 审查当前成果
```bash
# 访问前端应用
open http://localhost:5174/

# 测试Shopify GEO工具
# 测试Amazon GEO工具
```

### Step 2: 准备Phase 1集成
```bash
cd frontend
npm install zustand @tanstack/react-query axios
```

### Step 3: 启动后端服务
```bash
# Knowledge Graph Service
cd backend/services/knowledge-graph
python main.py

# Data Collector Service
cd backend/services/data-collector
python main.py
```

---

**制定时间**: 2025-10-11 01:30
**预计完成**: 2025-12-20
**执行状态**: ⏳ 待开始
