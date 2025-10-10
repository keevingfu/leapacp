# Leap Agentic Commerce Platform（GEO + Agentic Commerce）

> 面向多品牌、多项目的 **生成引擎优化（GEO）** 与 **代理商务（ACP 即时结账）** 一体化平台白皮书 / 说明文档（v1）。

---

## 1. 平台愿景与价值主张

**愿景**：让每个品牌在生成式 AI 与对话式搜索时代，不仅“被看见”，更能“被买到”。

**价值主张**：用 **知识图谱 + 多模态内容资产库 + 代理商务（ACP）收单与订单编排** 打通从“问题-内容-推荐-下单-履约-归因”的闭环，面向 **多品牌** 的统一运营与增长平台。

**服务对象**：跨境 DTC、品牌出海企业、平台型电商卖家及其代理商。

---

## 2. 目标与范围

- 构建 **SweetNight** 等品牌的 **GEO 知识图谱 + 内容资产库**，覆盖品牌/产品/需求/FAQ/场景等语义节点。
- 基于图谱 **自动/半自动** 生产 **多平台内容**（YouTube、Reddit、Medium、Quora、Wikipedia、LinkedIn、Twitter/X、Amazon、官网）。
- 建立 **评分-评审-分发-监测-归因** 的优化闭环，提升搜索/内容覆盖、用户信任与 **转化率**。
- 接入 **Agentic Commerce Protocol（ACP）**，让 ChatGPT（或其他 AI 代理）在对话中 **即时结账**，平台侧完成 **收单、支付、履约编排**。
- 形成 **多品牌、多项目** 的统一管理：权限、数据隔离、报表与财务结算。

---

## 3. 能力地图（Capability Map）

### 3.1 GEO 侧
- 数据采集与清洗：YouTube/Reddit/Quora/Medium/Wikipedia/LinkedIn/Twitter(X)/Amazon/官网/关键词。
- FAQ 知识地图：意图聚类、节点归并、热点识别。
- 知识图谱：Product/Feature/Scenario/Problem/UserGroup/Competitor + 关系抽取与融合，Neo4j 存储。
- 内容生成：脚本/长文/QA/对比/FAQ，多模态模板驱动。
- 评分与评审：自动打分（相关性/可读性/SEO）、人工审核阈值。
- 分发：YouTube/Reddit/Quora/Medium/Wikipedia/LinkedIn/Twitter(X)/Amazon/官网/SEO 页。
- 监测与归因：平台指标 + 内部 BI，数据驱动迭代。

### 3.2 Agentic Commerce 侧（ACP）
- **commerce-gateway**：ACP 入站网关（验签、幂等、重放防护、速率限制）。
- **order-orchestrator**：订单编排/SAGA 状态机（风控→库存校验→授权→商家下单→捕获→履约）。
- **payment-adapter**：支付聚合（Stripe 共享支付令牌/Delegated Payments + 非 Stripe 处理器适配）。
- **offer-catalog**：基于知识图谱生成“可售视图”（Offer/Price/Availability/Seller）。
- **consent & data-minimization**：同意留痕、字段白名单、最小化共享。

### 3.3 跨域能力
- 多租户与 RBAC：品牌/项目/地域维度隔离与细粒度权限。
- 合规与安全：PII 保护、审计台账、风控策略、地理合规。
- 观测性：Tracing/Logging/Metrics，业务看板与告警。
- 增长分析：Citation→Offer 暴露→下单→履约→复购的漏斗视图与归因。

---

## 4. 高层架构

```mermaid
flowchart LR
  subgraph GEO 层
    A[数据采集]-->B[FAQ/意图聚类]
    B-->C[知识图谱(Neo4j)]
    C-->D[内容生成]
    D-->E[评分/评审]
    E-->F[分发]
    F-->G[效果监测/归因]
    G-->C
    G-->D
  end

  subgraph Agentic Commerce 层
    C-->|Offer 建模|H[offer-catalog]
    I[commerce-gateway]-->J[order-orchestrator]
    J-->K[payment-adapter]
    J-->L[商家适配: Shopify/Etsy/OMS]
    J-->M[履约/物流]
    I-->N[consent & data-minimization]
  end

  F-->|可购 CTA/深链|I
  H-->|可售/可价/有货|D
```

---

## 5. 域模型（简化）

**图谱侧（Neo4j）**
- `(:Product)`、`(:Feature)`、`(:Scenario)`、`(:Problem)`、`(:UserGroup)`、`(:Competitor)`
- `(:Offer {offer_id, sku, merchant_id, price, currency, availability, valid_from, valid_until, region})`
- `(:Merchant {merchant_id, name, platform:"shopify|etsy|custom", mor:true})`
- `(:PaymentRail {type:"stripe|processorX", capabilities:[...]})`
- 关系：`HAS_FEATURE` / `SOLVES` / `APPLIES_TO` / `COMPARES_WITH` / `HAS_OFFER` / `SOLD_BY` / `USES` / `FULFILLED_BY`

**交易侧（PostgreSQL）**
- `orders(id, acp_order_id, user_hash, merchant_id, offer_id, qty, amount, currency, state, acp_client, created_at, updated_at)`
- `payments(id, order_id, provider, acp_token_ref, amount, auth_status, capture_status, risk_score, created_at)`
- `fulfillments(id, order_id, carrier, ship_to_json, status, tracking_no, created_at)`
- `audit_consent(id, user_hash, step, fields_shared[], acp_request_id, timestamp)`

---

## 6. 关键流程

### 6.1 从“问题”到“下单”
1. **发现**：用户在 ChatGPT 询问（例：$100 内最佳冷感床垫）。
2. **推荐**：代理调用网络与平台知识（图谱支撑）产出结果；若 `Offer` 可购，展示 **Buy**（即时结账）。
3. **同意与校验**：网关校验 ACP 请求 + 用户同意步骤留痕；二次校验价格/库存/可售区域。
4. **支付授权**：`payment-adapter` 使用共享支付令牌 / Delegated 流程 **仅授权** 指定金额 + 指定商家。
5. **商家下单**：`order-orchestrator` 调 Shopify/Etsy/OMS 创建订单；按策略 **捕获** 或发货后捕获。
6. **履约/通知**：同步状态到代理与用户；追踪物流；异常进入补偿流（取消/退款）。
7. **归因**：串联 `prompt/content_id/offer_id/merchant_id`，从 Citation → Purchase 建立转化回路。

### 6.2 订单编排状态机（SAGA）
`CREATED → RISK_CHECK → VALIDATE_OFFER → PAYMENT_AUTHORIZE → MERCHANT_ORDER → CAPTURE → FULFILLING → CLOSED/REFUNDED/CANCELLED`

---

## 7. 安全与合规

- **数据最小化**：只向商家共享履约必需字段（名称、地址、联系方式等），支付仅持 **令牌引用**。
- **支付安全**：一次性加密令牌绑定 **金额 + 商家**，需用户显式授权；平台不落 PAN。
- **风控**：设备指纹/IP/ASN 信誉、地址黑名单、频控、限额、地区合规（如 OFAC）。
- **审计与可撤回**：同意留痕与字段白名单；非交易必需信息可按政策脱敏或删除。
- **观测性**：全链路 Trace（`acp_request_id`）、慢查询、失败重试、异常峰值告警。

---

## 8. 多品牌 / 多项目（多租户）

- **租户模型**：Tenant→Brand→Project→Channel→Content/Offer→Order。
- **隔离**：数据行级/库级隔离，密钥按租户分卷管理；品牌/地域维度策略模板化。
- **RBAC**：角色（Owner/Manager/Editor/Analyst/Finance/DevOps），支持客座账号（审计只读）。
- **财务结算**：品牌/商家/渠道维度的结算报表，对账差异工单与追踪。

---

## 9. 指标体系（统一增长看板）

**认知**：AI Citation Rate、Share of Voice、品牌提及数、FAQ 覆盖率。

**内容**：质量分、审核通过率、发布频率、平台互动率（like/comment/share/CTR）。

**商业**：Offer 覆盖率、即时结账曝光/点击率、授权成功率、捕获成功率、拒单率、退款率、履约时长、转化率、客单价、毛利贡献。

**归因**：Citation→Offer→Order 的跨域路径与数据驱动归因（First/Last/U 型/时间衰减/数据驱动）。

---

## 10. 接口与契约（节选）

### 10.1 ACP 入站（commerce-gateway）
- `POST /acp/orders.create`（验签 + 幂等），Body：订单行、送货、金额、共享支付令牌、consent。
- `GET /acp/orders.status?order_id=...`

### 10.2 订单编排（order-orchestrator）
- 事件总线：`order.created / .authorized / .merchant_created / .captured / .fulfilled / .refunded / .cancelled`
- 回调契约：商家适配器需回传 `merchant_order_id / state / reasons`。

### 10.3 支付适配（payment-adapter）
- `/payments/authorize`、`/payments/capture`、`/payments/refund`（抽象统一；Stripe/非 Stripe 后端具体实现）。

### 10.4 Offer Catalog
- `GET /offers?product_id=...&region=US`（返回价格/有货/商家/可用支付轨）。

---

## 11. 技术栈与基础设施

- **图谱**：Neo4j + GraphQL API；
- **服务**：FastAPI (Python) + Celery（异步任务）；
- **消息**：Kafka/RabbitMQ；
- **存储**：PostgreSQL（交易/审计）、Redis（缓存/队列）、对象存储（素材）；
- **前端**：React + Tailwind（运营/看板）；
- **观测**：OpenTelemetry + Prometheus + Grafana；
- **CI/CD**：GitHub Actions；
- **容器化**：Docker + K8s；
- **安全**：OIDC 单点登录、细粒度密钥管理（Vault/Secrets）。

---

## 12. 实施路线（与分阶段里程碑对齐）

**Phase 1｜核心基础（W1–W4）**
- 图谱本体/库搭建、采集管道 MVP、内容生成与评分 MVP；
- 搭建 commerce-gateway + order-orchestrator 骨架；接 Stripe 授权沙箱。

**Phase 2｜功能增强（W5–W8）**
- 多平台分发、小流量试投；
- Offer Catalog 与二次校验；Shopify/Etsy 适配 MVP；
- 风控与观测完善，归因链路打通。

**Phase 3｜产品化（W9–W12）**
- 多租户/RBAC、财务对账报表；
- 捕获/退款/异常补偿完善；
- 规模化灰度与 SLO 守护，运维手册与应急预案。

---

## 13. 风险与缓解

| 风险 | 缓解 |
|---|---|
| 价格/库存陈旧导致下单失败 | 下单前二次校验 + 价格保护策略 + 回滚通知 |
| 商家拒单或超时 | 补偿事务（释放授权/退款）+ 用户通知模板 |
| 支付失败/风控误杀 | 可配置风控阈值 + 白名单 + 人工复核通道 |
| 合规与隐私 | 最小化共享 + 同意审计 + 数据保留策略 |
| 代理生态变更 | ACP 版本适配层 + 契约测试 |

---

## 14. 场景示例（SweetNight：散热 / 热感）
- 图谱识别“热感/散热”高频；生成 YouTube/Quora/Reddit/Medium 内容矩阵；
- 官网/亚马逊 FAQ 标准化；内容中注入 **可购 CTA**；
- ChatGPT 推荐中出现可购 Offer，用户点击 **Buy**；
- 平台完成授权/下单/履约，Closed-Loop 数据回写至归因看板。

---

## 15. 附录：术语
- **GEO**：生成引擎优化（Generation Engine Optimization）。
- **ACP**：Agentic Commerce Protocol，代理商务协议（支持即时结账）。
- **MOR**：Merchant of Record，记录商家。
- **Offer**：可售报价视图（价格/库存/商家/区域）。

> 本文档为 v1，可作为 PRD/技术方案与对外方案宣讲的共同底板。后续可拆分为：网关/支付/编排 3 份 PRD、Neo4j Schema 迁移脚本、OpenAPI 3 契约与演示 Demo。

