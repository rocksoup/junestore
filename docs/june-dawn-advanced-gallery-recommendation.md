# June Lingerie (Dawn-derived) — Advanced Product Gallery Recommendation

**Goal:** upgrade the Dawn product media experience (PDP) beyond default behavior with a *premium*, *fast*, *low-risk* enhancement.

---

## Summary recommendation

Implement a **real lightbox + pinch/zoom** using **PhotoSwipe v5** on product pages, wired into Dawn’s existing product media gallery.

Why this is the best first upgrade for apparel:

- Fullscreen swipe gallery (mobile + desktop)
- Pinch-to-zoom (mobile) + wheel/trackpad zoom (desktop)
- Uses responsive image sizes (load big assets only when needed)
- Minimal impact on Dawn’s core media handling (images/videos/3D can stay intact)

---

## Important note about the live site

Your product page is behind Shopify’s `/password` page, and this environment can’t submit that password form to inspect the DOM directly.  
The approach below is the standard, safe integration path for a **Dawn-derived** theme and can be made exact once we confirm your theme’s file names and markup.

---

## Where this lives in a Dawn-derived theme

In most Dawn versions, the product gallery is rendered from:

- `sections/main-product.liquid`  
- `snippets/product-media-gallery.liquid` (or similarly named snippet)

If your fork renamed these, search in your theme for:
- `product-media-gallery`
- `data-media-id`
- `media-gallery`
- `main-product`

---

## Implementation plan (PhotoSwipe v5)

### 1) Add PhotoSwipe assets to your theme

Download PhotoSwipe v5 files and add to `/assets/`:

- `photoswipe-lightbox.esm.js`
- `photoswipe.esm.js`
- `photoswipe.css`

> Use ESM builds so we can load as a module and keep it product-page-only.

---

### 2) Load PhotoSwipe CSS

In `layout/theme.liquid`, add:

```liquid
{{ 'photoswipe.css' | asset_url | stylesheet_tag }}
```

If you want to scope this even tighter, you can gate it to product pages:

```liquid
{%- if request.page_type == 'product' -%}
  {{ 'photoswipe.css' | asset_url | stylesheet_tag }}
{%- endif -%}
```

---

### 3) Add a stable selector on the gallery wrapper

In `snippets/product-media-gallery.liquid` (or your equivalent), add an attribute to the gallery root container:

```liquid
<div data-product-gallery>
  ...
</div>
```

---

### 4) Wrap **image** media items in anchors that PhotoSwipe can open

Within the media loop, for **image media only**, wrap the image tag with an `<a>` and include:

- `href` to a large rendition
- `data-pswp-width`
- `data-pswp-height`

Example pattern (adapt variable names to match your snippet):

```liquid
{%- assign img = media.preview_image -%}

<a
  class="pswp-item"
  href="{{ img | image_url: width: 3000 }}"
  data-pswp-width="{{ img.width }}"
  data-pswp-height="{{ img.height }}"
>
  {{ img
    | image_url: width: 1200
    | image_tag:
        loading: 'lazy',
        sizes: '100vw',
        widths: '400, 800, 1200, 1600, 2000'
  }}
</a>
```

**Critical:** Do **not** wrap video, external video, or 3D model media in PhotoSwipe anchors.  
Leave those rendered exactly how Dawn does it today.

---

### 5) Initialize PhotoSwipe only on product pages

Create `assets/photoswipe-init.js`:

```js
import PhotoSwipeLightbox from './photoswipe-lightbox.esm.js';

function initProductLightbox() {
  const gallery = document.querySelector('[data-product-gallery]');
  if (!gallery) return;

  const lightbox = new PhotoSwipeLightbox({
    gallery: gallery,
    children: 'a.pswp-item',
    pswpModule: () => import('./photoswipe.esm.js'),
    wheelToZoom: true
  });

  lightbox.init();
}

document.addEventListener('DOMContentLoaded', initProductLightbox);
```

Then include it in `layout/theme.liquid`:

```liquid
{%- if request.page_type == 'product' -%}
  <script type="module" src="{{ 'photoswipe-init.js' | asset_url }}"></script>
{%- endif -%}
```

---

## Clothing-specific enhancements (optional, high impact)

### A) Variant-aware gallery behavior (colorways)

Improve the “premium” feel by ensuring that on variant change:

- the active slide transitions to the variant’s featured media
- (optional) only media relevant to that variant is emphasized

Implementation idea:
- Hook into the existing variant-change logic in Dawn (often tied to the product form change event)
- Locate the target media by `data-media-id`
- Use the gallery’s existing methods (or programmatic scroll) to set active media

This should remain aligned with Dawn’s native behavior, rather than replacing it.

---

### B) “Model / Flat / Detail” quick toggles

Simple but powerful:

1. Add `alt` keywords to your media:
   - `model`, `flat`, `detail` (or similar)
2. Add three small buttons above thumbnails:
   - **Model** → jumps to first media tagged `model`
   - **Flat** → jumps to first media tagged `flat`
   - **Detail** → jumps to first media tagged `detail`

This gives shoppers instant confidence without extra heavy JS.

---

## Performance checklist (keep it fast)

- Load PhotoSwipe only on product pages (`request.page_type == 'product'`)
- Keep primary PDP images at reasonable sizes; load huge images only when lightbox opens
- Ensure `widths` + `sizes` are set on `image_tag` so responsive images work well
- Avoid adding multiple gallery/slider libraries at once (bloat + conflicts)
- Respect reduced motion (keep transitions subtle and allow OS preferences)

---

## Testing plan

Test on:

- iPhone Safari + Chrome (pinch zoom, swipe, fullscreen open/close)
- Android Chrome
- Desktop Safari + Chrome (wheel/trackpad zoom, keyboard navigation)
- Variant switching (colorway changes should not break the active media)
- Video and 3D media: confirm they still behave exactly as before

---

## What I need (optional) to produce an exact patch

If you paste or upload these from your theme, I can return a precise diff that matches your markup:

- `sections/main-product.liquid`
- `snippets/product-media-gallery.liquid` (or equivalent)
- any custom gallery JS file if your fork diverges from Dawn
