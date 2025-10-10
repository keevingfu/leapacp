# 下一步自动化开发流程规划

**制定时间**: 2025-10-09 19:45
**策略**: 垂直切片 + Context Engineering自动化
**目标**: 10周内完成19个服务开发

---

## 🎯 总体策略：垂直切片开发

### 为什么选择垂直切片？

✅ **优势**:
1. 早期验证端到端流程
2. 快速发现集成问题
3. 每个里程碑都有可演示的功能
4. 降低后期集成风险
5. 支持敏捷迭代

📊 **预期效果**:
- Week 2: 可演示GEO基础流程
- Week 4: 可演示Commerce基础流程
- Week 6: 可演示完整GEO能力
- Week 8: 可演示完整Commerce能力
- Week 10: 生产就绪的多租户平台

---

## 📅 10周开发路线图

### Week 1-2: GEO基础链路 🌟

**目标**: 实现"数据采集→知识图谱→内容生成"端到端流程

#### Week 1: data-collector-service

**Day 1-2: 需求定义与PRP生成**
```bash
# 1. 创建INITIAL-data-collector.md (2小时)
- 功能需求：10+数据源（Reddit, YouTube, Medium等）
- 技术方案：Firecrawl MCP + Celery + MongoDB
- 成功标准：至少3个数据源稳定采集

# 2. 生成PRP (5分钟)
/generate-prp INITIAL-data-collector.md
# 预期输出: PRPs/data-collector-service.md
# 目标置信度: ≥8/10

# 3. 审查PRP (30分钟)
- 检查所有必要组件
- 验证技术方案
- 确认验证门控
```

**Day 3-5: 自动化实现**
```bash
# Context Engineering自动执行
/execute-prp PRPs/data-collector-service.md

# 或手动执行（按PRP蓝图）:
Phase 1: 项目结构 (30分钟)
Phase 2: 数据模型 (2小时)
  - CollectionTask, DataSource, RawData
Phase 3: 采集器实现 (1天)
  - RedditCollector, YouTubeCollector, MediumCollector
  - 使用Firecrawl MCP
Phase 4: Celery任务调度 (4小时)
  - 异步任务队列
  - 定时任务
  - 重试策略
Phase 5: API层 (4小时)
  - POST /api/v1/collect
  - GET /api/v1/tasks
  - GET /api/v1/data
Phase 6: 测试 (4小时)
  - 单元测试 (采集器)
  - 集成测试 (端到端采集)
  - 模拟数据测试
```

**验收标准**:
- [ ] 3个数据源可正常采集
- [ ] Celery任务调度工作正常
- [ ] 数据存储到MongoDB
- [ ] API可查询采集任务状态
- [ ] 测试覆盖率≥80%

**交付物**:
- backend/services/data-collector/
- PRPs/data-collector-service.md
- COMPLETION_REPORT_data_collector.md

#### Week 2: content-generator-service (MVP)

**Day 1-2: 需求定义与实现**
```bash
# MVP范围：仅实现2种内容类型
# 1. 长文生成（基于知识图谱）
# 2. FAQ生成（基于Problem节点）

# 使用OpenAI/Anthropic API
# 从knowledge-graph-service查询上下文
```

**Day 3-4: 集成测试**
```bash
# 端到端测试：
1. data-collector采集Reddit问题
2. 存入MongoDB
3. 手动导入knowledge-graph
4. content-generator生成FAQ
5. 验证内容质量
```

**Day 5: 文档与演示**
```bash
# 准备Week 2演示：
- GEO基础链路演示
- 文档更新
- 性能报告
```

**Week 1-2里程碑**:
- ✅ 2个新服务完成（data-collector + content-generator MVP）
- ✅ GEO基础流程打通
- ✅ 可演示：采集→图谱→生成

---

### Week 3-4: Commerce基础链路 💳

**目标**: 实现"订单→支付→履约"端到端流程

#### Week 3: commerce-gateway + order-orchestrator

**Day 1-3: commerce-gateway**
```bash
# 重点功能：
- ACP协议验签
- 请求验证
- 速率限制
- 幂等性处理

# 集成：
- PostgreSQL (订单数据)
- Redis (幂等性缓存)
```

**Day 4-5: order-orchestrator (基础SAGA)**
```bash
# MVP流程：
CREATED → VALIDATE_OFFER → PAYMENT_AUTHORIZE → CAPTURE → CLOSED

# 暂不实现：
- 商家下单（后续Week 8）
- 复杂补偿（后续完善）
```

#### Week 4: payment-adapter + 集成测试

**Day 1-3: payment-adapter**
```bash
# Stripe集成：
- 沙箱环境
- 支付令牌管理
- 授权/捕获
- Webhook处理
```

**Day 4-5: 端到端测试**
```bash
# 测试流程：
1. 创建测试Offer（手动插入knowledge-graph）
2. 调用commerce-gateway创建订单
3. order-orchestrator编排流程
4. payment-adapter授权支付
5. 捕获并完成订单
6. 验证状态流转
```

**Week 3-4里程碑**:
- ✅ 3个新服务完成（gateway + orchestrator + payment）
- ✅ Commerce基础流程打通
- ✅ 可演示：端到端订单完成
- ✅ 累计5个服务（25%）

---

### Week 5-6: 完善GEO功能 📊

**目标**: 完整的GEO能力，支持6种内容类型

#### Week 5

**Day 1-2: faq-clustering-service**
```bash
# 功能：
- FAQ意图聚类（使用OpenAI Embeddings）
- 热点识别
- 映射到knowledge-graph

# 集成：
- Memory MCP (持久化聚类结果)
- Neo4j (更新关系)
```

**Day 3-4: content-generator扩展**
```bash
# 扩展到6种内容类型：
1. ✅ 长文（已实现）
2. ✅ FAQ（已实现）
3. 视频脚本
4. 产品对比
5. 使用案例
6. 评论回复

# 每种类型单独的Prompt模板
```

**Day 5: content-scoring-service**
```bash
# MVP评分：
- 相关性评分（与知识图谱匹配度）
- 可读性评分（Flesch-Kincaid）
- SEO评分（关键词密度）

# 使用LLM评估
```

#### Week 6

**Day 1-2: distribution-service**
```bash
# 支持3个平台：
- Medium (API集成)
- WordPress (REST API)
- Ghost (Admin API)

# 功能：
- 内容发布
- 调度管理
- 状态跟踪
```

**Day 3-4: analytics-service**
```bash
# 基础分析：
- Citation追踪（记录知识图谱引用）
- 内容性能（浏览量、互动）
- 归因分析（简化版）

# 数据存储：
- PostgreSQL (metrics表)
```

**Day 5: GEO完整测试**
```bash
# 端到端验证：
1. 采集数据
2. 聚类FAQ
3. 更新知识图谱
4. 生成6种内容
5. 评分
6. 发布到3个平台
7. 追踪效果
```

**Week 5-6里程碑**:
- ✅ 4个新服务（clustering + scoring + distribution + analytics）
- ✅ GEO完整能力
- ✅ 6种内容类型支持
- ✅ 累计9个服务（45%）

---

### Week 7-8: 完善Commerce功能 🛒

**目标**: 完整的Commerce能力，支持多商家

#### Week 7

**Day 1-2: offer-catalog-service**
```bash
# 功能：
- 基于knowledge-graph生成Offer视图
- 价格/库存管理
- 区域支持
- Offer缓存（Redis）

# 集成：
- Neo4j (Product + Offer节点)
- Redis (缓存)
```

**Day 3-4: merchant-adapter-service (Shopify)**
```bash
# MVP: 仅Shopify适配
# 功能：
- 创建订单
- 库存查询
- 状态同步

# 集成Shopify Admin API
```

**Day 5: order-orchestrator完善**
```bash
# 扩展SAGA流程：
CREATED → VALIDATE_OFFER → PAYMENT_AUTHORIZE →
MERCHANT_ORDER → CAPTURE → FULFILLING → CLOSED

# 添加补偿事务
```

#### Week 8

**Day 1-2: fulfillment-service**
```bash
# 功能：
- 履约状态管理
- 物流追踪（集成ShipStation）
- 异常处理

# 集成：
- PostgreSQL (fulfillments表)
- Notification service (发送通知)
```

**Day 3-4: consent-service**
```bash
# 功能：
- 用户同意记录
- 数据最小化
- 合规审计

# GDPR/CCPA支持
```

**Day 5: Commerce完整测试**
```bash
# 端到端验证：
1. 查询Offer（从knowledge-graph）
2. 创建订单（through gateway）
3. 验证价格库存（offer-catalog）
4. 授权支付（payment-adapter）
5. 商家下单（Shopify）
6. 捕获支付
7. 履约跟踪
8. 完成订单
```

**Week 7-8里程碑**:
- ✅ 4个新服务（offer-catalog + merchant-adapter + fulfillment + consent）
- ✅ Commerce完整能力
- ✅ 支持Shopify商家
- ✅ 累计13个服务（65%）

---

### Week 9-10: 共享服务与生产就绪 🔐

**目标**: 多租户、认证、监控，生产就绪

#### Week 9

**Day 1-2: auth-service**
```bash
# 功能：
- OIDC单点登录
- JWT生成/验证
- 刷新令牌
- 2FA支持（可选）

# 集成：
- PostgreSQL (users表)
- Redis (session cache)
```

**Day 3-4: tenant-service**
```bash
# 核心功能：
- 多租户管理
- RBAC权限
- 数据隔离策略

# 每个服务集成tenant_id
```

**Day 5: 所有服务集成认证**
```bash
# 为所有服务添加：
- JWT验证中间件
- Tenant ID隔离
- 权限检查
```

#### Week 10

**Day 1-2: notification-service + audit-service**
```bash
# notification-service:
- 邮件（SendGrid）
- 短信（Twilio）
- Webhook

# audit-service:
- 操作日志
- 合规报告
```

**Day 3-4: 集成测试与优化**
```bash
# 完整测试：
1. 多租户场景
2. 权限隔离
3. 端到端业务流程
4. 性能测试
5. 安全测试

# 优化：
- 数据库索引
- 缓存策略
- API限流
```

**Day 5: 文档与部署准备**
```bash
# 文档：
- API文档（所有服务）
- 部署文档
- 运维手册
- 故障排查指南

# 部署准备：
- Docker化所有服务
- K8s配置
- CI/CD pipeline
```

**Week 9-10里程碑**:
- ✅ 4个新服务（auth + tenant + notification + audit）
- ✅ 所有20个服务完成
- ✅ 多租户支持
- ✅ 生产就绪

---

## 🤖 自动化执行模板

### 每个服务的标准流程

#### 第1步：需求定义（30分钟-2小时）

创建 `INITIAL-{service-name}.md`:

```markdown
# Feature: {Service Name}

## FEATURE
### Core Requirements
1. 功能需求1
2. 功能需求2
...

### Technical Requirements
- 框架：FastAPI/Flask
- 数据库：PostgreSQL/MongoDB/Neo4j
- 消息队列：Redis/Kafka
- 依赖服务：xxx-service

## EXAMPLES
### Reference Implementations
- {类似服务的实现}
- {相关代码模式}

### Code Patterns
```python
# 示例代码
```

## DOCUMENTATION
- {相关API文档链接}
- {技术文档链接}

## OTHER CONSIDERATIONS
### Project Structure
```
backend/services/{service-name}/
├── main.py
├── models/
├── services/
├── api/
└── tests/
```

### Dependencies
- {依赖列表}

### Security
- {安全要求}

### Performance
- {性能目标}

## VALIDATION GATES
Level 1: 语法检查
Level 2: 单元测试
Level 3: 集成测试
Level 4: API测试
Level 5: 性能测试

## SUCCESS CRITERIA
- [ ] 功能1完成
- [ ] 功能2完成
- [ ] 测试覆盖率≥80%
```

#### 第2步：生成PRP（5分钟）

```bash
/generate-prp INITIAL-{service-name}.md
```

或手动创建PRP（如命令不可用）：
- 参考 `PRPs/knowledge-graph-service.md` 模板
- 包含完整实施蓝图
- 包含验证门控
- 置信度评分

#### 第3步：审查PRP（15-30分钟）

检查清单：
- [ ] 所有核心功能都有实施计划
- [ ] 技术方案可行
- [ ] 依赖服务已就绪或同步开发
- [ ] 验证门控完整
- [ ] 置信度≥7/10

#### 第4步：自动化实现（1-4天）

```bash
# 使用Context Engineering自动执行
/execute-prp PRPs/{service-name}.md

# 或按PRP手动执行：
# Phase 1: 项目结构
# Phase 2: 数据模型
# Phase 3: 服务层
# Phase 4: API层
# Phase 5: 测试
# Phase 6: 文档
```

#### 第5步：验证（半天）

```bash
# 1. 语法检查
python -m py_compile **/*.py

# 2. 运行测试
pytest tests/ --cov=. --cov-report=html

# 3. 启动服务
python main.py

# 4. API测试
curl http://localhost:800X/health
curl http://localhost:800X/docs

# 5. 集成测试（如需要）
# 测试与其他服务的集成
```

#### 第6步：CI/CD更新（15分钟）

```bash
# 1. 更新Todo
TodoWrite([
    {"content": "{service-name}开发", "status": "completed", ...}
])

# 2. 更新AUTOMATION_PLAN.md
Edit(...) # 添加到已完成列表

# 3. 更新PROJECT_STATUS.md
Edit(...) # 更新进度表格

# 4. 统计代码
wc -l backend/services/{service-name}/**/*.py

# 5. 生成完成报告（可选）
# 参考COMPLETION_REPORT.md模板
```

---

## 📊 每周检查清单

### Week 1 检查
- [ ] data-collector-service完成
- [ ] 3个数据源稳定采集
- [ ] MongoDB有测试数据
- [ ] CI/CD文档已更新
- [ ] 累计代码：~5,000行

### Week 2 检查
- [ ] content-generator MVP完成
- [ ] 2种内容类型可生成
- [ ] GEO端到端流程验证
- [ ] 演示材料准备完成
- [ ] 累计代码：~7,000行

### Week 4 检查
- [ ] Commerce基础流程完成
- [ ] 可完成1笔测试订单
- [ ] Stripe沙箱集成成功
- [ ] 累计服务：5个（25%）
- [ ] 累计代码：~15,000行

### Week 6 检查
- [ ] GEO完整能力就绪
- [ ] 6种内容类型支持
- [ ] 3个平台可发布
- [ ] 累计服务：9个（45%）
- [ ] 累计代码：~25,000行

### Week 8 检查
- [ ] Commerce完整能力就绪
- [ ] Shopify集成完成
- [ ] 端到端订单流程验证
- [ ] 累计服务：13个（65%）
- [ ] 累计代码：~35,000行

### Week 10 检查
- [ ] 所有20个服务完成
- [ ] 多租户支持
- [ ] 3个品牌测试接入
- [ ] 知识图谱≥1000节点
- [ ] 累计代码：~45,000行
- [ ] 生产就绪度：90%+

---

## 🎯 成功关键因素

### 1. 严格遵循Context Engineering流程
- ✅ 每个服务都有INITIAL.md
- ✅ 每个服务都有PRP
- ✅ 置信度≥7/10才开始实施

### 2. 持续集成测试
- ✅ 每个服务完成后立即集成测试
- ✅ 不积累技术债
- ✅ 发现问题立即修复

### 3. CI/CD文档实时更新
- ✅ 每天更新Todo列表
- ✅ 每个服务完成更新状态文档
- ✅ 每周生成进度报告

### 4. 保持代码质量
- ✅ 测试覆盖率≥80%
- ✅ 类型注解完整
- ✅ 文档齐全

### 5. 风险管理
- ✅ 优先开发高风险服务
- ✅ 早期暴露集成问题
- ✅ 保持技术方案灵活性

---

## 📝 下一步行动

### 立即执行（今天）

#### 1. 创建data-collector需求定义（1小时）
```bash
cd /Users/cavin/Desktop/dev/leapacp
vi INITIAL-data-collector.md

# 内容结构：
# - FEATURE: 10+数据源采集需求
# - EXAMPLES: Firecrawl使用示例
# - DOCUMENTATION: API文档链接
# - SUCCESS CRITERIA: 明确的验收标准
```

#### 2. 生成PRP（5分钟）
```bash
# 如有Context Engineering命令
/generate-prp INITIAL-data-collector.md

# 或手动创建
vi PRPs/data-collector-service.md
# 参考knowledge-graph-service.md模板
```

#### 3. 审查并开始实施（明天开始）
```bash
# 审查PRP置信度
# 如果≥7/10，开始实施
# 预计2-3天完成
```

---

**规划完成时间**: 2025-10-09 20:00
**下一个里程碑**: Week 2 - GEO基础链路演示
**最终目标**: Week 10 - 生产就绪的多租户平台

🚀 **Let's start building!**
