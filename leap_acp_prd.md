# Leap Agentic Commerce Platform 需求文档

## 文档信息

| 项目 | 内容 |
|---|---|
| 文档名称 | Leap Agentic Commerce Platform 产品需求文档（PRD） |
| 版本 | v1.0 |
| 创建日期 | 2025-10-09 |
| 文档状态 | Draft |
| 产品定位 | 生成引擎优化（GEO）+ 代理商务（ACP）一体化平台 |
| 目标用户 | 跨境DTC品牌、电商卖家、品牌出海企业 |

---

## 1. 项目背景与愿景

### 1.1 业务背景

在生成式AI与对话式搜索时代，传统SEO优化已无法满足品牌在AI驱动的信息检索场景中的曝光需求。同时，AI代理（如ChatGPT）正在成为新的商务入口，但缺乏从"推荐"到"交易"的闭环能力。

### 1.2 市场机会

- **生成引擎优化（GEO）**：在AI引用、推荐场景中提升品牌可见性
- **代理商务（Agentic Commerce）**：在对话式AI中实现即时结账能力
- **多品牌运营**：为出海企业提供统一的内容+交易管理平台

### 1.3 产品愿景

**让每个品牌在生成式AI与对话式搜索时代，不仅"被看见"，更能"被买到"。**

### 1.4 核心价值主张

通过**知识图谱 + 多模态内容资产库 + 代理商务收单与订单编排**，打通从"问题-内容-推荐-下单-履约-归因"的完整闭环，为多品牌提供统一的运营与增长平台。

---

## 2. 业务目标

### 2.1 定量目标（Phase 1-3，12周）

| 指标 | 目标值 | 时间节点 |
|---|---|---|
| 品牌接入数量 | ≥3个品牌 | W12 |
| 知识图谱节点覆盖 | ≥1000个实体节点 | W8 |
| 内容资产生成 | ≥500篇多平台内容 | W12 |
| AI Citation Rate | 提升30% | W12 |
| ACP订单成功率 | ≥95% | W12 |
| 交易履约时长 | ≤48小时（标准物流） | W12 |

### 2.2 定性目标

- 建立行业领先的GEO+ACP技术体系
- 打造可复制的多品牌运营模式
- 形成"内容-交易-归因"数据闭环
- 构建可扩展的代理商务基础设施

---

## 3. 功能需求

## 3.1 GEO模块（生成引擎优化）

### 3.1.1 数据采集与清洗

**需求描述**：从多个平台采集与品牌相关的数据，为知识图谱构建提供原始素材。

**功能点**：

1. **多平台数据采集**
   - YouTube：视频评论、标题、描述、互动数据
   - Reddit：帖子、评论、投票数、subreddit分类
   - Quora：问答内容、点赞数、话题标签
   - Medium：文章内容、claps数、标签
   - Wikipedia：相关词条、引用关系
   - LinkedIn：行业文章、公司动态
   - Twitter/X：品牌提及、话题趋势
   - Amazon：产品评论、Q&A、评分分布
   - 官网：产品详情、FAQ、博客内容
   - 关键词工具：搜索量、竞争度、相关词

2. **数据清洗与预处理**
   - 去重、过滤垃圾信息
   - 语言识别与翻译
   - 实体识别与归一化
   - 情感分析与分类

3. **采集管理**
   - 采集任务调度与监控
   - 增量更新策略
   - API配额管理
   - 数据质量评估

**验收标准**：
- 支持10+数据源自动采集
- 数据清洗准确率≥90%
- 采集任务成功率≥95%
- 支持每日增量更新

---

### 3.1.2 FAQ知识地图

**需求描述**：通过意图聚类和热点识别，构建用户常见问题知识地图。

**功能点**：

1. **意图聚类**
   - 问题相似度计算（语义向量）
   - K-means/DBSCAN聚类算法
   - 簇心提取与命名
   - 跨平台意图合并

2. **节点归并**
   - 同义问题识别
   - 问题层级关系建立
   - 问题分类体系（购买/使用/对比/故障）

3. **热点识别**
   - 高频问题排序
   - 季节性/趋势性问题发现
   - 未覆盖问题缺口分析
   - 竞品对比问题挖掘

4. **知识管理**
   - FAQ编辑与审核
   - 问题关联推荐
   - 答案版本管理
   - 多语言FAQ支持

**验收标准**：
- 问题聚类准确率≥85%
- 热点问题识别覆盖率≥80%
- 支持5种主要语言
- FAQ审核流程完整

---

### 3.1.3 知识图谱构建

**需求描述**：构建以产品为核心的多维度知识图谱，支撑内容生成与AI推荐。

**功能点**：

1. **实体建模**
   - Product（产品）：SKU、名称、类别、属性
   - Feature（特性）：材质、技术、卖点
   - Scenario（场景）：使用场景、适用人群
   - Problem（问题）：用户痛点、解决方案
   - UserGroup（用户群）：人口统计、行为特征
   - Competitor（竞品）：品牌、产品、价格
   - Offer（报价）：价格、库存、商家、区域

2. **关系抽取**
   - HAS_FEATURE：产品-特性关系
   - SOLVES：特性-问题关系
   - APPLIES_TO：产品-场景关系
   - COMPARES_WITH：产品-竞品关系
   - TARGETS：产品-用户群关系
   - HAS_OFFER：产品-报价关系
   - SOLD_BY：报价-商家关系

3. **图谱融合**
   - 多源数据融合规则
   - 冲突解决策略
   - 实体对齐与链接
   - 关系置信度计算

4. **图谱存储**
   - Neo4j图数据库
   - GraphQL查询接口
   - 图谱版本管理
   - 增量更新机制

**验收标准**：
- 图谱节点≥1000个
- 关系准确率≥90%
- 查询响应时间<100ms
- 支持复杂图查询（3跳以上）

---

### 3.1.4 内容生成引擎

**需求描述**：基于知识图谱自动/半自动生成多平台优质内容。

**功能点**：

1. **内容类型支持**
   - 视频脚本（YouTube）
   - 长文章（Medium）
   - 问答（Quora、Reddit）
   - 产品对比（所有平台）
   - FAQ（官网、Amazon）
   - 社交媒体短文（Twitter/X、LinkedIn）

2. **生成策略**
   - 模板驱动生成
   - LLM辅助生成（GPT-4/Claude）
   - 多模态内容生成（文本+图片+视频）
   - 个性化内容变体

3. **内容优化**
   - 关键词密度优化
   - 可读性评估（Flesch分数）
   - SEO友好性检查
   - 品牌一致性校验

4. **生成管理**
   - 批量生成任务
   - 生成队列管理
   - 成本控制（Token使用）
   - 生成日志与追溯

**验收标准**：
- 支持8+内容类型
- 生成内容质量分≥85分
- 单篇内容生成时间<30秒
- 批量生成成功率≥95%

---

### 3.1.5 内容评分与评审

**需求描述**：建立自动化+人工结合的内容质量保障体系。

**功能点**：

1. **自动评分系统**
   - 相关性评分（与产品/品牌关联度）
   - 可读性评分（语法、流畅度）
   - SEO评分（关键词、结构、meta）
   - 原创性评分（查重）
   - 合规性检查（敏感词、法律风险）

2. **评审工作流**
   - 自动评分阈值过滤
   - 人工审核任务分配
   - 审核意见收集
   - 修改建议生成
   - 多轮审核机制

3. **质量管理**
   - 评分标准配置
   - 审核员权限管理
   - 审核效率监控
   - 内容质量趋势分析

4. **反馈闭环**
   - 拒绝原因统计
   - 生成策略优化
   - 模板迭代建议

**验收标准**：
- 自动评分与人工评分相关性≥0.8
- 审核通过率≥70%
- 单篇审核时间<5分钟
- 审核流转SLA≤24小时

---

### 3.1.6 多平台分发

**需求描述**：将审核通过的内容自动分发到各目标平台。

**功能点**：

1. **平台适配器**
   - YouTube：视频上传、字幕、描述、标签
   - Reddit：帖子发布、subreddit选择
   - Quora：问答发布、话题选择
   - Medium：文章发布、标签、出版物
   - Wikipedia：词条编辑（人工为主）
   - LinkedIn：文章/动态发布
   - Twitter/X：推文发布、线程
   - Amazon：Q&A回答、Seller Central
   - 官网：博客/FAQ更新

2. **分发策略**
   - 平台优先级配置
   - 发布时间优化
   - 频率控制
   - A/B测试支持

3. **分发管理**
   - 任务队列与调度
   - 失败重试机制
   - 平台API配额管理
   - 分发日志与追踪

4. **内容同步**
   - 多平台版本管理
   - 更新同步策略
   - 下架/删除管理

**验收标准**：
- 支持9+平台自动分发
- 分发成功率≥95%
- 分发延迟<5分钟
- 支持定时/立即发布

---

### 3.1.7 效果监测与归因

**需求描述**：监测内容在各平台的表现，并建立从内容到转化的归因链路。

**功能点**：

1. **平台指标采集**
   - 曝光/展示数
   - 点击/互动数（like/share/comment）
   - CTR/参与率
   - 转化数（点击购买链接）
   - 情感指标（正负面评价）

2. **归因链路**
   - Citation → Offer暴露 → 点击 → 订单 → 履约
   - 跨平台用户标识
   - 多触点归因模型（First/Last/Linear/U型/时间衰减）
   - 归因窗口配置

3. **效果分析**
   - 内容ROI计算
   - 平台效果对比
   - 热门内容识别
   - 内容生命周期分析

4. **数据看板**
   - 实时监控仪表盘
   - 自定义报表
   - 异常告警
   - 趋势预测

**验收标准**：
- 支持10+效果指标
- 数据延迟<1小时
- 归因覆盖率≥80%
- 看板加载时间<3秒

---

## 3.2 Agentic Commerce模块（代理商务）

### 3.2.1 Commerce Gateway（商务网关）

**需求描述**：ACP协议入站网关，负责请求验签、安全防护和流量管理。

**功能点**：

1. **请求验证**
   - ACP签名验证
   - API版本兼容检查
   - 请求格式校验
   - 必填字段验证

2. **安全防护**
   - 幂等性控制（基于request_id）
   - 重放攻击防护（时间戳+nonce）
   - 速率限制（按client/IP/user）
   - DDoS防护

3. **流量管理**
   - 请求路由
   - 负载均衡
   - 熔断降级
   - 灰度发布支持

4. **协议适配**
   - ACP v1/v2协议支持
   - 向后兼容策略
   - 错误码标准化
   - 响应格式转换

**验收标准**：
- 验签准确率100%
- 重放攻击拦截率100%
- 网关延迟<50ms
- 支持10000 QPS

---

### 3.2.2 Order Orchestrator（订单编排）

**需求描述**：订单生命周期编排，实现SAGA状态机管理。

**功能点**：

1. **订单状态机**
   ```
   CREATED → RISK_CHECK → VALIDATE_OFFER → 
   PAYMENT_AUTHORIZE → MERCHANT_ORDER → CAPTURE → 
   FULFILLING → CLOSED/REFUNDED/CANCELLED
   ```

2. **编排步骤**
   - 风控检查：设备指纹、IP信誉、地址验证
   - 报价校验：价格、库存、可售区域二次确认
   - 支付授权：调用支付适配器授权
   - 商家下单：调用Shopify/Etsy/自建OMS
   - 支付捕获：按策略捕获（即时/发货后）
   - 履约编排：物流创建、状态跟踪
   - 异常补偿：取消/退款/重试

3. **事件总线**
   - order.created
   - order.authorized
   - order.merchant_created
   - order.captured
   - order.fulfilled
   - order.refunded
   - order.cancelled

4. **补偿事务**
   - 失败回滚策略
   - 补偿操作定义
   - 重试策略配置
   - 人工介入触发

**验收标准**：
- 状态机覆盖所有关键节点
- 补偿成功率≥99%
- 订单编排延迟<3秒
- 事件投递可靠性≥99.9%

---

### 3.2.3 Payment Adapter（支付适配）

**需求描述**：支付聚合层，支持Stripe及其他支付处理器。

**功能点**：

1. **Stripe集成**
   - 共享支付令牌（Shared Payment Tokens）
   - 委托支付（Delegated Payments）
   - 仅授权金额+指定商家
   - 3DS认证支持

2. **多支付轨支持**
   - 信用卡/借记卡
   - 数字钱包（Apple Pay/Google Pay）
   - BNPL（Affirm/Klarna）
   - 区域支付方式（支付宝/微信支付）

3. **支付操作**
   - authorize（授权）
   - capture（捕获）
   - refund（退款）
   - cancel（取消授权）

4. **支付管理**
   - 支付令牌生命周期管理
   - 支付状态同步
   - 支付失败重试
   - 对账数据提供

**验收标准**：
- 支付授权成功率≥98%
- 支付延迟<2秒
- 支持5+支付方式
- 对账准确率100%

---

### 3.2.4 Offer Catalog（报价目录）

**需求描述**：基于知识图谱生成可售视图，提供实时价格、库存和商家信息。

**功能点**：

1. **报价建模**
   ```
   Offer {
     offer_id: String
     sku: String
     merchant_id: String
     price: Decimal
     currency: String
     availability: Boolean
     stock_level: Int
     valid_from: DateTime
     valid_until: DateTime
     region: String
     shipping_options: []
     payment_methods: []
   }
   ```

2. **报价生成**
   - 从知识图谱Product节点生成
   - 商家多渠道价格聚合
   - 促销/折扣规则应用
   - 动态定价支持

3. **实时校验**
   - 价格有效性检查
   - 库存可用性查询
   - 区域可售性验证
   - 支付方式匹配

4. **报价查询**
   - 按产品ID查询
   - 按区域筛选
   - 按价格排序
   - 按商家过滤

**验收标准**：
- 报价数据准确率≥99%
- 库存同步延迟<5分钟
- 查询响应时间<100ms
- 支持10000+ SKU

---

### 3.2.5 Merchant Adapters（商家适配）

**需求描述**：适配不同电商平台和商家系统，实现订单自动创建。

**功能点**：

1. **Shopify适配器**
   - 订单创建API
   - 库存查询API
   - 履约状态同步
   - Webhook事件接收

2. **Etsy适配器**
   - 订单创建
   - 卖家通知
   - 状态更新

3. **自建OMS适配器**
   - 标准接口定义
   - 订单推送
   - 状态回调

4. **适配器管理**
   - 商家配置管理
   - API凭证管理
   - 错误处理与重试
   - 适配器健康检查

**验收标准**：
- 支持3+电商平台
- 订单创建成功率≥98%
- 订单同步延迟<30秒
- 错误通知及时性<1分钟

---

### 3.2.6 Fulfillment & Logistics（履约物流）

**需求描述**：管理订单履约流程，追踪物流状态。

**功能点**：

1. **履约管理**
   - 履约任务创建
   - 发货信息录入
   - 运单号生成/绑定
   - 发货确认

2. **物流追踪**
   - 物流商API集成
   - 状态自动更新
   - 异常事件告警
   - 签收确认

3. **通知服务**
   - 发货通知（给用户/代理）
   - 物流更新通知
   - 签收通知
   - 异常通知

4. **履约数据**
   - 履约时长统计
   - 物流商表现分析
   - 异常原因分类

**验收标准**：
- 物流状态更新及时率≥95%
- 履约SLA达成率≥90%
- 异常告警准确率≥95%
- 支持5+物流商

---

### 3.2.7 Consent & Data Minimization（同意与数据最小化）

**需求描述**：实现用户同意管理和数据最小化共享原则。

**功能点**：

1. **同意管理**
   - 同意步骤定义
   - 同意请求展示
   - 同意记录留痕
   - 同意撤回机制

2. **数据最小化**
   - 字段白名单定义
   - 必需/可选字段标记
   - 自动脱敏规则
   - 数据共享审计

3. **隐私保护**
   - PII识别与标记
   - 数据加密存储
   - 访问权限控制
   - 数据保留策略

4. **合规支持**
   - GDPR合规
   - CCPA合规
   - 数据主体权利（访问/删除/纠正）
   - 合规报告生成

**验收标准**：
- 同意留痕完整率100%
- 数据共享符合最小化原则
- 合规检查通过率100%
- 数据主体请求响应≤30天

---

## 3.3 跨域能力

### 3.3.1 多租户与RBAC

**需求描述**：支持多品牌、多项目的租户隔离和细粒度权限控制。

**功能点**：

1. **租户模型**
   ```
   Tenant → Brand → Project → Channel → 
   Content/Offer → Order
   ```

2. **数据隔离**
   - 行级数据隔离（tenant_id）
   - 库级隔离（多库模式）
   - 对象存储隔离（bucket/prefix）
   - 密钥隔离（per-tenant keys）

3. **角色权限**
   - Owner：全部权限
   - Manager：运营管理
   - Editor：内容编辑
   - Analyst：数据分析（只读）
   - Finance：财务查看
   - DevOps：技术运维

4. **权限管理**
   - 角色创建与分配
   - 资源级权限控制
   - 操作审计日志
   - 客座账号（临时访问）

**验收标准**：
- 支持10+租户
- 数据隔离率100%
- 权限检查延迟<10ms
- 审计日志完整性100%

---

### 3.3.2 安全与风控

**需求描述**：构建多层次安全防护和智能风控体系。

**功能点**：

1. **身份认证**
   - OIDC单点登录
   - 2FA双因子认证
   - API密钥管理
   - Session管理

2. **风控策略**
   - 设备指纹识别
   - IP/ASN信誉检查
   - 地址黑名单
   - 频率限制
   - 限额控制
   - 地理合规（OFAC）

3. **风险评分**
   - 实时风险计算
   - 规则引擎
   - 机器学习模型
   - 黑白名单

4. **安全审计**
   - 操作日志
   - 异常行为告警
   - 安全事件响应
   - 漏洞扫描

**验收标准**：
- 风险识别准确率≥90%
- 误杀率<5%
- 审计日志保留≥1年
- 安全漏洞响应时间<24小时

---

### 3.3.3 观测性与运维

**需求描述**：全链路可观测性，支撑快速问题定位和性能优化。

**功能点**：

1. **分布式追踪**
   - OpenTelemetry集成
   - Trace ID传递（acp_request_id）
   - 跨服务调用链
   - 慢请求分析

2. **日志管理**
   - 结构化日志
   - 日志聚合（ELK/Loki）
   - 日志查询与分析
   - 日志告警

3. **指标监控**
   - Prometheus采集
   - Grafana可视化
   - 业务指标（订单/支付/履约）
   - 系统指标（CPU/内存/网络）
   - 告警规则配置

4. **健康检查**
   - 服务健康端点
   - 依赖健康检查
   - SLO定义与监控
   - 自动降级/熔断

**验收标准**：
- Trace覆盖率100%
- 日志查询响应<3秒
- 告警准确率≥95%
- SLO达成率≥99%

---

## 4. 非功能需求

### 4.1 性能要求

| 指标 | 要求 |
|---|---|
| API响应时间（P95） | <500ms |
| API响应时间（P99） | <1s |
| 网关吞吐量 | ≥10000 QPS |
| 订单处理时长 | <5s |
| 知识图谱查询 | <100ms |
| 数据库查询（P95） | <50ms |
| 页面加载时间 | <2s |

### 4.2 可用性要求

| 指标 | 要求 |
|---|---|
| 系统可用性 | ≥99.9% |
| 订单服务可用性 | ≥99.95% |
| 支付服务可用性 | ≥99.99% |
| 数据库可用性 | ≥99.95% |
| 计划内停机时间 | <2小时/月 |

### 4.3 扩展性要求

- 支持水平扩展（stateless services）
- 数据库支持读写分离
- 缓存支持分布式部署
- 消息队列支持集群模式
- 支持多数据中心部署

### 4.4 安全性要求

- 数据传输加密（TLS 1.3）
- 敏感数据加密存储
- PII数据脱敏展示
- 定期安全审计
- 漏洞修复SLA：Critical<24h, High<7天

### 4.5 合规性要求

- GDPR合规
- CCPA合规
- PCI DSS合规（支付数据）
- SOC 2认证准备
- 数据本地化（按地区）

---

## 5. 技术架构

### 5.1 架构分层

```
┌─────────────────────────────────────────┐
│           接入层（Gateway）              │
│  API Gateway / ACP Gateway / CDN        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           应用层（Services）             │
│  GEO Services / Commerce Services       │
│  Content / Graph / Order / Payment      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           数据层（Data）                 │
│  Neo4j / PostgreSQL / Redis / S3        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        基础设施层（Infrastructure）      │
│  K8s / Kafka / Monitoring / Logging     │
└─────────────────────────────────────────┘
```

### 5.2 核心技术栈

| 层次 | 技术选型 |
|---|---|
| 后端框架 | FastAPI (Python) |
| 异步任务 | Celery + Redis |
| 图数据库 | Neo4j |
| 关系数据库 | PostgreSQL |
| 缓存 | Redis |
| 消息队列 | Kafka / RabbitMQ |
| 对象存储 | S3 / MinIO |
| 前端框架 | React + TypeScript |
| UI组件 | Tailwind CSS + shadcn/ui |
| 容器编排 | Kubernetes |
| 监控 | Prometheus + Grafana |
| 追踪 | OpenTelemetry + Jaeger |
| 日志 | ELK / Loki |
| CI/CD | GitHub Actions |

### 5.3 服务划分

**GEO侧**：
- data-collector-service
- faq-clustering-service
- knowledge-graph-service
- content-generation-service
- content-scoring-service
- distribution-service
- analytics-service

**Commerce侧**：
- commerce-gateway
- order-orchestrator
- payment-adapter
- offer-catalog-service
- merchant-adapter-service
- fulfillment-service
- consent-service

**共享服务**：
- auth-service
- tenant-service
- notification-service
- audit-service

---

## 6. 数据模型

### 6.1 知识图谱Schema（Neo4j）

```cypher
// 节点类型
(:Product {id, name, sku, category, brand, description})
(:Feature {id, name, type, value, description})
(:Scenario {id, name, description, tags[]})
(:Problem {id, description, severity, frequency})
(:UserGroup {id, name, demographics{}, behavior{}})
(:Competitor {id, brand, product, price_range})
(:Offer {offer_id, sku, merchant_id, price, currency, 
         availability, stock, valid_from, valid_until, region})
(:Merchant {merchant_id, name, platform, mor, commission_rate})
(:Content {content_id, type, platform, url, status, score})

// 关系类型
-[:HAS_FEATURE {confidence}]->
-[:SOLVES {effectiveness}]->
-[:APPLIES_TO {relevance}]->
-[:TARGETS {priority}]->
-[:COMPARES_WITH {comparison_type}]->
-[:HAS_OFFER]->
-[:SOLD_BY]->
-[:GENERATED_FROM]->
```

### 6.2 交易数据模型（PostgreSQL）

```sql
-- 订单表
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    acp_order_id VARCHAR(64) UNIQUE NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    brand_id VARCHAR(32) NOT NULL,
    user_hash VARCHAR(64) NOT NULL,
    merchant_id VARCHAR(32) NOT NULL,
    offer_id VARCHAR(64) NOT NULL,
    quantity INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    state VARCHAR(32) NOT NULL,
    acp_client VARCHAR(64),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_tenant_brand (tenant_id, brand_id),
    INDEX idx_user_hash (user_hash),
    INDEX idx_state (state),
    INDEX idx_created_at (created_at)
);

-- 支付表
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    provider VARCHAR(32) NOT NULL,
    acp_token_ref VARCHAR(128) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    auth_id VARCHAR(64),
    auth_status VARCHAR(32),
    capture_id VARCHAR(64),
    capture_status VARCHAR(32),
    risk_score DECIMAL(5,2),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_order_id (order_id),
    INDEX idx_auth_status (auth_status)
);

-- 履约表
CREATE TABLE fulfillments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    carrier VARCHAR(64),
    ship_to JSONB NOT NULL,
    status VARCHAR(32) NOT NULL,
    tracking_no VARCHAR(128),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_order_id (order_id),
    INDEX idx_status (status)
);

-- 同意审计表
CREATE TABLE audit_consent (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    user_hash VARCHAR(64) NOT NULL,
    step VARCHAR(64) NOT NULL,
    fields_shared TEXT[] NOT NULL,
    acp_request_id VARCHAR(64) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_hash (user_hash),
    INDEX idx_acp_request_id (acp_request_id)
);
```

---

## 7. 接口设计

### 7.1 ACP接口（Commerce Gateway）

**创建订单**
```
POST /acp/v1/orders.create

Request:
{
  "client_id": "chatgpt",
  "request_id": "req_abc123",
  "items": [{
    "offer_id": "offer_xyz",
    "quantity": 1
  }],
  "shipping_address": {
    "name": "John Doe",
    "line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94102",
    "country": "US"
  },
  "payment_token": "tok_visa_4242",
  "consent": {
    "data_sharing": true,
    "terms_accepted": true
  }
}

Response:
{
  "order_id": "ord_123456",
  "status": "processing",
  "amount": 99.99,
  "currency": "USD",
  "estimated_delivery": "2025-10-15"
}
```

**查询订单状态**
```
GET /acp/v1/orders.status?order_id=ord_123456

Response:
{
  "order_id": "ord_123456",
  "status": "shipped",
  "tracking": {
    "carrier": "USPS",
    "tracking_no": "9400111899223344556677",
    "url": "https://tools.usps.com/go/TrackConfirmAction?tLabels=..."
  },
  "timeline": [
    {"step": "created", "timestamp": "2025-10-09T10:00:00Z"},
    {"step": "authorized", "timestamp": "2025-10-09T10:00:05Z"},
    {"step": "shipped", "timestamp": "2025-10-10T14:30:00Z"}
  ]
}
```

### 7.2 Offer Catalog接口

**查询报价**
```
GET /api/v1/offers?product_id=prod_mattress_cool&region=US

Response:
{
  "offers": [{
    "offer_id": "offer_xyz",
    "sku": "MAT-COOL-QUEEN",
    "merchant": {
      "merchant_id": "merch_sweetnight",
      "name": "SweetNight Official",
      "rating": 4.8
    },
    "price": {
      "amount": 299.99,
      "currency": "USD",
      "original_price": 399.99,
      "discount": 25
    },
    "availability": {
      "in_stock": true,
      "stock_level": "high",
      "ships_from": "US",
      "estimated_delivery_days": 5
    },
    "payment_methods": ["card", "apple_pay", "affirm"]
  }]
}
```

### 7.3 Knowledge Graph接口

**图查询**
```
POST /api/v1/graph/query

Request:
{
  "cypher": "MATCH (p:Product {sku: $sku})-[:HAS_FEATURE]->(f:Feature) RETURN p, f",
  "params": {
    "sku": "MAT-COOL-QUEEN"
  }
}

Response:
{
  "nodes": [...],
  "relationships": [...],
  "execution_time_ms": 45
}
```

---

## 8. 实施计划

### Phase 1：核心基础（W1-W4）

**目标**：建立MVP系统，验证核心流程

**GEO侧**：
- [ ] 搭建Neo4j知识图谱基础
- [ ] 实现基础数据采集管道（3个数据源）
- [ ] 开发FAQ聚类MVP
- [ ] 开发内容生成MVP（2种内容类型）
- [ ] 实现简单评分系统

**Commerce侧**：
- [ ] 搭建commerce-gateway骨架
- [ ] 实现order-orchestrator基础状态机
- [ ] 接入Stripe沙箱环境
- [ ] 实现Shopify适配器MVP
- [ ] 开发Offer Catalog基础功能

**基础设施**：
- [ ] PostgreSQL数据库设计与初始化
- [ ] Redis缓存部署
- [ ] 基础监控搭建
- [ ] CI/CD流程建立

**里程碑验收**：
- 完成首个产品的知识图谱建模
- 生成并发布10篇测试内容
- 完成1笔端到端测试订单

---

### Phase 2：功能增强（W5-W8）

**目标**：扩展功能覆盖，小流量试运行

**GEO侧**：
- [ ] 扩展数据源至8个平台
- [ ] 完善知识图谱关系抽取
- [ ] 扩展内容类型至6种
- [ ] 实现多平台自动分发
- [ ] 建立效果监测仪表盘

**Commerce侧**：
- [ ] 完善订单编排所有状态
- [ ] 实现支付捕获策略
- [ ] 增加Etsy适配器
- [ ] 开发履约追踪功能
- [ ] 实现同意管理系统

**风控与合规**：
- [ ] 实现基础风控规则
- [ ] 建立审计日志系统
- [ ] 实现数据最小化策略
- [ ] 完成PII保护机制

**里程碑验收**：
- 知识图谱节点≥500个
- 生成内容≥200篇
- 完成10笔真实订单
- 风控拦截准确率≥85%

---

### Phase 3：产品化（W9-W12）

**目标**：多租户支持，规模化准备

**多租户**：
- [ ] 实现租户管理系统
- [ ] 开发RBAC权限系统
- [ ] 实现数据隔离机制
- [ ] 建立租户自助管理界面

**财务与运营**：
- [ ] 开发财务对账系统
- [ ] 实现分润计算引擎
- [ ] 建立运营数据看板
- [ ] 完善归因分析系统

**优化与稳定性**：
- [ ] 性能优化（缓存策略、数据库索引）
- [ ] 异常补偿流程完善
- [ ] 完整的告警体系
- [ ] 应急预案与Runbook

**文档与培训**：
- [ ] API文档完善
- [ ] 运维手册编写
- [ ] 用户使用指南
- [ ] 团队培训

**里程碑验收**：
- 支持≥3个租户
- 知识图谱节点≥1000个
- 生成内容≥500篇
- 订单成功率≥95%
- 系统SLO达成≥99%

---

## 9. 风险与缓解

### 9.1 技术风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|---|---|---|---|
| 知识图谱质量不达标 | 中 | 高 | 建立质量评估体系；引入人工审核；渐进式优化 |
| ACP协议变更 | 中 | 中 | 版本适配层设计；契约测试；快速响应机制 |
| 支付集成复杂度 | 高 | 高 | 充分的沙箱测试；分阶段集成；专家咨询 |
| 性能瓶颈 | 中 | 中 | 性能测试；缓存策略；水平扩展能力 |
| 第三方API限制 | 高 | 中 | 配额管理；速率控制；优雅降级 |

### 9.2 业务风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|---|---|---|---|
| 价格/库存不同步 | 高 | 高 | 下单前二次校验；价格保护策略；自动补偿 |
| 商家拒单/超时 | 中 | 高 | SLA约定；备选方案；用户通知 |
| 支付欺诈 | 中 | 高 | 多层风控；实时监控；人工复核 |
| 用户投诉/退款 | 中 | 中 | 完善客服流程；快速响应；争议处理机制 |
| 合规问题 | 低 | 极高 | 法务审核；合规咨询；定期审计 |

### 9.3 运营风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|---|---|---|---|
| 内容质量下降 | 中 | 中 | 质量监控；定期审查；迭代优化 |
| 多租户资源争抢 | 中 | 中 | 资源配额；优先级策略；弹性扩容 |
| 数据泄露 | 低 | 极高 | 加密；访问控制；审计；应急预案 |
| 系统故障 | 中 | 高 | 高可用架构；监控告警；快速恢复 |

---

## 10. 验收标准

### 10.1 功能验收

**GEO模块**：
- [ ] 支持10+数据源采集
- [ ] 知识图谱节点≥1000个，准确率≥90%
- [ ] 支持8+内容类型生成
- [ ] 内容质量分≥85分
- [ ] 支持9+平台自动分发
- [ ] 效果监测数据延迟<1小时

**Commerce模块**：
- [ ] ACP协议验证100%准确
- [ ] 订单状态机覆盖所有关键节点
- [ ] 支付授权成功率≥98%
- [ ] 订单创建成功率≥95%
- [ ] 履约追踪准确率≥95%
- [ ] 同意管理完整留痕

**多租户**：
- [ ] 支持≥3个租户
- [ ] 数据隔离100%
- [ ] RBAC权限正确性100%
- [ ] 财务对账准确率100%

### 10.2 性能验收

- [ ] API响应时间P95<500ms
- [ ] 网关吞吐量≥10000 QPS
- [ ] 订单处理时长<5s
- [ ] 知识图谱查询<100ms
- [ ] 页面加载时间<2s

### 10.3 可用性验收

- [ ] 系统可用性≥99.9%
- [ ] 订单服务可用性≥99.95%
- [ ] 支付服务可用性≥99.99%
- [ ] 故障恢复时间<15分钟

### 10.4 安全验收

- [ ] 通过渗透测试
- [ ] 无高危漏洞
- [ ] 敏感数据加密100%
- [ ] 审计日志完整性100%
- [ ] 合规检查通过

---

## 11. 附录

### 11.1 术语表

| 术语 | 定义 |
|---|---|
| GEO | Generation Engine Optimization，生成引擎优化 |
| ACP | Agentic Commerce Protocol，代理商务协议 |
| MOR | Merchant of Record，记录商家 |
| Offer | 可售报价视图（价格/库存/商家/区域） |
| SAGA | 分布式事务模式，用于订单编排 |
| PII | Personally Identifiable Information，个人可识别信息 |
| Citation | AI在推荐时引用品牌/产品的行为 |
| 3DS | 3D Secure，信用卡在线支付安全认证 |

### 11.2 参考资料

- OpenAI ACP规范文档
- Stripe Connect文档
- Neo4j图数据库最佳实践
- GDPR合规指南
- PCI DSS标准

### 11.3 相关文档

- 《技术架构设计文档》
- 《API接口文档》
- 《数据库设计文档》
- 《运维手册》
- 《安全合规指南》

---

## 文档变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|---|---|---|---|
| v1.0 | 2025-10-09 | 初始版本 | Team |

---

**审批流程**

| 角色 | 姓名 | 日期 | 签名 |
|---|---|---|---|
| 产品负责人 | | | |
| 技术负责人 | | | |
| 业务负责人 | | | |

---

**附注**：本文档为产品需求文档（PRD），后续需拆分为详细的技术设计文档、接口文档、测试用例等配套文档。