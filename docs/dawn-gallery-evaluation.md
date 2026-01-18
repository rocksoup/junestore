# Dawn Theme Gallery Evaluation - Multi-Image Products

**Date:** 2026-01-18
**Task:** junestore-74z.4
**Test Products:** 3 products with 7-15 images each

## Executive Summary

Dawn's default gallery uses "stacked" layout with **no thumbnails**, requiring users to navigate 13+ images using only prev/next arrow buttons. This creates significant UX friction for products with many images, particularly lingerie where customers need to view multiple angles and details.

## Test Setup

### Products Tested
1. **Test Lingerie Set - Multi Image Gallery** - 13 images - $45.00
2. **Second Test Lingerie Set - Multi Image Gallery** - ? images - $50.00 (sold out)
3. **June Brief** - Standard product (control)

### Environment
- **Dev Server:** http://127.0.0.1:9292
- **Theme:** Dawn (Shopify)
- **Gallery Layout:** Stacked (default)
- **Testing Date:** January 18, 2026

## Key Findings

### 1. Gallery Layout Configuration

**Current Setting: "Stacked" (Default)**

Dawn offers 4 gallery layout options in `sections/main-product.liquid`:

| Layout | Description | Thumbnails | Best For |
|--------|-------------|------------|----------|
| `stacked` | Vertical stack, no thumbnails | ✗ No | 1-3 images |
| `columns` | Multi-column grid | ✗ No | Unknown |
| `thumbnail` | Single row of thumbnails | ✓ Yes | 4-8 images |
| `thumbnail_slider` | Scrollable thumbnail strip | ✓ Yes | 7+ images |

**Finding:** With 13 images and "stacked" layout, no thumbnails render at all.

```liquid
"default": "stacked",  // Line in main-product.liquid schema
```

### 2. Desktop Gallery Behavior (Stacked Layout)

#### Navigation Method
- **Primary:** Previous/Next arrow buttons
- **Secondary:** Slider counter ("1 / 13")
- **Thumbnails:** None rendered
- **Zoom:** Configurable via `image_zoom` setting (not tested)

#### User Experience Issues

**✗ Poor Discoverability**
- No visual preview of available images
- Users don't know what images 2-13 contain without clicking through
- No way to jump to specific image (e.g., "back view")

**✗ High Interaction Cost**
- Viewing all 13 images requires 12 sequential clicks
- No shortcuts or overview
- Counter shows progress but doesn't help navigation

**✗ Limited Context**
- One image visible at a time
- Can't compare multiple angles simultaneously
- Difficult to relocate a specific image after browsing

#### What Works

**✓ Clean, Minimal Interface**
- Large product images with good visibility
- Simple navigation pattern (arrows work consistently)
- Mobile-first design philosophy

**✓ Performance**
- Images lazy-load (only loads visible + next image)
- Smooth transitions between images
- No performance issues with 13 images

### 3. Mobile Gallery Behavior

#### Expected Behavior (Based on Code Analysis)

```liquid
{%- if hide_mobile_slider -%}
  // Slider hidden on mobile if:
  // - Single image only
  // - Mobile thumbnails set to "show"
  // - Mobile thumbnails "columns" mode with <3 images
{%- endif -%}
```

**Mobile Navigation:**
- Swipe gestures enabled via `slider-component`
- Arrow buttons conditionally hidden
- Counter always visible
- Thumbnails controlled by `mobile_thumbnails` setting

**Mobile Layouts Available:**
1. `columns` - Grid of images
2. `show` - Show thumbnails on mobile
3. `hide` - Hide thumbnails, swipe only

### 4. Gallery Implementation Analysis

#### File Structure
- **Main Template:** `sections/main-product.liquid` (line 79)
- **Gallery Snippet:** `snippets/product-media-gallery.liquid`
- **Thumbnail Rendering:** Lines 184-330 in gallery snippet
- **JavaScript:** `assets/media-gallery.js` (deferred)

#### Thumbnail Rendering Logic

```liquid
{%- if is_not_limited_to_single_item
  and media_count > 1
  and section.settings.gallery_layout contains 'thumbnail'
  or section.settings.mobile_thumbnails == 'show'
-%}
  <!-- Thumbnail slider renders here -->
{%- endif -%}
```

**Why No Thumbnails Render:**
- `gallery_layout = "stacked"` (doesn't contain "thumbnail")
- `mobile_thumbnails` ≠ "show"
- Both conditions fail → No thumbnail component

## Recommendations

### Critical: Change Gallery Layout for Multi-Image Products

**For Products with 7+ Images:**

Change `gallery_layout` setting from `stacked` to `thumbnail_slider`:

1. Navigate to Shopify Admin → Themes → Customize
2. Select product page template
3. Find "Product information" section settings
4. Change "Desktop media layout" to "Thumbnail slider"

**Expected Improvement:**
- ✓ All 13 images visible as thumbnails
- ✓ Click any thumbnail to jump to that image
- ✓ Horizontal scrolling for many thumbnails
- ✓ Maintains large main image view
- ✓ Significantly better UX for detailed product photography

### Alternative Layouts by Product Type

| Product Type | Image Count | Recommended Layout | Rationale |
|--------------|-------------|-------------------|-----------|
| Simple items | 1-3 images | `stacked` | Clean, minimal |
| Standard products | 4-6 images | `thumbnail` | Quick overview |
| Detailed products | 7-15 images | `thumbnail_slider` | Easy navigation |
| Complex products | 15+ images | `thumbnail_slider` + Consider splitting variants | Prevent overwhelming users |

### Mobile Optimization

**Set `mobile_thumbnails` to `show`** for products with many images:
- Gives mobile users thumbnail overview
- Reduces need for sequential swiping
- Better matches desktop experience

### Zoom Functionality

**Test and Enable Image Zoom:**

```liquid
{% if section.settings.image_zoom == 'hover' %}
  data-zoom-on-hover
{% endif %}
```

Options in schema:
- `none` - No zoom
- `lightbox` - Click opens modal
- `hover` - Magnifier on hover (desktop only)

**Recommendation:** Enable `lightbox` for detailed product photography (lingerie detail shots)

## Testing Gaps

Due to technical limitations, the following could not be tested directly:

1. **Zoom functionality** - Settings exist but behavior not verified
2. **Mobile swipe gestures** - Code indicates support, not tested on device
3. **Thumbnail_slider layout** - Not configured, behavior inferred from code
4. **Modal/lightbox behavior** - Render logic found, interaction not tested
5. **Performance with 20+ images** - Only tested up to 13 images

## Code Quality Observations

**✓ Strengths:**
- Well-structured Liquid templates
- Proper accessibility attributes (ARIA labels)
- Responsive design patterns
- Lazy loading implementation
- Clean separation of concerns (gallery snippet)

**⚠ Considerations:**
- Default "stacked" layout may not suit all product types
- No dynamic layout switching based on image count
- Merchant must manually configure per template

## Next Steps

1. **Immediate:** Change gallery layout to `thumbnail_slider` in theme customizer
2. **Test:** Verify thumbnail behavior with new setting
3. **Optimize:** Configure zoom functionality for detail images
4. **Monitor:** Track user engagement with product images (analytics)
5. **Consider:** Custom layout logic based on product type or image count

## Related Files

- `/sections/main-product.liquid` - Main product template
- `/snippets/product-media-gallery.liquid` - Gallery implementation
- `/snippets/product-thumbnail.liquid` - Individual thumbnail rendering
- `/assets/media-gallery.js` - Gallery interaction logic
- `/assets/component-slider.css` - Slider styling

## Appendix: HTML Inspection Results

```bash
# Test Product: test-lingerie-set-multi-image-gallery
Total Images: 13
Thumbnails Rendered: 0
Gallery Layout: stacked
Slider Buttons: ✓ Present
Counter: ✓ Present (1 / 13)
```

**Conclusion:** Dawn's gallery is well-implemented but requires proper configuration for optimal UX with multi-image products. The default "stacked" layout prioritizes simplicity over navigation efficiency, which becomes problematic with 7+ images.
