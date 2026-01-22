# Blog Editorial Implementation - Issues

Based on investigation from `docs/blog_spec.md` and `docs/BLOG_EDITORIAL_INVESTIGATION.md`.

---

## Issue 1: Featured Hero Module
**ID:** junestore-4lh (created)
**Priority:** HIGH | **Complexity:** MEDIUM (3-4 hours)
**Labels:** blog, enhancement, design-system

Create featured hero post module for blog listing page.
- 16:9 or 21:9 aspect ratio image
- Manual article picker OR auto-latest
- Title (36-44px desktop, serif), tag chip, date
- Create `snippets/featured-article-hero.liquid`
- Eager load image for LCP

---

## Issue 2: Tag Filter Chips UI
**ID:** junestore-39y (created)
**Priority:** HIGH | **Complexity:** LOW (1-2 hours)
**Labels:** blog, enhancement, ui, a11y

Implement horizontal tag filter chips for blog filtering.
- "All" chip resets to base blog URL
- Each tag links to `/tagged/{{ tag | handleize }}`
- Active state styling
- Horizontal scroll on mobile

---

## Issue 3: Photo-First Article Cards
**ID:** junestore-qmp (created)
**Priority:** HIGH | **Complexity:** MEDIUM (2-3 hours)
**Labels:** blog, enhancement, design-system, a11y

Refactor article cards for photo-first design.
- Fixed 4:5 aspect ratio
- 2-line clamp on titles (not truncate)
- Hover/focus/active states
- Entire card is single link

---

## Issue 4: Enhanced Responsive Grid
**ID:** junestore-9ja (created)
**Priority:** HIGH | **Complexity:** LOW-MEDIUM (1-2 hours)
**Labels:** blog, enhancement, responsive

Update grid to support 1→2→3→4 columns.
- Mobile: 1 col, Tablet: 2 col, Desktop: 3 col, Wide: 4 col
- Grid gaps: 16px → 24px
- Container max-width: 1280px

---

## Issue 5: Load More (Section Rendering API)
**Priority:** MEDIUM | **Complexity:** MEDIUM-HIGH (3-4 hours)
**Labels:** blog, enhancement, javascript, progressive-enhancement

Implement "Load more" with graceful pagination fallback.
- Use Shopify Section Rendering API
- Create `assets/blog-load-more.js`
- URL updates with pushState
- Loading states, error handling

---

## Issue 6: June Design System Styling
**Priority:** MEDIUM | **Complexity:** LOW-MEDIUM (2-3 hours)
**Labels:** blog, design-system, styling

Apply June design system consistently to blog.
- Typography scales (Fraunces serif headings, Inter body)
- Color inheritance from theme settings
- Spacing tokens
- Create `assets/june-blog-editorial.css`

---

## Issue 7: Performance Optimization
**Priority:** HIGH | **Complexity:** LOW-MEDIUM (2-3 hours)
**Labels:** blog, performance, seo, critical

Optimize for Core Web Vitals (LCP, CLS).
- Eager-load hero image (fetchpriority="high")
- Lazy-load below-fold cards
- Set aspect-ratio to prevent CLS
- Responsive srcset optimization

---

## Issue 8: Article Detail Gallery Block (Optional)
**Priority:** LOW | **Complexity:** MEDIUM (3-4 hours)
**Labels:** blog, enhancement, article

Gallery block for photo-heavy posts.
- 2 cols (mobile) → 3 cols (desktop)
- Optional lightbox with keyboard nav
- Create `snippets/gallery-block.liquid`

---

## Issue 9: Related Posts Module (Optional)
**Priority:** LOW | **Complexity:** LOW-MEDIUM (2 hours)
**Labels:** blog, enhancement, article

Show related articles at bottom of article pages.
- 3-4 related posts
- Use article tags for relevance
- Create `snippets/related-posts.liquid`

---

## Dependencies

```
Issue 1 (Hero) ──┐
Issue 2 (Tags) ──┼──▶ Issue 6 (Styling) ──▶ Issue 7 (Performance)
Issue 3 (Cards) ─┤
Issue 4 (Grid) ──┘

Issue 5 (Load More) - Independent

Issue 8 (Gallery) - Independent, optional
Issue 9 (Related) - Independent, optional
```

## Recommended Order

1. **Phase 1 (Core):** Issues 1, 2, 3, 4 (can be parallel)
2. **Phase 2 (Polish):** Issues 6, 7
3. **Phase 3 (Enhancement):** Issue 5
4. **Phase 4 (Optional):** Issues 8, 9

---

## Quick Commands to Create Remaining Issues

```bash
# Issue 5: Load More
bd create --title "Blog Editorial: Load More with Section Rendering API" \
  --labels "blog,enhancement,javascript"

# Issue 6: Design System
bd create --title "Blog Editorial: Apply June Design System Styling" \
  --labels "blog,design-system,styling"

# Issue 7: Performance
bd create --title "Blog Editorial: Performance Optimization" \
  --labels "blog,performance,seo,critical"

# Issue 8: Gallery Block
bd create --title "Blog Editorial: Article Gallery Block" \
  --labels "blog,enhancement,article"

# Issue 9: Related Posts
bd create --title "Blog Editorial: Related Posts Module" \
  --labels "blog,enhancement,article"
```

---

**Total Estimated Effort:** 16-24 hours
