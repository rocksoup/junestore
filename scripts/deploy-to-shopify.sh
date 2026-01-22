#!/usr/bin/env bash
# ABOUTME: Deploys local code to Shopify live theme with safety checks
# ABOUTME: Always syncs from Shopify admin before deploying to prevent overwriting admin changes

set -e  # Exit on any error

# Color output for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploy to Shopify Live Theme${NC}"
echo "================================"
echo ""

# Guard 1: Check for uncommitted changes
echo -e "${BLUE}Guard 1: Checking for uncommitted local changes...${NC}"
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${RED}❌ ERROR: You have uncommitted changes.${NC}"
    echo ""
    echo "Please commit your changes before deploying:"
    echo "  git add <files>"
    echo "  git commit -m 'Descriptive message'"
    echo "  git push"
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ Working directory is clean${NC}"
echo ""

# Guard 2: Sync from git (ensure we have latest code)
echo -e "${BLUE}Guard 2: Pulling latest code from git remote...${NC}"
git pull --rebase
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: Failed to pull from git.${NC}"
    echo "Please resolve conflicts and try again."
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ Git sync complete${NC}"
echo ""

# Guard 3: Sync from Shopify (THE CRITICAL STEP)
echo -e "${BLUE}Guard 3: Syncing configuration from Shopify admin...${NC}"
echo "This ensures we don't overwrite any admin changes made since last sync."
echo ""

shopify theme pull --live \
    --only config/settings_data.json \
    --only templates/*.json

echo -e "${GREEN}✓ Shopify sync complete${NC}"
echo ""

# Check if Shopify had changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo ""
    echo -e "${YELLOW}⚠️  ADMIN CHANGES DETECTED${NC}"
    echo "========================="
    echo "Shopify admin has changes that weren't in your local git repo:"
    echo ""
    git status --short
    echo ""
    echo -e "${BLUE}📋 Summary of changes:${NC}"
    git diff --stat
    echo ""
    echo "Would you like to:"
    echo "  1. Review the changes (git diff)"
    echo "  2. Commit these changes and continue deployment"
    echo "  3. Abort deployment"
    echo ""
    read -p "Enter choice (1/2/3): " choice

    case $choice in
        1)
            echo ""
            git diff
            echo ""
            read -p "Commit and deploy? (y/n): " confirm
            if [ "$confirm" != "y" ]; then
                echo -e "${RED}❌ Deployment aborted.${NC}"
                exit 1
            fi
            ;;
        2)
            # Continue to commit step
            ;;
        3)
            echo -e "${RED}❌ Deployment aborted.${NC}"
            exit 1
            ;;
        *)
            echo -e "${RED}❌ Invalid choice. Aborting.${NC}"
            exit 1
            ;;
    esac

    # Commit the admin changes
    echo ""
    echo -e "${BLUE}Committing admin changes...${NC}"
    git add config/settings_data.json templates/*.json 2>/dev/null || true
    git commit -m "Sync admin changes before deployment

Pulled from Shopify live theme before deploying to ensure
admin changes are captured in git and not overwritten.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

    git push
    echo -e "${GREEN}✓ Admin changes committed and pushed to git${NC}"
    echo ""
else
    echo -e "${GREEN}ℹ️  No admin changes detected - local git matches Shopify${NC}"
    echo ""
fi

# Deploy to Shopify
echo ""
echo -e "${BLUE}🚀 Deploying to Shopify live theme...${NC}"
shopify theme push --live --allow-live

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo "Your changes are now live at: ${BLUE}https://june-lingerie-2.myshopify.com${NC}"
else
    echo ""
    echo -e "${RED}❌ Deployment failed. Check errors above.${NC}"
    exit 1
fi
