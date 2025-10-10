# Leap ACP 项目验证指南

**目的**: 确保每次完成任务后系统能够正常运行，无错误

---

## 🔍 自动化验证工具

### 前端应用验证

#### 快速检查（推荐）
```bash
cd frontend
npm run verify
```

**检查内容**:
- ✅ TypeScript类型检查
- ✅ 关键文件完整性
- ✅ 页面组件数量
- ✅ 构建产物存在

**执行时间**: ~5秒

#### 完整验证
```bash
cd frontend
npm run verify-full
```

**检查内容**:
- ✅ 依赖安装状态
- ✅ TypeScript类型检查
- ✅ ESLint代码质量
- ✅ 生产构建测试
- ✅ 所有关键文件
- ✅ 所有页面组件（9个）
- ✅ 所有UI组件（7个）
- ✅ 所有依赖包
- ✅ 开发服务器状态

**执行时间**: ~30-60秒

#### 仅类型检查
```bash
cd frontend
npm run type-check
```

---

## 📋 手动验证清单

### 前端应用验证

#### 1. 开发服务器启动
```bash
cd frontend
npm run dev
```

**预期结果**:
```
✓ Vite v7.1.9  ready in XXX ms
➜  Local:   http://localhost:5174/
```

**检查项**:
- [ ] 服务器成功启动
- [ ] 无编译错误
- [ ] 无TypeScript错误
- [ ] 热模块替换（HMR）正常工作

#### 2. 页面访问测试

访问以下所有页面，确保无错误：

| 页面 | 路径 | 验证项 |
|------|------|--------|
| Dashboard | http://localhost:5174/ | 显示4个指标卡片 |
| Analytics | http://localhost:5174/analytics | 图表正常渲染 |
| Knowledge Graph | http://localhost:5174/geo/knowledge-graph | React Flow图谱显示 |
| Data Collection | http://localhost:5174/geo/data-collection | 表格数据显示 |
| Content Generation | http://localhost:5174/geo/content-generation | Tabs切换正常 |
| Content Library | http://localhost:5174/geo/content-library | 搜索框显示 |
| Orders | http://localhost:5174/commerce/orders | 订单列表显示 |
| Offers | http://localhost:5174/commerce/offers | 报价列表显示 |
| Settings | http://localhost:5174/settings | 5个标签页显示 |

**检查项** (每个页面):
- [ ] 页面成功加载
- [ ] 无JavaScript错误
- [ ] 无React错误
- [ ] 样式正确应用
- [ ] 导航正常工作
- [ ] 组件交互正常

#### 3. 生产构建测试
```bash
cd frontend
npm run build
```

**预期结果**:
```
✓ 2626 modules transformed.
✓ built in X.XXs
```

**检查项**:
- [ ] 构建成功完成
- [ ] 无TypeScript错误
- [ ] 无Vite错误
- [ ] dist目录创建成功
- [ ] 产物文件存在（index.html, assets/*.js, assets/*.css）

#### 4. 预览生产版本
```bash
cd frontend
npm run preview
```

访问: http://localhost:4173

**检查项**:
- [ ] 生产版本正常运行
- [ ] 所有页面可访问
- [ ] 功能正常工作

---

### 后端服务验证

#### Knowledge Graph Service

```bash
cd backend/services/knowledge-graph
python -m py_compile models/*.py services/*.py api/*.py
```

**检查项**:
- [ ] 无Python语法错误
- [ ] 所有模块可导入

#### Data Collector Service

```bash
cd backend/services/data-collector
python -m py_compile models/*.py services/*.py utils/*.py
```

**检查项**:
- [ ] 无Python语法错误
- [ ] 所有模块可导入

---

## 🚨 常见问题与解决

### 问题1: TypeScript错误

**错误**: `error TS6133: 'X' is declared but its value is never read`

**解决**:
- 删除未使用的import
- 或使用下划线前缀 `_unusedVar`

### 问题2: Tailwind CSS未生效

**错误**: 页面无样式

**解决**:
```bash
cd frontend
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
```

### 问题3: React Flow类型错误

**错误**: `error TS1484: 'Node' is a type and must be imported using a type-only import`

**解决**:
```typescript
import { type Node, type Edge } from 'reactflow'
```

### 问题4: 端口被占用

**错误**: `Port 5173 is in use`

**解决**:
- Vite会自动使用下一个可用端口（5174）
- 或手动停止占用端口的进程

---

## ✅ 验证通过标准

### 前端应用

**必须通过**:
- ✅ TypeScript编译无错误
- ✅ 生产构建成功
- ✅ 所有9个页面正常加载
- ✅ 开发服务器正常运行

**可选通过**:
- ⚠️ ESLint警告（允许存在）
- ⚠️ Bundle大小警告（可优化）

### 后端服务

**必须通过**:
- ✅ Python语法检查通过
- ✅ 所有模块可导入
- ✅ 测试用例执行成功

---

## 📊 自动化CI/CD检查（未来）

### GitHub Actions工作流

```yaml
# .github/workflows/verify.yml
name: Verify Application

on: [push, pull_request]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm install
      - run: cd frontend && npm run type-check
      - run: cd frontend && npm run build
      - run: cd frontend && npm run verify
```

---

## 🎯 每次任务完成后必须执行

### 快速验证（1分钟内）

```bash
# 前端快速检查
cd frontend && npm run verify

# 后端语法检查
cd backend/services/knowledge-graph && python -m py_compile models/*.py
cd backend/services/data-collector && python -m py_compile models/*.py
```

### 完整验证（5分钟内）

```bash
# 前端完整检查
cd frontend
npm run verify-full
npm run build

# 后端测试
cd backend/services/knowledge-graph
pytest tests/ -v

cd backend/services/data-collector
pytest tests/ -v
```

---

## 📝 验证结果记录

每次任务完成后，在项目文档中记录：

```markdown
### 验证记录 - YYYY-MM-DD

**任务**: [任务描述]

**前端验证**:
- [x] TypeScript检查通过
- [x] 构建成功
- [x] 所有页面正常

**后端验证**:
- [x] 语法检查通过
- [x] 测试通过

**问题**: 无

**状态**: ✅ 通过
```

---

## 🔄 持续改进

定期更新验证脚本，添加新的检查项：

1. **性能检查**: Bundle大小、加载时间
2. **安全检查**: 依赖漏洞扫描
3. **代码质量**: 代码覆盖率、圈复杂度
4. **可访问性**: a11y检查
5. **浏览器兼容性**: 多浏览器测试

---

**最后更新**: 2025-10-10
**维护者**: Claude Code Team
