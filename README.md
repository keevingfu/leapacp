# Leap ACP - Agentic Commerce Platform

**Leap Agentic Commerce Platform (ACP)** 是一个集成**生成引擎优化（GEO）**和**代理商务（ACP）**的一体化平台，旨在让品牌在AI时代不仅"被看见"，更能"被购买"。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/keevingfu/leapacp)](https://github.com/keevingfu/leapacp/stargazers)

## 🎯 核心定位

- **GEO侧**: 通过知识图谱+多模态内容生成提升AI Citation率
- **Commerce侧**: 通过ACP协议实现AI对话中的即时结账能力
- **多租户**: 支持多品牌、多项目的统一运营与数据隔离

## ✨ 功能特性

### 前端应用
- ✅ **9个完整业务页面**
  - Dashboard - 数据概览仪表板
  - Analytics - 数据分析与可视化
  - Knowledge Graph - 知识图谱可视化（React Flow）
  - Data Collection - 多平台数据采集管理
  - Content Generation - AI内容生成工作区
  - Content Library - 内容库管理
  - Orders - 订单管理
  - Offers - 报价目录管理
  - Settings - 系统设置

- 🎨 **7个可复用UI组件** (基于 shadcn/ui)
  - Button, Card, Badge, Table, Input, Textarea, Tabs

### 后端服务
- ✅ **Knowledge Graph Service** - Neo4j知识图谱管理
- ✅ **Data Collector Service** - 多平台数据采集（YouTube/Reddit/Firecrawl）
- 🚧 **Content Generator Service** - 基于LLM的多模态内容生成
- 🚧 **Commerce Gateway** - ACP协议网关
- 🚧 **Order Orchestrator** - 订单编排SAGA状态机

## 🏗️ 技术栈

### Frontend
- **框架**: React 18 + TypeScript 5.9
- **构建工具**: Vite 7.1
- **样式**: Tailwind CSS 3.4 + shadcn/ui
- **路由**: React Router DOM 7.9
- **可视化**: React Flow 11.11, Recharts 3.2
- **状态管理**: Zustand 5.0, TanStack Query 5.90

### Backend
- **框架**: FastAPI (Python 3.11+)
- **图数据库**: Neo4j 5.x
- **关系数据库**: PostgreSQL 15+
- **缓存**: Redis 7.x
- **异步任务**: Celery 5.3+
- **消息队列**: Kafka 3.x / RabbitMQ

### DevOps
- **容器**: Docker + Docker Compose
- **编排**: Kubernetes
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack / Loki
- **CI/CD**: GitHub Actions

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.11+
- Docker Desktop
- PostgreSQL 15+
- Redis 7+
- Neo4j 5+

### 1. 克隆项目

```bash
git clone https://github.com/keevingfu/leapacp.git
cd leapacp
```

### 2. 前端启动

```bash
cd frontend
npm install
npm run dev
```

访问: http://localhost:5173

### 3. 后端启动

#### Knowledge Graph Service

```bash
cd backend/services/knowledge-graph
cp .env.example .env
# 编辑 .env 填入 Neo4j 连接信息
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

#### Data Collector Service

```bash
cd backend/services/data-collector
cp .env.example .env
# 编辑 .env 填入数据库和API密钥
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

### 4. 验证系统

```bash
cd frontend
npm run verify        # 快速验证（5秒）
npm run verify-full   # 完整验证（30-60秒）
```

## 🔒 安全配置

### GitHub Token 保护

本项目使用 `.env` 文件保护敏感信息（如 GitHub Token）。

**重要提示**:
- ✅ `.env` 文件已在 `.gitignore` 中，**永远不会**被提交到 Git
- ✅ `.env` 文件权限已设置为 `600`（仅所有者可读写）
- ✅ 使用 `.env.example` 作为模板

### 设置您的 .env 文件

```bash
# 1. 复制模板
cp .env.example .env

# 2. 编辑并填入您的实际值
nano .env

# 3. 设置安全权限
chmod 600 .env

# 4. 验证权限
ls -la .env  # 应显示 -rw-------
```

### 获取 GitHub Personal Access Token

1. 访问 GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 设置 Token 名称和有效期
4. 勾选权限: `repo` (Full control of private repositories)
5. 生成并复制 Token
6. 粘贴到 `.env` 文件的 `GITHUB_TOKEN` 字段

⚠️ **警告**: Token 只会显示一次，请妥善保存！

## 📦 项目结构

```
leapacp/
├── .claude/                   # Claude Code 自动化命令
│   └── commands/
│       ├── generate-prp.md    # 生成 Product Requirements Prompt
│       └── execute-prp.md     # 执行 PRP
├── backend/
│   └── services/
│       ├── knowledge-graph/   # 知识图谱服务
│       └── data-collector/    # 数据采集服务
├── frontend/                  # React 前端应用
│   ├── src/
│   │   ├── pages/            # 9个业务页面
│   │   ├── components/ui/    # 7个UI组件
│   │   └── layouts/          # 布局组件
│   ├── quick-check.sh        # 快速验证脚本
│   └── verify.sh             # 完整验证脚本
├── PRPs/                      # Product Requirements Prompts
│   ├── knowledge-graph-service.md
│   └── data-collector-service.md
├── .env.example               # 环境变量模板
├── .gitignore                 # Git 忽略规则
├── CLAUDE.md                  # Claude Code 项目指南
├── VERIFICATION_GUIDE.md      # 验证操作指南
└── README.md                  # 本文件
```

## 🧪 测试

### 前端测试

```bash
cd frontend
npm run type-check    # TypeScript 类型检查
npm run lint          # ESLint 检查
npm run build         # 生产构建
npm run verify        # 快速验证
npm run verify-full   # 完整验证
```

### 后端测试

```bash
cd backend/services/knowledge-graph
pytest tests/ -v --cov=.

cd ../data-collector
pytest tests/ -v --cov=.
```

## 📊 验证系统

项目包含自动化验证工具，确保每次任务完成后系统正常运行：

### 快速验证（推荐）
```bash
cd frontend && npm run verify
```
**检查内容**: TypeScript、关键文件、页面组件、构建产物
**执行时间**: ~5秒

### 完整验证
```bash
cd frontend && npm run verify-full
```
**检查内容**: 依赖、TypeScript、ESLint、构建、文件、组件、服务器
**执行时间**: ~30-60秒

详见: [VERIFICATION_GUIDE.md](./VERIFICATION_GUIDE.md)

## 📝 文档

- [产品需求文档 (PRD)](./leap_acp_prd.md) - 完整的产品需求说明
- [开发指南](./leap_acp_dev_guide.md) - 开发规范和最佳实践
- [用户指南](./leap_acp_user_guide.md) - 用户操作手册
- [验证指南](./VERIFICATION_GUIDE.md) - 自动化验证说明
- [Context Engineering](./CLAUDE.md) - AI 辅助开发指南

## 🛠️ 开发工作流

### Context Engineering 方法

本项目集成了 Context Engineering 自动化开发能力：

```bash
# 1. 定义功能需求（创建 INITIAL.md）
# 2. 生成 Product Requirements Prompt
/generate-prp INITIAL-feature-name.md

# 3. 自动化执行 PRP
/execute-prp PRPs/feature-name.md
```

### 标准开发流程

1. 创建功能分支: `git checkout -b feature/your-feature`
2. 开发并测试
3. 运行验证: `npm run verify-full`
4. 提交代码: `git commit -m "feat: your feature"`
5. 推送: `git push origin feature/your-feature`
6. 创建 Pull Request

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 提交规范 (Conventional Commits)

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建工具或依赖
```

### 分支策略

- `main` - 生产环境
- `develop` - 开发环境
- `feature/*` - 功能分支
- `hotfix/*` - 紧急修复

## 📈 项目状态

- **前端**: ✅ 完成（9个页面，7个组件，所有验证通过）
- **后端**: 🚧 进行中（Knowledge Graph ✅, Data Collector ✅）
- **测试**: ✅ 单元测试框架就绪
- **文档**: ✅ 完整

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🌟 致谢

- 使用 [Claude Code](https://claude.com/claude-code) 开发
- UI 组件基于 [shadcn/ui](https://ui.shadcn.com/)
- 图谱可视化使用 [React Flow](https://reactflow.dev/)
- 图表库使用 [Recharts](https://recharts.org/)

## 📞 联系方式

- **GitHub**: [@keevingfu](https://github.com/keevingfu)
- **项目地址**: https://github.com/keevingfu/leapacp
- **问题反馈**: https://github.com/keevingfu/leapacp/issues

---

**Leap ACP** - 让品牌在 AI 时代被看见，更被购买 🚀

🤖 Generated with [Claude Code](https://claude.com/claude-code)
