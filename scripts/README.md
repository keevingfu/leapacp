# CI/CD Automation Scripts

This directory contains scripts for automated deployment and continuous integration.

## 🚀 Quick Deploy

Use the `auto-deploy.sh` script to quickly commit and push changes to GitHub, which will trigger automatic Vercel deployment.

### Usage

```bash
# From project root
./scripts/auto-deploy.sh "your commit message"
```

### Example

```bash
./scripts/auto-deploy.sh "feat: add new user dashboard component"
```

## 🔐 Security Setup

### GitHub Token Protection

✅ **Already Configured:**
- Git remote URL no longer contains tokens
- Git credential helper configured to use macOS Keychain
- `.gitignore` protects all sensitive files

### First Time Setup

If you haven't already, you'll need to provide your GitHub credentials when pushing:

```bash
# The first time you push, Git will prompt for credentials
Username: keevingfu
Password: [your Personal Access Token]

# macOS Keychain will securely store these credentials
```

### Creating a GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
4. Copy the token (starts with `ghp_`)
5. Use it as your password when Git prompts

## 📋 What This Script Does

1. ✅ Checks for uncommitted changes
2. ✅ Stages all changes (`git add .`)
3. ✅ Creates a commit with your message
4. ✅ Automatically adds Claude Code attribution
5. ✅ Pushes to GitHub `main` branch
6. ✅ Triggers Vercel automatic deployment

## 🎯 Workflow

```
Local Changes → auto-deploy.sh → GitHub → Vercel → Live Site
     ↓              ↓              ↓         ↓
  Edit Code    Commit+Push    Webhook   Auto Build
```

## 🔄 Git Hooks

A `post-commit` hook has been set up to remind you to deploy changes.

### Enable Auto-Push (Optional)

To automatically push after every commit:

1. Edit `.git/hooks/post-commit`
2. Uncomment the line: `git push origin main`

**Warning:** This will push EVERY commit immediately. Use with caution!

## 📝 Alternative: Manual Workflow

If you prefer manual control:

```bash
# Stage changes
git add .

# Commit
git commit -m "your message"

# Push
git push origin main
```

## 🛡️ Protected Files

The following files are automatically excluded from commits (via `.gitignore`):

- `.env` and all `.env.*` files
- Credentials and keys (`*.pem`, `*.key`, `credentials.json`)
- `node_modules/`
- Build artifacts (`dist/`, `.vite/`)
- Database files (`*.db`, `*.sqlite`)
- Logs (`*.log`, `logs/`)

## 🔍 Vercel Deployment Status

After pushing, you can monitor deployment at:
- https://vercel.com/dashboard
- GitHub Actions tab in your repository

## ⚡ Tips

- **Quick commits**: Use descriptive messages for better tracking
- **Atomic commits**: Commit related changes together
- **Test locally**: Always test before deploying
- **Monitor Vercel**: Check build logs if deployment fails

## 🆘 Troubleshooting

### "Authentication failed"
- Verify your Personal Access Token is valid
- Check token has `repo` scope enabled
- Try: `git credential-osxkeychain erase` and re-authenticate

### "Push rejected"
- Pull latest changes first: `git pull origin main`
- Resolve any conflicts
- Try pushing again

### "No changes to commit"
- Script automatically detects this and exits gracefully
- Verify you have unsaved changes

## 📚 Related Documentation

- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Vercel Git Integration](https://vercel.com/docs/concepts/git)
- [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
