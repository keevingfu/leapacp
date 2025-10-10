# 前端优先开发计划

**策略**: Frontend-First Development
**目标**: 先构建完整可交互的前端应用，再逐步对接后端服务
**更新时间**: 2025-10-09

---

## 📋 开发策略

### 核心理念
1. **用户视角**: 从不同角色使用平台的角度出发
2. **业务流程**: 完整覆盖GEO+Commerce全业务链路
3. **可运行验证**: 每个阶段都确保前端应用可独立运行
4. **Mock数据**: 前期使用Mock数据，后期逐步对接真实后端
5. **增量开发**: 从核心页面到完整系统，逐步扩展

### 开发顺序
```
Phase 1: 项目搭建 + 核心框架
  ↓
Phase 2: 基础页面（Dashboard + 导航）
  ↓
Phase 3: GEO模块页面
  ↓
Phase 4: Commerce模块页面
  ↓
Phase 5: System模块页面
  ↓
Phase 6: 后端对接（逐个服务）
  ↓
Phase 7: 端到端测试
```

---

## 👥 用户角色分析

### 1. 品牌运营经理 (Brand Manager)
**核心诉求**: 提升品牌AI Citation率、监控内容表现、管理商品Offer

**主要使用页面**:
- Dashboard（数据概览）
- Knowledge Graph（知识图谱管理）
- Content Generation（内容生成）
- Distribution（内容分发）
- Analytics（效果分析）
- Offer Management（商品管理）

### 2. 内容创作者 (Content Creator)
**核心诉求**: 快速生成高质量内容、了解内容表现

**主要使用页面**:
- Content Generation（内容创作）
- Content Scoring（内容评分）
- Distribution（发布管理）
- Analytics（内容效果）

### 3. 订单/客服专员 (Operations)
**核心诉求**: 处理订单、解决异常、跟踪履约

**主要使用页面**:
- Order Management（订单管理）
- Payments（支付管理）
- Fulfillment（履约追踪）

### 4. 技术管理员 (Admin)
**核心诉求**: 系统配置、用户管理、数据监控

**主要使用页面**:
- Team Management（团队管理）
- Brand Management（品牌配置）
- Settings（系统设置）
- Data Collection（数据采集配置）

---

## 🎨 前端技术栈

### 核心框架
- **React 18+** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具（快速HMR）
- **React Router v6** - 路由管理

### UI组件库
- **Tailwind CSS 3+** - 样式框架
- **shadcn/ui** - 组件库（基于Radix UI）
- **lucide-react** - 图标库

### 状态管理
- **Zustand** - 轻量级状态管理（比Redux简单）
- **React Query / TanStack Query** - 服务端状态管理

### 数据可视化
- **Recharts** - 图表库
- **React Flow** - 知识图谱可视化

### 开发工具
- **ESLint + Prettier** - 代码规范
- **Mock Service Worker (MSW)** - API Mock

---

## 📱 页面结构规划

### 布局层级
```
App
├── Auth Layout（登录/注册）
│   ├── Login
│   └── Register
└── Main Layout（主应用）
    ├── Header（顶部导航栏）
    ├── Sidebar（侧边栏菜单）
    └── Content（内容区）
        ├── Overview（概览）
        │   ├── Dashboard
        │   └── Analytics
        ├── GEO Module（GEO模块）
        │   ├── Data Collection
        │   ├── Knowledge Graph
        │   ├── FAQ Management
        │   ├── Content Generation
        │   ├── Content Scoring
        │   ├── Distribution
        │   └── AI Citations
        ├── Commerce Module（Commerce模块）
        │   ├── Offer Management
        │   ├── Order Management
        │   ├── Payments
        │   └── Fulfillment
        └── System Module（系统模块）
            ├── Team Management
            ├── Brand Management
            └── Settings
```

### 详细页面清单（25个页面）

#### Overview模块 (2个)
1. **Dashboard** - 数据概览仪表盘
2. **Analytics** - 深度数据分析

#### GEO模块 (7个)
3. **Data Collection** - 数据采集任务管理
4. **Knowledge Graph** - 知识图谱管理（实体、关系）
5. **FAQ Management** - FAQ知识地图
6. **Content Generation** - 内容生成工作台
7. **Content Library** - 内容库管理
8. **Content Scoring** - 内容质量评分
9. **Distribution** - 多平台分发
10. **AI Citations** - AI引用监测

#### Commerce模块 (4个)
11. **Offer Management** - 商品Offer管理
12. **Order Management** - 订单管理
13. **Payments** - 支付与结算
14. **Fulfillment** - 履约物流

#### System模块 (3个)
15. **Team Management** - 团队成员管理
16. **Brand Management** - 品牌配置
17. **Settings** - 系统设置

#### 公共页面 (4个)
18. **Login** - 登录页
19. **Register** - 注册页
20. **Profile** - 个人资料
21. **Notifications** - 通知中心

#### 详情页面 (5个)
22. **Order Detail** - 订单详情
23. **Content Detail** - 内容详情
24. **Offer Detail** - Offer详情
25. **Entity Detail** - 知识图谱实体详情

---

## 🚀 实施计划

### Phase 1: 项目搭建 + 基础框架 (Day 1)

**目标**: 搭建React + Vite + TypeScript项目，配置基础依赖

**任务**:
1. 创建Vite + React + TypeScript项目
2. 安装核心依赖（Tailwind, shadcn/ui, React Router等）
3. 配置ESLint + Prettier
4. 创建基础布局组件
   - MainLayout
   - Header
   - Sidebar
   - Footer
5. 配置路由结构
6. 创建Mock数据工具（MSW）

**产出**:
- 可运行的React应用
- 基础布局和导航
- 路由配置完成

**验证**: `npm run dev` 启动成功，显示基础布局

---

### Phase 2: Overview模块 (Day 1-2)

**目标**: 完成Dashboard和Analytics页面

**任务**:
1. **Dashboard页面**
   - 6个核心指标卡片
   - 转化漏斗图表
   - 最近订单列表
   - 内容发布趋势图
   - AI Citation趋势图
2. **Analytics页面**
   - 时间范围选择器
   - 多维度数据图表
   - 对比分析视图
   - 导出功能

**Mock数据**:
- 仪表盘指标数据
- 图表时序数据
- 订单列表数据

**产出**:
- 完整的Dashboard页面
- 完整的Analytics页面
- 可交互的图表

**验证**: 页面完整展示，图表交互流畅

---

### Phase 3: GEO模块 - 核心页面 (Day 2-3)

#### 3.1 Knowledge Graph页面
**功能**:
- 实体列表（Product, Feature, Scenario等）
- 实体创建/编辑表单
- 关系管理
- 可视化图谱（React Flow）
- 搜索和筛选

#### 3.2 Content Generation页面
**功能**:
- 内容类型选择（视频脚本、长文、FAQ等）
- 基于知识图谱的上下文选择
- AI生成参数配置
- 内容预览和编辑
- 保存草稿/发布

#### 3.3 Data Collection页面
**功能**:
- 采集任务列表
- 创建新任务（平台、关键词、频率）
- 任务状态监控
- 采集数据预览
- 任务日志查看

**Mock数据**:
- 知识图谱实体和关系
- 内容生成结果
- 采集任务列表

**产出**:
- 3个核心GEO页面完整实现

**验证**: 表单提交、列表展示、交互流畅

---

### Phase 4: GEO模块 - 扩展页面 (Day 3-4)

#### 4.1 FAQ Management
#### 4.2 Content Scoring
#### 4.3 Distribution
#### 4.4 AI Citations

**产出**: GEO模块全部7个页面完成

---

### Phase 5: Commerce模块 (Day 4-5)

#### 5.1 Offer Management
**功能**:
- Offer列表（SKU、价格、库存、商家）
- 创建/编辑Offer
- 批量导入
- 状态管理（上架/下架）

#### 5.2 Order Management
**功能**:
- 订单列表（状态、金额、时间）
- 订单详情（状态机可视化）
- 订单搜索和筛选
- 订单操作（取消、退款、补偿）

#### 5.3 Payments
**功能**:
- 支付流水列表
- 结算报表
- 对账功能

#### 5.4 Fulfillment
**功能**:
- 履约任务列表
- 物流追踪
- 异常处理

**Mock数据**:
- Offer列表
- 订单数据（包含完整状态机）
- 支付流水
- 物流信息

**产出**: Commerce模块全部4个页面完成

**验证**: 订单详情完整展示，状态流转清晰

---

### Phase 6: System模块 (Day 5)

#### 6.1 Team Management
#### 6.2 Brand Management
#### 6.3 Settings

**产出**: System模块全部3个页面完成

---

### Phase 7: 公共页面 + 优化 (Day 5-6)

#### 7.1 认证页面
- Login
- Register

#### 7.2 个人中心
- Profile
- Notifications

#### 7.3 细节优化
- 响应式适配
- 加载状态
- 错误处理
- 空状态设计
- 表单验证

**产出**: 完整的前端应用（纯Mock数据）

**验证**: 所有页面可访问，交互完整，UI美观

---

### Phase 8: 后端对接 - 逐步替换Mock (Week 2)

**策略**: 逐个服务对接，逐步替换Mock数据为真实API

#### 8.1 对接Knowledge Graph Service
- 替换知识图谱Mock数据
- 集成Neo4j查询结果
- 实现实体CRUD

#### 8.2 对接Data Collector Service
- 替换采集任务Mock
- 集成MongoDB查询
- 实时任务状态更新

#### 8.3 对接其他服务（按优先级）
- Content Generator（内容生成）
- Order Orchestrator（订单管理）
- Analytics（数据分析）

**工具**:
- Axios/Fetch封装
- React Query处理异步状态
- 环境变量配置（.env）

**产出**: 逐步对接真实后端，前后端打通

---

### Phase 9: 端到端测试 + 部署 (Week 3)

#### 9.1 功能测试
- 每个页面完整功能测试
- 前后端集成测试

#### 9.2 性能优化
- 代码分割（懒加载）
- 图片优化
- 缓存策略

#### 9.3 部署
- 构建优化
- 部署到Vercel/Netlify
- 配置环境变量

**产出**: 完整可用的生产环境应用

---

## 📊 进度跟踪

### 第1周：纯前端开发
- [x] Phase 1: 项目搭建
- [ ] Phase 2: Overview模块
- [ ] Phase 3-4: GEO模块
- [ ] Phase 5: Commerce模块
- [ ] Phase 6: System模块
- [ ] Phase 7: 公共页面优化

### 第2周：后端对接
- [ ] Phase 8.1: Knowledge Graph对接
- [ ] Phase 8.2: Data Collector对接
- [ ] Phase 8.3: 其他服务对接

### 第3周：测试与部署
- [ ] Phase 9.1: 功能测试
- [ ] Phase 9.2: 性能优化
- [ ] Phase 9.3: 生产部署

---

## ✅ 每日验证检查清单

### 开发中验证
- [ ] `npm run dev` 启动成功
- [ ] 无TypeScript错误
- [ ] 无ESLint警告
- [ ] 页面路由正常
- [ ] 交互功能正常
- [ ] 样式渲染正确
- [ ] Mock数据正确显示

### 提交前验证
- [ ] `npm run build` 构建成功
- [ ] `npm run preview` 预览正常
- [ ] 所有页面可访问
- [ ] 关键功能测试通过
- [ ] 响应式适配正常
- [ ] 无控制台错误

---

## 🎯 成功标准

### 第1周结束
- ✅ 25个页面全部完成
- ✅ 所有页面可交互
- ✅ Mock数据流畅运行
- ✅ UI美观一致
- ✅ 响应式适配

### 第2周结束
- ✅ 已完成后端服务对接
- ✅ 真实数据展示
- ✅ CRUD操作正常

### 第3周结束
- ✅ 端到端功能完整
- ✅ 性能达标
- ✅ 生产环境可用

---

## 📁 前端项目结构

```
frontend/
├── public/               # 静态资源
├── src/
│   ├── main.tsx         # 应用入口
│   ├── App.tsx          # 根组件
│   ├── routes/          # 路由配置
│   ├── layouts/         # 布局组件
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── pages/           # 页面组件
│   │   ├── overview/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Analytics.tsx
│   │   ├── geo/
│   │   │   ├── DataCollection.tsx
│   │   │   ├── KnowledgeGraph.tsx
│   │   │   ├── ContentGeneration.tsx
│   │   │   └── ...
│   │   ├── commerce/
│   │   │   ├── OfferManagement.tsx
│   │   │   ├── OrderManagement.tsx
│   │   │   └── ...
│   │   └── system/
│   │       └── ...
│   ├── components/      # 可复用组件
│   │   ├── ui/         # shadcn/ui组件
│   │   ├── charts/     # 图表组件
│   │   ├── forms/      # 表单组件
│   │   └── common/     # 通用组件
│   ├── hooks/          # 自定义Hooks
│   ├── lib/            # 工具函数
│   ├── services/       # API服务
│   ├── stores/         # Zustand stores
│   ├── mocks/          # Mock数据
│   │   ├── handlers.ts # MSW handlers
│   │   └── data.ts     # Mock数据
│   └── types/          # TypeScript类型
├── .env.example        # 环境变量模板
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🔄 与后端开发协调

### 并行开发策略
1. **前端团队**: 专注UI/UX，使用Mock数据
2. **后端团队**: 基于前端API需求开发服务
3. **接口契约**: 通过OpenAPI/Swagger定义接口
4. **定期同步**: 每周对接一次进度

### API契约定义
前端开发时同步输出API需求文档：
- 每个页面需要哪些API
- 请求/响应数据结构
- 错误处理规范

---

## 🚦 风险与应对

### 风险1: Mock数据与真实数据不匹配
**应对**:
- 前期定义清晰的数据结构（TypeScript types）
- 使用Zod等库进行运行时验证

### 风险2: 页面功能变更频繁
**应对**:
- 组件化设计，易于修改
- 保持代码灵活性

### 风险3: 后端API延迟
**应对**:
- Mock数据保留，可随时切换
- 分批对接，降低风险

---

**下一步**: 开始执行 Phase 1 - 项目搭建 🚀
