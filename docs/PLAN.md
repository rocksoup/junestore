# June Lingerie Shopify Theme Development Plan

## Overview
Set up a modern Shopify theme development environment based on the Dawn theme, with initial focus on research and planning for lingerie-specific customizations (product photography optimization and size charts/fit guides).

## Prerequisites
- Shopify development store is already set up ✓
- GitHub repository initialized at rocksoup/junestore ✓
- Brand new launch (no migration required) ✓

## Phase 1: Local Development Environment Setup

### 1.1 Install Shopify CLI and Dependencies
```bash
# Install Shopify CLI globally
npm install -g @shopify/cli @shopify/theme

# Verify installation
shopify version
```

### 1.2 Initialize Dawn Theme
```bash
# Clone Dawn theme as starting point
shopify theme init --clone-url https://github.com/Shopify/dawn.git

# This creates a complete Dawn theme structure in the current directory
```

### 1.3 Connect to Development Store
```bash
# Start local development server with hot reload
shopify theme dev --store [your-store-name].myshopify.com

# This will:
# - Connect to your dev store
# - Start local server (typically at http://127.0.0.1:9292)
# - Enable hot reloading for instant preview of changes
# - Sync files to a development theme on your store
```

### 1.4 Set Up Version Control
```bash
# Add Dawn theme files to repository
git add .

# Create initial commit
git commit -m "Initial Dawn theme setup"

# Push to GitHub
git push origin main
```

## Phase 2: Dawn Theme Exploration and Documentation

### 2.1 Understand Dawn's File Structure
Explore and document the key directories:

- **`/assets/`** - CSS, JavaScript, images, fonts
  - Review: `base.css`, `theme.js`, component-specific CSS files
- **`/sections/`** - Modular, configurable components
  - Key sections: `main-product.liquid`, `image-banner.liquid`, `featured-collection.liquid`
- **`/snippets/`** - Reusable code fragments
  - Important: `product-card.liquid`, `icon-*.liquid`, `price.liquid`
- **`/templates/`** - JSON templates for each page type
  - Review: `product.json`, `collection.json`, `index.json`
- **`/layout/`** - Main wrapper (`theme.liquid`)
- **`/config/`** - Theme settings (`settings_schema.json`)

### 2.2 Analyze Current Product Page Implementation
Focus on `/sections/main-product.liquid`:
- Current image gallery implementation
- Variant selector structure
- Product information layout
- Mobile vs desktop responsive behavior

### 2.3 Analyze Collection/Listing Pages
Focus on `/sections/main-collection-product-grid.liquid`:
- Product card layout and styling
- Filtering capabilities (via Shopify Search & Discovery)
- Grid structure and responsive breakpoints

## Phase 3: Lingerie-Specific Feature Research

### 3.1 Product Photography Optimization Analysis

**Current Dawn Capabilities:**
- Media gallery with thumbnail navigation
- Zoom functionality
- Video support
- Mobile-friendly swipe gestures

**Lingerie Requirements (from guide):**
- Minimum 5-7 images per product (front, back, side, details, lifestyle)
- Model measurements display
- Multiple angle views
- Detail shots for fabric/construction

**Research Tasks:**
1. Test Dawn's default gallery with 7+ images
2. Identify improvements needed for:
   - Thumbnail layout with many images
   - Quick navigation between angles
   - Integration of model measurements into product info section
3. Evaluate if third-party apps are needed or if custom sections suffice

### 3.2 Size Chart & Fit Guide Integration

**Options to Evaluate:**

**Option A: Third-Party App (Recommended Start)**
- App: Kiwi Sizing ($6.99/mo) or ESC Size Charts (free tier)
- Pros: Immediate functionality, tested UX, maintained
- Cons: Monthly cost, less customization

**Option B: Custom Section Development**
- Build custom Liquid section for size charts
- Pros: No ongoing cost, full control, matches brand
- Cons: Development time, maintenance responsibility

**Requirements:**
- International size conversions (US, UK, EU, AU)
- Visual measurement guide with images
- Per-product fit notes ("runs small", "true to size")
- Modal or drawer interface (don't clutter product page)

**Recommended Approach:**
Start with ESC Size Charts free tier to test UX, then build custom if specific needs arise.

### 3.3 Product Filtering Requirements

**Current Dawn + Shopify Search & Discovery:**
- Up to 25 filters (free, built into Shopify)
- Color swatches
- Typo tolerance
- No additional cost

**Lingerie-Specific Filters Needed:**
- Size (band + cup for bras, S/M/L for other items)
- Style (thong, bikini, brief, boyshort, etc.)
- Color (with visual swatches)
- Material (lace, cotton, satin, etc.)
- Coverage level (full, moderate, minimal)

**Implementation:**
Configure via Shopify admin → Search & Discovery app (free)

## Phase 4: Development Tooling Integration

### 4.1 Set Up Tailwind CSS (Optional but Recommended)

**Why:** Modern utility-first CSS that integrates well with Liquid

**Setup:**
1. Install dependencies:
   ```bash
   npm init -y
   npm install -D tailwindcss vite vite-plugin-shopify
   ```

2. Create `vite.config.js`:
   ```javascript
   import shopify from 'vite-plugin-shopify';

   export default {
     plugins: [shopify()],
     build: {
       outDir: 'assets',
       rollupOptions: {
         output: { entryFileNames: '[name].js' }
       }
     }
   }
   ```

3. Create `tailwind.config.js`:
   ```javascript
   module.exports = {
     content: [
       './sections/*.liquid',
       './snippets/*.liquid',
       './layout/*.liquid',
       './templates/**/*.json'
     ],
     theme: {
       extend: {}
     }
   }
   ```

4. Create `.shopifyignore`:
   ```
   node_modules/
   vite.config.*
   tailwind.config.*
   package*.json
   src/
   ```

### 4.2 Install VS Code Extensions
- Shopify Liquid (official extension for syntax highlighting and linting)
- Tailwind CSS IntelliSense (if using Tailwind)

### 4.3 Set Up Theme Check Linting
```bash
# Run Theme Check regularly
shopify theme check

# Catches Liquid syntax errors, performance issues, deprecated patterns
```

## Phase 5: Priority Customizations Roadmap

### 5.1 Product Page Enhancements (Priority 1)

**Image Gallery Improvements:**
1. Modify `/sections/main-product.liquid` to:
   - Optimize thumbnail navigation for 7+ images
   - Add "View Detail" labels on hover
   - Ensure mobile swipe gestures work smoothly

2. Create new snippet `/snippets/product-model-info.liquid`:
   - Display model measurements
   - Show size worn by model
   - Include height and measurements

3. Style enhancements in `/assets/component-product.css`:
   - Larger preview images on desktop
   - Better mobile gallery experience
   - Quick navigation between key angles

**Size Chart Integration:**
1. Install ESC Size Charts app (free tier) initially
2. Configure for each product type:
   - Bras: band/cup conversion table
   - Underwear: waist/hip measurements
   - Loungewear: standard S/M/L/XL

3. Add custom fit notes field to products:
   - Use product metafields for "Fit Description"
   - Display prominently near size selector

### 5.2 Collection Page Optimization (Priority 2)

**Product Card Improvements:**
1. Modify `/snippets/product-card.liquid`:
   - Ensure quick view of multiple images on hover
   - Display available sizes clearly
   - Show "New Arrival" or "Best Seller" badges

**Filtering Setup:**
1. Configure Shopify Search & Discovery:
   - Create filter groups for Size, Style, Color, Material, Coverage
   - Set up color swatches
   - Test filtering UX

### 5.3 Return Policy Integration (Priority 3)

**Policy Display:**
1. Create custom section `/sections/product-return-policy.liquid`:
   - Different policies for bras vs underwear vs loungewear
   - Highlight hygiene liner requirement
   - First-purchase size guarantee messaging

2. Add to product pages via JSON template customization

## Phase 6: Testing and Validation

### 6.1 Test Order Flow
- Enable Bogus Gateway in dev store
- Place test orders with different scenarios:
  - Card "1" (success)
  - Card "2" (failure)
  - Card "3" (exception)
- Verify: checkout, email notifications, inventory updates

### 6.2 Mobile Testing
- Test on actual mobile devices (iOS and Android)
- Focus on:
  - Image gallery swipe gestures
  - Size chart modal/drawer
  - Filtering interface
  - Checkout flow

### 6.3 Performance Testing
- Run Lighthouse audits
- Target scores:
  - Performance: 90+
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 90+

### 6.4 Theme Check Validation
```bash
shopify theme check
```
- Fix any errors or warnings
- Ensure no deprecated Liquid patterns

## Critical Files to Modify

Based on priorities, these files will need customization:

1. **`/sections/main-product.liquid`** - Product page layout, image gallery
2. **`/snippets/product-card.liquid`** - Collection page product cards
3. **`/assets/component-product.css`** - Product page styles
4. **`/config/settings_schema.json`** - Theme customization options
5. **`/templates/product.json`** - Product page section configuration
6. **`/templates/collection.json`** - Collection page section configuration

**New files to create:**
1. **`/snippets/product-model-info.liquid`** - Model measurements display
2. **`/sections/product-return-policy.liquid`** - Custom return policy section
3. **`/sections/size-chart-modal.liquid`** - Custom size chart (if building instead of using app)

## Verification Steps

After implementation:

1. **Visual Verification:**
   - Browse site in dev environment
   - Check all product pages with 7+ images
   - Test size chart on different product types
   - Verify filtering works across all collections

2. **Functional Testing:**
   - Add products to cart
   - Complete test checkout
   - Test size chart interactions
   - Verify responsive behavior on mobile

3. **Performance Check:**
   - Run `shopify theme check`
   - Run Lighthouse audit
   - Check image optimization (WebP format, lazy loading)

4. **Code Review:**
   - Review Liquid code for best practices
   - Check for hardcoded values (should use settings)
   - Ensure all sections have proper schema definitions

## Next Steps After Plan Approval

1. Copy this plan to repository at `docs/PLAN.md` for version control
2. Create beads epics and issues as outlined in the Beads Issue Tracking Structure section
3. Run Shopify CLI commands to initialize Dawn theme
4. Explore Dawn's current implementation in depth
5. Create local quick-reference at `docs/shopify-quick-reference.md`
6. Test ESC Size Charts app in dev store
7. Create detailed design mockups for product page customizations
8. Begin Phase 5.1 implementation (Product Page Enhancements)

## Timeline Estimate

- **Phase 1 (Setup):** 1-2 hours
- **Phase 2 (Exploration):** 2-3 hours
- **Phase 3 (Research):** 3-4 hours
- **Phase 4 (Tooling):** 1-2 hours
- **Phase 5 (Customizations):** 2-3 weeks (varies by scope)
- **Phase 6 (Testing):** 3-5 days

## Shopify Documentation Strategy

### Essential Documentation Resources

**Primary Resources:**
1. **Shopify Theme Development:** https://shopify.dev/docs/themes
2. **Liquid Reference:** https://shopify.dev/docs/api/liquid
3. **Dawn Theme Repository:** https://github.com/Shopify/dawn
4. **Online Store 2.0 Architecture:** https://shopify.dev/docs/themes/architecture
5. **Theme Development Tools:** https://shopify.dev/docs/themes/tools

**API References:**
1. **Liquid Objects:** https://shopify.dev/docs/api/liquid/objects
2. **Liquid Filters:** https://shopify.dev/docs/api/liquid/filters
3. **Liquid Tags:** https://shopify.dev/docs/api/liquid/tags
4. **Theme Settings Schema:** https://shopify.dev/docs/themes/architecture/settings/input-settings

### Documentation Access Strategy

**Recommendation: Hybrid Approach**

Instead of Context7 (which may not be specifically designed for Shopify docs), I recommend:

1. **Use WebFetch strategically** when you need specific documentation:
   - Fetch only the exact page needed
   - Cache results in memory during active development sessions
   - Reduces token usage vs. loading large documentation sets

2. **Create a local quick-reference file** (`docs/shopify-reference.md`):
   - Common Liquid patterns for product pages
   - Dawn theme section examples
   - Frequently used object properties (product, collection, cart, etc.)
   - Keep it minimal (1-2 pages max)
   - Update as you discover useful patterns

3. **Bookmark key pages** in browser for quick manual reference:
   - Liquid object reference (most frequently used)
   - Dawn GitHub for code examples
   - Theme Check documentation

4. **Use GitHub search** on Dawn repository:
   - Search for implementation examples directly in Dawn's code
   - Example: "product.metafields" to see how metafields are used
   - This is often faster than reading docs

**Why not Context7 or similar tools?**
- Shopify's documentation is well-structured and searchable online
- WebFetch provides targeted access when needed
- Creating comprehensive local documentation cache would be 50K+ tokens
- Better to fetch specific pages on-demand (2-5K tokens each)
- Local quick-reference for common patterns keeps essentials accessible

### Recommended Local Reference File Structure

Create `docs/shopify-quick-reference.md` with:

```markdown
# Shopify Quick Reference

## Common Liquid Objects
- product.title, product.images, product.variants
- collection.products, collection.all_products_count
- cart.item_count, cart.items

## Product Page Patterns
[Code snippets for variant selector, image gallery, etc.]

## Section Schema Examples
[Common schema patterns for sections]

## Useful Filters
- money, img_url, url_for_vendor
```

Keep this under 500 lines - it's a cheat sheet, not comprehensive docs.

## Beads Issue Tracking Structure

### Epic Organization

The plan will be organized into 8 epics in beads:

**Epic 1: Development Environment Setup**
- Issues for Shopify CLI installation, Dawn theme initialization, Git setup, dev server connection

**Epic 2: Dawn Theme Exploration**
- Issues for exploring file structure, analyzing product pages, analyzing collection pages, documenting findings

**Epic 3: Lingerie Feature Research**
- Issues for researching product photography requirements, evaluating size chart solutions, defining filtering requirements

**Epic 4: Development Tooling**
- Issues for Tailwind CSS setup, VS Code extensions, Theme Check configuration, build tooling

**Epic 5: Product Page Enhancements** (Priority 1)
- Issues for image gallery improvements, model info display, size chart integration, product page styling

**Epic 6: Collection Page Optimization** (Priority 2)
- Issues for product card improvements, filtering setup, collection page styling

**Epic 7: Return Policy Integration** (Priority 3)
- Issues for creating return policy section, configuring policies by product type, integrating into templates

**Epic 8: Testing and Validation**
- Issues for test order flow, mobile testing, performance testing, theme check validation

### Issue Dependencies

Key dependency chains:
1. Epic 1 → Epic 2 (can't explore until environment is set up)
2. Epic 2 → Epic 3 (need to understand Dawn before planning customizations)
3. Epic 3 → Epic 5/6/7 (research informs implementation)
4. Epic 4 can run parallel with Epic 2/3
5. Epic 8 depends on completion of Epic 5/6/7

### After Plan Approval

1. Create all epics in beads using `/bd-epic create`
2. Create individual issues for each task with proper epic assignments
3. Set up dependencies between issues using `/bd-dep`
4. Use `/bd-ready` to find tasks ready to work on

## Notes

- This plan focuses on research and foundational setup before major development
- Emphasizes using Dawn's existing optimizations rather than rebuilding from scratch
- Prioritizes lingerie-specific features: photography and sizing
- Uses free tools where possible (Shopify Search & Discovery, ESC free tier)
- Maintains flexibility to pivot based on findings during exploration phase
- All tasks will be tracked in beads for multi-session work management
