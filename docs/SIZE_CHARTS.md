# Size Chart Implementation Guide

## Overview

This document describes the custom size chart implementation for June Lingerie. The solution provides comprehensive sizing information for bras, panties, and sets with international size conversions and unit toggles (inches/centimeters).

## Implementation Details

### Custom Solution vs. App

**Decision**: Custom implementation (no app required)

**Rationale**:
- Zero recurring costs (Kiwi Size Chart app costs $6.99+/month)
- Full control over design and functionality
- Better integration with Dawn theme patterns
- No third-party dependencies
- Faster page load times
- Customizable to specific lingerie sizing needs

**Kiwi Size Chart Reference**: While the Kiwi Size Chart app is a solid option with ML-powered recommendations, our custom solution provides sufficient functionality without the monthly cost. If advanced features like AI size recommendations are needed in the future, it remains a viable option.

## Files Created

### Snippets
- `/snippets/size-chart.liquid` - Main size chart component with tables and measurements
- `/snippets/size-chart-link.liquid` - Trigger link/button for opening the modal

### Sections
- `/sections/size-chart-modal.liquid` - Modal dialog for displaying size charts

### Locales
- `/locales/en.default.json` - Updated with size chart translations

### Modified Files
- `/sections/main-product.liquid` - Added `size_chart_link` block type

## How to Use

### Setup Instructions

1. **Add the Size Chart Modal to the Theme**
   - Go to Shopify Admin > Online Store > Themes > Customize
   - Navigate to any product page
   - Click "Add section" at the bottom of the page
   - Search for "Size Chart Modal" and add it
   - Configure the heading and unit toggle settings if desired
   - Note the section ID (visible in the URL or section settings)

2. **Add Size Chart Link to Product Pages**
   - While in the theme editor on a product page
   - In the product section, click "Add block"
   - Search for "Size Chart Link" and add it
   - Position it near the variant picker (size selector) for best visibility
   - Configure the settings:
     - **Link Text**: Default "Size Guide" (or customize)
     - **Link Style**: Choose from "Text Link", "Button", or "Icon Only"
     - **Size Chart Modal Section ID**: Enter the section ID from step 1

3. **Tag Your Products**
   - For the size chart to show the correct tables, tag products appropriately:
     - Bras: Add tag "bra" or "bralette"
     - Panties: Add tag "panty", "panties", "underwear", or "brief"
     - Sets: Add tag "set" or "lingerie set"
   - Products can have multiple tags to show multiple size charts

### Customization Options

#### Link Styles

**Text Link** (default):
- Minimal, underlined text link
- Best for subtle integration near size selectors

**Button**:
- Prominent button style
- Good for standalone placement or emphasis

**Icon Only**:
- Just shows a ruler icon
- Space-saving option for compact layouts

#### Unit Toggle

The size chart includes a toggle between inches and centimeters. This can be disabled in the Size Chart Modal section settings if you only serve one market.

## Size Chart Data

### Bra Sizing

**Band Sizes** (Imperial):
- 30: 26-27" underbust
- 32: 28-29" underbust
- 34: 30-31" underbust
- 36: 32-33" underbust
- 38: 34-35" underbust
- 40: 36-37" underbust
- 42: 38-39" underbust

**Band Sizes** (Metric):
- 65: 63-67 cm
- 70: 68-72 cm
- 75: 73-77 cm
- 80: 78-82 cm
- 85: 83-87 cm
- 90: 88-92 cm
- 95: 93-97 cm

**Cup Size Conversions**:
| Cup | US | UK | EU | AU |
|-----|----|----|----|----|
| A   | A  | A  | A  | A  |
| B   | B  | B  | B  | B  |
| C   | C  | C  | C  | C  |
| D   | D  | D  | D  | D  |
| DD/E| DD | DD | E  | DD |
| DDD/F| DDD/F | E | F | E |
| G   | G  | F  | G  | F  |
| H   | H  | FF | H  | FF |

### Panty Sizing

**Size Chart** (Imperial):
| Size | US Size | Waist | Hips |
|------|---------|-------|------|
| XS   | 0-2     | 23-25"| 33-35"|
| S    | 4-6     | 26-28"| 36-38"|
| M    | 8-10    | 29-31"| 39-41"|
| L    | 12-14   | 32-34"| 42-44"|
| XL   | 16-18   | 35-37"| 45-47"|

**Size Chart** (Metric):
| Size | US Size | Waist | Hips |
|------|---------|-------|------|
| XS   | 0-2     | 58-64 cm| 84-89 cm|
| S    | 4-6     | 66-71 cm| 91-97 cm|
| M    | 8-10    | 74-79 cm| 99-104 cm|
| L    | 12-14   | 81-86 cm| 107-112 cm|
| XL   | 16-18   | 89-94 cm| 114-119 cm|

**International Conversions**:
| US | UK | EU | AU |
|----|----|----|-----|
| XS (0-2) | 4-6 | 32-34 | 4-6 |
| S (4-6) | 8-10 | 36-38 | 8-10 |
| M (8-10) | 12-14 | 40-42 | 12-14 |
| L (12-14) | 16-18 | 44-46 | 16-18 |
| XL (16-18) | 20-22 | 48-50 | 20-22 |

## Updating Size Chart Data

To modify size chart measurements:

1. Open `/snippets/size-chart.liquid`
2. Locate the relevant table section (bra, panty, or international conversions)
3. Update the table rows with new measurements
4. Ensure both imperial and metric tables are updated
5. Test on the staging site before deploying to production

## Maintenance

### Adding New Size Ranges

To add additional sizes:

1. Edit `/snippets/size-chart.liquid`
2. Add new `<tr>` rows to the appropriate tables
3. Follow the existing pattern for consistency
4. Update both imperial and metric versions
5. Test the display on mobile and desktop

### Translating Size Charts

The size chart uses Shopify's translation system. To add translations:

1. Copy the `size_chart` section from `/locales/en.default.json`
2. Translate the strings to your target language
3. Add to the appropriate locale file (e.g., `/locales/fr.json`)
4. All measurements remain the same; only labels are translated

### Styling Changes

The size chart uses inline styles via `{% stylesheet %}` tags in:
- `/snippets/size-chart.liquid`
- `/snippets/size-chart-link.liquid`
- `/sections/size-chart-modal.liquid`

To modify styling, edit the `{% stylesheet %}` blocks in these files. The styles are scoped and mobile-responsive by default.

## Technical Details

### Modal System

The size chart modal uses the Dawn theme's modal pattern:
- Custom element: `<modal-dialog>`
- Accessibility features: ARIA labels, focus trapping, ESC key support
- Background overlay with click-to-close
- Responsive design with scrolling for long content

### Unit Toggle

The unit toggle is implemented with:
- JavaScript custom element: `<size-chart>`
- Button group with `aria-pressed` states
- Show/hide logic for imperial vs. metric tables
- Persistent state during modal session

### Product Type Detection

The snippet automatically detects product type using tags:
- Searches for keywords in lowercase: "bra", "bralette", "panty", "brief", etc.
- Shows relevant size charts based on detected type
- Sets can show both bra and panty charts

## Mobile Optimization

The size charts are fully responsive:
- Tables adjust font size and padding on small screens
- Modal takes up 95% viewport height on mobile
- Touch-friendly buttons and links
- Horizontal scrolling for wide tables if needed

## Browser Support

Compatible with all modern browsers:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

No polyfills required as the implementation uses standard web APIs supported by Dawn's target browsers.

## Troubleshooting

### Size Chart Link Not Opening Modal

**Issue**: Clicking the size chart link does nothing.

**Solution**:
1. Verify the Size Chart Modal section is added to the theme
2. Check that the section ID in the Size Chart Link block matches the modal section ID
3. Clear browser cache and test in incognito mode

### Wrong Size Chart Showing

**Issue**: Product shows the wrong size chart (e.g., panty chart for a bra).

**Solution**:
1. Check the product tags in Shopify admin
2. Ensure tags use the correct keywords: "bra", "panty", "set"
3. Tags are case-insensitive but must contain the keywords

### Size Chart Not Mobile-Friendly

**Issue**: Size chart is hard to read on mobile devices.

**Solution**:
1. The responsive styles should handle this automatically
2. If issues persist, check for theme CSS conflicts
3. Consider using the collapsible tab block instead for very long charts

## Future Enhancements

Potential improvements for future consideration:

1. **Model Measurements**: Add a section showing model measurements and what size they're wearing
2. **Fit Preferences**: Add guidance for preferred fit (snug vs. relaxed)
3. **Visual Measurement Guide**: Include diagrams showing how to measure
4. **Size Recommendation Quiz**: Interactive quiz to suggest sizes
5. **Reviews Integration**: Show what sizes customers ordered vs. their usual size
6. **Video Tutorial**: Embed a video showing how to measure

## Support

For questions or issues with the size chart implementation:
1. Check this documentation first
2. Review the code comments in the liquid files
3. Test in the Shopify theme editor preview mode
4. Contact the development team for custom modifications

---

**Last Updated**: 2026-01-19
**Version**: 1.0.0
