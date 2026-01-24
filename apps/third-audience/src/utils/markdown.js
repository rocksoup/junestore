import TurndownService from 'turndown';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Clean up Shopify-specific HTML artifacts
turndown.addRule('removeEmptyParagraphs', {
  filter: (node) => node.nodeName === 'P' && !node.textContent.trim(),
  replacement: () => '',
});

/**
 * Convert HTML to clean Markdown
 */
export function htmlToMarkdown(html) {
  if (!html) return '';
  return turndown.turndown(html).trim();
}

/**
 * Generate YAML frontmatter from an object
 */
export function generateFrontmatter(data) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string') {
      // Escape quotes and handle multiline
      if (value.includes('\n') || value.includes('"')) {
        lines.push(`${key}: |`);
        value.split('\n').forEach((line) => lines.push(`  ${line}`));
      } else {
        lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
      }
    } else if (Array.isArray(value)) {
      lines.push(`${key}:`);
      value.forEach((item) => lines.push(`  - "${item}"`));
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

/**
 * Format price with currency
 */
export function formatPrice(amount, currencyCode = 'USD') {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(num);
}

/**
 * Generate a clean slug/handle
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
