# Core Web Vitals Optimization

## Overview

Core Web Vitals are Google's metrics for measuring user experience. This document outlines the optimizations implemented in this theme to meet Google's performance standards.

## Core Web Vitals Metrics

### Target Scores

- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **FID (First Input Delay):** < 100 milliseconds
- **CLS (Cumulative Layout Shift):** < 0.1

## Current Optimizations

### ✅ Image Optimization (LCP & CLS)

**Lazy Loading:**
```liquid
<img loading="lazy" />
```
- Images below the fold load only when needed
- Reduces initial page load time
- Improves LCP score

**Width and Height Attributes:**
```liquid
<img width="1100" height="1100" />
```
- Prevents layout shift as images load
- Reserves space in layout before image loads
- Critical for CLS score

**Responsive Images (srcset):**
```liquid
srcset="
  {{ image | image_url: width: 550 }} 550w,
  {{ image | image_url: width: 1100 }} 1100w,
  {{ image | image_url: width: 2048 }} 2048w
"
```
- Serves appropriately sized images for each device
- Reduces unnecessary data transfer
- Improves LCP on mobile

**Image Formats:**
- Shopify automatically serves WebP to supported browsers
- Falls back to JPG/PNG for older browsers
- WebP typically 25-35% smaller than JPG

### ✅ JavaScript Optimization (FID)

**Deferred Script Loading:**
```liquid
<script src="{{ 'global.js' | asset_url }}" defer="defer"></script>
```
- All scripts use `defer` attribute
- Scripts load without blocking HTML parsing
- JavaScript executes after HTML is fully parsed
- Improves FID and LCP

**No Parser-Blocking Scripts:**
- Zero synchronous `<script>` tags in `<head>`
- All scripts are deferred or async
- Page renders immediately without waiting for JS

### ✅ Font Optimization (CLS & LCP)

**Font Display Swap:**
```liquid
{{ settings.type_body_font | font_face: font_display: 'swap' }}
```
- Shows fallback font immediately
- Swaps to custom font when loaded
- Prevents invisible text (FOIT)
- Improves perceived performance

**Font Preloading:**
```liquid
<link rel="preload" as="font" href="{{ font_url }}" type="font/woff2" crossorigin>
```
- Critical fonts load early in page lifecycle
- Reduces time to text render
- Improves LCP

**Font Format:**
- Uses WOFF2 format (best compression)
- Falls back to WOFF for older browsers
- Hosted on Shopify CDN for fast delivery

### ✅ CSS Optimization

**Critical CSS Inline:**
```liquid
{% style %}
  /* Critical above-the-fold styles */
{% endstyle %}
```
- Inline critical CSS in `<head>`
- No render-blocking external stylesheets
- Page renders without CSS download wait

**Non-Critical CSS:**
```liquid
<link rel="stylesheet" href="{{ 'component-cart.css' | asset_url }}" media="print" onload="this.media='all'">
```
- Non-critical CSS loads asynchronously
- Uses media attribute hack for async loading
- Doesn't block initial render

### ✅ Shopify CDN

**Automatic Optimizations:**
- Global CDN distribution
- Automatic image optimization
- Brotli/Gzip compression
- HTTP/2 support
- Edge caching

## Monitoring Core Web Vitals

### Testing Tools

**Google PageSpeed Insights:**
```
https://pagespeed.web.dev/
```
- Official Google testing tool
- Tests both mobile and desktop
- Provides specific recommendations

**Chrome DevTools Lighthouse:**
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Performance" category
4. Click "Analyze page load"

**Google Search Console:**
- Navigate to "Core Web Vitals" report
- View real user data from Chrome users
- Identify pages needing improvement

**WebPageTest:**
```
https://www.webpagetest.org/
```
- Advanced testing with multiple locations
- Waterfall view of all resources
- Filmstrip view of load progression

### Real User Monitoring (RUM)

**Shopify Analytics:**
- Built-in performance tracking
- Real visitor data
- Online Store Speed report

**Google Analytics 4:**
- Web Vitals report available
- Real user measurements
- Segmentation by device/location

## Common Issues & Solutions

### Slow LCP (> 2.5s)

**Symptoms:**
- Large images loading slowly
- Heavy JavaScript blocking render
- Slow server response time

**Solutions:**
- Compress product images (target < 200KB)
- Use Shopify's image CDN (automatic)
- Minimize third-party scripts
- Enable Shopify's performance features

### High CLS (> 0.1)

**Symptoms:**
- Content jumping as page loads
- Images pushing content down
- Fonts causing layout shift

**Solutions:**
- Always include width/height on images
- Reserve space for dynamic content
- Use `font-display: swap` (already implemented)
- Avoid injecting content above existing content

### Poor FID (> 100ms)

**Symptoms:**
- Delayed button clicks
- Slow form interactions
- Heavy JavaScript execution

**Solutions:**
- Reduce JavaScript bundle size
- Remove unused scripts
- Use code splitting
- Defer non-critical scripts (already implemented)

## Product Page Specific Optimizations

### Above the Fold Content

**Priority Loading:**
1. Product title (H1)
2. Product price
3. Main product image
4. Add to cart button

**Deferred Content:**
- Product description (below fold)
- Related products
- Customer reviews
- Additional images (lazy loaded)

### Image Gallery

**Optimization Strategy:**
- First image: Preload (LCP element)
- Visible thumbnails: Normal priority
- Hidden thumbnails: Lazy load
- Zoom images: Load on demand

**Implementation:**
```liquid
{%- if media_index == 1 -%}
  <link rel="preload" as="image" href="{{ media.preview_image | image_url: width: 1445 }}">
{%- endif -%}
```

### Third-Party Scripts

**App Scripts:**
- Load asynchronously when possible
- Place at bottom of page
- Use async/defer attributes
- Audit regularly for performance impact

**Minimize Apps:**
- Each app adds load time
- Review installed apps quarterly
- Remove unused apps
- Choose lightweight alternatives

## Performance Budget

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Page Size | < 1.5 MB | Check with PageSpeed |
| Requests | < 50 | Check with DevTools |
| LCP | < 2.5s | Monitor in Search Console |
| FID | < 100ms | Monitor in Search Console |
| CLS | < 0.1 | Monitor in Search Console |

### Regular Audits

**Monthly:**
- Run PageSpeed Insights on key pages
- Check Google Search Console Core Web Vitals report
- Review Shopify Online Store Speed report

**Quarterly:**
- Full site audit with WebPageTest
- Review and remove unused code
- Audit third-party scripts
- Test on real devices

## Advanced Optimizations

### Potential Improvements

**Resource Hints:**
```liquid
<link rel="dns-prefetch" href="//cdn.shopify.com">
<link rel="preconnect" href="//cdn.shopify.com" crossorigin>
```
- Speed up external resource loading
- Reduce DNS lookup time

**Intersection Observer:**
```javascript
// Lazy load sections below fold
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Load content
    }
  });
});
```
- Progressive content loading
- Reduce initial page weight

**Code Splitting:**
- Load JavaScript modules on demand
- Reduce initial bundle size
- Improve FID score

## Shopify Theme Settings

### Performance Features

**Enable in Shopify Admin:**

1. **Online Store Speed:** Navigate to Online Store > Themes > Speed
   - Review recommendations
   - Enable suggested optimizations

2. **Animations:** Settings > Theme settings > Animations
   - Disable heavy animations on mobile
   - Use CSS animations over JavaScript

3. **Media Settings:** Settings > Files
   - Set maximum image dimensions (2048x2048 recommended)
   - Enable automatic image optimization

## Support & Resources

### Shopify Resources
- [Performance Best Practices](https://shopify.dev/docs/themes/best-practices/performance)
- [Dawn Theme Performance](https://github.com/Shopify/dawn)
- [Shopify Speed Report](https://shopify.dev/docs/themes/best-practices/performance/speed-report)

### Google Resources
- [Web Vitals](https://web.dev/vitals/)
- [Core Web Vitals Guide](https://web.dev/vitals-core/)
- [Optimize LCP](https://web.dev/optimize-lcp/)
- [Optimize FID](https://web.dev/optimize-fid/)
- [Optimize CLS](https://web.dev/optimize-cls/)

---

**Last Updated:** 2026-01-20
**Version:** 1.0.0
