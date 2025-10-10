# CI/CD 自动化流程

**创建时间**: 2025-10-09
**目的**: 自动更新开发计划和项目状态，实现持续集成/持续开发

---

## 🎯 自动化目标

### 核心理念
每次完成任务后，自动将进展同步到所有相关文档，确保：
1. **开发计划实时更新** - AUTOMATION_PLAN.md反映最新进度
2. **项目状态同步** - PROJECT_STATUS.md展示当前状态
3. **Todo列表管理** - TodoWrite工具跟踪任务进度
4. **完成报告生成** - 每个里程碑自动生成COMPLETION_REPORT.md

---

## 📋 状态文件体系

### 1. AUTOMATION_PLAN.md
**用途**: 开发执行方案和任务清单
**更新时机**:
- 开始新的Phase时
- 完成任务时
- 修改计划时

**更新内容**:
```markdown
## 📋 项目现状分析
### ✅ 已完成 (XX%)
- ✅ Phase X: 任务描述 (文件名, 行数)

### 🚧 进行中
- 🚧 Phase Y: 当前任务

### ⏳ 待完成
- ⏳ Phase Z: 未来任务

### 📅 更新时间
- **最后更新**: YYYY-MM-DD HH:MM
- **完成度**: XX%
```

### 2. PROJECT_STATUS.md
**用途**: 项目整体状态报告
**更新时机**:
- 完成主要里程碑时
- 每日工作结束时

**更新内容**:
```markdown
**更新时间**: YYYY-MM-DD HH:MM
**项目阶段**: Phase X - 状态描述

### 进度明细
| Phase | 任务 | 状态 | 文件 | 代码行数 |
|-------|------|------|------|---------|
| Phase X | 任务名 | ✅ 完成 | filename.py | XXX |
```

### 3. Todo List (TodoWrite工具)
**用途**: 当前会话任务跟踪
**更新时机**: 实时更新
**状态**: pending → in_progress → completed

### 4. COMPLETION_REPORT.md
**用途**: 里程碑完成报告
**创建时机**: 完成重大模块/服务时
**包含内容**:
- 完成总结
- 代码统计
- 验证结果
- 遗留工作
- 使用说明

---

## 🔄 自动化工作流

### Workflow 1: 任务开始时

```bash
# 1. 创建TodoWrite任务清单
TodoWrite([
    {"content": "Phase X.Y: 任务描述", "status": "pending", "activeForm": "任务进行时"}
])

# 2. 更新AUTOMATION_PLAN.md
# 标记任务为"进行中"

# 3. 可选：更新PROJECT_STATUS.md
# 如果是新的Phase，更新项目阶段
```

### Workflow 2: 任务完成时

```bash
# 1. 标记TodoWrite为completed
TodoWrite([
    {"content": "Phase X.Y: 任务描述", "status": "completed", "activeForm": "任务进行时"}
])

# 2. 更新AUTOMATION_PLAN.md
# 将任务从"进行中"移到"已完成"
# 更新完成度百分比
# 记录代码行数

# 3. 更新PROJECT_STATUS.md进度表
# 更新任务状态为 ✅
# 填写代码行数
# 更新总计统计

# 4. 运行验证命令（如适用）
python -m py_compile file.py  # 语法检查
python -c "from module import Class"  # 导入测试
pytest tests/  # 测试运行
```

### Workflow 3: Phase完成时

```bash
# 1. 标记所有Todo为completed

# 2. 更新AUTOMATION_PLAN.md
# 更新Phase完成状态
# 更新时间戳

# 3. 更新PROJECT_STATUS.md
# 更新Phase状态为 ✅ 完成
# 更新验证门控状态

# 4. 生成阶段性报告（可选）
```

### Workflow 4: 里程碑完成时

```bash
# 1. 完成所有Todo

# 2. 全面更新AUTOMATION_PLAN.md
# 所有任务标记为完成
# 完成度标记为100%

# 3. 全面更新PROJECT_STATUS.md
# 所有进度明细标记完成
# 所有验证门控标记完成

# 4. 生成COMPLETION_REPORT.md
# 包含完整的完成总结、统计、验证结果

# 5. 清理Todo列表
# 保留需要用户执行的验证任务
```

---

## 🤖 自动化实现

### 方法1: 手动模板更新（当前使用）

每次完成任务后，使用Edit工具手动更新：

```python
# 更新AUTOMATION_PLAN.md
Edit(
    file_path="AUTOMATION_PLAN.md",
    old_string="### 进行中\n- 🚧 Phase X: 任务",
    new_string="### ✅ 已完成\n- ✅ Phase X: 任务 (file.py, XXX行)\n\n### 进行中\n- 🚧 Phase Y: 下一任务"
)

# 更新PROJECT_STATUS.md
Edit(
    file_path="PROJECT_STATUS.md",
    old_string="| Phase X | 任务 | 🚧 进行中 | file.py | - |",
    new_string="| Phase X | 任务 | ✅ 完成 | file.py | XXX |"
)
```

### 方法2: Python自动化脚本（推荐）

创建 `scripts/update_status.py`:

```python
#!/usr/bin/env python
"""自动更新项目状态脚本"""
import json
from datetime import datetime
from pathlib import Path

def update_automation_plan(phase, task, status, file_path, lines):
    """更新AUTOMATION_PLAN.md"""
    plan_path = Path("AUTOMATION_PLAN.md")
    content = plan_path.read_text()

    # 更新逻辑
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")

    # ... 更新内容 ...

    plan_path.write_text(content)
    print(f"✅ Updated AUTOMATION_PLAN.md: {task}")

def update_project_status(phase, task, status, file_path, lines):
    """更新PROJECT_STATUS.md"""
    status_path = Path("PROJECT_STATUS.md")
    content = status_path.read_text()

    # 更新表格行
    # ... 更新逻辑 ...

    status_path.write_text(content)
    print(f"✅ Updated PROJECT_STATUS.md: {task}")

def update_from_todos(todos_file):
    """从TodoWrite JSON文件读取并更新"""
    with open(todos_file) as f:
        todos = json.load(f)

    for todo in todos:
        if todo["status"] == "completed":
            # 解析任务信息
            # 更新状态文件
            pass

if __name__ == "__main__":
    # 自动从Todo列表更新
    todos_path = ".claude/todos/*.json"
    # ... 实现逻辑 ...
```

### 方法3: Git Hook自动化（最佳）

创建 `.git/hooks/post-commit`:

```bash
#!/bin/bash
# Git post-commit hook: 自动更新项目状态

# 提取本次提交的文件和行数变化
FILES_CHANGED=$(git diff-tree --no-commit-id --name-only -r HEAD)

# 运行状态更新脚本
python scripts/update_status.py --from-git

# 如果状态文件被更新，自动提交
if git diff --quiet AUTOMATION_PLAN.md PROJECT_STATUS.md; then
    echo "No status updates needed"
else
    git add AUTOMATION_PLAN.md PROJECT_STATUS.md
    git commit -m "chore: auto-update project status"
    echo "✅ Project status auto-updated"
fi
```

---

## 📊 状态同步检查清单

### 每次任务完成后检查：

- [ ] **TodoWrite更新** - 任务标记为completed
- [ ] **AUTOMATION_PLAN.md** - 任务从"进行中"移到"已完成"
- [ ] **PROJECT_STATUS.md** - 进度表更新状态为✅
- [ ] **代码行数统计** - 使用`wc -l`记录实际行数
- [ ] **时间戳更新** - 记录最后更新时间
- [ ] **完成度计算** - 更新百分比（已完成任务/总任务）

### Phase完成后检查：

- [ ] 所有任务Todo标记完成
- [ ] AUTOMATION_PLAN.md Phase状态为✅
- [ ] PROJECT_STATUS.md表格全部更新
- [ ] 验证门控状态更新
- [ ] 代码统计准确
- [ ] 时间戳最新

### 里程碑完成后：

- [ ] 生成COMPLETION_REPORT.md
- [ ] 所有文档100%同步
- [ ] 验证命令全部执行
- [ ] 清理过时Todo
- [ ] 更新README（如需要）

---

## 🔧 工具使用指南

### TodoWrite最佳实践

```python
# 开始新Phase时
TodoWrite([
    {"content": "Phase 3.1: 实现GraphService", "status": "in_progress", "activeForm": "实现GraphService"},
    {"content": "Phase 3.2: 添加事务函数", "status": "pending", "activeForm": "添加事务函数"},
    {"content": "Phase 3验证: 导入测试", "status": "pending", "activeForm": "导入测试"}
])

# 完成一个任务时
TodoWrite([
    {"content": "Phase 3.1: 实现GraphService", "status": "completed", "activeForm": "实现GraphService"},
    {"content": "Phase 3.2: 添加事务函数", "status": "in_progress", "activeForm": "添加事务函数"},
    {"content": "Phase 3验证: 导入测试", "status": "pending", "activeForm": "导入测试"}
])

# 保持一次只有一个in_progress任务
```

### Edit工具更新模式

```python
# 模式1: 添加已完成任务
Edit(
    file_path="AUTOMATION_PLAN.md",
    old_string="### ✅ 已完成 (XX%)",
    new_string="### ✅ 已完成 (YY%)\n- ✅ 新完成任务"
)

# 模式2: 更新进行中任务
Edit(
    file_path="AUTOMATION_PLAN.md",
    old_string="### 🚧 进行中\n- 🚧 当前任务",
    new_string="### ✅ 已完成\n- ✅ 当前任务\n\n### 🚧 进行中\n- 🚧 下一任务"
)

# 模式3: 更新表格状态
Edit(
    file_path="PROJECT_STATUS.md",
    old_string="| Phase X | 任务 | 🚧 进行中 | file.py | - |",
    new_string="| Phase X | 任务 | ✅ 完成 | file.py | 123 |"
)
```

---

## 📈 自动化指标

### 跟踪指标

1. **任务完成率** = (已完成任务数 / 总任务数) × 100%
2. **代码产出** = 累计代码行数
3. **验证通过率** = (通过验证数 / 总验证数) × 100%
4. **更新及时性** = 最后更新时间与当前时间差
5. **文档同步度** = 所有状态文档的一致性

### 自动计算示例

```python
def calculate_completion_rate():
    """计算完成率"""
    with open(".claude/todos/current.json") as f:
        todos = json.load(f)

    total = len(todos)
    completed = sum(1 for t in todos if t["status"] == "completed")

    return (completed / total) * 100

def count_code_lines():
    """统计代码行数"""
    result = subprocess.run(
        ["wc", "-l"] + glob.glob("**/*.py", recursive=True),
        capture_output=True, text=True
    )
    # 解析结果
    return total_lines
```

---

## 🎯 实施建议

### 短期（本项目）
✅ **已实施**:
- TodoWrite实时跟踪
- 手动Edit更新状态文件
- 完成报告生成

🔄 **改进方向**:
- 创建update_status.py脚本
- 自动化代码行数统计
- Git hook集成

### 长期（团队规模化）
- CI/CD pipeline集成
- 自动化测试覆盖率报告
- 自动生成changelog
- Slack/钉钉通知集成
- 项目仪表盘可视化

---

## 📝 使用示例

### 示例1: 完成GraphService开发

```bash
# 1. 完成代码编写
# 编写 services/graph_service.py (489行)

# 2. 更新Todo
TodoWrite([
    {"content": "Phase 3: 实现GraphService核心服务", "status": "completed", "activeForm": "实现GraphService"}
])

# 3. 验证
python -m py_compile services/graph_service.py
python -c "from services.graph_service import GraphService"

# 4. 更新AUTOMATION_PLAN.md
Edit(
    file_path="AUTOMATION_PLAN.md",
    old_string="- 🚧 Knowledge Graph Service Phase 3: 核心服务层",
    new_string="- ✅ Phase 3: 核心服务层 (graph_service.py, 489行)"
)

# 5. 更新PROJECT_STATUS.md
Edit(
    file_path="PROJECT_STATUS.md",
    old_string="| Phase 3 | GraphService | ⏳ 待开始 | services/graph_service.py | - |",
    new_string="| Phase 3 | GraphService | ✅ 完成 | services/graph_service.py | 489 |"
)

# 6. 记录验证结果
# 在验证门控部分标记通过
```

### 示例2: 完成整个模块

```bash
# 所有Phase完成后

# 1. 生成完成报告
Write(
    file_path="COMPLETION_REPORT.md",
    content="""
# Knowledge Graph Service 开发完成报告
## 完成情况
- Phase 1-6: 100%完成
- 代码总量: 2,090行
...
"""
)

# 2. 全面更新AUTOMATION_PLAN.md
Edit(
    file_path="AUTOMATION_PLAN.md",
    old_string="### 🚧 进行中",
    new_string="### 🎉 当前状态\n- ✨ Knowledge Graph Service **开发完成**"
)

# 3. 全面更新PROJECT_STATUS.md
# 标记所有任务完成
# 更新项目阶段

# 4. 清理Todo
TodoWrite([
    {"content": "最终验证: 端到端测试 + API手动测试", "status": "pending", "activeForm": "最终验证"}
])
```

---

## 🔍 故障排查

### 问题1: 状态文件不同步

**症状**: AUTOMATION_PLAN.md显示80%完成，但PROJECT_STATUS.md显示60%

**解决**:
```bash
# 1. 检查Todo列表
cat .claude/todos/*.json | grep -c '"status": "completed"'

# 2. 手动对比文件
diff <(grep "✅" AUTOMATION_PLAN.md) <(grep "✅" PROJECT_STATUS.md)

# 3. 重新同步
# 以Todo为准，更新所有文档
```

### 问题2: 代码行数统计不准

**症状**: 记录的行数与实际不符

**解决**:
```bash
# 重新统计
wc -l services/graph_service.py api/*.py models/*.py | tail -1

# 更新文档中的行数
```

### 问题3: 时间戳过时

**症状**: 最后更新时间是几天前

**解决**:
```bash
# 更新时间戳为当前时间
date "+%Y-%m-%d %H:%M"  # 获取当前时间
# 手动Edit更新
```

---

## ✅ 检查清单模板

复制此清单，每次完成任务后检查：

```markdown
## 任务完成检查清单

### 代码实现
- [ ] 代码编写完成
- [ ] 语法检查通过 (`python -m py_compile`)
- [ ] 导入测试成功
- [ ] 运行验证通过

### 状态更新
- [ ] TodoWrite标记completed
- [ ] AUTOMATION_PLAN.md已更新
- [ ] PROJECT_STATUS.md表格已更新
- [ ] 代码行数已统计 (`wc -l`)
- [ ] 时间戳已更新

### 文档同步
- [ ] 所有状态文件一致
- [ ] 完成度百分比准确
- [ ] 验证门控状态正确

### 提交
- [ ] Git commit with proper message
- [ ] 状态文件一起提交
```

---

**最后更新**: 2025-10-09 19:20
**适用项目**: Leap ACP
**维护者**: Claude Code with Context Engineering
