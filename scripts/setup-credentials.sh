#!/bin/bash

# GitHub Credentials Setup Helper
# This script helps store GitHub credentials securely in macOS Keychain

set -e

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 GitHub Credentials Setup${NC}\n"

# Check if token is already in environment
if [ -n "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo -e "${YELLOW}Found GITHUB_PERSONAL_ACCESS_TOKEN in environment${NC}"
    TOKEN="$GITHUB_PERSONAL_ACCESS_TOKEN"
else
    # Prompt for token
    echo -e "${YELLOW}Please enter your GitHub Personal Access Token:${NC}"
    echo -e "${BLUE}(Create one at: https://github.com/settings/tokens)${NC}"
    echo -n "Token: "
    read -s TOKEN
    echo ""
fi

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ No token provided${NC}"
    exit 1
fi

# Store credentials in Git credential helper
echo -e "\n${BLUE}📝 Storing credentials in macOS Keychain...${NC}"

# Use Git credential helper to store
echo "protocol=https
host=github.com
username=keevingfu
password=$TOKEN" | git credential-osxkeychain store

echo -e "${GREEN}✅ Credentials stored successfully!${NC}\n"

# Test the credentials
echo -e "${BLUE}🧪 Testing credentials...${NC}"
if git ls-remote https://github.com/keevingfu/leapacp.git HEAD > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Authentication successful!${NC}\n"
    echo -e "${GREEN}You can now use './scripts/auto-deploy.sh' to push changes${NC}"
else
    echo -e "${RED}❌ Authentication failed${NC}"
    echo -e "${YELLOW}Please verify your token has the correct permissions:${NC}"
    echo -e "  - repo (Full control of private repositories)"
    echo -e "  - workflow (Update GitHub Action workflows)"
    exit 1
fi
