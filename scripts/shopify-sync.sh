#!/usr/bin/env bash
# ABOUTME: Core Shopify sync script that pulls config/template changes from Shopify admin to git
# ABOUTME: Can be called by any agent or manually from command line

set -e

# Color output for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Shopify Theme Sync${NC}"
echo ""

# Step 1: Check for uncommitted changes
echo -e "${BLUE}Step 1: Checking for uncommitted local changes...${NC}"
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Uncommitted local changes detected${NC}"
    echo ""
    echo "Please commit them first:"
    echo "  git add <files>"
    echo "  git commit -m 'Descriptive message'"
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ Working directory is clean${NC}"
echo ""

# Step 2: Pull changes from Shopify
echo -e "${BLUE}Step 2: Pulling configuration and templates from Shopify...${NC}"
shopify theme pull --live \
    --only config/settings_data.json \
    --only templates/*.json

echo -e "${GREEN}✓ Pull complete${NC}"
echo ""

# Step 3: Check what changed
echo -e "${BLUE}Step 3: Checking for changes...${NC}"
if git diff --quiet; then
    echo -e "${GREEN}ℹ️  No changes to sync - Shopify admin matches local files${NC}"
    exit 0
fi

echo -e "${GREEN}📝 Changes detected:${NC}"
git status --short
echo ""

echo -e "${BLUE}Diff summary:${NC}"
git diff --stat
echo ""

# Step 4 & 5: Stage and commit
echo -e "${BLUE}Step 4: Staging changes...${NC}"
git add config/settings_data.json templates/*.json 2>/dev/null || true
echo -e "${GREEN}✓ Changes staged${NC}"
echo ""

echo -e "${BLUE}Step 5: Committing changes...${NC}"
git commit -m "Sync configuration updates from Shopify admin

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
echo -e "${GREEN}✓ Changes committed${NC}"
echo ""

# Step 6: Push to remote
echo -e "${BLUE}Step 6: Pushing to remote...${NC}"
git push
echo -e "${GREEN}✓ Pushed to remote${NC}"
echo ""

echo -e "${GREEN}✅ Sync complete!${NC}"
