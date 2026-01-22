# Blog Design Spec — Option A: Editorial Feature + Grid (Photo-First)

## Layout overview (Blog Listing)
**Template:** `blog` (Shopify OS2) :contentReference[oaicite:1]{index=1}

### Page structure (top → bottom)
1) **Page header**
   - H1: “Journal”
   - Optional short intro line (1 sentence max)

2) **Featured post module**
   - 1 featured article presented as an editorial hero card (large image + title + minimal meta)
   - Clickable surface (whole module)

3) **Filter row**
   - Tag chips (All + tags)
   - Optional search affordance (small, unobtrusive)

4) **Editorial card grid**
   - Uniform cards with strong imagery and minimal text
   - “Load more” (preferred) with pagination fallback

5) **Footer newsletter**
   - Keep it consistent with global footer (don’t make it a second big signup block)

Why this works: grids and cards help scanning, and card view supports engaging visual grouping. :contentReference[oaicite:2]{index=2}

---

## Container + grid rules
### Content container
- Max width: **1200–1280px**
- Side padding: **16px (mobile)** → **24px (tablet+)**

### Featured module spacing
- Margin top: 24–40px (depending on header height)
- Margin bottom: 20–28px

### Grid columns
- Mobile: **1 col**
- Tablet: **2 col**
- Desktop: **3 col**
- Wide: **4 col** (only if cards remain readable)

### Grid gaps
- 16px (mobile) → 20–24px (desktop)

---

## Featured post module (Hero)
### Image
- Aspect ratio: **16:9** (editorial) or **21:9** (more cinematic)
- Treatment: soft corners matching card radius
- Text placement:
  - Preferred: **below image** (clean, avoids readability issues)
  - Optional: overlay only if you guarantee contrast (gradient scrim)

### Content
- Tag chip + date (small)
- Title (serif) 36–44px desktop / 26–32px mobile
- Optional deck: **1 line max** (or none)

---

## Article Card component (Listing)
Cards should behave as “one unit”: image + meta + title (+ optional deck). Cards are a standard UI pattern; make the card the scannable unit. :contentReference[oaicite:3]{index=3}

### Anatomy
- Entire card is a **single link**
- Media (image)
- Meta row (tag + date)
- Title (2-line clamp)
- Optional deck (2-line clamp)

### Image spec (critical for photo-first)
- Aspect ratio: **4:5** (recommended for lingerie/editorial photos)
- `object-fit: cover`
- Provide reserved space to avoid layout shift (use real image dimensions / aspect ratio wrappers) :contentReference[oaicite:4]{index=4}

### Typography (suggested)
- Meta: 12–13px, medium, slightly muted
- Title: 18–20px (desktop), 16–18px (mobile)
- Deck: 14–15px, max 2 lines

### States (must-have)
- Hover: subtle lift or shadow increase (no heavy animation)
- Focus-visible: clear outline/ring (not just shadow)
- Active: slight press / reduced shadow

Accessibility note: ensure the whole card is one interactive element and keyboard focus is obvious. :contentReference[oaicite:5]{index=5}

---

## Filter row (Tag chips)
### Behavior
- “All” resets to the base blog URL
- Each tag links to: `{{ blog.url }}/tagged/{{ tag | handleize }}` (common Shopify pattern; uses `current_tags` to style active chips) :contentReference[oaicite:6]{index=6}

### UI
- Chips in a single row that wraps
- Active chip uses primary accent background (or border + text, depending on DS)
- Keep it lightweight; don’t turn it into a huge toolbar

---

## “Load more” (preferred) + fallback pagination
### Baseline (no JS)
- Standard Shopify pagination works; keep it simple and styled.

### Progressive enhancement (with JS)
- Use Shopify’s **Section Rendering API** to fetch and append the next page’s blog grid section without full page reload. :contentReference[oaicite:7]{index=7}
- Keep URL/pagination accessible; don’t trap users in infinite scroll.

---

## Blog Article Detail (Option A companion spec)
**Template:** `article` :contentReference[oaicite:8]{index=8}

### Header
- Hero image: full-width (or wide contained)
- Title + meta below (prefer readable text over overlays)

### Body
- Reading width: **680–760px**
- Image blocks:
  - Default: contained
  - Allowed: periodic “full-bleed” image blocks for impact

### Photo-heavy posts: “Gallery block”
- Inline grid: 2 cols (mobile) → 3 cols (desktop)
- Optional lightbox:
  - Esc closes
  - Focus is trapped in modal while open (avoid keyboard trap) 
  - Visible close button

(If you skip lightbox, make images open in a new tab—still fine, simpler, faster.)

---

## Performance rules (non-negotiable for photo-first)
1) **Responsive images** (`srcset`) so mobile doesn’t download desktop images :contentReference[oaicite:10]{index=10}  
2) **Set width/height** (or aspect ratio) to prevent CLS :contentReference[oaicite:11]{index=11}  
3) **Don’t lazy-load the LCP/hero image** (load hero eagerly; lazy-load below fold) :contentReference[oaicite:12]{index=12}  

---

## Shopify build checklist (what to change in theme)
- Create/modify `templates/blog.json` and `templates/article.json` (OS2 JSON templates). :contentReference[oaicite:13]{index=13}  
- Update `sections/main-blog.liquid` to:
  - Support featured post selection
  - Add tag chip row
  - Render the new card grid (with consistent image ratios)
- Update `snippets/article-card.liquid` (and optionally a `featured-article-card.liquid`)
- Add schema settings:
  - Featured post toggle + selection method
  - Grid columns by breakpoint
  - Image aspect ratio (4:5 default)
  - Show/hide deck
- Optional enhancement:
  - Add “Load more” using Section Rendering API (with fallback pagination). :contentReference[oaicite:14]{index=14}  

---

## What to add to June’s style guide
- **Blog Listing pattern:** header + featured hero + tag chips + editorial grid + load more
- **Article Card component:** anatomy, ratios, states, typography, focus style
- **Article Detail pattern:** hero + body width + gallery block + related posts
- **Performance rules:** responsive images + CLS prevention + LCP eager-loading guidance
