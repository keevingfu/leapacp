# Leap ACP 快速开发指南

本项目已集成全局自动化开发能力，可大幅提升开发效率。

## 🚀 快速开始

### 方式一：Context Engineering自动化开发 (推荐)

这是本项目已使用的方式，适合需求明确的功能开发。

#### 步骤1: 定义需求
创建 `INITIAL.md` 文件，包含：
- **FEATURE**: 具体功能需求
- **EXAMPLES**: 参考代码和模式
- **DOCUMENTATION**: 相关文档URL
- **OTHER CONSIDERATIONS**: 约束条件

#### 步骤2: 生成PRP (Product Requirements Prompt)
```bash
# 在Claude Code中执行
/generate-prp INITIAL.md
```

这会自动：
- 研究代码库中的类似模式
- 收集外部文档和最佳实践
- 生成详细的实现蓝图
- 创建可执行的验证门控
- 输出到 `PRPs/feature-name.md`

#### 步骤3: 执行PRP自动化实现
```bash
# 在Claude Code中执行
/execute-prp PRPs/feature-name.md
```

这会自动：
- 创建所有必要的文件
- 实现完整功能
- 编写单元测试和集成测试
- 运行验证确保质量
- 生成文档

**已完成示例**:
- ✅ `INITIAL.md` → Knowledge Graph Service 需求
- ✅ `PRPs/knowledge-graph-service.md` → 完整实施计划
- 🚧 正在执行自动化实现

---

## 🛠️ 方式二：使用BMAD角色命令

适合需要多角色协作的复杂业务系统。

### 需求分析阶段
```bash
# 市场研究和需求分析
/analyst --research "跨境DTC品牌的GEO和ACP需求"

# 输出: 市场分析报告、用户画像、竞品分析
```

### 架构设计阶段
```bash
# 系统架构设计
/architect --design "知识图谱服务架构"

# 输出: 架构图、技术选型、接口设计
```

### 项目管理阶段
```bash
# 创建PRD
/pm --create-prd "内容生成服务"

# 输出: 详细PRD文档、验收标准、里程碑
```

### 敏捷开发阶段
```bash
# 创建用户故事
/sm --create-stories

# 开发实现
/dev --implement "story-KG-001"

# 质量保证
/qa --test "knowledge-graph-service"
```

---

## ⚡ 方式三：SuperClaude快速命令

适合日常开发任务和快速迭代。

### 从PRD生成工作流
```bash
/sc:workflow leap_acp_prd.md

# 输出: 详细实施步骤、任务分解、依赖关系
```

### 功能实现（自动使用MCP）
```bash
# 实现功能，自动连接Neo4j等MCP服务
/sc:implement --feature "FAQ聚类服务"

# 自动：
# - 检测需要的数据库（Neo4j/PostgreSQL/Redis）
# - 生成数据模型
# - 实现业务逻辑
# - 集成MCP服务器
```

### 测试与报告
```bash
# 执行测试并生成报告
/sc:test --coverage

# 输出: 测试结果、覆盖率报告、失败原因
```

### Git智能操作
```bash
# 智能分析变更，生成提交信息
/sc:git --commit

# 自动：
# - 分析git diff
# - 生成符合Conventional Commits规范的提交信息
# - 添加Co-Authored-By标签
```

### 代码分析
```bash
# 多维度代码分析
/sc:analyze --security --performance

# 输出: 安全漏洞、性能瓶颈、代码异味、改进建议
```

---

## 🗄️ 使用MCP服务器能力

本项目可直接使用全局配置的20+个MCP服务器：

### Neo4j图数据库 (核心依赖)
```bash
# 连接信息
URI: bolt://localhost:7687
HTTP: http://localhost:7475
用户: neo4j
密码: (见 ~/.mcp.env)

# 浏览器管理界面
open http://localhost:7475
```

### PostgreSQL关系数据库
```bash
# 连接信息
Host: localhost:5437
User: claude
Database: claude_dev
密码: (见 ~/.mcp.env)

# 命令行连接
psql -h localhost -p 5437 -U claude -d claude_dev
```

### MongoDB文档数据库
```bash
# 连接信息
URI: mongodb://localhost:27018
User: claude
Database: claude_dev

# 命令行连接
mongosh mongodb://claude:password@localhost:27018/claude_dev
```

### Redis缓存
```bash
# 连接信息
Host: localhost:6382
密码: (见 ~/.mcp.env)

# 命令行连接
redis-cli -h localhost -p 6382 -a <password>
```

### Firecrawl自托管爬虫
```bash
# API端点
http://localhost:3002

# 管理界面
open http://localhost:3002/admin/@/queues

# 启动/停止
cd /Users/cavin/firecrawl
docker compose up -d    # 启动
docker compose down     # 停止
```

---

## 📝 协作与文档工具

### Notion知识库
```bash
# 创建项目文档
# MCP自动连接到配置的Notion workspace
```

### Feishu (飞书)
```bash
# 生成架构图、流程图、思维导图
# 支持Mermaid语法、数学公式(LaTeX)
# 自动同步项目文档
```

### GitHub操作
```bash
# 通过MCP直接操作GitHub
# - 创建Issue
# - 提交PR
# - 查看CI状态
```

---

## 🔍 开发工作流示例

### 示例1: 实现新的微服务

```bash
# 1. 定义需求
创建 INITIAL.md (参考已有的 INITIAL.md 格式)

# 2. 生成PRP
/generate-prp INITIAL.md

# 3. 审查PRP置信度评分
# 如果 ≥7/10，继续执行
# 如果 <7，补充更多上下文后重新生成

# 4. 执行自动化实现
/execute-prp PRPs/service-name.md

# 5. 验证结果
# - 检查生成的代码
# - 运行测试套件
# - 验证API文档

# 6. 提交代码
/sc:git --commit
```

### 示例2: 数据分析任务

```bash
# 1. 使用Sequential Thinking分解问题
# MCP自动启用结构化思维

# 2. 使用Memory MCP持久化分析结果
# 跨会话保持上下文

# 3. 使用数据库MCP直接查询
# Neo4j: 图谱分析
# PostgreSQL: 事务数据
# MongoDB: 非结构化数据

# 4. 使用Notion生成分析报告
```

### 示例3: 内容生成工作流

```bash
# 1. 使用Firecrawl采集数据
# 从竞品网站、社交媒体采集

# 2. 使用Neo4j构建知识图谱
# 实体识别、关系抽取

# 3. 使用LLM生成内容
# 基于知识图谱的上下文

# 4. 使用Feishu发布文档
# 自动格式化、添加图表
```

---

## 🎯 最佳实践

### Context Engineering最佳实践
1. **详细的INITIAL.md**: 越详细，PRP质量越高
2. **提供参考示例**: 指定代码库中类似模式的位置
3. **包含文档URL**: 提供官方文档的具体章节
4. **定义验证标准**: 明确成功的标准

### BMAD方法最佳实践
1. **按角色分工**: 每个命令专注特定职责
2. **顺序执行**: 遵循分析→设计→开发→测试流程
3. **文档驱动**: 每个阶段产生明确的文档输出
4. **迭代改进**: 根据反馈优化设计

### MCP使用最佳实践
1. **连接池管理**: 避免频繁创建/销毁连接
2. **数据安全**: 敏感信息只存储在 ~/.mcp.env
3. **性能优化**: 使用Redis缓存频繁访问的数据
4. **监控告警**: 通过MCP监控数据库状态

---

## 🆘 故障排查

### Context Engineering问题

**问题**: `/generate-prp` 命令不可用
```bash
# 解决: 确保命令文件存在
ls -la .claude/commands/

# 如果不存在，从Context-Engineering-Intro复制
cp /Users/cavin/Context-Engineering-Intro/.claude/commands/*.md .claude/commands/
```

**问题**: PRP置信度评分低
```bash
# 原因: 上下文不足
# 解决: 在INITIAL.md中补充
# - 更多代码示例
# - 更具体的文档链接
# - 更详细的约束条件
```

### MCP连接问题

**问题**: Neo4j连接失败
```bash
# 检查服务状态
docker ps | grep neo4j

# 启动Neo4j容器
docker start neo4j-claude-mcp

# 验证连接
python -c "from neo4j import GraphDatabase; driver = GraphDatabase.driver('bolt://localhost:7687', auth=('neo4j', 'password')); driver.verify_connectivity(); print('✓ Connected')"
```

**问题**: 其他数据库连接失败
```bash
# 检查所有MCP相关容器
docker ps -a | grep claude

# 批量启动
docker start postgres-claude-mcp mongodb-claude-mcp redis-claude-mcp neo4j-claude-mcp

# 验证环境变量
source ~/.mcp-load-env.sh
env | grep NEO4J
```

### BMAD命令问题

**问题**: 命令执行无响应
```bash
# 检查SuperClaude安装
ls -la ~/.claude/commands/sc/

# 如果命令不可用，可能需要等待Claude Code加载
# 或使用 Task 工具调用对应功能
```

---

## 📚 进一步学习

- **Context Engineering完整指南**: `/Users/cavin/Context-Engineering-Intro/README.md`
- **SuperClaude文档**: `/Users/cavin/SuperClaude/README.md`
- **MCP设置说明**: `~/.mcp-setup-README.md`
- **项目架构**: `CLAUDE.md`
- **PRD文档**: `leap_acp_prd.md`
- **开发指南**: `leap_acp_dev_guide.md`

---

## 🎉 开始开发

选择一个适合你的工作流，开始自动化开发吧！

```bash
# 快速开始: 使用已有的PRP
/execute-prp PRPs/knowledge-graph-service.md

# 或者: 从新需求开始
# 1. 创建 INITIAL.md
# 2. /generate-prp INITIAL.md
# 3. /execute-prp PRPs/feature-name.md
```

**提示**: 第一次使用建议从小功能开始，熟悉流程后再处理复杂任务。
