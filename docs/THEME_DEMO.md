# Visual Theme Demo System

## Overview

A CSS-based theme switching system for presenting alternative visual styles to clients. Uses URL parameters and sessionStorage to switch between themes without duplicating templates or modifying core Shopify files.

## Available Themes

### 1. Default (Current Design)
**URL:** `http://127.0.0.1:9292/`

The current June Lingerie design with custom fonts, rounded corners, and gradient buttons.

### 2. Editorial
**URL:** `http://127.0.0.1:9292/?theme=editorial`

**Inspired by:** Mimi Flamingo (https://www.mimiflamingo.com)

**Style essence:** Modern editorial with serif headings, rounded shapes, and sophisticated blue accents. Clean, premium feel with generous whitespace.

**Key characteristics:**
- Serif headings (Crimson Pro) for editorial feel
- Clean sans-serif body text (Inter)
- Vibrant blue accent color (rgb(0, 56, 255))
- Rounded corners (0.75rem - 1.2rem)
- Generous spacing and whitespace
- Subtle shadows for depth
- Sentence case text (natural capitalization)

### 3. Refined
**URL:** `http://127.0.0.1:9292/?theme=refined`

**Inspired by:** Royce Lingerie (https://www.royce-lingerie.co.uk)

**Style essence:** Professional, minimal, utilitarian. Sharp edges, uppercase treatments, clean typography. Functional luxury with restrained elegance.

**Key characteristics:**
- Sans-serif throughout (Montserrat headings, Work Sans body)
- Monochromatic palette (pure black and white)
- Sharp corners (0.188rem - minimal rounding)
- Uppercase text treatment for impact
- Compact, tight spacing
- Flat design with minimal shadows
- Compact type scale
- Bordered product cards

## How to Use

### During Client Presentation

1. **Start dev server:**
   ```bash
   shopify theme dev --store june-lingerie-2.myshopify.com --store-password june
   ```

2. **Show default design:**
   ```
   http://127.0.0.1:9292/
   ```

3. **Show editorial theme:**
   ```
   http://127.0.0.1:9292/?theme=editorial
   ```
   Navigate to product page - theme persists automatically

4. **Show refined theme:**
   ```
   http://127.0.0.1:9292/?theme=refined
   ```
   Navigate to product page - theme persists automatically

5. **Switch back to default:**
   ```
   http://127.0.0.1:9292/?theme=default
   ```

### Console Commands

Open browser console and use:

```javascript
// Switch to editorial theme
juneSetTheme('editorial')

// Switch to refined theme
juneSetTheme('refined')

// Back to default
juneSetTheme('default')
```

### Quick Tab Switching

Open 3 browser tabs for instant comparison:
- Tab 1: `http://127.0.0.1:9292/` (default)
- Tab 2: `http://127.0.0.1:9292/?theme=editorial`
- Tab 3: `http://127.0.0.1:9292/?theme=refined`

## Technical Details

### Architecture

**Approach:** CSS variable overrides + component-level styling
- Zero Liquid template duplication
- Only CSS generation needed
- All existing interactions work automatically
- Single small JavaScript file for switching logic

### Files

**Created:**
- `/assets/june-theme-editorial.css` - Editorial theme styles
- `/assets/june-theme-refined.css` - Refined theme styles
- `/assets/june-theme-switcher.js` - Theme switching logic

**Modified:**
- `/layout/theme.liquid` - Added 3 lines to load switcher script on homepage and product pages (lines 410-412)

### How It Works

1. JavaScript reads `?theme=` URL parameter
2. If valid theme found, loads corresponding CSS file
3. Theme choice stored in sessionStorage for navigation persistence
4. Theme CSS overrides CSS variables and component styles
5. Body class added (`theme-editorial` or `theme-refined`) for additional scoping

### Tested Pages

✅ Homepage - All themes working
✅ Product page - All themes working
✅ Navigation persistence - Themes stay active when navigating
✅ Console switching - JavaScript helpers working
✅ Existing interactions - PhotoSwipe, variant pickers, cart buttons all functional

## After Demo

### If client chooses a theme:

1. Copy chosen theme CSS into `/assets/june-custom.css`
2. Delete the 3 theme files:
   - `june-theme-editorial.css`
   - `june-theme-refined.css`
   - `june-theme-switcher.js`
3. Remove script tag from `theme.liquid` (lines 410-412)
4. Commit refined styles to git

### If client wants iterations:

1. Keep theme switcher in place
2. Modify theme CSS files based on feedback
3. Refresh browser to see changes (dev server auto-reloads)
4. Can generate additional theme variations easily

### If client rejects all options:

1. Delete the 3 new files
2. Remove script tag from `theme.liquid`
3. Zero impact on original theme

## Notes

- Themes only load on homepage (`request.page_type == 'index'`) and product pages (`request.page_type == 'product'`)
- Other pages (cart, collection, etc.) continue using default theme
- Dev server handles cache busting automatically
- sessionStorage is cleared when `?theme=default` is used
- No impact on production Shopify theme until explicitly deployed
