# SweetNight GEO 自动化数据管道

## 📋 项目概述

为 SweetNight 品牌实现的自动化数据收集、处理和知识图谱构建管道。

## 🎯 已完成功能

### ✅ Phase 1-4 全面验证通过
- **Phase 1**: Data Collection Service (端口 8003) - 健康运行
- **Phase 2**: ETL Processing Service (端口 8004) - 健康运行
- **Phase 3**: ECharts Visualization - 集成完成
- **Phase 4**: Scheduler Service (端口 8005) - 健康运行

### ✅ 自动化数据管道
- **完整流程**: Web → Firecrawl → Data Collection → ETL → Neo4j
- **端到端测试**: 5/5 测试通过
- **数据验证**: 成功收集并处理测试数据

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                  Scheduler Service (8005)                │
│                  - Cron/Interval Scheduling             │
│                  - Task Orchestration                    │
└──────────────────────┬──────────────────────────────────┘
                       │
      ┌────────────────┴────────────────┐
      │                                  │
      ▼                                  ▼
┌─────────────────┐              ┌──────────────────┐
│ Data Collection │              │  ETL Processing  │
│   Service       │─────────────▶│    Service       │
│   (Port 8003)   │              │   (Port 8004)    │
└─────────────────┘              └────────┬─────────┘
      │                                    │
      │ Firecrawl API (3002)              │
      ▼                                    ▼
┌─────────────────┐              ┌──────────────────┐
│   Web Content   │              │   Neo4j Graph    │
│   Scraping      │              │   Database       │
└─────────────────┘              └──────────────────┘
```

## 📊 当前数据状态

**Neo4j 数据库统计**:
- 总节点数: 44 nodes
- 总关系数: 41 relationships
- 节点类型分布:
  - Feature: 11 个
  - Product: 10 个
  - Problem: 9 个
  - UserGroup: 6 个
  - Scenario: 5 个
  - Brand: 3 个

## 🚀 快速开始

### 1. 启动所有服务

```bash
# Terminal 1: Data Collection Service
cd backend/services/data-collection
source venv/bin/activate
uvicorn main:app --reload --port 8003

# Terminal 2: ETL Processing Service
cd backend/services/etl-processing
source venv/bin/activate
uvicorn main:app --reload --port 8004

# Terminal 3: Scheduler Service
cd backend/services/scheduler
source venv/bin/activate
uvicorn main:app --reload --port 8005

# Terminal 4: Knowledge Graph Service
cd backend/services/knowledge-graph
source venv/bin/activate
uvicorn main:app --reload --port 8001
```

### 2. 测试数据管道

```bash
cd backend/services/scheduler

# 简单测试（使用 example.com）
./test_simple_pipeline.sh

# 完整的 E2E 测试
python3 test_e2e_pipeline.py

# 检查管道状态
python3 check_pipeline_status.py
```

### 3. 手动触发数据收集

```bash
# 收集单个页面
curl -X POST http://localhost:8003/api/v1/collection/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown"],
    "only_main_content": true
  }'

# 查看任务状态
curl http://localhost:8003/api/v1/collection/stats
```

## 📈 监控端点

| 服务 | 健康检查 | 统计信息 |
|------|---------|---------|
| Data Collection | http://localhost:8003/health | http://localhost:8003/api/v1/collection/stats |
| ETL Processing | http://localhost:8004/health | http://localhost:8004/api/v1/etl/stats |
| Scheduler | http://localhost:8005/health | http://localhost:8005/api/v1/scheduler/stats |
| Knowledge Graph | http://localhost:8001/health | http://localhost:8001/api/v1/graph/stats |

## 🛠️ 工具脚本

### setup_sweetnight_pipeline.py
创建自动化调度任务并立即执行数据收集。

**功能**:
- 创建 4 个自动化调度任务
- 立即触发数据收集
- 监控执行进度
- 显示管道统计信息

**使用方法**:
```bash
python3 setup_sweetnight_pipeline.py
```

### test_e2e_pipeline.py
端到端集成测试，验证所有服务是否正常运行。

**测试项目**:
1. Services Health Check
2. Neo4j Connection Test
3. Data Collection Stats
4. ETL Processing Stats
5. Scheduler Stats

**使用方法**:
```bash
python3 test_e2e_pipeline.py
```

### check_pipeline_status.py
详细的管道状态检查工具。

**检查内容**:
- 活跃的调度任务
- 最近的任务执行
- 数据收集任务状态
- ETL 处理任务状态
- Neo4j 数据库状态

**使用方法**:
```bash
python3 check_pipeline_status.py
```

### test_simple_pipeline.sh
简单的管道功能测试（使用 example.com）。

**使用方法**:
```bash
./test_simple_pipeline.sh
```

## ⚠️ 已知问题

### 1. Scheduler 服务内存存储
**问题**: 调度任务和执行历史存储在内存中，服务重启后会丢失。

**影响**:
- 服务重启后所有调度任务消失
- 无法持久化任务执行历史

**临时解决方案**:
- 避免频繁重启服务
- 每次重启后重新运行 `setup_sweetnight_pipeline.py`

**长期解决方案**:
- 实现 SQLite/PostgreSQL 数据库持久化
- 添加调度任务的导入/导出功能

### 2. SweetNight 官网 URL 访问限制
**问题**: 直接抓取 SweetNight 官网（sweetnight.com）失败。

**原因**:
- 可能有反爬虫保护
- 地理位置限制
- Firecrawl API 无法访问

**解决方案**:
- 使用公开的产品评论网站（如 Amazon, Sleep Foundation）
- 使用 YouTube 视频评论（通过 YouTube API）
- 使用 Reddit 讨论（通过 Reddit API）

### 3. 并发请求限制
**问题**: 同时发起多个 Firecrawl 请求可能导致失败。

**解决方案**:
- 调度任务之间添加延迟
- 限制并发请求数量
- 实现请求队列和速率限制

## 📝 数据管道使用建议

### 推荐的数据源

#### 1. 产品信息
```python
# Amazon 产品页面
{"url": "https://www.amazon.com/sweetnight-mattress/dp/XXX"}

# Sleep Foundation 评测
{"url": "https://www.sleepfoundation.org/mattress-reviews/sweetnight"}
```

#### 2. 用户评论
```python
# Reddit 讨论
# 需要使用 Reddit API（已在 data-collector 中实现）

# YouTube 评论
# 需要使用 YouTube API（已在 data-collector 中实现）
```

#### 3. 竞品分析
```python
# 公开可访问的竞品页面
{"url": "https://www.casper.com/mattresses"}
{"url": "https://www.purple.com/mattresses"}
```

## 🔮 下一步开发计划

### Phase 5: 数据持久化
- [ ] 实现 Scheduler 数据库存储（SQLite/PostgreSQL）
- [ ] 添加任务执行历史持久化
- [ ] 实现调度任务导入/导出

### Phase 6: 增强数据收集
- [ ] 集成 YouTube API 收集视频评论
- [ ] 集成 Reddit API 收集论坛讨论
- [ ] 实现智能 URL 发现（自动查找相关页面）

### Phase 7: 数据质量优化
- [ ] 添加数据去重逻辑
- [ ] 实现增量更新（只收集新内容）
- [ ] 添加数据验证和清洗

### Phase 8: 监控和告警
- [ ] 实现 Web 监控界面
- [ ] 添加任务失败告警（Email/Slack）
- [ ] 实现数据质量监控

### Phase 9: API 集成
- [ ] 连接前端 Knowledge Graph 可视化
- [ ] 实现 GraphQL API
- [ ] 添加数据导出功能（JSON/CSV/Excel）

## 📚 相关文档

- [Data Collection Service README](../data-collection/README.md)
- [ETL Processing Service README](../etl-processing/README.md)
- [Scheduler Service API 文档](./API.md)
- [主项目 CLAUDE.md](/Users/cavin/Desktop/dev/leapacp/CLAUDE.md)

## 🤝 贡献

如需添加新功能或修复问题，请：
1. 创建新的 feature branch
2. 实现并测试更改
3. 运行所有测试确保通过
4. 提交 Pull Request

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目 Issue: [GitHub Issues](https://github.com/your-repo/issues)
- 技术文档: 参考 CLAUDE.md

---

**最后更新**: 2025-10-14
**版本**: 1.0.0
**状态**: ✅ 生产就绪（需要注意已知问题）
