/**
 * AI-friendly content routes
 * These routes serve content in Markdown format for AI agents
 */

import { Router } from 'express';
import { LRUCache } from 'lru-cache';
import {
  getShop,
  getProducts,
  getProductByHandle,
  getProductMetafields,
  getCollections,
  getCollectionByHandle,
  getCollectionProducts,
  getPages,
  getPageByHandle,
} from '../utils/shopify.js';
import {
  generateLlmsTxt,
  generateProductMarkdown,
  generateCollectionMarkdown,
  generatePageMarkdown,
  generateSitemapMarkdown,
  generateSitemapXml,
} from '../utils/generators.js';

const router = Router();

// Cache for 5 minutes to reduce API calls
const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5,
});

/**
 * Helper to set text/plain content type for Markdown
 */
function sendMarkdown(res, content) {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('X-Content-Format', 'markdown');
  res.send(content);
}

/**
 * GET /llms.txt
 * Discovery file for AI agents
 */
router.get('/llms.txt', async (req, res, next) => {
  try {
    const cacheKey = 'llms.txt';
    let content = cache.get(cacheKey);

    if (!content) {
      const [shop, products, collections, pages] = await Promise.all([
        getShop(),
        getProducts(),
        getCollections(),
        getPages(),
      ]);
      content = generateLlmsTxt(shop, products, collections, pages);
      cache.set(cacheKey, content);
    }

    sendMarkdown(res, content);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /sitemap.md
 * Structured overview of all content
 */
router.get('/sitemap.md', async (req, res, next) => {
  try {
    const cacheKey = 'sitemap.md';
    let content = cache.get(cacheKey);

    if (!content) {
      const [shop, products, collections, pages] = await Promise.all([
        getShop(),
        getProducts(),
        getCollections(),
        getPages(),
      ]);
      content = generateSitemapMarkdown(shop, products, collections, pages);
      cache.set(cacheKey, content);
    }

    sendMarkdown(res, content);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /sitemap.xml
 * XML sitemap for AI-friendly content (standard sitemap protocol)
 */
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const cacheKey = 'sitemap.xml';
    let content = cache.get(cacheKey);

    if (!content) {
      const [products, collections, pages] = await Promise.all([
        getProducts(),
        getCollections(),
        getPages(),
      ]);
      content = generateSitemapXml(products, collections, pages);
      cache.set(cacheKey, content);
    }

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(content);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /products/:handle.md
 * Individual product as Markdown
 */
router.get('/products/:handle.md', async (req, res, next) => {
  try {
    const { handle } = req.params;
    const cacheKey = `product:${handle}`;
    let content = cache.get(cacheKey);

    if (!content) {
      const product = await getProductByHandle(handle);
      if (!product) {
        return res.status(404).send('Product not found');
      }

      // Fetch metafields for rich content
      const metafields = await getProductMetafields(product.id);
      content = generateProductMarkdown(product, metafields);
      cache.set(cacheKey, content);
    }

    sendMarkdown(res, content);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /collections/:handle.md
 * Collection with product list as Markdown
 */
router.get('/collections/:handle.md', async (req, res, next) => {
  try {
    const { handle } = req.params;
    const cacheKey = `collection:${handle}`;
    let content = cache.get(cacheKey);

    if (!content) {
      const collection = await getCollectionByHandle(handle);
      if (!collection) {
        return res.status(404).send('Collection not found');
      }

      const products = await getCollectionProducts(collection.id);
      content = generateCollectionMarkdown(collection, products);
      cache.set(cacheKey, content);
    }

    sendMarkdown(res, content);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /pages/:handle.md
 * Static page as Markdown
 */
router.get('/pages/:handle.md', async (req, res, next) => {
  try {
    const { handle } = req.params;
    const cacheKey = `page:${handle}`;
    let content = cache.get(cacheKey);

    if (!content) {
      const page = await getPageByHandle(handle);
      if (!page) {
        return res.status(404).send('Page not found');
      }

      content = generatePageMarkdown(page);
      cache.set(cacheKey, content);
    }

    sendMarkdown(res, content);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /products.md
 * List all products
 */
router.get('/products.md', async (req, res, next) => {
  try {
    const cacheKey = 'products-list';
    let content = cache.get(cacheKey);

    if (!content) {
      const [shop, products] = await Promise.all([getShop(), getProducts()]);
      const lines = [
        `# ${shop.name} - All Products`,
        '',
        `${products.length} products available.`,
        '',
      ];

      products.forEach((p) => {
        const price = p.variants[0]?.price;
        const priceStr = price ? ` - $${price}` : '';
        lines.push(`- [${p.title}](products/${p.handle}.md)${priceStr}`);
      });

      content = lines.join('\n');
      cache.set(cacheKey, content);
    }

    sendMarkdown(res, content);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /collections.md
 * List all collections
 */
router.get('/collections.md', async (req, res, next) => {
  try {
    const cacheKey = 'collections-list';
    let content = cache.get(cacheKey);

    if (!content) {
      const [shop, collections] = await Promise.all([
        getShop(),
        getCollections(),
      ]);
      const lines = [
        `# ${shop.name} - Collections`,
        '',
        `${collections.length} collections available.`,
        '',
      ];

      collections.forEach((c) => {
        lines.push(`- [${c.title}](collections/${c.handle}.md)`);
      });

      content = lines.join('\n');
      cache.set(cacheKey, content);
    }

    sendMarkdown(res, content);
  } catch (error) {
    next(error);
  }
});

export default router;
