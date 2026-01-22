# Blog Editorial Implementation - Investigation Report

**Date:** 2026-01-21  
**Project:** June Lingerie Shopify Store  
**Spec Reference:** `docs/blog_spec.md` (Option A: Editorial Feature + Grid)

---

## Executive Summary

The current Shopify theme (Dawn-based) has a functional blog implementation with basic grid/collage layouts. To implement the **Editorial Feature + Grid (Photo-First)** spec, we need to make significant enhancements to:

1. Add a **featured hero post** module
2. Implement **tag chip filtering** UI
3. Refactor article cards to be **photo-first** with 4:5 aspect ratio
4. Add **"Load more"** progressive enhancement
5. Update CSS to match June's design system
6. Optimize for performance (responsive images, CLS prevention)

**Current State:** ✅ Basic functionality exists  
**Target State:** 📐 Editorial, photo-first, feature-rich blog

---

## Current Implementation Analysis

### Files Inventory

**Templates:**
- ✅ `templates/blog.json` - Blog listing template (basic configuration)
- ✅ `templates/article.json` - Individual article template

**Sections:**
- ✅ `sections/main-blog.liquid` - Main blog section (144 lines)
- ✅ `sections/main-article.liquid` - Individual article section (375 lines)
- ✅ `sections/featured-blog.liquid` - Homepage featured blog module (exists)

**Snippets:**
- ✅ `snippets/article-card.liquid` - Reusable article card component (156 lines)

**Styles:**
- ✅ `assets/section-main-blog.css` - Blog grid styling (62 lines)
- ✅ `assets/component-article-card.css` - Article card styling
- ✅ `assets/section-blog-post.css` - Individual article styling
- ✅ `assets/section-featured-blog.css` - Featured blog styling
- ✅ `assets/june-custom.css` - June design system overrides (240 lines)

**Documentation:**
- ✅ `docs/BLOG_SETUP.md` - Setup guide (215 lines)
- ✅ `docs/blog_spec.md` - Editorial design spec (169 lines)

### Current Features

**Blog Listing (`main-blog.liquid`):**
- ✅ Paginate by 6 articles
- ✅ Grid or collage layout options (theme setting)
- ✅ Image height options: adapt/small/medium/large
- ✅ Toggle show/hide: image, date, author
- ✅ Article excerpts enabled
- ⚠️ **Missing:** Featured hero post module
- ⚠️ **Missing:** Tag filtering UI
- ⚠️ **Missing:** Load more functionality

**Article Card (`article-card.liquid`):**
- ✅ Responsive images with srcset
- ✅ Shows: image, title, date, author, excerpt
- ✅ Comment count display
- ⚠️ **Issue:** No fixed aspect ratio (images adapt)
- ⚠️ **Issue:** Title truncates at 50 chars (should be 2-line clamp)
- ⚠️ **Issue:** Layout not optimized for photo-first editorial style

**Grid Layout (`section-main-blog.css`):**
- ✅ Responsive grid: 1 col (mobile) → 2 col (tablet)
- ⚠️ **Missing:** 3-4 col options for desktop/wide
- ⚠️ **Missing:** Editorial grid spacing per spec

**Individual Article (`main-article.liquid`):**
- ✅ Featured image with adaptive height
- ✅ Title with date/author
- ✅ Social share buttons (Twitter, Facebook, Pinterest)
- ✅ Comments system ready
- ⚠️ **Missing:** Gallery block for photo-heavy posts
- ⚠️ **Missing:** Related posts module

---

## Gap Analysis: Spec vs. Current

### Required Changes

| Feature | Spec Requirement | Current State | Status |
|---------|-----------------|---------------|--------|
| **Featured Hero Module** | 1 featured post with 16:9 or 21:9 image | Not implemented | 🚧 **BUILD** |
| **Tag Filter Chips** | Horizontal chip row with active state | Not implemented | 🚧 **BUILD** |
| **Article Cards** | 4:5 aspect ratio, photo-first | Variable aspect ratio | 🔧 **REFACTOR** |
| **Grid Columns** | 1→2→3→4 responsive | 1→2 only | 🔧 **ENHANCE** |
| **Load More** | Section Rendering API + fallback | Traditional pagination only | 🆕 **ADD** |
| **Card Typography** | 2-line clamp on title | 50-char truncate | 🔧 **FIX** |
| **Performance** | LCP eager-load, CLS prevention | Partially implemented | ✅ **OPTIMIZE** |
| **Design System** | June fonts/colors/spacing | Basic integration | 🔧 **ENHANCE** |

---

## Design System Integration

### Current State (`june-custom.css`)

✅ **Working Well:**
- Typography: Fraunces (serif) + Inter (sans) fonts loaded
- Custom spacing and radius tokens
- Card hover effects
- Logo animation styles (from landing page)
- Color inheritance from Shopify theme settings

⚠️ **Needs Enhancement:**
- Blog-specific typography scales not yet applied
- Article card states (hover, focus) need refinement
- Tag chip styling not yet defined
- Featured hero module styles not created

---

## Recommended Implementation Plan

### Phase 1: Core Layout Components
**Priority: HIGH** | **Complexity: MEDIUM**

1. **Create Featured Hero Module**
   - New snippet: `snippets/featured-article-hero.liquid`
   - Support featured post selection (manual or auto-latest)
   - 16:9 or 21:9 aspect ratio images
   - Content: tag chip + date + title + optional deck

2. **Refactor Article Cards for Photo-First**
   - Update `snippets/article-card.liquid`
   - Enforce 4:5 aspect ratio
   - Implement 2-line clamp on titles
   - Add proper hover/focus states

3. **Update Grid System**
   - Modify `assets/section-main-blog.css`
   - Add 3-column (desktop) and 4-column (wide) breakpoints
   - Implement proper grid gaps per spec (16px → 20-24px)

### Phase 2: Filtering & Navigation
**Priority: HIGH** | **Complexity: LOW**

4. **Add Tag Filter Chips**
   - Render tag chips in `sections/main-blog.liquid`
   - Style active/inactive states
   - Link to `{{ blog.url }}/tagged/{{ tag | handleize }}`
   - Responsive: horizontal scroll on mobile

### Phase 3: Progressive Enhancement
**Priority: MEDIUM** | **Complexity: MEDIUM-HIGH**

5. **Implement "Load More"**
   - Use Shopify Section Rendering API
   - Graceful fallback to pagination
   - Maintain URL state for accessibility

### Phase 4: Styling & Polish
**Priority: MEDIUM** | **Complexity: LOW**

6. **Apply June Design System**
   - Create blog-specific CSS utilities in `june-custom.css`
   - Typography scales per spec
   - Color scheme integration
   - Spacing and container rules

7. **Performance Optimization**
   - Eager-load hero image (fetchpriority="high")
   - Lazy-load below-fold cards
   - Set explicit width/height for CLS prevention
   - Audit srcset coverage

### Phase 5: Article Detail Enhancements
**Priority: LOW** | **Complexity: MEDIUM**

8. **Gallery Block for Photo-Heavy Posts**
   - Inline grid: 2 cols (mobile) → 3 cols (desktop)
   - Optional lightbox with keyboard navigation

9. **Related Posts Module**
   - Show 3-4 related articles at bottom
   - Use article tags for relevance

---

## Schema Settings to Add

Per the spec, we need to add these schema settings to `sections/main-blog.liquid`:

```liquid
{
  "type": "article",
  "id": "featured_article",
  "label": "Featured article",
  "info": "Leave empty to auto-select latest post"
},
{
  "type": "select",
  "id": "featured_image_ratio",
  "label": "Featured image ratio",
  "options": [
    { "value": "16-9", "label": "Editorial (16:9)" },
    { "value": "21-9", "label": "Cinematic (21:9)" }
  ],
  "default": "16-9"
},
{
  "type": "select",
  "id": "grid_columns_desktop",
  "label": "Grid columns (desktop)",
  "options": [
    { "value": "2", "label": "2 columns" },
    { "value": "3", "label": "3 columns" },
    { "value": "4", "label": "4 columns" }
  ],
  "default": "3"
},
{
  "type": "checkbox",
  "id": "show_tags",
  "label": "Show tag filters",
  "default": true
},
{
  "type": "checkbox",
  "id": "enable_load_more",
  "label": "Enable 'Load more' (requires JS)",
  "default": false,
  "info": "Falls back to pagination if JS disabled"
}
```

---

## Technical Notes

### Container & Grid Rules (From Spec)

```css
/* Content container */
max-width: 1200–1280px;
side-padding: 16px (mobile) → 24px (tablet+);

/* Grid columns */
mobile: 1 col
tablet: 2 col  
desktop: 3 col
wide: 4 col (optional, if cards remain readable)

/* Grid gaps */
mobile: 16px
desktop: 20–24px
```

### Article Card Anatomy (From Spec)

```
┌─────────────────────┐
│                     │
│   Image (4:5)       │  ← Critical: Fixed aspect ratio
│                     │
├─────────────────────┤
│ Tag · Date          │  ← Meta row (12-13px, muted)
│ Title (2-line max)  │  ← 18-20px (desktop), serif
│ Deck (2-line max)   │  ← 14-15px, optional
└─────────────────────┘
```

### Featured Hero Anatomy (From Spec)

```
┌─────────────────────────────────────┐
│                                     │
│   Image (16:9 or 21:9)              │  ← Soft corners
│                                     │
├─────────────────────────────────────┤
│ Tag · Date (small)                  │
│ Title (36–44px desktop, serif)      │
│ Optional deck (1 line max)          │
└─────────────────────────────────────┘
```

---

## Testing Checklist

Once implemented, verify:

- [ ] Featured hero displays correctly with correct aspect ratio
- [ ] Tag filters work and show active state
- [ ] Article cards maintain 4:5 ratio across all breakpoints
- [ ] Grid responds correctly: 1→2→3→4 columns
- [ ] "Load more" works with JS, falls back to pagination without
- [ ] Images are responsive (srcset) and don't cause CLS
- [ ] Hero image loads eagerly (LCP optimization)
- [ ] Typography matches June design system
- [ ] Colors inherit from theme settings
- [ ] Hover/focus states are clear and accessible
- [ ] Mobile experience is optimized
- [ ] Performance metrics (Core Web Vitals) meet targets

---

## Files to Create

1. `snippets/featured-article-hero.liquid` - Featured hero component
2. `snippets/tag-filter-chips.liquid` - Tag filter UI component
3. `assets/june-blog-editorial.css` - Editorial blog styles

## Files to Modify

1. `sections/main-blog.liquid` - Add featured hero, tag filters, load more
2. `snippets/article-card.liquid` - Refactor for 4:5 ratio, photo-first
3. `assets/section-main-blog.css` - Update grid system, spacing
4. `assets/component-article-card.css` - Update card styles
5. `assets/june-custom.css` - Add blog-specific design tokens
6. `templates/blog.json` - Update default settings

## Optional Enhancements

1. `snippets/gallery-block.liquid` - Photo gallery for articles
2. `snippets/related-posts.liquid` - Related posts module
3. `assets/blog-load-more.js` - Section Rendering API script

---

## Dependencies & Prerequisites

- ✅ June design system (`june-custom.css`) already established
- ✅ Color scheme integration working (theme settings)
- ✅ Font loading (Fraunces + Inter) functional
- ⚠️ Need blog content with high-quality images for testing
- ⚠️ Need to select/tag featured posts in Shopify admin

---

## Risks & Considerations

1. **Image Quality:** Blog success depends on high-quality photography
2. **Content Volume:** Editorial grid works best with 10+ posts
3. **Browser Compatibility:** Test "Load more" across browsers
4. **Performance:** Monitor LCP with hero images
5. **Mobile UX:** Ensure tag chips don't overwhelm mobile layout

---

## Next Steps

1. ✅ **Investigation Complete** (this document)
2. 🎯 **Create Beads Issues** for each implementation phase
3. 📋 **Prioritize Issues** based on dependencies
4. 🏗️ **Begin Implementation** starting with Phase 1

---

**End of Investigation Report**
