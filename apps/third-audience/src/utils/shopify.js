/**
 * Shopify Admin API client using REST
 * Fetches products, collections, pages, and articles for AI-friendly rendering
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2024-01';

async function shopifyFetch(endpoint, params = {}) {
  const url = new URL(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/${endpoint}`
  );
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Get shop information
 */
export async function getShop() {
  const data = await shopifyFetch('shop.json');
  return data.shop;
}

/**
 * Get all products (published, paginated)
 */
export async function getProducts(limit = 250) {
  const data = await shopifyFetch('products.json', {
    limit,
    status: 'active',
  });
  return data.products;
}

/**
 * Get a single product by handle
 */
export async function getProductByHandle(handle) {
  const data = await shopifyFetch('products.json', {
    handle,
    limit: 1,
  });
  return data.products[0] || null;
}

/**
 * Get product metafields
 */
export async function getProductMetafields(productId) {
  const data = await shopifyFetch(`products/${productId}/metafields.json`);
  return data.metafields;
}

/**
 * Get all collections (custom + smart)
 */
export async function getCollections(limit = 250) {
  const [custom, smart] = await Promise.all([
    shopifyFetch('custom_collections.json', { limit }),
    shopifyFetch('smart_collections.json', { limit }),
  ]);
  return [...custom.custom_collections, ...smart.smart_collections];
}

/**
 * Get a single collection by handle
 */
export async function getCollectionByHandle(handle) {
  // Try custom collections first
  let data = await shopifyFetch('custom_collections.json', {
    handle,
    limit: 1,
  });
  if (data.custom_collections.length > 0) {
    return { ...data.custom_collections[0], type: 'custom' };
  }

  // Try smart collections
  data = await shopifyFetch('smart_collections.json', { handle, limit: 1 });
  if (data.smart_collections.length > 0) {
    return { ...data.smart_collections[0], type: 'smart' };
  }

  return null;
}

/**
 * Get products in a collection
 */
export async function getCollectionProducts(collectionId, limit = 250) {
  const data = await shopifyFetch('products.json', {
    collection_id: collectionId,
    limit,
  });
  return data.products;
}

/**
 * Get all pages
 */
export async function getPages(limit = 250) {
  const data = await shopifyFetch('pages.json', {
    limit,
    published_status: 'published',
  });
  return data.pages;
}

/**
 * Get a single page by handle
 */
export async function getPageByHandle(handle) {
  const data = await shopifyFetch('pages.json', { handle, limit: 1 });
  return data.pages[0] || null;
}

/**
 * Get all blogs
 */
export async function getBlogs(limit = 50) {
  const data = await shopifyFetch('blogs.json', { limit });
  return data.blogs;
}

/**
 * Get articles from a blog
 */
export async function getArticles(blogId, limit = 250) {
  const data = await shopifyFetch(`blogs/${blogId}/articles.json`, {
    limit,
    published_status: 'published',
  });
  return data.articles;
}

/**
 * Get a single article by handle
 */
export async function getArticleByHandle(blogId, handle) {
  const data = await shopifyFetch(`blogs/${blogId}/articles.json`, {
    handle,
    limit: 1,
  });
  return data.articles[0] || null;
}
