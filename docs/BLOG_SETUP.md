# Blog Setup Guide

## Overview

The June Lingerie blog is configured for content marketing, SEO, and customer engagement. Dawn theme includes fully-functional blog templates with social sharing and SEO optimization built in.

## Theme Configuration (Already Complete)

The following has been configured in the theme code:

✅ Blog template (`templates/blog.json`) - displays article listings with pagination
✅ Article template (`templates/article.json`) - displays individual posts with featured image, title, share buttons, and content
✅ Featured blog section added to homepage - shows 3 latest posts
✅ Social sharing buttons configured on article pages
✅ SEO meta tags (OpenGraph, Twitter Cards) automatically generated
✅ Responsive images and proper semantic HTML

## Shopify Admin Setup Steps

These steps must be completed in the Shopify Admin interface:

### 1. Create Blog

1. Go to **Shopify Admin > Online Store > Blog Posts**
2. Click **"Manage blogs"**
3. Create a new blog (suggested name: "News" or "Journal")
4. Configure blog settings:
   - **Title:** Journal (or your preferred name)
   - **Handle:** journal (this creates the URL `/blogs/journal`)
   - **Template:** Use default `blog` template

### 2. Configure Homepage Featured Blog Section

1. Go to **Shopify Admin > Online Store > Themes > Customize**
2. Navigate to the homepage
3. Find the **"From Our Journal"** section
4. In the section settings:
   - **Blog:** Select the blog you created in step 1
   - **Posts to show:** 3 (default)
   - **Show image:** Yes
   - **Show date:** Yes
   - **Show author:** No (or Yes if you want bylines)
   - **Show "View all" button:** Yes

### 3. Add Blog to Navigation Menu

1. Go to **Shopify Admin > Online Store > Navigation**
2. Select **"Main menu"**
3. Click **"Add menu item"**
4. Configure:
   - **Name:** Journal (or Blog, News, etc.)
   - **Link:** Select "Blogs" → your blog
5. Drag to reorder in navigation
6. Click **"Save menu"**

### 4. Create Initial Blog Posts

Create content that aligns with the brand and supports SEO:

**Suggested Topics:**
- Lingerie care and maintenance guides
- Sizing guides and fit tips
- Style guides (how to wear different pieces)
- Fabric and material education
- Brand story and values
- Behind-the-scenes content
- Customer testimonials and features

**SEO Best Practices:**
1. Go to **Online Store > Blog Posts > Add blog post**
2. For each post:
   - **Title:** Clear, descriptive, include keywords
   - **Content:** Minimum 300 words, well-structured with headings
   - **Excerpt:** Write a compelling 150-160 character excerpt
   - **Featured Image:** High-quality image (1200x630px minimum)
   - **SEO Settings:**
     - Page title: Include primary keyword (60 characters max)
     - Meta description: Compelling summary with keywords (155-160 characters)
   - **URL handle:** Keep it short, descriptive, keyword-rich

### 5. Configure Blog Settings for SEO

1. In each blog post, use the **"Search engine listing preview"** section
2. Optimize:
   - **Page title:** Front-load keywords, keep under 60 characters
   - **Description:** Include keywords naturally, 155-160 characters
   - **URL:** Clean, descriptive URLs (e.g., `/blogs/journal/lingerie-care-guide`)

### 6. Social Sharing Configuration

Social sharing is already enabled in the article template. To optimize:

1. For each post, ensure you have a **featured image** (appears in social shares)
2. Recommended image size: **1200 x 630 pixels** (Facebook/Twitter optimal)
3. Test social sharing:
   - Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 7. Optional: Configure Social Media Links

If you want your Twitter handle to appear in Twitter Cards:

1. Go to **Shopify Admin > Online Store > Themes > Customize**
2. Navigate to **Theme settings > Social media**
3. Add your social media links (Twitter, Instagram, Facebook, etc.)
4. Save changes

## Content Strategy Recommendations

### Content Calendar

- **Frequency:** 2-4 posts per month minimum
- **Topics:** Mix educational content, product features, and brand storytelling
- **Format:** Long-form (800+ words) for SEO, shorter posts for timely content

### SEO Keywords to Target

**Lingerie-specific long-tail keywords:**
- "how to care for silk lingerie"
- "lingerie sizing guide"
- "best lingerie fabrics"
- "how to measure for bra size"
- "lingerie style tips"

### Content Ideas

1. **Educational Guides**
   - "The Complete Guide to Lingerie Care"
   - "Understanding Fabric Types: Silk vs Satin vs Cotton"
   - "How to Find Your Perfect Bra Size"

2. **Style Content**
   - "5 Ways to Style a Bodysuit"
   - "Lingerie as Outerwear: A Modern Guide"
   - "Seasonal Lingerie Trends 2026"

3. **Brand Content**
   - "Why We Use Sustainable Fabrics"
   - "Behind the Design: Our Latest Collection"
   - "Customer Spotlight: Real Women, Real Stories"

4. **Seasonal Content**
   - "Valentine's Day Gift Guide"
   - "Summer Lingerie Essentials"
   - "Wedding Lingerie: What to Wear Under Your Dress"

## AI Search Optimization

Blog content directly supports the Agentic Storefronts feature (junestore-dp6):

- Quality blog posts become part of your knowledge base
- AI assistants can reference your content when answering customer questions
- Helps establish brand authority in AI search results

**Recommendation:** Export key blog posts to your Shopify knowledge base app (once configured for Agentic Storefronts).

## Analytics and Monitoring

Track blog performance:

1. **Shopify Admin > Analytics > Reports**
   - Online store conversion by referrer
   - Top online store pages by sessions

2. **Google Analytics** (if configured)
   - Page views per post
   - Average time on page
   - Bounce rate
   - Traffic sources

3. **Google Search Console**
   - Search queries leading to blog posts
   - Click-through rates
   - Average position in search results

## Technical Notes

**Blog Template Features:**
- Pagination (6 posts per page)
- Collage or grid layout options
- Responsive images
- Article cards with excerpts
- Date display (author display optional)

**Article Template Features:**
- Featured image with adaptive height
- Title with date/author
- Social share buttons (Twitter, Facebook, Pinterest)
- Proper semantic HTML (article tags, h1 hierarchy)
- Comment system ready (can be enabled in theme settings)

**SEO Features (Automatic):**
- Canonical URLs
- OpenGraph meta tags for social sharing
- Twitter Card meta tags
- Responsive images with proper alt text
- Clean URL structure (`/blogs/journal/post-slug`)
- Automatic sitemap inclusion

## Next Steps

1. ✅ Create blog in Shopify Admin
2. ✅ Configure featured blog section on homepage (select the blog)
3. ✅ Add blog to main navigation menu
4. ✅ Write and publish 3-5 initial blog posts
5. ✅ Test social sharing with Facebook/Twitter validators
6. ✅ Set up analytics tracking
7. ✅ Establish content calendar for ongoing posts

## Resources

- [Shopify Blog Guide](https://help.shopify.com/en/manual/online-store/blogs)
- [SEO Best Practices](https://help.shopify.com/en/manual/promoting-marketing/seo/adding-keywords)
- [Dawn Theme Documentation](https://github.com/Shopify/dawn)
