# Product Metafields Setup Guide

This document provides step-by-step instructions for creating custom metafields in Shopify Admin to support enhanced product information display for June Lingerie.

## Overview

These metafields enable detailed product information display including fabric content, care instructions, model measurements, fabric stretch properties, and fit recommendations. This structured data will support:

- Enhanced product detail pages
- Future fit quiz functionality
- AI-powered product recommendations
- Consistent product information across all items

## Required Metafields

All metafields use the namespace `custom` to ensure they appear in the Shopify Admin product editor.

### 1. Fabric Content

**Purpose:** Display detailed fabric composition (e.g., "82% Nylon, 18% Spandex")

**Configuration:**
- **Namespace:** `custom`
- **Key:** `fabric_content`
- **Name:** Fabric Content
- **Description:** Detailed fabric composition and materials
- **Type:** Multi-line text
- **Validation:** None required
- **Show in Storefront API:** Yes (for future headless features)

**Example Value:**
```
82% Nylon, 18% Spandex
Soft, breathable mesh fabric
```

---

### 2. Care Instructions

**Purpose:** Provide washing and care guidance specific to each garment

**Configuration:**
- **Namespace:** `custom`
- **Key:** `care_instructions`
- **Name:** Care Instructions
- **Description:** Washing, drying, and maintenance instructions
- **Type:** Multi-line text
- **Validation:** None required
- **Show in Storefront API:** Yes

**Example Value:**
```
Hand wash cold with like colors
Lay flat to dry
Do not bleach or iron
Do not dry clean
```

---

### 3. Model Measurements

**Purpose:** Display model body measurements to help customers visualize fit

**Configuration:**
- **Namespace:** `custom`
- **Key:** `model_measurements`
- **Name:** Model Measurements
- **Description:** Body measurements of the model wearing this product
- **Type:** JSON
- **Validation:** Valid JSON format
- **Show in Storefront API:** Yes

**Example Value:**
```json
{
  "size_worn": "S",
  "bust": "32\"",
  "waist": "24\"",
  "hips": "35\"",
  "height": "5'8\""
}
```

**Alternative Simple Format (if JSON is complex):**
- **Type:** Multi-line text
- **Example Value:**
```
Model is wearing size S
Bust: 32" | Waist: 24" | Hips: 35" | Height: 5'8"
```

---

### 4. Fabric Stretch

**Purpose:** Describe the stretch characteristics of the fabric

**Configuration:**
- **Namespace:** `custom`
- **Key:** `fabric_stretch`
- **Name:** Fabric Stretch
- **Description:** Fabric stretch properties and fit behavior
- **Type:** Single line text
- **Validation:** Maximum 100 characters
- **Show in Storefront API:** Yes

**Example Values:**
- `Four-way stretch for flexibility and comfort`
- `Moderate stretch, forms to body`
- `Light stretch with structure and support`
- `No stretch, maintains shape`

---

### 5. Recommended For

**Purpose:** Suggest body types, occasions, or use cases this item works well for

**Configuration:**
- **Namespace:** `custom`
- **Key:** `recommended_for`
- **Name:** Recommended For
- **Description:** Body types, occasions, or use cases this product suits
- **Type:** List of single line text values
- **Validation:** None required
- **Show in Storefront API:** Yes

**Example Values:**
```
All body types
Everyday comfort
Special occasions
Support for larger busts
```

---

## Setup Instructions

### Step 1: Access Metafield Settings

1. Log into Shopify Admin
2. Navigate to **Settings** > **Custom data**
3. Select **Products** from the list

### Step 2: Add Each Metafield

For each metafield listed above:

1. Click **Add definition**
2. Enter the **Name** (as shown above)
3. Select the appropriate **Type** from the dropdown
4. Enter the **Namespace** as `custom`
5. Enter the **Key** (exactly as shown above)
6. Add the **Description** for editor guidance
7. Configure **Validation** if specified
8. Enable **Storefront API access** (check the box)
9. Click **Save**

### Step 3: Verify Metafields

After creating all metafields:

1. Go to **Products** > select any product
2. Scroll down to the **Metafields** section
3. Confirm all five custom metafields appear:
   - Fabric Content
   - Care Instructions
   - Model Measurements
   - Fabric Stretch
   - Recommended For

### Step 4: Add Test Data

To verify the theme integration works correctly:

1. Select a test product
2. Fill in all five metafields with example data
3. Save the product
4. Preview the product page on the storefront to see the metafields displayed

---

## Theme Integration

The theme has been updated to automatically display these metafields when they contain data:

### Display Location

Metafields appear in collapsible accordion sections on product pages:

- **Materials** tab: Shows Fabric Content and Fabric Stretch
- **Care Instructions** tab: Shows Care Instructions
- **Fit Guide** tab: Shows Model Measurements and Recommended For

### Graceful Degradation

The theme implementation includes:

- **Conditional display:** Sections only appear when metafield data exists
- **No empty tabs:** If a metafield is empty, its section is hidden
- **Backwards compatible:** Works on products without metafields

### Technical Implementation

See `/snippets/product-metafields.liquid` for the implementation code.

---

## Content Entry Guidelines

### Fabric Content
- List percentages first, then material names
- Include texture or special properties on a second line if relevant
- Be specific about fabric quality (e.g., "Premium Italian mesh")

### Care Instructions
- Use short, clear imperative statements
- List most important instruction first (usually washing)
- Include what NOT to do if critical

### Model Measurements
- Always specify the size the model is wearing
- Use consistent units (inches with quotes: `32"`)
- Include all four measurements: bust, waist, hips, height

### Fabric Stretch
- Focus on how the stretch affects fit and comfort
- Use descriptive language (e.g., "four-way stretch")
- Keep under 100 characters

### Recommended For
- Be inclusive and positive in language
- Focus on benefits, not limitations
- Include both body types and use cases
- Aim for 3-5 recommendations per product

---

## Bulk Operations

### Exporting Product Data

To export products with metafields for bulk editing:

1. Go to **Products**
2. Click **Export**
3. Choose **CSV for Excel, Numbers, or other spreadsheet programs**
4. Select **All products** or filter as needed
5. Click **Export products**

Note: You may need to use the Shopify API or a bulk editor app to include metafield data in exports.

### Bulk Editing

For editing multiple products at once:

1. Use the **Shopify Bulk Editor** (in Products > More actions > Bulk editor)
2. Or use a third-party app like **Matrixify** or **Excelify**
3. Or use the Shopify Admin API for programmatic updates

---

## Validation and Quality Assurance

### Pre-Launch Checklist

Before going live with metafields:

- [ ] All 5 metafields created in Shopify Admin
- [ ] Metafields use `custom` namespace
- [ ] Storefront API access enabled for all metafields
- [ ] At least one test product has complete metafield data
- [ ] Product page displays all metafields correctly
- [ ] Empty metafields don't create empty sections
- [ ] Mobile display looks correct
- [ ] Metafields are visible in product editor

### Data Entry Quality Standards

For consistent, high-quality product information:

1. **Completeness:** All products should have all 5 metafields populated
2. **Consistency:** Use the same format and terminology across all products
3. **Accuracy:** Verify fabric content matches supplier specifications
4. **Clarity:** Write for customers, not internal use
5. **Tone:** Match the June Lingerie brand voice (luxurious, empowering, inclusive)

---

## Future Enhancements

These metafields lay the foundation for:

1. **Fit Quiz Integration:** Use recommended_for and fabric_stretch to power fit recommendations
2. **Advanced Filtering:** Allow customers to filter by fabric content or stretch
3. **AI Recommendations:** Feed metafield data into recommendation algorithms
4. **Size Matching:** Compare model measurements to customer measurements
5. **Sustainability Tracking:** Add metafields for eco-friendly materials and certifications

---

## Support and Troubleshooting

### Common Issues

**Metafields don't appear in product editor:**
- Verify namespace is `custom` (not `app` or `global`)
- Check that metafield definition was saved
- Refresh the product page

**Metafields don't display on storefront:**
- Verify "Storefront API access" is enabled
- Check that metafield has data for that specific product
- Clear theme cache and browser cache

**JSON validation errors:**
- Use a JSON validator (jsonlint.com) to check syntax
- Ensure quotes are proper double quotes, not smart quotes
- Verify all brackets and commas are correct

### Getting Help

- Check Shopify documentation: https://shopify.dev/docs/apps/custom-data/metafields
- Review theme code in `/snippets/product-metafields.liquid`
- Contact theme developer for integration issues

---

## Appendix: Complete Example Product

Here's a complete example showing all metafields for a single product:

**Product:** Lace Bralette in Black

**Fabric Content:**
```
82% Nylon, 18% Spandex
Soft floral lace overlay with comfortable stretch
```

**Care Instructions:**
```
Hand wash cold with like colors
Lay flat to dry
Do not bleach or iron
Store folded to preserve lace detail
```

**Model Measurements (JSON):**
```json
{
  "size_worn": "M",
  "bust": "34\"",
  "waist": "26\"",
  "hips": "36\"",
  "height": "5'9\""
}
```

**Fabric Stretch:**
```
Four-way stretch for flexibility and all-day comfort
```

**Recommended For:**
```
All body types
Everyday comfort
Loungewear
Layering under sheer tops
Special occasions
```

This example shows the level of detail and formatting that should be used for all products.
