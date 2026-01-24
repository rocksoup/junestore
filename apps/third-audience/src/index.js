/**
 * Shopify Third Audience App
 *
 * Serves store content in AI-friendly Markdown format.
 * Inspired by Dries Buytaert's "The Third Audience" concept.
 *
 * @see https://dri.es/the-third-audience
 */

import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for correct client IP when behind load balancer
app.set('trust proxy', 1);

/**
 * Verify Shopify App Proxy signature (optional but recommended)
 * @see https://shopify.dev/docs/apps/online-store/app-proxies#signature-verification
 */
function verifyShopifyProxy(req, res, next) {
  const secret = process.env.SHOPIFY_APP_PROXY_SECRET;

  // Skip verification if no secret configured (development mode)
  if (!secret) {
    return next();
  }

  const { signature, ...params } = req.query;

  if (!signature) {
    return res.status(401).send('Missing signature');
  }

  // Sort parameters and create query string
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('');

  const calculatedSignature = crypto
    .createHmac('sha256', secret)
    .update(sortedParams)
    .digest('hex');

  if (calculatedSignature !== signature) {
    return res.status(401).send('Invalid signature');
  }

  next();
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'shopify-third-audience' });
});

// Root redirect to llms.txt
app.get('/', (req, res) => {
  res.redirect('/llms.txt');
});

// Apply proxy verification middleware (can be disabled for development)
if (process.env.SHOPIFY_APP_PROXY_SECRET) {
  app.use(verifyShopifyProxy);
}

// Mount AI content routes
app.use('/', aiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.message.includes('Shopify API error')) {
    return res.status(502).send('Error fetching data from Shopify');
  }

  res.status(500).send('Internal server error');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
# 404 - Not Found

The requested content is not available.

## Available Endpoints

- \`/llms.txt\` - Discovery file for AI agents
- \`/sitemap.md\` - Site structure overview
- \`/products.md\` - All products list
- \`/products/:handle.md\` - Individual product
- \`/collections.md\` - All collections list
- \`/collections/:handle.md\` - Individual collection
- \`/pages/:handle.md\` - Static page

Visit the [llms.txt](/llms.txt) file for the full directory.
  `.trim());
});

app.listen(PORT, () => {
  console.log(`
┌─────────────────────────────────────────────────────┐
│                                                     │
│   🤖 Shopify Third Audience App                     │
│                                                     │
│   Serving AI-friendly content on port ${PORT}          │
│                                                     │
│   Endpoints:                                        │
│   • /llms.txt           Discovery file              │
│   • /sitemap.md         Site structure              │
│   • /products/:handle.md   Product content          │
│   • /collections/:handle.md Collection content      │
│   • /pages/:handle.md      Page content             │
│                                                     │
└─────────────────────────────────────────────────────┘
  `);
});

export default app;
