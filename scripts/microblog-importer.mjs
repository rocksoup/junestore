#!/usr/bin/env node
const DEFAULT_FEED_URL = "https://junelingerie.micro.blog/feed.json";
const DEFAULT_API_VERSION = "2024-01";

const FEED_URL = process.env.MICROBLOG_FEED_URL || DEFAULT_FEED_URL;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || DEFAULT_API_VERSION;
const BLOG_HANDLE = process.env.SHOPIFY_BLOG_HANDLE || "journal";
const DEFAULT_AUTHOR = process.env.DEFAULT_AUTHOR || "";
const MIGRATION_TAG = process.env.MIGRATION_TAG || "microblog";
const DRY_RUN = !process.env.DRY_RUN || process.env.DRY_RUN === "true" || process.env.DRY_RUN === "1";
const MAX_ITEMS = process.env.MAX_ITEMS ? Number(process.env.MAX_ITEMS) : null;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
  console.error("Missing required env vars: SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_TOKEN");
  process.exit(1);
}

const baseUrl = new URL(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/`);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decodeEntities = (text) => {
  if (!text) return "";
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
};

const stripHtml = (html) => decodeEntities(String(html || "").replace(/<[^>]*>/g, " "));

const truncate = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
};

const extractSlug = (url) => {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    return last.replace(/\.html?$/i, "");
  } catch (error) {
    return "";
  }
};

const titleCaseFromSlug = (slug) =>
  slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();

const buildTitle = (item, slug) => {
  if (item.title && item.title.trim()) return item.title.trim();
  if (slug && /[a-z]/i.test(slug)) return titleCaseFromSlug(slug);
  if (item.date_published) {
    const date = new Date(item.date_published);
    if (!Number.isNaN(date.valueOf())) {
      return `June Lingerie Post ${date.toISOString().slice(0, 10)}`;
    }
  }
  return "June Lingerie Post";
};

const buildHandle = (item, slug, usedHandles) => {
  const baseFromSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  let base = baseFromSlug;
  if (!base) {
    const date = item.date_published ? new Date(item.date_published) : new Date();
    base = `post-${date.toISOString().slice(0, 10)}`;
  }
  let handle = base;
  let counter = 2;
  while (usedHandles.has(handle)) {
    handle = `${base}-${counter}`;
    counter += 1;
  }
  usedHandles.add(handle);
  return handle;
};

const extractFirstImage = (html) => {
  const tagMatch = String(html || "").match(/<img\s[^>]*>/i);
  if (!tagMatch) return null;
  const tag = tagMatch[0];
  const srcMatch = tag.match(/src=["']([^"']+)["']/i);
  if (!srcMatch) return null;
  const altMatch = tag.match(/alt=["']([^"']*)["']/i);
  return { src: srcMatch[1], alt: altMatch ? altMatch[1] : "" };
};

const getNextPageInfo = (linkHeader) => {
  if (!linkHeader) return null;
  const links = linkHeader.split(",");
  for (const link of links) {
    if (link.includes('rel="next"')) {
      const match = link.match(/<([^>]+)>/);
      if (match) {
        const url = new URL(match[1]);
        return url.searchParams.get("page_info");
      }
    }
  }
  return null;
};

const shopifyRequest = async (path, { method = "GET", body } = {}) => {
  const url = new URL(path, baseUrl);
  const response = await fetch(url, {
    method,
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify API ${response.status}: ${text}`);
  }

  const data = await response.json();
  return { data, headers: response.headers };
};

const fetchFeed = async () => {
  const response = await fetch(FEED_URL);
  if (!response.ok) {
    throw new Error(`Feed fetch failed ${response.status}: ${await response.text()}`);
  }
  return response.json();
};

const fetchBlogByHandle = async () => {
  const { data } = await shopifyRequest("blogs.json?limit=250");
  const blogs = data.blogs || [];
  return blogs.find((blog) => blog.handle === BLOG_HANDLE);
};

const fetchExistingHandles = async (blogId) => {
  const handles = new Set();
  let pageInfo = null;

  do {
    let path = `blogs/${blogId}/articles.json?limit=250&fields=id,handle`;
    if (pageInfo) {
      path += `&page_info=${pageInfo}`;
    }
    const { data, headers } = await shopifyRequest(path);
    const articles = data.articles || [];
    for (const article of articles) {
      if (article.handle) handles.add(article.handle);
    }
    pageInfo = getNextPageInfo(headers.get("link"));
  } while (pageInfo);

  return handles;
};

const main = async () => {
  console.log(`Fetching feed: ${FEED_URL}`);
  const feed = await fetchFeed();
  let items = feed.items || [];
  if (MAX_ITEMS && Number.isFinite(MAX_ITEMS)) {
    items = items.slice(0, MAX_ITEMS);
  }

  console.log(`Fetching blogs for handle: ${BLOG_HANDLE}`);
  const blog = await fetchBlogByHandle();
  if (!blog) {
    throw new Error(`No blog found with handle "${BLOG_HANDLE}"`);
  }
  console.log(`Using blog "${blog.title}" (id ${blog.id})`);

  console.log("Loading existing article handles...");
  const usedHandles = await fetchExistingHandles(blog.id);

  for (const [index, item] of items.entries()) {
    const slug = extractSlug(item.url);
    const title = buildTitle(item, slug);
    const handle = buildHandle(item, slug, usedHandles);
    const textContent = stripHtml(item.content_html || "");
    const summary = truncate(textContent.trim(), 160);
    const image = extractFirstImage(item.content_html);

    const article = {
      title,
      body_html: item.content_html || "",
      handle,
      tags: MIGRATION_TAG ? [MIGRATION_TAG] : [],
      published: true,
      published_at: item.date_published || undefined,
      summary_html: summary || undefined,
    };

    if (DEFAULT_AUTHOR) {
      article.author = DEFAULT_AUTHOR;
    }

    if (image) {
      article.image = { src: image.src, alt: image.alt };
    }

    if (DRY_RUN) {
      console.log(`[dry-run] ${index + 1}/${items.length} would create: ${handle}`);
      continue;
    }

    console.log(`Creating ${index + 1}/${items.length}: ${handle}`);
    await shopifyRequest(`blogs/${blog.id}/articles.json`, {
      method: "POST",
      body: { article },
    });
    await sleep(600);
  }

  console.log(DRY_RUN ? "Dry-run complete." : "Import complete.");
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
