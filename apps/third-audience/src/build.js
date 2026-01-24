#!/usr/bin/env node

/**
 * Static Site Generator for Third Audience
 *
 * Generates all AI-friendly content as static files at build time.
 * Output can be deployed to GitHub Pages, Netlify, Vercel, or any static host.
 *
 * Usage:
 *   npm run build
 *   # Then deploy the ./dist folder
 */

import 'dotenv/config';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import {
  getShop,
  getProducts,
  getProductByHandle,
  getProductMetafields,
  getCollections,
  getCollectionByHandle,
  getCollectionProducts,
  getPages,
} from './utils/shopify.js';
import {
  generateLlmsTxt,
  generateProductMarkdown,
  generateCollectionMarkdown,
  generatePageMarkdown,
  generateSitemapMarkdown,
  generateSitemapXml,
} from './utils/generators.js';

const DIST_DIR = join(process.cwd(), 'dist');

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function write(path, content) {
  const fullPath = join(DIST_DIR, path);
  await ensureDir(join(fullPath, '..'));
  await writeFile(fullPath, content, 'utf-8');
  console.log(`  ✓ ${path}`);
}

async function build() {
  console.log('\n🤖 Third Audience Static Build\n');
  console.log('Fetching data from Shopify...\n');

  // Fetch all data
  const [shop, products, collections, pages] = await Promise.all([
    getShop(),
    getProducts(),
    getCollections(),
    getPages(),
  ]);

  console.log(`Found: ${products.length} products, ${collections.length} collections, ${pages.length} pages\n`);
  console.log('Generating files...\n');

  // Create output directories
  await ensureDir(join(DIST_DIR, 'products'));
  await ensureDir(join(DIST_DIR, 'collections'));
  await ensureDir(join(DIST_DIR, 'pages'));

  // Generate discovery files
  await write('llms.txt', generateLlmsTxt(shop, products, collections, pages));
  await write('sitemap.md', generateSitemapMarkdown(shop, products, collections, pages));
  await write('sitemap.xml', generateSitemapXml(products, collections, pages));

  // Generate product index
  const productIndex = [
    `# ${shop.name} - All Products\n`,
    `${products.length} products available.\n`,
    ...products.map(p => `- [${p.title}](products/${p.handle}.md)`),
  ].join('\n');
  await write('products.md', productIndex);

  // Generate collection index
  const collectionIndex = [
    `# ${shop.name} - Collections\n`,
    `${collections.length} collections available.\n`,
    ...collections.map(c => `- [${c.title}](collections/${c.handle}.md)`),
  ].join('\n');
  await write('collections.md', collectionIndex);

  // Generate individual product pages
  for (const product of products) {
    try {
      const metafields = await getProductMetafields(product.id);
      const content = generateProductMarkdown(product, metafields);
      await write(`products/${product.handle}.md`, content);
    } catch (err) {
      console.error(`  ✗ products/${product.handle}.md - ${err.message}`);
    }
  }

  // Generate individual collection pages
  for (const collection of collections) {
    try {
      const collectionProducts = await getCollectionProducts(collection.id);
      const content = generateCollectionMarkdown(collection, collectionProducts);
      await write(`collections/${collection.handle}.md`, content);
    } catch (err) {
      console.error(`  ✗ collections/${collection.handle}.md - ${err.message}`);
    }
  }

  // Generate individual pages
  for (const page of pages) {
    try {
      const content = generatePageMarkdown(page);
      await write(`pages/${page.handle}.md`, content);
    } catch (err) {
      console.error(`  ✗ pages/${page.handle}.md - ${err.message}`);
    }
  }

  console.log('\n✅ Build complete! Output in ./dist\n');
  console.log('Deploy options:');
  console.log('  • GitHub Pages: Push dist/ to gh-pages branch');
  console.log('  • Netlify: Set publish directory to "apps/third-audience/dist"');
  console.log('  • Vercel: vercel deploy dist/');
  console.log('  • Any static host: Upload contents of dist/\n');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
