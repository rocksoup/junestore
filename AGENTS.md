# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

**Shopify Theme Workflow:** See [docs/SHOPIFY_SYNC_WORKFLOW.md](docs/SHOPIFY_SYNC_WORKFLOW.md) for the complete workflow on synchronizing between Local, Git/GitHub, and Shopify themes.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Project Skills

Project-specific Codex skills live in `skills/`. For Shopify admin sync, use `skills/sync-from-shopify/SKILL.md`.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **DEPLOY TO LIVE THEME** - This is MANDATORY:
   ```bash
   shopify theme push --live --allow-live
   ```
6. **Clean up** - Clear stashes, prune remote branches
7. **Verify** - All changes committed AND pushed
8. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
- ALWAYS pull Shopify admin changes before any push (`/sync-from-shopify` or `shopify theme pull ...`) to avoid overwriting admin edits
- ALWAYS snapshot local changes before any Shopify pull (commit tracked changes, stash untracked)
- ALWAYS deploy to Live after pushing to GitHub (no confirmation needed)
