# Shopify Theme Sync Workflow

## Overview

This document defines the three-way synchronization workflow between:
1. **Local development** - Your working files on this machine
2. **Git/GitHub** - Source of truth and version control
3. **Shopify themes** - Development and Live themes on Shopify

## The Three Environments

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Local Files    │ ←──────→│   Git/GitHub    │ ────────→│  Shopify Live   │
│  (your machine) │         │  (source truth) │         │  (production)   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        ↕                            ↕                            ↕
        │                            │                            │
        └────────────────────────────┴────────────────────────────┘
                    via Shopify CLI & git
```

**Key Principles:**
- **Git is the source of truth** - All changes must be committed to git
- **Bidirectional sync** - Changes can happen locally OR in Shopify admin
- **Main-only branching** - All work happens on main branch (simple workflow)
- **Auto-deploy on push** - Pushing to main deploys to live theme (during development phase)
- **Never push without pulling admin changes first** - Always run `/sync-from-shopify` (or a manual theme pull) before any push

## Current Theme Setup

Per `shopify theme list`:
- **Live Theme**: "June Lingerie - Dawn" (#13970381220) - Production site
- **Development Theme**: "Development (6d3ffc-Jareds-MacBook-Air)" - Connected to `shopify theme dev`
- **Staging Theme**: "Horizon" (#13965249752) - Optional testing environment

## Daily Development Workflow

### Starting Your Work Session

**1. Pull latest changes from all sources**
```bash
# Pull from GitHub (gets other collaborators' changes)
git pull --rebase

# Pull from Shopify admin (gets any admin-made changes)
/sync-from-shopify
# OR manually:
# shopify theme pull --only config/settings_data.json --only templates/*.json
# git add config/settings_data.json templates/*.json
# git commit -m "Sync configuration updates from Shopify admin"
```

**2. Start local development server**
```bash
shopify theme dev --store june-lingerie-2.myshopify.com --store-password june
```
This starts a server at http://127.0.0.1:9292 that:
- Syncs file changes to your Development theme automatically
- Provides hot reload for CSS and sections
- Does NOT affect your Live theme

**3. Check what you're working on**
```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim the work
```

### Making Local Changes

**While developing:**
1. Edit files in your local directory
2. Changes automatically sync to Development theme via `shopify theme dev`
3. Preview at http://127.0.0.1:9292
4. Commit frequently to git:
   ```bash
   git add <changed-files>
   git commit -m "Descriptive message"
   ```

**DO NOT push to GitHub until you're ready to deploy to Live** (since push = deploy during dev phase)
**ALWAYS pull from Shopify before any push** to avoid overwriting admin edits:
```bash
/sync-from-shopify
# or manually:
shopify theme pull --only config/settings_data.json --only templates/*.json
git add config/settings_data.json templates/*.json
git commit -m "Sync configuration updates from Shopify admin"
```

### Handling Shopify Admin Changes

**If you or someone else makes changes in the Shopify theme editor:**

**Option A: Use the skill (recommended)**
```bash
/sync-from-shopify
```
This will:
1. Pull config/template changes from Shopify
2. Show you what changed
3. Commit to git
4. Push to GitHub

**Option B: Manual sync**
```bash
# 1. Pull changes from Shopify
shopify theme pull --only config/settings_data.json --only templates/*.json

# 2. Review what changed
git status
git diff

# 3. Stage and commit
git add config/settings_data.json templates/*.json
git commit -m "Sync configuration updates from Shopify admin"

# 4. Push (this will deploy to live during dev phase)
git push
```

**IMPORTANT:** Always pull from Shopify before starting local work to avoid conflicts.

## Deployment Workflow

### Current Phase: Auto-Deploy on Push

**When you push to main, it deploys to Live theme:**

```bash
# 1. Pull latest admin edits from Shopify (required before any push)
/sync-from-shopify

# 2. Ensure local changes are committed
git status  # Should show "nothing to commit"

# 3. Run quality checks (if applicable)
shopify theme check

# 4. Pull latest from remote (in case someone else pushed)
git pull --rebase

# 5. Push to GitHub (this triggers deployment to live)
git push

# 6. Verify deployment
# Visit https://junelingerie.com to confirm changes are live
```

**How does auto-deploy work?**
Currently, your workflow is:
1. Push to GitHub
2. Manually run `shopify theme push --live --allow-live` to deploy

**Future Phase: Manual Deploy with Confirmation**

When you're ready to require manual confirmation before deploying to live:

**Option 1: Git tag-based deployment**
```bash
# 1. Commit and push code changes (does NOT deploy)
git push

# 2. When ready to deploy, create a release tag
git tag -a v1.0.0 -m "Release v1.0.0: Add size chart feature"
git push --tags

# 3. Manually deploy
shopify theme push --live --allow-live
```

**Option 2: Separate deployment command**
```bash
# 1. Push code changes (does NOT deploy)
git push

# 2. Manually deploy when ready
shopify theme push --live --allow-live
```

I recommend **Option 1** (git tags) because:
- Clear history of what was deployed and when
- Can rollback by checking out a previous tag
- Tags are visible in GitHub releases

## Conflict Resolution

### Local vs Shopify Admin Conflicts

**Scenario: You made local changes, but someone also edited in Shopify admin**

```bash
# 1. Commit your local changes first
git add .
git commit -m "Your local changes"

# 2. Pull from Shopify
shopify theme pull --only config/settings_data.json --only templates/*.json

# 3. If conflicts occur, git will show them
git status  # Look for "both modified" files

# 4. Resolve conflicts manually
# Open conflicted files and choose which changes to keep

# 5. Complete the resolution
git add <conflicted-files>
git commit -m "Resolve conflict between local and admin changes"
git push
```

**Prevention:** Always run `/sync-from-shopify` before starting work.

### Git Pull Conflicts

**Scenario: Someone else pushed to GitHub while you were working**

```bash
# 1. Try to pull
git pull --rebase
# If conflicts occur...

# 2. Resolve conflicts in your editor
# Git will mark conflicts with <<<<<<< and >>>>>>>

# 3. After resolving
git add <resolved-files>
git rebase --continue

# 4. Push your changes
git push
```

## Session Close Protocol

**MANDATORY steps before ending work session:**

```bash
# 1. Pull latest admin edits from Shopify (required before any push)
/sync-from-shopify

# 2. Verify all work is committed
git status  # Should show "nothing to commit"

# 3. Update issue tracking
bd close <id>         # Close completed issues
bd sync               # Sync beads with git

# 4. Push everything to GitHub
git pull --rebase     # Get latest changes
git push              # Push your work (deploys to live in dev phase)

# 5. Verify push succeeded
git status            # Must show "Your branch is up to date with 'origin/main'"

# 6. Verify deployment (if auto-deploying)
# Visit https://junelingerie.com to confirm changes are live
```

**CRITICAL:** Work is NOT complete until `git push` succeeds AND changes are verified on live site.

## Emergency Procedures

### Rollback Bad Deployment

**If you deploy something broken to live:**

**Option 1: Quick revert (recommended)**
```bash
# 1. Revert the commit
git revert HEAD
git push  # Deploys the revert to live

# 2. Verify rollback on live site
```

**Option 2: Restore previous theme version**
```bash
# 1. List recent theme backups
shopify theme list

# 2. Download a previous version
shopify theme pull --theme <backup-theme-id>

# 3. Push it to live
shopify theme push --live --allow-live
```

### Recovery from "Out of Sync" State

**If git, local files, and Shopify are out of sync:**

```bash
# 1. Stash any uncommitted local changes
git stash

# 2. Reset to GitHub main
git fetch origin
git reset --hard origin/main

# 3. Pull from Shopify to get latest admin changes
shopify theme pull

# 4. Review and commit Shopify changes
git status
git add .
git commit -m "Sync from Shopify to recover from out-of-sync state"

# 5. Restore your stashed changes if needed
git stash pop

# 6. Resolve any conflicts and push
git push
```

## File Management

### Files to Track in Git

**ALWAYS commit:**
- `sections/*.liquid` - Section files
- `snippets/*.liquid` - Snippet files
- `templates/*.json` - Template definitions
- `layout/*.liquid` - Layout files
- `assets/*` - CSS, JS, images
- `config/settings_schema.json` - Theme settings definition
- `locales/*.json` - Translations

**SYNC from Shopify admin:**
- `config/settings_data.json` - Theme settings values (colors, fonts, etc.)
- `templates/*.json` - Template configurations (sections used on each page)

**IGNORE (already in .gitignore):**
- `.shopify/` - CLI cache
- `.DS_Store` - Mac OS files

### Handling Different File Types

**Liquid files (sections, snippets, layout):**
- Edit locally ONLY
- Use Shopify admin only to preview or configure via schema settings
- These should never be edited directly in admin

**Template JSON files:**
- Can be edited locally OR in Shopify admin
- If edited in admin, run `/sync-from-shopify` to pull changes

**Config settings_data.json:**
- Generated by Shopify theme editor
- ALWAYS pull from Shopify, never edit manually locally
- Run `/sync-from-shopify` regularly to keep in sync

**Assets (CSS, JS, images):**
- Edit locally ONLY
- Use version control for all changes

## Troubleshooting

### "shopify theme dev" not syncing changes

```bash
# 1. Stop the dev server (Ctrl+C)
# 2. Clear Shopify CLI cache
rm -rf .shopify
# 3. Restart dev server
shopify theme dev --store june-lingerie-2.myshopify.com --store-password june
```

### "shopify theme pull" showing no changes when you know admin was edited

```bash
# 1. Check which theme you're pulling from
shopify theme list

# 2. Explicitly specify the development theme
shopify theme pull --development

# 3. Or pull from live theme if that's where changes were made
shopify theme pull --live
```

### Git says files are modified but you didn't change them

This usually happens with `config/settings_data.json` due to Shopify's auto-formatting:

```bash
# 1. Check what changed
git diff config/settings_data.json

# 2. If changes are just whitespace/formatting, commit them
git add config/settings_data.json
git commit -m "Shopify auto-formatting of settings_data.json"
git push
```

## Best Practices

### DO:
- ✅ Always run `/sync-from-shopify` before starting work
- ✅ Commit frequently with descriptive messages
- ✅ Use `shopify theme dev` for all local development
- ✅ Test on Development theme before deploying to Live
- ✅ Run `shopify theme check` before pushing to main
- ✅ Use `bd` to track all non-trivial work
- ✅ Follow the session close protocol religiously

### DON'T:
- ❌ Edit Liquid files directly in Shopify admin (use local editor)
- ❌ Push to main without testing on Development theme first
- ❌ Skip pulling from Shopify before starting work (causes conflicts)
- ❌ Leave work uncommitted at end of session
- ❌ Push directly to Live theme without going through git
- ❌ Make changes in both local and admin simultaneously (causes conflicts)

## Quick Reference

### Common Commands

```bash
# Start local development
shopify theme dev --store june-lingerie-2.myshopify.com --store-password june

# Pull admin changes (required before any push)
/sync-from-shopify

# Check for theme issues
shopify theme check

# Deploy to live (manual)
shopify theme push --live --allow-live

# List themes
shopify theme list

# Session close (pull admin edits first)
/sync-from-shopify && git status && bd sync && git pull --rebase && git push
```

### Workflow Shortcuts

**Normal development (no admin edits):**
```bash
# Start work
shopify theme dev &
bd ready

# Make changes, test, commit frequently
git add . && git commit -m "Description"

# End session (deploys to live)
bd sync && git push
```

**After admin edits:**
```bash
# Sync from admin first
/sync-from-shopify

# Then continue normal development
shopify theme dev &
# ... make changes ...
```

## Future Workflow Changes

**When transitioning from auto-deploy to manual deploy:**

1. Update this document's deployment section
2. Remove or modify any automation that auto-deploys on push
3. Create git tags for releases
4. Document the new deployment command in CLAUDE.md
5. Update the session close protocol to NOT automatically deploy

**Commands to add at that time:**
```bash
# Deploy to live with confirmation
shopify theme push --live --allow-live

# Or create a deployment script
./scripts/deploy-to-live.sh
```

## Related Documentation

- **CLAUDE.md** - Development guidelines and project context
- **AGENTS.md** - Issue tracking and session close protocol
- **.claude/skills/sync-from-shopify/SKILL.md** - Sync from Shopify skill details
- **README.md** - Quick start and project overview
