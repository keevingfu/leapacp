#!/bin/bash

# Automated Git Commit and Push Script
# Usage: ./scripts/auto-deploy.sh "commit message"

set -e

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo -e "${BLUE}🚀 Starting Auto-Deploy Workflow${NC}"

# Check if there are changes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ No changes to commit${NC}"
    exit 0
fi

# Check if commit message is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Commit message is required${NC}"
    echo "Usage: $0 \"commit message\""
    exit 1
fi

COMMIT_MSG="$1"

echo -e "${BLUE}📝 Staging changes...${NC}"
git add .

echo -e "${BLUE}💾 Creating commit...${NC}"
git commit -m "$(cat <<EOF
$COMMIT_MSG

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push origin main

echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
echo -e "${BLUE}🔄 Vercel will automatically deploy the changes${NC}"
