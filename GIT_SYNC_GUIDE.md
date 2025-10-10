# Git 同步指南 - 安全管理 GitHub Token

本指南说明如何安全地将代码同步到 GitHub，以及如何保护您的敏感信息。

---

## 🔒 安全原则

**核心原则**: **绝对不要将 Token 提交到 Git 仓库**

我们使用以下安全措施：
1. ✅ `.env` 文件存储所有敏感信息
2. ✅ `.env` 已在 `.gitignore` 中（永远不会被提交）
3. ✅ `.env` 文件权限设置为 `600`（仅所有者可读写）
4. ✅ 使用 `.env.example` 作为公开模板
5. ✅ Git 命令通过环境变量读取 Token

---

## 📋 初始设置（已完成）

本项目已经完成初始化，以下是已完成的步骤：

### 1. ✅ 创建 .env 文件
```bash
# .env 文件已创建并包含：
GITHUB_TOKEN=your_token_here
GITHUB_REPO=https://github.com/keevingfu/leapacp.git
GITHUB_USER=keevingfu
```

### 2. ✅ 设置文件权限
```bash
chmod 600 .env
# 验证: ls -la .env 应显示 -rw-------
```

### 3. ✅ 配置 .gitignore
```bash
# .gitignore 中已包含：
.env
.env.local
.env.*.local
*.pem
*.key
credentials.json
secrets.json
```

### 4. ✅ 初始化 Git 仓库
```bash
git init
git branch -m main
git config user.name "Keeving Fu"
git config user.email "keevingfu@users.noreply.github.com"
```

### 5. ✅ 添加远程仓库
```bash
source .env
git remote add origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/leapacp.git"
```

### 6. ✅ 首次提交和推送
```bash
git add -A
git commit -m "Initial commit"
git push -u origin main
```

---

## 🚀 日常使用

### 提交代码到 GitHub

```bash
# 1. 查看修改
git status

# 2. 添加文件
git add .
# 或添加特定文件
git add path/to/file

# 3. 提交
git commit -m "feat: your feature description"

# 4. 推送（使用 .env 中的 token）
source .env && git push
```

### 拉取最新代码

```bash
source .env && git pull
```

### 查看提交历史

```bash
git log --oneline
```

### 创建分支

```bash
# 创建并切换到新分支
git checkout -b feature/your-feature

# 推送新分支
source .env && git push -u origin feature/your-feature
```

---

## 🔐 Token 安全管理

### 验证 .env 文件安全性

```bash
# 1. 检查文件权限
ls -la .env
# 应显示: -rw-------  (600权限)

# 2. 验证不会被提交
git status
# .env 不应出现在 "Untracked files" 或 "Changes to be committed"

# 3. 检查 .gitignore
cat .gitignore | grep .env
# 应显示: .env
```

### 如果 Token 泄露怎么办？

**立即采取行动**:

1. **吊销旧 Token**
   - 访问 GitHub Settings > Developer settings > Personal access tokens
   - 找到泄露的 Token，点击 "Delete"

2. **生成新 Token**
   - 点击 "Generate new token (classic)"
   - 勾选 `repo` 权限
   - 复制新 Token

3. **更新 .env 文件**
   ```bash
   nano .env
   # 更新 GITHUB_TOKEN=new_token_here
   ```

4. **更新 Git Remote URL**
   ```bash
   source .env
   git remote set-url origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/leapacp.git"
   ```

5. **验证新配置**
   ```bash
   source .env && git pull
   ```

### 定期轮换 Token

建议每 3-6 个月更换一次 Token：
```bash
# 1. 在 GitHub 生成新 Token
# 2. 更新 .env 文件
# 3. 更新 remote URL
# 4. 测试连接
```

---

## 🛠️ 常见问题

### Q1: 如何检查 Token 是否有效？

```bash
source .env
curl -H "Authorization: token ${GITHUB_TOKEN}" \
     https://api.github.com/user
```
应返回您的 GitHub 用户信息。

### Q2: Push 时提示 "Authentication failed"

**原因**: Token 无效或过期

**解决方案**:
1. 在 GitHub 检查 Token 是否被删除或过期
2. 生成新 Token
3. 更新 .env 文件
4. 更新 remote URL

### Q3: 如何在多台机器上使用？

**每台机器都需要**:
1. 克隆仓库: `git clone https://github.com/keevingfu/leapacp.git`
2. 创建自己的 .env 文件（使用自己的 Token）
3. 设置权限: `chmod 600 .env`

**不要**:
- ❌ 复制 .env 文件到云端
- ❌ 通过邮件/消息发送 .env
- ❌ 在多人间共享 Token

### Q4: 团队协作如何管理？

**每个团队成员**:
1. 生成自己的 Personal Access Token
2. 创建自己的 .env 文件
3. 独立管理自己的凭证

**项目管理员**:
- 提供 .env.example 模板
- 在 README 中说明设置步骤
- 定期审查仓库权限

### Q5: 如何查看当前 Remote URL？

```bash
git remote -v
```

如果看到明文 Token，使用以下命令隐藏：
```bash
git remote -v | sed 's/:.*@/:***@/g'
```

---

## 📝 Git 远程 URL 格式

### ✅ 推荐格式（使用 Token）
```bash
https://username:token@github.com/username/repo.git
```

### ⚠️ 其他格式

**HTTPS（需要每次输入密码）**:
```bash
https://github.com/username/repo.git
```

**SSH（需要配置 SSH Key）**:
```bash
git@github.com:username/repo.git
```

---

## 🔄 自动化脚本

### 创建便捷脚本

创建 `sync.sh`:
```bash
#!/bin/bash
# Git 同步便捷脚本

source .env

case "$1" in
  push)
    git push
    ;;
  pull)
    git pull
    ;;
  status)
    git status
    ;;
  *)
    echo "Usage: ./sync.sh {push|pull|status}"
    exit 1
    ;;
esac
```

使用:
```bash
chmod +x sync.sh
./sync.sh push
./sync.sh pull
./sync.sh status
```

---

## 📊 当前仓库状态

```bash
# 查看仓库状态
git status

# 查看提交历史
git log --oneline -5

# 查看分支
git branch -a

# 查看远程配置
git remote -v
```

---

## ✅ 安全检查清单

在每次提交前，确保：

- [ ] .env 文件权限为 600
- [ ] .env 不在 git status 中
- [ ] .gitignore 包含 .env
- [ ] 代码中没有硬编码的 Token
- [ ] 没有其他敏感信息被提交
- [ ] 提交信息清晰明确

---

## 📚 相关文档

- [README.md](./README.md) - 项目主文档
- [.env.example](./.env.example) - 环境变量模板
- [.gitignore](./.gitignore) - Git 忽略规则
- [GitHub Token 文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## 🆘 需要帮助？

如果遇到问题：
1. 查看本指南的常见问题部分
2. 访问 [GitHub Issues](https://github.com/keevingfu/leapacp/issues)
3. 查看 GitHub 官方文档

---

**记住**: 🔒 安全第一，永远不要提交敏感信息到 Git！

🤖 Generated with [Claude Code](https://claude.com/claude-code)
