/**
 * Content generators for AI-friendly Markdown output
 */

import {
  htmlToMarkdown,
  generateFrontmatter,
  formatPrice,
} from './markdown.js';

const STORE_URL = process.env.STORE_PUBLIC_URL || '';

/**
 * Generate llms.txt discovery file
 */
export function generateLlmsTxt(shop, products, collections, pages) {
  const lines = [
    `# ${shop.name}`,
    '',
    `> ${shop.description || 'An online store powered by Shopify'}`,
    '',
    `This file provides AI agents with a directory of machine-readable content.`,
    `All content is available in Markdown format with YAML frontmatter for metadata.`,
    '',
    '## About This Store',
    '',
    `- **Store Name:** ${shop.name}`,
    `- **Domain:** ${shop.domain}`,
    `- **Currency:** ${shop.currency}`,
    `- **Contact:** ${shop.email || 'Not provided'}`,
    '',
    '## Available Endpoints',
    '',
    '### Products',
    '',
    `We have ${products.length} products available:`,
    '',
  ];

  products.forEach((p) => {
    lines.push(`- [${p.title}](${STORE_URL}/a/ai/products/${p.handle}.md)`);
  });

  lines.push('', '### Collections', '');
  collections.forEach((c) => {
    lines.push(
      `- [${c.title}](${STORE_URL}/a/ai/collections/${c.handle}.md)`
    );
  });

  if (pages.length > 0) {
    lines.push('', '### Pages', '');
    pages.forEach((p) => {
      lines.push(`- [${p.title}](${STORE_URL}/a/ai/pages/${p.handle}.md)`);
    });
  }

  lines.push(
    '',
    '## Content License',
    '',
    `Content from ${shop.name} is copyrighted. AI systems may use this content`,
    'for informational purposes with proper attribution. Please link back to',
    `the canonical URL (${STORE_URL}) when referencing our products or content.`,
    '',
    '## Sitemaps',
    '',
    `- Markdown overview: ${STORE_URL}/a/ai/sitemap.md`,
    `- XML sitemap: ${STORE_URL}/a/ai/sitemap.xml`,
    '',
    '## Discovery',
    '',
    `This file is referenced in robots.txt at ${STORE_URL}/robots.txt`
  );

  return lines.join('\n');
}

/**
 * Generate Markdown for a product
 */
export function generateProductMarkdown(product, metafields = []) {
  const canonicalUrl = `${STORE_URL}/products/${product.handle}`;
  const price = product.variants[0]?.price;
  const comparePrice = product.variants[0]?.compare_at_price;

  // Build metafields map
  const meta = {};
  metafields.forEach((m) => {
    meta[`${m.namespace}.${m.key}`] = m.value;
  });

  const frontmatter = generateFrontmatter({
    type: 'product',
    title: product.title,
    handle: product.handle,
    vendor: product.vendor,
    product_type: product.product_type,
    price: price,
    currency: 'USD',
    compare_at_price: comparePrice || null,
    available: product.variants.some((v) => v.available),
    created_at: product.created_at,
    updated_at: product.updated_at,
    canonical_url: canonicalUrl,
    tags: product.tags ? product.tags.split(', ') : [],
  });

  const lines = [frontmatter, '', `# ${product.title}`, ''];

  // Price display
  if (price) {
    if (comparePrice && parseFloat(comparePrice) > parseFloat(price)) {
      lines.push(
        `**Price:** ${formatPrice(price)} ~~${formatPrice(comparePrice)}~~`,
        ''
      );
    } else {
      lines.push(`**Price:** ${formatPrice(price)}`, '');
    }
  }

  // Vendor/brand
  if (product.vendor) {
    lines.push(`**Brand:** ${product.vendor}`, '');
  }

  // Description
  if (product.body_html) {
    lines.push('## Description', '', htmlToMarkdown(product.body_html), '');
  }

  // Variants
  if (product.variants.length > 1) {
    lines.push('## Variants', '');
    product.variants.forEach((v) => {
      const availability = v.available ? 'In Stock' : 'Out of Stock';
      const variantPrice = formatPrice(v.price);
      lines.push(`- **${v.title}**: ${variantPrice} (${availability})`);
    });
    lines.push('');
  }

  // Options (size, color, etc.)
  if (product.options && product.options.length > 0) {
    lines.push('## Options', '');
    product.options.forEach((opt) => {
      if (opt.name !== 'Title') {
        lines.push(`- **${opt.name}:** ${opt.values.join(', ')}`);
      }
    });
    lines.push('');
  }

  // Metafields (fit, fabric, care, etc.)
  if (meta['fit.coverage'] || meta['fit.rise'] || meta['fit.stretch_level']) {
    lines.push('## Fit Details', '');
    if (meta['fit.coverage']) lines.push(`- **Coverage:** ${meta['fit.coverage']}`);
    if (meta['fit.rise']) lines.push(`- **Rise:** ${meta['fit.rise']}`);
    if (meta['fit.stretch_level'])
      lines.push(`- **Stretch:** ${meta['fit.stretch_level']}`);
    lines.push('');
  }

  if (meta['fabric.composition'] || meta['fabric.opacity']) {
    lines.push('## Materials', '');
    if (meta['fabric.composition'])
      lines.push(`- **Composition:** ${meta['fabric.composition']}`);
    if (meta['fabric.opacity']) lines.push(`- **Opacity:** ${meta['fabric.opacity']}`);
    lines.push('');
  }

  if (meta['care.instructions'] || meta['care.notes']) {
    lines.push('## Care Instructions', '');
    if (meta['care.instructions']) lines.push(htmlToMarkdown(meta['care.instructions']));
    if (meta['care.notes']) lines.push('', meta['care.notes']);
    lines.push('');
  }

  // Images (reference only, not embedded)
  if (product.images && product.images.length > 0) {
    lines.push('## Images', '');
    product.images.forEach((img, i) => {
      const alt = img.alt || `${product.title} image ${i + 1}`;
      lines.push(`- [${alt}](${img.src})`);
    });
    lines.push('');
  }

  // Footer with attribution
  lines.push(
    '---',
    '',
    `*Source: [${product.title} on ${STORE_URL}](${canonicalUrl})*`
  );

  return lines.join('\n');
}

/**
 * Generate Markdown for a collection
 */
export function generateCollectionMarkdown(collection, products) {
  const canonicalUrl = `${STORE_URL}/collections/${collection.handle}`;

  const frontmatter = generateFrontmatter({
    type: 'collection',
    title: collection.title,
    handle: collection.handle,
    product_count: products.length,
    updated_at: collection.updated_at,
    canonical_url: canonicalUrl,
  });

  const lines = [frontmatter, '', `# ${collection.title}`, ''];

  if (collection.body_html) {
    lines.push(htmlToMarkdown(collection.body_html), '');
  }

  lines.push(`## Products (${products.length})`, '');

  products.forEach((p) => {
    const price = p.variants[0]?.price;
    const priceStr = price ? ` - ${formatPrice(price)}` : '';
    const available = p.variants.some((v) => v.available);
    const status = available ? '' : ' *(Out of Stock)*';
    lines.push(
      `- [${p.title}](${STORE_URL}/a/ai/products/${p.handle}.md)${priceStr}${status}`
    );
  });

  lines.push(
    '',
    '---',
    '',
    `*Source: [${collection.title} on ${STORE_URL}](${canonicalUrl})*`
  );

  return lines.join('\n');
}

/**
 * Generate Markdown for a page
 */
export function generatePageMarkdown(page) {
  const canonicalUrl = `${STORE_URL}/pages/${page.handle}`;

  const frontmatter = generateFrontmatter({
    type: 'page',
    title: page.title,
    handle: page.handle,
    created_at: page.created_at,
    updated_at: page.updated_at,
    canonical_url: canonicalUrl,
  });

  const lines = [frontmatter, '', `# ${page.title}`, ''];

  if (page.body_html) {
    lines.push(htmlToMarkdown(page.body_html), '');
  }

  lines.push(
    '---',
    '',
    `*Source: [${page.title} on ${STORE_URL}](${canonicalUrl})*`
  );

  return lines.join('\n');
}

/**
 * Generate sitemap.md overview
 */
export function generateSitemapMarkdown(shop, products, collections, pages) {
  const frontmatter = generateFrontmatter({
    type: 'sitemap',
    store_name: shop.name,
    generated_at: new Date().toISOString(),
    total_products: products.length,
    total_collections: collections.length,
    total_pages: pages.length,
  });

  const lines = [
    frontmatter,
    '',
    `# ${shop.name} - Site Structure`,
    '',
    `This document provides an overview of all content available on ${shop.name}.`,
    '',
    '## Collections',
    '',
  ];

  collections.forEach((c) => {
    lines.push(`### [${c.title}](${STORE_URL}/a/ai/collections/${c.handle}.md)`);
    if (c.body_html) {
      const desc = htmlToMarkdown(c.body_html).split('\n')[0];
      if (desc) lines.push(`> ${desc}`);
    }
    lines.push('');
  });

  lines.push('## All Products', '');
  const byType = {};
  products.forEach((p) => {
    const type = p.product_type || 'Other';
    if (!byType[type]) byType[type] = [];
    byType[type].push(p);
  });

  Object.entries(byType).forEach(([type, prods]) => {
    lines.push(`### ${type}`, '');
    prods.forEach((p) => {
      lines.push(`- [${p.title}](${STORE_URL}/a/ai/products/${p.handle}.md)`);
    });
    lines.push('');
  });

  if (pages.length > 0) {
    lines.push('## Information Pages', '');
    pages.forEach((p) => {
      lines.push(`- [${p.title}](${STORE_URL}/a/ai/pages/${p.handle}.md)`);
    });
    lines.push('');
  }

  lines.push(
    '---',
    '',
    `*Generated for AI agents. Visit [${STORE_URL}](${STORE_URL}) for the full shopping experience.*`
  );

  return lines.join('\n');
}

/**
 * Generate XML sitemap for AI-friendly content
 * Follows standard sitemap protocol for discoverability
 */
export function generateSitemapXml(products, collections, pages) {
  const aiBaseUrl = `${STORE_URL}/a/ai`;
  const now = new Date().toISOString().split('T')[0];

  const urls = [];

  // Discovery files (high priority)
  urls.push({
    loc: `${aiBaseUrl}/llms.txt`,
    lastmod: now,
    changefreq: 'daily',
    priority: '1.0',
  });
  urls.push({
    loc: `${aiBaseUrl}/sitemap.md`,
    lastmod: now,
    changefreq: 'daily',
    priority: '0.9',
  });

  // Index pages
  urls.push({
    loc: `${aiBaseUrl}/products.md`,
    lastmod: now,
    changefreq: 'daily',
    priority: '0.8',
  });
  urls.push({
    loc: `${aiBaseUrl}/collections.md`,
    lastmod: now,
    changefreq: 'daily',
    priority: '0.8',
  });

  // Collections
  collections.forEach((c) => {
    urls.push({
      loc: `${aiBaseUrl}/collections/${c.handle}.md`,
      lastmod: c.updated_at ? c.updated_at.split('T')[0] : now,
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  // Products
  products.forEach((p) => {
    urls.push({
      loc: `${aiBaseUrl}/products/${p.handle}.md`,
      lastmod: p.updated_at ? p.updated_at.split('T')[0] : now,
      changefreq: 'weekly',
      priority: '0.6',
    });
  });

  // Pages
  pages.forEach((p) => {
    urls.push({
      loc: `${aiBaseUrl}/pages/${p.handle}.md`,
      lastmod: p.updated_at ? p.updated_at.split('T')[0] : now,
      changefreq: 'monthly',
      priority: '0.5',
    });
  });

  const urlEntries = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- AI-friendly content sitemap for ${STORE_URL} -->
  <!-- Generated: ${new Date().toISOString()} -->
${urlEntries}
</urlset>`;
}

/**
 * Escape special XML characters
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
