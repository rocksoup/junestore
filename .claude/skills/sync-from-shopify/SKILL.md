---
name: sync-from-shopify
description: Synchronize Shopify theme changes to git. Pull configuration and template changes from Shopify admin, commit them to git, and push to remote. Use when you need to pull theme updates from the Shopify admin editor or sync recent admin changes.
---

# Sync from Shopify

Pull theme changes from Shopify admin, commit them to git, and push to remote.

## Workflow

YOU MUST execute these steps in order:

1. **Pull changes from Shopify**
   ```bash
   shopify theme pull --only config/settings_data.json --only templates/*.json
   ```
   This pulls configuration and template changes made in the Shopify theme editor.

2. **Check what changed**
   ```bash
   git status
   git diff
   ```
   Review the changes to understand what was modified in the Shopify admin.

3. **Stage the changes**
   ```bash
   git add config/settings_data.json templates/*.json
   ```
   Only stage the files that were pulled from Shopify.

4. **Commit with descriptive message**
   ```bash
   git commit -m "Sync configuration updates from Shopify admin"
   ```
   Use a clear commit message indicating these are admin changes.

5. **Push to remote**
   ```bash
   git push
   ```
   Push the synchronized changes to the remote git repository.

6. **Confirm completion**
   Report back to Jared:
   - What files were changed
   - A summary of the changes (from git diff)
   - Confirmation that changes are pushed to remote

## Error Handling

- If there are no changes to pull, report this and skip the commit/push steps
- If there are uncommitted local changes, STOP and ask Jared how to proceed
- If push fails, report the error and ask for guidance

## Notes

- This skill focuses on config and template changes (the most common admin edits)
- If you need to pull ALL theme files, use `shopify theme pull` without the `--only` flags
- Always verify changes before committing - don't blindly commit everything
