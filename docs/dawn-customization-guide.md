# Dawn Theme Customization Guide

## Overview

Dawn is Shopify's reference theme, designed to be customized through the Shopify Admin UI with minimal code changes. This guide documents Dawn's customization architecture and identifies which features can be configured through the admin vs requiring code modifications.

## Customization Levels

Dawn provides three levels of customization:

### 1. Global Theme Settings (Admin UI)
**Location:** Theme Customizer → Theme Settings
**File:** `config/settings_schema.json`

Global settings apply across the entire theme and include:

#### Brand & Identity
- **Logo:** Upload logo image, set width (50-300px), upload favicon
- **Brand Information:** Store name, contact info, social media links

#### Visual Design
- **Colors:** Color scheme groups (5 schemes) with background, text, buttons, shadows
  - Supports gradients for backgrounds
  - Separate color schemes can be applied to different sections
- **Typography:** Header and body font selection, scale adjustments
- **Layout:** Page width, section spacing, grid spacing

#### Component Styling
- **Buttons:** Border thickness, opacity, radius, shadow settings
- **Variant Pills:** Border, radius, shadow for product variant selectors
- **Form Inputs:** Border, radius, shadow for input fields
- **Cards:** Styling for product cards, collection cards, blog cards
  - Image padding, text alignment, color scheme, borders, shadows
- **Media:** Border, radius, shadow for images and videos
- **Content Containers:** Text boxes styling
- **Popups & Drawers:** Modal and drawer styling

#### Interactive Elements
- **Animations:** Enable/disable reveal-on-scroll animations
- **Badges:** Position and styling for sale/sold-out badges

#### Functional Settings
- **Search:** Predictive search, vendor display, price display
- **Currency Format:** Currency code display
- **Cart:** Cart type (drawer/notification), vendor display, cart notes
- **Social Media:** Links to social profiles

**Admin Path:** Shopify Admin → Themes → Customize → Theme Settings

### 2. Section-Level Settings (Admin UI)
**Location:** Theme Customizer → Sections
**Files:**
- `sections/*.liquid` (section definitions with `{% schema %}` blocks)
- `templates/*.json` (template configurations)

Sections are modular, full-width components that can be added, reordered, and customized per template.

#### Example: Product Page Section Settings
From our work on `templates/product.json`, the main-product section includes:

**Gallery Settings:**
- `gallery_layout`: stacked | columns | thumbnail | thumbnail_slider
- `media_size`: small | medium | large
- `image_zoom`: lightbox | hover | none
- `mobile_thumbnails`: columns | show | hide
- `constrain_to_viewport`: true/false
- `enable_video_looping`: true/false

**Layout Settings:**
- `media_position`: left | right
- `enable_sticky_info`: Keep product info sticky while scrolling

**Spacing:**
- `padding_top`: Numeric value
- `padding_bottom`: Numeric value

#### Common Section Types
Dawn includes these major sections:
- `main-product` - Product page layout
- `featured-product` - Product showcase
- `featured-collection` - Collection showcase
- `image-banner` - Hero images
- `collage` - Image galleries
- `multicolumn` - Multi-column content
- `footer` - Footer content
- `header` - Navigation
- `announcement-bar` - Top announcements
- `collapsible-content` - Accordions/FAQs
- `contact-form` - Contact forms
- `newsletter` - Email signup

**Admin Path:** Shopify Admin → Themes → Customize → (select template) → Add/Edit Sections

### 3. Block-Level Settings (Admin UI)
**Location:** Theme Customizer → Sections → Blocks

Blocks are nested components within sections. They can be added, reordered, and removed through the admin.

#### Example: Product Page Blocks
From `templates/product.json`, the product page includes these blocks:
- `vendor` - Product vendor/brand
- `title` - Product title
- `price` - Product price
- `variant_picker` - Size/color selection
- `quantity_selector` - Quantity input
- `buy_buttons` - Add to cart, dynamic checkout
- `description` - Product description
- `collapsible_tab` - Collapsible info sections (Materials, Shipping, Dimensions, Care)
- `share` - Social sharing buttons

Each block has its own settings (text style, icons, content, etc.)

**Admin Path:** Shopify Admin → Themes → Customize → (select section) → Add/Edit Blocks

## Code-Level Customization

### When Code Changes Are Required

Dawn requires code changes for:

1. **New Sections/Blocks:** Creating entirely new section types or block types
2. **Custom Liquid Logic:** Complex conditionals, loops, data transformations
3. **New Settings:** Adding settings not present in the schema
4. **Theme Structure:** Modifying layout files, adding new templates
5. **Custom Features:** Functionality beyond Dawn's built-in capabilities
6. **Asset Modifications:** Custom CSS, JavaScript, or images

### File Structure

```
junestore/
├── config/
│   ├── settings_schema.json    # Global theme settings definitions
│   └── settings_data.json       # Current theme settings values
├── templates/
│   └── *.json                   # Template configurations (which sections, in what order)
├── sections/
│   └── *.liquid                 # Section definitions (include {% schema %})
├── snippets/
│   └── *.liquid                 # Reusable code fragments (require {% doc %} headers)
├── layout/
│   └── theme.liquid             # HTML wrapper for all pages
├── assets/
│   ├── *.css                    # Stylesheets
│   ├── *.js                     # JavaScript
│   └── *.(png|jpg|svg)          # Images
└── locales/
    └── *.json                   # Translations
```

## Real-World Example: Product Gallery Improvements

We recently improved the product gallery UX through admin-configurable settings:

### Changes Made (Admin UI Only)
**File Modified:** `templates/product.json`

```json
"settings": {
  "gallery_layout": "thumbnail_slider",  // Changed from "stacked"
  "image_zoom": "lightbox",               // Added (was missing)
  "mobile_thumbnails": "show"             // Changed from "hide"
}
```

### Impact
- Desktop: Clickable thumbnails for all images instead of prev/next arrows
- Mobile: Thumbnail overview instead of sequential swiping
- All devices: Lightbox zoom for detail viewing

### No Code Required
These changes were made by updating JSON configuration values that correspond to existing settings in `sections/main-product.liquid`.

## Best Practices

### Prefer Admin Configuration
- Always check if a feature can be configured through existing settings before writing code
- Use JSON template configuration for section-specific overrides
- Leverage Dawn's built-in settings wherever possible

### When Writing Code
- Follow Dawn's patterns and conventions
- Add `{% schema %}` blocks to sections for merchant customization
- Add `{% doc %}` headers to snippets documenting parameters
- Use translation keys in `locales/` for all user-facing text
- Match Dawn's responsive, functional design philosophy

### Testing Customizations
- Use `shopify theme dev` for local testing with hot reload
- Test on both desktop and mobile viewports
- Run `shopify theme check` for Liquid validation
- Verify changes across different product types (single image, multi-image, videos)

## Useful Commands

```bash
# Start dev server
shopify theme dev --store june-lingerie-2.myshopify.com --store-password june

# Lint/validate theme code
shopify theme check

# Push changes to live theme
shopify theme push
```

## Resources

- **Dawn GitHub:** https://github.com/Shopify/dawn
- **Shopify Liquid Docs:** https://shopify.dev/docs/themes
- **Settings Schema Reference:** https://shopify.dev/docs/themes/architecture/settings
- **Section Schema Reference:** https://shopify.dev/docs/themes/architecture/sections/section-schema

## Conclusion

Dawn's architecture prioritizes merchant-friendly customization through the admin UI. Approximately 80-90% of typical customizations can be achieved without touching code by:
1. Adjusting global theme settings
2. Configuring section settings per template
3. Adding/removing/reordering blocks within sections
4. Modifying template JSON files for section-specific overrides

Code changes should be reserved for truly custom functionality or features beyond Dawn's comprehensive built-in capabilities.
