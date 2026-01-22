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
- **Use skills for safety** - Use `/deploy-to-shopify` instead of direct Shopify CLI commands
- **Skills enforce workflow** - `/deploy-to-shopify` automatically syncs from Shopify before deploying to prevent data loss

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

# Snapshot local changes before any Shopify pull (prevents overwrites)
git status -sb
git add -A
git commit -m "WIP: snapshot before Shopify pull" || true
git stash -u -m "WIP: untracked before Shopify pull"

# Pull from Shopify admin (gets any admin-made changes)
/sync-from-shopify
# OR manually:
# git status  # Check for uncommitted changes first
# git add -A && git commit -m "WIP: snapshot before Shopify pull" || true
# git stash -u -m "WIP: untracked before Shopify pull"
# shopify theme pull --live --only config/settings_data.json --only templates/*.json
# git add config/settings_data.json templates/*.json
# git commit -m "Sync configuration updates from Shopify admin"
# git stash pop  # Re-apply untracked changes if needed
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

**DO NOT push to GitHub until you're ready to deploy to Live** (standard flow deploys after `git push`)
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

**Option A: Use the skill (recommended for Claude Code)**
```bash
/sync-from-shopify
```
This skill calls the core sync script and will:
1. Check for uncommitted local changes (exits if any found)
2. Pull config/template changes from Shopify
3. Show you what changed with diff summary
4. Stage, commit, and push changes to GitHub

**Option B: Use the script directly (works with any agent or manually)**
```bash
./scripts/shopify-sync.sh
```
This is the core sync script that can be called by any agent (Claude Code, Codex, etc.) or manually from the command line. Same behavior as Option A.

**Option C: Manual sync**
```bash
# 1. Check for uncommitted changes first
git status

# 2. If clean, pull changes from Shopify
shopify theme pull --live --only config/settings_data.json --only templates/*.json

# 3. Review what changed
git status
git diff

# 4. Stage and commit Shopify changes
git add config/settings_data.json templates/*.json
git commit -m "Sync configuration updates from Shopify admin

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 5. Push to GitHub
git push
```

**IMPORTANT:** Always pull from Shopify before starting local work to avoid conflicts.

**Note on Script Abstraction:** The core sync logic lives in `scripts/shopify-sync.sh` to make it reusable across different agents and tools. The Claude and Codex skills (`.claude/skills/sync-from-shopify/SKILL.md` and `skills/sync-from-shopify/SKILL.md`) are thin wrappers that call this script.

## Deployment Workflow

### Standard Deployment (Recommended)

**Use the `/deploy-to-shopify` skill which includes built-in safety checks:**

```bash
# 1. Ensure local changes are committed
git status  # Should show "nothing to commit"

# 2. Run quality checks (if applicable)
shopify theme check

# 3. Deploy to Live (skill handles all safety checks)
/deploy-to-shopify
```

The `/deploy-to-shopify` skill will:
1. Check for uncommitted local changes (exits if any found)
2. Pull latest code from git remote
3. **Sync from Shopify admin** (critical safety check)
4. Show any admin changes that would be overwritten
5. Prompt for review if admin changes detected
6. Commit admin changes to git before deployment
7. Deploy to Shopify live theme
8. Report completion status

This prevents the timing window where admin changes could be overwritten.

### Alternative: Manual Deployment

**Only use this if you need to bypass the skill for some reason:**

```bash
# 1. Pull latest admin edits from Shopify (CRITICAL - never skip this)
/sync-from-shopify

# 2. Ensure local changes are committed
git status  # Should show "nothing to commit"

# 3. Pull latest from remote
git pull --rebase

# 4. Push to GitHub
git push

# 5. Deploy to Live
shopify theme push --live --allow-live

# 6. Verify deployment
# Visit https://june-lingerie-2.myshopify.com to confirm changes are live
```

**WARNING:** Manual deployment is risky because it's easy to forget the sync step. Always prefer using `/deploy-to-shopify`.
### Optional: Tag-Based Release Flow

Use this if you want explicit release markers.

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

### Recommended: Use the `/session-close` Skill

**The `/session-close` skill automates the session close checklist:**

```bash
/session-close
```

The skill will:
1. Show git status (what changed during session)
2. Stage code changes (interactive confirmation)
3. Sync beads issues to git
4. Commit code changes (prompts for commit message)
5. Sync beads again (capture any changes from commit hooks)
6. Push to git remote
7. **Optional:** Prompt to deploy to Shopify live

This ensures you don't forget any steps in the protocol.

### Alternative: Manual Session Close

**If you need to run the protocol manually:**

```bash
# 1. Check what changed
git status

# 2. Stage code changes
git add <files>

# 3. Sync beads issues
bd sync

# 4. Commit code
git commit -m "Descriptive message"

# 5. Sync beads again
bd sync

# 6. Push to remote
git push

# 7. Optional: Deploy to Shopify
/deploy-to-shopify
```

**CRITICAL:** Work is NOT complete until `git push` succeeds. Deployment to live is optional and can be done later.

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
- **Primary Source:** Shopify Theme Editor (Admin UI)
- **Secondary Source:** Local JSON for Design System baselines (colors/fonts)
- **Workflow:**
  1. **Before Pull:** ALWAYS commit local changes first.
  2. **Before Push:** Ensure you aren't overwriting a Merchant's recent Admin edits.
  3. **Best Practice:** Use code for foundational setup; use Admin for day-to-day tweaks.

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

### Project Skills (Claude Code)

```bash
# Sync from Shopify admin (start of session)
/sync-from-shopify

# Deploy to Shopify live (includes safety checks)
/deploy-to-shopify

# Complete session close protocol
/session-close
```

### Common Commands

```bash
# Start local development
shopify theme dev --store june-lingerie-2.myshopify.com --store-password june

# Pull admin changes (alternative to /sync-from-shopify)
./scripts/shopify-sync.sh

# Check for theme issues
shopify theme check

# List themes
shopify theme list
```

### When to Use Each Skill

| Operation | Skill | When |
|-----------|-------|------|
| Start session | `/sync-from-shopify` | First action of each work session |
| End session | `/session-close` | Before closing Claude Code |
| Deploy to live | `/deploy-to-shopify` | After commits are pushed to git |

### Workflow Shortcuts

**Normal development session:**
```bash
# Start work
/sync-from-shopify
shopify theme dev &
bd ready

# Make changes, test, commit frequently
git add . && git commit -m "Description"

# End session
/session-close
# (Optionally deploy when prompted)
```

**Deployment only (after session close):**
```bash
# Deploy to live with safety checks
/deploy-to-shopify
```

## Deployment Standard

Always use `/deploy-to-shopify` skill which includes automatic safety checks. The skill syncs from Shopify admin immediately before deploying to prevent overwriting admin changes.

## Troubleshooting: If Deployment Overwrites Admin Changes

If data loss occurs despite the safeguards (extremely rare):

### Step 1: Assess the Damage

```bash
# Check what was overwritten by comparing with Shopify's current state
shopify theme pull --live --only config/settings_data.json --only templates/*.json
git diff
```

### Step 2: Recovery Options

**Option A: Restore from Git History (if admin changes were previously committed)**

```bash
# 1. Find the commit that had the admin changes
git log --oneline -10 -- templates/index.json

# 2. View the content at that commit
git show <commit-hash>:templates/index.json

# 3. Restore the file
git checkout <commit-hash> -- templates/index.json

# 4. Commit and deploy
git add templates/index.json
git commit -m "Restore admin changes that were overwritten"
/deploy-to-shopify
```

**Option B: Restore from Shopify Version History**

1. Log into Shopify admin
2. Navigate to: **Online Store → Themes**
3. Click on your Live theme → **Actions → Version history**
4. Find the version before the deployment
5. Compare changes and manually restore lost sections

**Option C: Manual Recreation**

If the changes were never committed to git and Shopify version history doesn't help:
1. Manually recreate the lost sections in Shopify admin
2. Immediately run `/sync-from-shopify` to capture the changes
3. Document what was lost for future reference

### Step 3: Prevent Future Occurrences

If this happened, it means:
- Someone edited in Shopify admin during the deployment window (30-second race condition)
- OR the `/deploy-to-shopify` skill wasn't used (bypassed safeguards)

**Prevention:**
- Always use `/deploy-to-shopify` skill (never `shopify theme push` directly)
- Avoid editing in Shopify admin while a deployment is in progress
- Run `/sync-from-shopify` more frequently during active admin editing sessions

## Multi-Agent Compatibility

**Current State:** The workflow skills (`/sync-from-shopify`, `/deploy-to-shopify`, `/session-close`) work in both Claude Code and Codex. All skills call shared scripts in `scripts/`.

**Future Requirement:** These skills need to be adapted for Codex to ensure all AI agents can use the safe Shopify workflow regardless of platform.

**Architecture:**
```
Core Implementation (Agent-Agnostic)
├── scripts/shopify-sync.sh              ← Shared sync logic
├── scripts/deploy-to-shopify.sh          ← Shared deploy logic
└── scripts/session-close.sh              ← Shared session close logic

Skill Wrappers (Platform-Specific)
├── .claude/skills/                      ← Claude Code skills
└── skills/                              ← Codex skills
```

**Maintenance:**
1. Keep shared scripts in `scripts/` as the single source of truth
2. Keep Claude and Codex skill wrappers in sync with script changes
3. Document platform differences (if any)

**Why this matters:**
Multiple AI agents from different companies will work on this project. The deployment safeguards must be enforced for ALL agents, regardless of whether they're using Claude Code, Codex, or other platforms. This prevents accidental data loss when different agents deploy to Shopify.

## Related Documentation

- **CLAUDE.md** - Development guidelines and project context
- **AGENTS.md** - Issue tracking and session close protocol
- **scripts/shopify-sync.sh** - Core sync script (agent-agnostic)
- **scripts/deploy-to-shopify.sh** - Core deploy script (agent-agnostic)
- **scripts/session-close.sh** - Core session close script (agent-agnostic)
- **.claude/skills/sync-from-shopify/SKILL.md** - Claude sync-from-shopify skill
- **.claude/skills/deploy-to-shopify/SKILL.md** - Claude deploy-to-shopify skill
- **.claude/skills/session-close/SKILL.md** - Claude session-close skill
- **skills/sync-from-shopify/SKILL.md** - Codex sync-from-shopify skill
- **skills/deploy-to-shopify/SKILL.md** - Codex deploy-to-shopify skill
- **skills/session-close/SKILL.md** - Codex session-close skill
- **README.md** - Quick start and project overview
