# INITIAL: Data Collector Service

## FEATURE

### 服务概述
data-collector-service是Leap ACP平台GEO侧的数据采集服务，负责从多个在线平台自动采集与品牌产品相关的用户生成内容（UGC），用于知识图谱构建和内容生成。

### 核心功能需求

#### 1. 多平台数据源集成（优先级：⭐⭐⭐）
**必须支持的数据源**：
- Reddit (通过PRAW API或Firecrawl)
- YouTube (评论、视频描述、字幕)
- Medium (文章、评论)
- Quora (问题、回答)
- Product Hunt (产品讨论、评论)
- Twitter/X (推文、回复)
- Amazon Reviews (产品评论)
- Trustpilot (品牌评价)

**数据采集内容**：
- 文本内容（标题、正文、评论）
- 元数据（作者、发布时间、点赞数、评论数）
- 分类标签（话题、标签）
- 情感倾向（正面/负面/中性）
- 关联链接

#### 2. 智能采集调度（优先级：⭐⭐⭐）
- 使用Celery + Redis实现异步任务队列
- 支持定时采集（cron表达式配置）
- 支持手动触发采集
- 采集任务去重（基于URL/ID）
- 增量采集（仅获取新内容）
- 采集频率控制（避免被封禁）

#### 3. API配额管理（优先级：⭐⭐）
- 追踪各平台API调用次数
- 配额预警（达到80%发送通知）
- 配额耗尽时自动降级（降低频率或暂停）
- 支持多个API Key轮换

#### 4. 数据清洗与规范化（优先级：⭐⭐⭐）
- HTML标签清理
- 特殊字符处理
- 语言检测（过滤非目标语言）
- 垃圾内容过滤（spam、广告）
- 统一数据格式（MongoDB文档结构）

#### 5. 数据存储（优先级：⭐⭐⭐）
- 使用MongoDB存储原始采集数据
- 数据库集合设计：
  ```javascript
  // collections.raw_content
  {
    content_id: UUID,
    source_platform: "reddit"|"youtube"|...,
    source_url: string,
    content_type: "post"|"comment"|"review"|"article",
    title: string,
    body: string,
    author: {
      id: string,
      name: string,
      reputation: number
    },
    metadata: {
      published_at: datetime,
      likes_count: number,
      comments_count: number,
      tags: [string],
      sentiment: "positive"|"negative"|"neutral"
    },
    tenant_id: UUID,
    brand_id: UUID,
    product_keywords: [string],
    collected_at: datetime,
    processed: boolean,
    processing_status: "pending"|"processed"|"failed"
  }
  ```

#### 6. 知识图谱集成（优先级：⭐⭐）
- 提取关键实体（产品名、特性、问题）
- 调用knowledge-graph-service API创建节点和关系
- 记录内容与知识图谱的关联关系

#### 7. API接口（优先级：⭐⭐⭐）
**RESTful Endpoints**：
```
POST   /api/v1/collector/tasks              # 创建采集任务
GET    /api/v1/collector/tasks/{task_id}    # 查询任务状态
DELETE /api/v1/collector/tasks/{task_id}    # 取消任务
GET    /api/v1/collector/tasks              # 列出所有任务
POST   /api/v1/collector/trigger            # 手动触发采集
GET    /api/v1/collector/quota              # 查询API配额状态
GET    /api/v1/collector/content            # 查询采集内容
GET    /api/v1/collector/health             # 健康检查
```

#### 8. 配置管理（优先级：⭐⭐）
- 支持环境变量配置
- 支持租户级别的采集规则
- 支持品牌级别的关键词配置
- 采集黑名单/白名单

### 非功能性需求

#### 性能要求
- 单个采集任务处理时间：<30秒
- 并发采集任务数：≥10
- 数据存储响应时间：<100ms

#### 可靠性要求
- 采集失败自动重试（最多3次）
- 重试指数退避策略
- 失败任务记录错误日志

#### 可观测性
- 采集任务状态追踪
- API调用次数统计
- 错误率监控
- 采集数据量统计

---

## EXAMPLES

### 参考文件1: knowledge-graph-service
**文件路径**: `backend/services/knowledge-graph/`

**参考内容**：
1. **项目结构**：
   ```
   backend/services/data-collector/
   ├── models/
   │   ├── __init__.py
   │   ├── content.py        # 数据模型（MongoDB文档）
   │   └── task.py           # 采集任务模型
   ├── services/
   │   ├── __init__.py
   │   ├── collector_service.py  # 核心采集服务
   │   ├── reddit_collector.py   # Reddit采集器
   │   ├── youtube_collector.py  # YouTube采集器
   │   └── ...                   # 其他平台采集器
   ├── api/
   │   ├── __init__.py
   │   ├── schemas.py        # Pydantic模型
   │   └── routes.py         # FastAPI路由
   ├── tasks/
   │   ├── __init__.py
   │   └── celery_tasks.py   # Celery异步任务
   ├── utils/
   │   ├── __init__.py
   │   ├── quota_manager.py  # API配额管理
   │   └── data_cleaner.py   # 数据清洗
   ├── tests/
   │   ├── __init__.py
   │   ├── conftest.py
   │   ├── test_collector_service.py
   │   └── test_api.py
   ├── config.py             # 配置管理
   ├── main.py               # FastAPI应用入口
   ├── celery_app.py         # Celery应用配置
   ├── requirements.txt      # 依赖
   └── README.md             # 文档
   ```

2. **FastAPI应用模式**：参考`knowledge-graph/main.py`的应用结构
3. **API路由模式**：参考`knowledge-graph/api/routes.py`的路由设计
4. **测试模式**：参考`knowledge-graph/tests/`的测试结构

### 参考文件2: Firecrawl集成
**MCP配置路径**: `~/.mcp.json`

**Firecrawl配置**：
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "@mendable/firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_URL": "http://localhost:3002",
        "FIRECRAWL_API_KEY": "fs-test"
      }
    }
  }
}
```

**Firecrawl使用场景**：
- 对于不提供API的平台（如Medium、部分论坛）使用Firecrawl抓取
- 对于提供API的平台（如Reddit、YouTube）优先使用官方API

### 参考文件3: Celery异步任务
**全局配置**: Celery + Redis已在MCP配置中可用

**Celery配置示例**：
```python
# celery_app.py
from celery import Celery

app = Celery(
    'data_collector',
    broker='redis://localhost:6382/0',
    backend='redis://localhost:6382/0'
)

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30分钟超时
)
```

**任务定义示例**：
```python
# tasks/celery_tasks.py
from celery_app import app
from services.collector_service import CollectorService

@app.task(bind=True, max_retries=3)
def collect_from_platform(self, platform: str, keywords: list, tenant_id: str):
    """采集任务"""
    try:
        service = CollectorService()
        result = service.collect(platform, keywords, tenant_id)
        return result
    except Exception as exc:
        # 指数退避重试
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
```

---

## DOCUMENTATION

### 官方API文档

1. **Reddit API (PRAW)**
   - URL: https://praw.readthedocs.io/en/stable/
   - 认证：OAuth2
   - 限制：60请求/分钟

2. **YouTube Data API v3**
   - URL: https://developers.google.com/youtube/v3
   - 认证：API Key
   - 配额：10,000单位/天

3. **Firecrawl (Self-Hosted)**
   - URL: http://localhost:3002
   - API文档: http://localhost:3002/api-docs
   - 认证：API Key (fs-test)

4. **Celery**
   - URL: https://docs.celeryq.dev/en/stable/
   - 配置：Redis作为broker和backend

5. **MongoDB Motor (异步驱动)**
   - URL: https://motor.readthedocs.io/en/stable/
   - 连接：mongodb://claude:claude_mongo_2025@localhost:27018/claude_dev

### 技术栈文档

- **FastAPI**: https://fastapi.tiangolo.com/
- **Pydantic v2**: https://docs.pydantic.dev/latest/
- **Redis**: https://redis.io/docs/
- **pytest**: https://docs.pytest.org/

### 项目内部文档

- **知识图谱服务API**: `backend/services/knowledge-graph/README.md`
- **项目开发指南**: `leap_acp_dev_guide.md`
- **API规范**: `CLAUDE.md` (API接口规范章节)

---

## OTHER CONSIDERATIONS

### Gotchas & Constraints

#### 1. API限流与封禁风险
- **问题**: 过于频繁的请求会导致IP被封禁
- **解决方案**:
  - 实现请求间隔控制（每个平台不同）
  - 使用代理IP轮换（如需要）
  - 遵守robots.txt规则
  - 添加User-Agent伪装

#### 2. 数据质量问题
- **问题**: 采集到的内容可能包含垃圾信息、广告、重复内容
- **解决方案**:
  - 实现内容去重算法（基于相似度检测）
  - 垃圾内容过滤规则（关键词黑名单）
  - 内容质量评分（长度、语言、完整性）

#### 3. 异步任务管理
- **问题**: Celery任务可能长时间运行或失败
- **解决方案**:
  - 设置任务超时时间（30分钟）
  - 实现任务状态追踪
  - 失败任务重试机制
  - 任务结果持久化到MongoDB

#### 4. 多租户数据隔离
- **问题**: 不同租户的采集任务和数据必须隔离
- **解决方案**:
  - 每个任务必须携带tenant_id
  - MongoDB查询必须包含tenant_id过滤
  - API层验证租户权限

#### 5. 敏感信息处理
- **问题**: API Keys和凭证不能泄露
- **解决方案**:
  - 使用环境变量存储凭证
  - 不在日志中记录完整API Key
  - 使用~/.mcp.env安全存储（600权限）

#### 6. 与知识图谱服务集成
- **问题**: 需要调用knowledge-graph-service API
- **解决方案**:
  - 使用httpx异步HTTP客户端
  - 服务发现（通过环境变量配置knowledge-graph服务地址）
  - 实现重试和熔断机制

#### 7. MongoDB异步操作
- **问题**: FastAPI是异步框架，需要异步MongoDB驱动
- **解决方案**:
  - 使用Motor（MongoDB官方异步驱动）
  - 连接池管理
  - 正确处理异步上下文

### 数据依赖

- **上游服务**: 无（作为数据入口服务）
- **下游服务**:
  - knowledge-graph-service（存储提取的实体和关系）
  - faq-clustering-service（后续用于FAQ聚类）
- **数据库**:
  - MongoDB（存储原始采集数据）
  - Redis（Celery任务队列）
  - Neo4j（通过knowledge-graph-service间接使用）

### 验证门控

#### Level 1: 环境搭建验证
- [ ] Python 3.11+环境
- [ ] 安装所有依赖（requirements.txt）
- [ ] MongoDB连接成功
- [ ] Redis连接成功
- [ ] 代码语法检查通过

#### Level 2: 单元测试
- [ ] CollectorService核心方法测试
- [ ] 数据清洗函数测试
- [ ] API配额管理测试
- [ ] 测试覆盖率≥80%

#### Level 3: 集成测试
- [ ] API端点测试（创建任务、查询任务、查询内容）
- [ ] MongoDB数据读写测试
- [ ] Celery任务执行测试

#### Level 4: 平台采集测试
- [ ] Reddit采集测试（使用测试关键词）
- [ ] YouTube采集测试
- [ ] Firecrawl采集测试（Medium文章）

#### Level 5: 知识图谱集成测试
- [ ] 成功调用knowledge-graph-service API
- [ ] 提取的实体正确创建到Neo4j
- [ ] 关联关系正确建立

#### Level 6: 端到端测试
- [ ] 创建采集任务→Celery执行→数据存储→知识图谱更新
- [ ] 多租户数据隔离验证
- [ ] API配额管理验证

#### Level 7: 性能测试
- [ ] 并发采集任务测试（≥10个任务）
- [ ] 单任务处理时间<30秒
- [ ] MongoDB写入响应<100ms

### 成功标准

1. **功能完整性**: 支持≥5个数据源的采集
2. **API可用性**: 所有7个API端点正常工作
3. **测试覆盖率**: ≥80%
4. **性能达标**: 满足所有性能要求
5. **数据质量**: 采集内容去重率≥95%
6. **可观测性**: 采集任务状态可追踪，错误可告警
7. **文档完整**: README包含部署、使用、API文档

---

## 实施优先级

### Phase 1: 核心框架（Day 1-2）⭐⭐⭐
- 项目结构搭建
- FastAPI应用骨架
- MongoDB连接
- Celery配置
- 基础API端点

### Phase 2: Reddit采集器（Day 2-3）⭐⭐⭐
- Reddit API集成（PRAW）
- 数据清洗
- MongoDB存储
- 基础测试

### Phase 3: 任务调度（Day 3-4）⭐⭐⭐
- Celery异步任务
- 任务状态管理
- 任务去重

### Phase 4: 扩展数据源（Day 4-5）⭐⭐
- YouTube采集器
- Firecrawl集成（Medium）
- 其他平台采集器（可选）

### Phase 5: 知识图谱集成（Day 5）⭐⭐
- 实体提取
- 调用knowledge-graph-service API
- 关联关系建立

### Phase 6: 测试与文档（Day 6）⭐⭐⭐
- 完整测试套件
- API文档
- 部署文档

---

**预计总工时**: 3-4天（使用Context Engineering自动化开发）
**置信度目标**: ≥7/10
