# Shopify Third Audience App

Serve your Shopify store content in AI-friendly Markdown format, implementing Dries Buytaert's "Third Audience" concept.

## Background

For two decades, websites were built for two audiences: **humans** and **search engines**. AI agents are now the **third audience**, and most websites aren't optimized for them yet.

This app provides clean, structured Markdown versions of your Shopify store content, making it easier for AI systems (ChatGPT, Claude, Perplexity, etc.) to understand and accurately reference your products.

**Reference:** [The Third Audience](https://dri.es/the-third-audience) by Dries Buytaert

## Features

- **`/llms.txt`** - Discovery file listing all AI-friendly endpoints
- **`/sitemap.xml`** - XML sitemap for AI content (standard protocol)
- **`/sitemap.md`** - Structured overview of store content
- **`/products/:handle.md`** - Individual product pages with full details
- **`/collections/:handle.md`** - Collection pages with product listings
- **`/pages/:handle.md`** - Static pages in Markdown

### Discoverability

The app integrates with standard web protocols for discovery:

1. **robots.txt** - References `llms.txt` and the AI sitemap
2. **XML Sitemap** - Standard sitemap protocol at `/a/ai/sitemap.xml`
3. **HTML Link Tag** - `<link rel="alternate">` in page head
4. **LLMs.txt** - Emerging standard for AI content directories

### What Gets Included

For products:
- Title, price, compare-at price
- Description (converted from HTML to Markdown)
- Variants with availability
- Options (size, color, etc.)
- Metafields (fit details, materials, care instructions)
- Image links
- Canonical URL for attribution

## Installation

### 1. Set Up the App

```bash
cd apps/third-audience
npm install
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your Shopify credentials:

```env
SHOPIFY_STORE_DOMAIN=june-lingerie-2.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
STORE_PUBLIC_URL=https://june-lingerie-2.myshopify.com
PORT=3001
```

### 3. Create Shopify Access Token

1. Go to Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps" → "Create an app"
3. Configure Admin API scopes:
   - `read_products`
   - `read_product_listings`
   - `read_content` (for pages)
4. Install the app and copy the Admin API access token

### 4. Run the App

```bash
# Development
npm run dev

# Production
npm start
```

### 5. Configure Shopify App Proxy (Optional)

To serve content under your store's domain (e.g., `june-lingerie-2.myshopify.com/a/ai/llms.txt`):

1. Create a Shopify app in Partner Dashboard (or use existing)
2. Go to App Setup → App Proxy
3. Configure:
   - **Subpath prefix:** `a`
   - **Subpath:** `ai`
   - **Proxy URL:** `https://your-app-host.com`

Requests to `yourstore.com/a/ai/*` will be proxied to your app.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /llms.txt` | Discovery file for AI agents |
| `GET /sitemap.xml` | XML sitemap (standard protocol) |
| `GET /sitemap.md` | Markdown site structure |
| `GET /products.md` | List all products |
| `GET /products/:handle.md` | Single product details |
| `GET /collections.md` | List all collections |
| `GET /collections/:handle.md` | Collection with products |
| `GET /pages/:handle.md` | Static page content |

## Example Output

### Product Markdown

```markdown
---
type: "product"
title: "Silk Bralette"
handle: "silk-bralette"
vendor: "June Lingerie"
price: "89.00"
currency: "USD"
available: true
canonical_url: "https://june-lingerie-2.myshopify.com/products/silk-bralette"
tags:
  - "bralette"
  - "silk"
  - "bestseller"
---

# Silk Bralette

**Price:** $89.00

**Brand:** June Lingerie

## Description

Luxuriously soft silk bralette with delicate lace trim...

## Variants

- **S**: $89.00 (In Stock)
- **M**: $89.00 (In Stock)
- **L**: $89.00 (Out of Stock)

## Fit Details

- **Coverage:** Light coverage
- **Rise:** Mid
- **Stretch:** Soft stretch

## Materials

- **Composition:** 100% Mulberry Silk

---

*Source: [Silk Bralette on https://june-lingerie-2.myshopify.com](https://june-lingerie-2.myshopify.com/products/silk-bralette)*
```

## Caching

Responses are cached for 5 minutes to reduce API calls. The cache is per-endpoint and automatically refreshes.

## Theme Integration

### HTML Link Tag

The theme includes a `<link>` tag to help AI crawlers discover the llms.txt file:

```html
<link rel="alternate" type="text/plain" href="/a/ai/llms.txt" title="LLMs.txt">
```

### robots.txt

A custom `robots.txt.liquid` template extends Shopify's default robots.txt with AI discovery:

```
# AI Content Discovery
LLMs-Txt: https://yourstore.com/a/ai/llms.txt
Sitemap: https://yourstore.com/a/ai/sitemap.xml

# Allow AI agents to crawl markdown content
User-agent: GPTBot
Allow: /a/ai/

User-agent: Claude-Web
Allow: /a/ai/

User-agent: PerplexityBot
Allow: /a/ai/
```

This ensures AI crawlers can discover and access your structured content through standard protocols.

## Security

- App Proxy signature verification (optional but recommended)
- Read-only access to Shopify data
- No customer or order data exposed

## Deployment

### Option A: Static Build (Recommended - No Server Required)

Generate all content as static files and deploy to any static host:

```bash
# Generate static files
npm run build

# Output is in ./dist:
# dist/
# ├── llms.txt
# ├── sitemap.xml
# ├── sitemap.md
# ├── products.md
# ├── products/
# │   └── *.md
# ├── collections.md
# ├── collections/
# │   └── *.md
# └── pages/
#     └── *.md
```

Deploy options for static files:
- **GitHub Pages** - Push `dist/` to `gh-pages` branch
- **Netlify** - Set publish directory to `apps/third-audience/dist`
- **Vercel** - `vercel deploy dist/`
- **Cloudflare Pages** - Connect repo, set build output to `dist`

Then update `robots.txt.liquid` to point to your static host URL.

**Tip:** Run `npm run build` in CI/CD on a schedule (daily/weekly) to keep content fresh.

### Option B: Dynamic Server

Run as a Node.js server for real-time content:

- **Heroku** - `heroku create && git push heroku main`
- **Railway** - Connect repo and deploy
- **Fly.io** - `fly launch`
- **Any Node.js host** - Just need Node 18+

### Option C: Serverless Functions

The routes can be adapted for serverless platforms:
- **Vercel Functions** - Each route becomes an API route
- **Netlify Functions** - Wrap routes as serverless handlers
- **Cloudflare Workers** - Edge-deployed, very fast

## Why This Matters

1. **Better AI Attribution** - Clean content helps AI provide accurate citations
2. **Future-Proofing** - As AI search grows, optimized content will rank better
3. **No Impact on SEO** - This supplements (not replaces) your HTML pages
4. **Simple Implementation** - Works alongside your existing theme

## License

MIT
