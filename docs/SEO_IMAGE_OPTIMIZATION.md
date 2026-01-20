# SEO Image Optimization Guide

## Overview

Product images are critical for both user experience and SEO. This guide provides best practices for optimizing product images for search engines and accessibility.

## Image Alt Text Best Practices

### What is Alt Text?

Alt text (alternative text) describes images for:
- Screen readers (accessibility)
- Search engines (SEO)
- Situations where images fail to load

### Alt Text Guidelines for Product Images

#### Format
```
[Product Name] - [Key Feature/Detail]
```

#### Examples

**Good Alt Text:**
- "Lace Bralette in Black - Front View"
- "Silk Panties in Rose - Detail of Lace Trim"
- "Wireless Comfort Bra in Nude - Side Angle"
- "Lingerie Set in Navy - Model Wearing Size Medium"

**Bad Alt Text:**
- "IMG_1234.jpg" (filename, not descriptive)
- "Product image" (too generic)
- "Beautiful sexy lingerie for women buy now" (keyword stuffing)
- "" (empty alt text)

#### Rules

1. **Be Descriptive but Concise**
   - Aim for 125 characters or less
   - Focus on what's visible in the image
   - Include the product name

2. **Include Relevant Details**
   - Color
   - View angle (front, back, side, detail)
   - What's shown (flat lay, model wearing, close-up)
   - Size if visible (e.g., "model wearing size M")

3. **Avoid Keyword Stuffing**
   - Don't repeat keywords
   - Don't use phrases like "image of" or "picture of"
   - Natural, descriptive language only

4. **Be Consistent**
   - Use the same format across all products
   - Maintain a consistent voice and style

### Setting Alt Text in Shopify Admin

1. Go to **Products** > Select a product
2. Click on the image you want to edit
3. In the **Alt text** field, enter your descriptive text
4. Click **Save**

**Bulk Edit:** Use Shopify's bulk editor or CSV import/export to update alt text for multiple products at once.

## Image File Optimization

### File Size

- **Target:** Under 200KB per image
- **Maximum:** 500KB (larger files slow page load)
- **Tool:** Use image compression tools like TinyPNG, ImageOptim, or Shopify's built-in optimization

### Dimensions

**Product Images:**
- **Minimum:** 1600 x 1600 pixels (for zoom functionality)
- **Recommended:** 2000 x 2000 pixels
- **Maximum:** 4472 x 4472 pixels (Shopify limit)

**Thumbnail Images:**
- Shopify automatically generates these from your main images
- No manual optimization needed

### File Format

- **Use:** JPG for photos, PNG for graphics with transparency
- **WebP:** Shopify automatically serves WebP to supported browsers
- **Avoid:** BMP, TIFF (too large)

### File Naming

Before uploading, name files descriptively:

**Good:**
- `black-lace-bralette-front.jpg`
- `silk-panties-rose-detail.jpg`
- `navy-lingerie-set-model.jpg`

**Bad:**
- `IMG_1234.jpg`
- `DSC00052.jpg`
- `photo.jpg`

## Image SEO Checklist

When adding a new product:

- [ ] Rename image files before uploading (descriptive, lowercase, hyphens)
- [ ] Upload high-resolution images (2000x2000px minimum)
- [ ] Compress images to under 200KB each
- [ ] Add descriptive alt text to all images
- [ ] Include multiple angles (front, back, side, detail)
- [ ] Add model shots showing fit and size
- [ ] Verify images load quickly on mobile

## Tools & Resources

### Image Compression
- [TinyPNG](https://tinypng.com/) - Free online compression
- [ImageOptim](https://imageoptim.com/) - Mac app for compression
- [Squoosh](https://squoosh.app/) - Google's image compression tool

### Image Editing
- [Canva](https://canva.com) - Free design tool
- [GIMP](https://www.gimp.org/) - Free Photoshop alternative
- Adobe Photoshop - Professional option

### Testing
- [Google PageSpeed Insights](https://pagespeed.web.dev/) - Test page speed and image optimization
- [GTmetrix](https://gtmetrix.com/) - Detailed performance analysis

## Technical Implementation

### Automatic Optimization

Shopify automatically:
- Serves images via CDN (fast global delivery)
- Generates multiple sizes for responsive images
- Converts to WebP for supported browsers
- Lazy loads images below the fold

### Theme Implementation

This theme uses:
- Responsive `srcset` attributes for proper sizing
- Lazy loading via `loading="lazy"` attribute
- Width and height attributes to prevent layout shift (CLS)
- Image zoom functionality for detail viewing

### Structured Data

Product images are included in the Product schema.org markup automatically via:
```liquid
{{ product | structured_data }}
```

This helps search engines understand and display your product images in search results.

## Monitoring & Maintenance

### Regular Audits

Monthly:
- Check Google Search Console for image indexing issues
- Review Core Web Vitals for image-related performance problems
- Test mobile load times

Quarterly:
- Audit all product images for missing alt text
- Verify image file sizes haven't crept up
- Review and update alt text for seasonal collections

### Common Issues

**Problem:** Images not appearing in Google Image Search
- **Solution:** Verify alt text is present and descriptive

**Problem:** Slow page load times
- **Solution:** Compress images, check file sizes

**Problem:** Low-quality images on mobile
- **Solution:** Upload larger source images (Shopify handles resizing)

## Support

For questions about image optimization:
- Check Shopify's [Image Best Practices](https://shopify.dev/docs/themes/architecture/performance/image-best-practices)
- Review this documentation
- Contact the development team for technical assistance

---

**Last Updated:** 2026-01-20
**Version:** 1.0.0
