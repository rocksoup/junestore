# Micro.blog to Shopify Blog Migration

This repo includes a simple Node script to import posts from the June Lingerie micro.blog JSON feed into Shopify blog articles.

## Requirements

- Node.js 18+ (uses built-in `fetch`)
- A Shopify Custom App access token with:
  - `read_blogs`
  - `read_blog_articles`
  - `write_blog_articles`

## Environment Variables

- `SHOPIFY_STORE_DOMAIN` (required): `your-store.myshopify.com`
- `SHOPIFY_ADMIN_TOKEN` (required): Admin API token from a Custom App
- `SHOPIFY_BLOG_HANDLE` (optional): default `journal`
- `SHOPIFY_API_VERSION` (optional): default `2024-01`
- `MICROBLOG_FEED_URL` (optional): default `https://junelingerie.micro.blog/feed.json`
- `DEFAULT_AUTHOR` (optional): set author on created posts
- `MIGRATION_TAG` (optional): default `microblog` (set empty string to skip)
- `DRY_RUN` (optional): default `true` (set to `false` to create posts)
- `MAX_ITEMS` (optional): limit import count for testing

## Usage

Dry-run (default):

```bash
SHOPIFY_STORE_DOMAIN="junelingerie.myshopify.com" \
SHOPIFY_ADMIN_TOKEN="shpat_xxx" \
node scripts/microblog-importer.mjs
```

Import for real:

```bash
SHOPIFY_STORE_DOMAIN="junelingerie.myshopify.com" \
SHOPIFY_ADMIN_TOKEN="shpat_xxx" \
DRY_RUN=false \
node scripts/microblog-importer.mjs
```

## Field Mapping

- `title`: micro.blog `title`, or derived from slug/date
- `handle`: derived from the micro.blog URL slug
- `body_html`: micro.blog `content_html`
- `summary_html`: plain text excerpt (160 chars)
- `published_at`: micro.blog `date_published`
- `image`: first `<img>` in `content_html`
- `tags`: `MIGRATION_TAG` if provided
- `author`: `DEFAULT_AUTHOR` if provided

## Idempotency

The script loads existing article handles for the target blog and skips handle collisions. This means reruns are safe as long as the handle mapping stays the same.
