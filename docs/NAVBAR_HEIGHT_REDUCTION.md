# Navbar Height Reduction - Logo Optimization Options

## Problem

The current navbar is too tall (240px initial height) due to the logo dimensions and top margin. The animated logo (200×200px + 40px margin) creates excessive vertical space, and when scaled down, the text inside the logo ("JUNE LINGERIE" and "PLAYFUL & PRETTY") becomes too small to read comfortably.

### Current Dimensions
- **Initial**: 200×200px, margin-top: 40px = **240px total**
- **Scrolled**: 160×120px
- **Mobile**: 100×100px, margin-top: 10px = **110px total**

### Logo Structure
The logo contains:
- **Emblem**: Circular border with heart symbol  
- **Wordmark**: "JUNE LINGERIE" (64px serif) + "PLAYFUL & PRETTY" (26px sans)

**Challenge**: Text legibility at smaller sizes

---

## Solution Options

### Option 1: Simple Size Reduction ⚡️

**Approach**: Proportionally scale down the entire logo while maintaining current animation behavior.

**Proposed Dimensions**:
- **Initial**: 140×140px, margin-top: 20px = **160px total** (vs 240px)
- **Scrolled**: 100×80px  
- **Mobile**: 80×80px, margin-top: 5px

**Implementation** (`june-custom.css` lines 164-238):
```css
/* Desktop - Initial */
.header__heading-logo-wrapper.custom-logo {
  width: 140px;
  height: 140px;
  margin-top: 20px;
}

/* Desktop - Scrolled */
.scrolled-past-header .header__heading-logo-wrapper.custom-logo {
  width: 100px;
  height: 80px;
  margin-top: 0;
}

/* Desktop - Wordmark Transform */
.scrolled-past-header .logo-wordmark {
  transform: translateY(-70px) scale(2.2);
}

/* Mobile - Initial */
@media screen and (max-width: 768px) {
  .header__heading-logo-wrapper.custom-logo {
    width: 80px;
    height: 80px;
    margin-top: 5px;
  }
  
  .scrolled-past-header .header__heading-logo-wrapper.custom-logo {
    width: 70px;
    height: 50px;
  }
  
  .scrolled-past-header .logo-wordmark {
    transform: translateY(-45px) scale(1.8);
  }
}
```

**Pros**:
- Simplest implementation - CSS-only changes
- Maintains all existing animations (emblem fade, wordmark zoom)
- ~33% height reduction (240px → 160px)
- Quick to test and iterate

**Cons**:
- Text in wordmark will be very small (64px → ~45px for "JUNE LINGERIE", 26px → ~18px for tagline)
- May fail WCAG text size guidelines
- Details in heart emblem may become unclear

**Text Legibility Concerns**:
At 140px container, "JUNE LINGERIE" renders at ~45px (acceptable) but "PLAYFUL & PRETTY" at ~18px (borderline illegible). This could hurt brand perception.

---

### Option 4: Landscape Orientation Hybrid 🌟 (RECOMMENDED)

**Approach**: Switch from square to landscape (wider/shorter) while keeping emblem + wordmark horizontally arranged. This preserves visual impact while significantly reducing vertical space.

**Proposed Dimensions**:
- **Initial**: 220×120px (landscape), margin-top: 10px = **130px total** (vs 240px)
- **Scrolled**: 160×70px
- **Mobile**: 140×80px, margin-top: 5px

**Required Changes**:

1. **SVG Modification** (`snippets/icon-june-logo.liquid`):
   - Change viewBox from `"0 0 1000 1000"` → `"0 0 1200 700"` (landscape)
   - Re-position emblem to left side (x: 250, y: 350)
   - Re-position wordmark to right side (x: 750)
   - Adjust circle radii to fit new viewBox proportions
   - Scale heart path to maintain aspect ratio

2. **CSS Updates** (`june-custom.css`):
```css
/* Desktop - Initial */
.header__heading-logo-wrapper.custom-logo {
  width: 220px;
  height: 120px;
  margin-top: 10px;
}

/* Desktop - Scrolled (only hide emblem, shrink container) */
.scrolled-past-header .header__heading-logo-wrapper.custom-logo {
  width: 160px;
  height: 70px;
  margin-top: 0;
}

/* Keep emblem fade on scroll */
.scrolled-past-header .logo-emblem {
  opacity: 0;
  transform: scale(0.85);
}

/* Wordmark stays in place (no dramatic zoom) */
.scrolled-past-header .logo-wordmark {
  transform: translateX(-30px) scale(1.1); /* Shift left to fill emblem space */
}

/* Mobile - Stack vertically OR use emblem-only */
@media screen and (max-width: 768px) {
  .header__heading-logo-wrapper.custom-logo {
    width: 140px;
    height: 80px;
    margin-top: 5px;
  }
  
  /* Option A: Hide wordmark, show emblem only */
  .logo-wordmark { display: none; }
  
  /* OR Option B: Stack vertically (revert to portrait) */
  /* SVG viewBox changes to 700×1000 on mobile via media query */
}
```

**Pros**:
- **46% height reduction** (240px → 130px) - most aggressive space savings
- Text remains full-size and readable (no scaling required)
- Emblem + wordmark side-by-side feels premium and balanced
- Modern, editorial aesthetic (like Vogue, Net-a-Porter headers)
- Animation becomes more subtle/sophisticated (less "gimmicky" zoom)

**Cons**:
- Requires SVG re-authoring (viewBox + element repositioning)
- More complex implementation (~2-3 hours vs 30 min for Option 1)
- Need to decide mobile behavior (emblem-only vs stacked)
- May need design iteration to perfect horizontal layout

**Mobile Strategy**:
- **Recommended**: Switch to **emblem-only** (just circle + heart, hide text)
- Alternative: Revert to vertical stack via responsive SVG viewBox

---

### Option 3: Wordmark-Only (Text-Based Logo) 💭

**Approach**: Completely remove the emblem (circle + heart) and use only the text "JUNE LINGERIE" as the logo. This is common for high-fashion brands (e.g., Chanel, Hermès).

**Proposed Dimensions**:
- **Initial**: Auto-width × 60px, margin-top: 10px = **70px total** (vs 240px)
- **Scrolled**: Auto-width × 45px
- **Mobile**: Auto-width × 50px, margin-top: 5px

**Implementation**:

1. **SVG Modification** (`snippets/icon-june-logo.liquid`):
```liquid
<svg xmlns="http://www.w3.org/2000/svg" aria-label="June Lingerie" viewBox="0 0 800 100">
  <text 
    x="400" 
    y="70" 
    class="logo-wordmark logo-fill-main" 
    font-family="'Fraunces', 'Cormorant Garamond', Georgia, serif" 
    font-size="60" 
    font-weight="600" 
    letter-spacing="8" 
    text-anchor="middle"
  >
    JUNE LINGERIE
  </text>
  <!-- Optional: Add subtle underline or flourish -->
  <line x1="200" y1="85" x2="600" y2="85" class="logo-stroke-main" stroke-width="2" />
</svg>
```

2. **CSS Updates** (`june-custom.css`):
```css
.header__heading-logo-wrapper.custom-logo {
  width: auto;
  height: 60px;
  margin-top: 10px;
  padding: 0 20px; /* Breathing room */
}

.scrolled-past-header .header__heading-logo-wrapper.custom-logo {
  height: 45px;
  margin-top: 0;
}

/* Simple scale animation on scroll */
.scrolled-past-header .logo-wordmark {
  transform: scale(0.9);
}

/* Hover: Subtle color shift */
.header__heading-link:hover .logo-wordmark {
  fill: rgb(var(--color-accent)); /* Rose Coral */
}

@media screen and (max-width: 768px) {
  .header__heading-logo-wrapper.custom-logo {
    height: 50px;
    margin-top: 5px;
  }
}
```

**Pros**:
- **71% height reduction** (240px → 70px) - most compact option
- Immediately readable at any size
- Clean, minimalist, high-fashion aesthetic
- Simplifies animation logic (no emblem fade)
- Best performance (smallest SVG payload)

**Cons**:
- **Loses brand equity** - the heart emblem is distinctive
- Less playful/memorable compared to icon+text
- Generic wordmark may not stand out in competitive market
- Reduces visual interest on homepage hero

**When to Use**:
- If brand recognition is already established
- If prioritizing extreme minimalism
- As fallback for very small screens (mobile < 375px)

---

## Recommendation Priority

1. **Option 4 (Landscape Hybrid)** - Best balance of impact + usability
2. **Option 1 (Simple Reduction)** - Quick win if text legibility is acceptable
3. **Option 3 (Wordmark-Only)** - Only if brand strategy shifts toward minimalism

---

## Testing Checklist

After implementing chosen option:

- [ ] Test on real devices (iPhone SE, iPad, MacBook)
- [ ] Verify text legibility at arm's length (WCAG AAA: 18pt+ for body text)
- [ ] Check animation smoothness (no jank on scroll)
- [ ] Validate hover states (heart color change)
- [ ] Ensure SVG scales correctly on ultra-wide monitors (2560px+)
- [ ] Test with browser zoom at 150% and 200%
- [ ] Validate against brand guidelines (if they exist)
- [ ] Get stakeholder approval before pushing to live

---

## Files to Modify

- `assets/june-custom.css` (lines 164-238)
- `snippets/icon-june-logo.liquid` (if Option 4 or 3)
- `sections/header.liquid` (no changes needed)

## References

- Current logo animation: Landing page inspiration (confirmed working)
- Design system: `/config/settings_data.json` (Rose Coral: #E78C8C)
- Typography: Fraunces (serif), Inter (sans-serif)
