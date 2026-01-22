#!/usr/bin/env bash
# ABOUTME: Automates the session close protocol from CLAUDE.md
# ABOUTME: Stages changes, syncs beads, commits, pushes, and optionally deploys to Shopify

set -e  # Exit on any error

# Color output for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Session Close Checklist${NC}"
echo "=========================="
echo ""

# 1. Show what changed
echo -e "${BLUE}Step 1: Checking git status...${NC}"
git status
echo ""

# Check if there are any changes to commit
if git diff-index --quiet HEAD -- 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    echo -e "${GREEN}ℹ️  No changes to commit - working directory is clean${NC}"
    echo ""
    exit 0
fi

# 2. Stage code changes (interactive)
echo -e "${BLUE}Step 2: Stage code changes${NC}"
read -p "Stage all changes? (y/n): " stage_all

if [ "$stage_all" = "y" ]; then
    git add -A
    echo -e "${GREEN}✓ All changes staged${NC}"
else
    echo ""
    echo "Please stage files manually with: git add <files>"
    echo "Then run this script again, or continue with manual commit workflow."
    echo ""
    exit 0
fi
echo ""

# 3. Sync beads
echo -e "${BLUE}Step 3: Syncing beads issues...${NC}"
if command -v bd &> /dev/null; then
    bd sync
    echo -e "${GREEN}✓ Beads synced${NC}"
else
    echo -e "${YELLOW}⚠️  Beads command not found - skipping beads sync${NC}"
fi
echo ""

# 4. Commit code
echo -e "${BLUE}Step 4: Committing code changes${NC}"
read -p "Enter commit message: " commit_msg

if [ -z "$commit_msg" ]; then
    echo -e "${RED}❌ ERROR: Commit message cannot be empty${NC}"
    exit 1
fi

git commit -m "$commit_msg

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

echo -e "${GREEN}✓ Changes committed${NC}"
echo ""

# 5. Sync beads again (capture any changes from commit hooks)
echo -e "${BLUE}Step 5: Syncing beads again...${NC}"
if command -v bd &> /dev/null; then
    bd sync
    echo -e "${GREEN}✓ Beads synced${NC}"
else
    echo -e "${YELLOW}⚠️  Beads command not found - skipping beads sync${NC}"
fi
echo ""

# 6. Push to git
echo -e "${BLUE}Step 6: Pushing to git remote...${NC}"
git push
echo -e "${GREEN}✓ Pushed to remote${NC}"
echo ""

echo -e "${GREEN}✅ Session close complete!${NC}"
echo ""

# Optional: Deploy to Shopify
echo -e "${BLUE}📦 Optional: Deploy to Shopify live${NC}"
read -p "Deploy to Shopify now? (y/n): " deploy_choice

if [ "$deploy_choice" = "y" ]; then
    echo ""
    echo -e "${BLUE}Calling deploy-to-shopify script...${NC}"
    echo ""
    ./.claude/skills/deploy-to-shopify/deploy-to-shopify.sh
else
    echo ""
    echo -e "${YELLOW}Skipping deployment.${NC}"
    echo "Run this command when ready to deploy:"
    echo "  ./.claude/skills/deploy-to-shopify/deploy-to-shopify.sh"
    echo ""
fi
