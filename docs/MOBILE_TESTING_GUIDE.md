# Mobile Product Page Testing Guide

## Quick Test (5 minutes)

### Setup
1. Start dev server: `shopify theme dev --store june-lingerie-2.myshopify.com`
2. Open http://127.0.0.1:9292/products/the-jade in Chrome
3. Open DevTools (Cmd+Option+I on Mac)
4. Toggle Device Toolbar (Cmd+Shift+M)
5. Select "iPhone 12 Pro" from device dropdown

### Visual Tests

#### 1. Sticky Add-to-Cart Bar
**Expected:** Bar appears at bottom when scrolling past buy buttons

1. Scroll down the page slowly
2. When "Add to Cart" button scrolls out of view, sticky bar should slide up from bottom
3. Scroll back up - sticky bar should slide down/hide
4. Tap sticky "Add to Cart" - should add to cart same as main button

**Visual Check:**
- ✓ Smooth slide animation
- ✓ Safe area padding for iPhone notch
- ✓ Product title and price visible
- ✓ Button accessible with thumb

#### 2. Image Gallery Swipe
**Expected:** Swipe left/right to navigate images

1. Touch/drag on main product image
2. Swipe left to see next image
3. Swipe right to see previous
4. Try swiping quickly (flick gesture)

**Visual Check:**
- ✓ Smooth scrolling, no jank
- ✓ Image counter updates (1/4, 2/4, etc.)
- ✓ Images don't overflow viewport
- ✓ Previous/Next buttons visible and tapable

#### 3. Collapsible Sections
**Expected:** Sections expand/collapse on tap

1. Tap "Materials" section
2. Should expand with smooth animation
3. Tap header again - collapses
4. Repeat for "Shipping & Returns", "Dimensions", "Care Instructions"

**Visual Check:**
- ✓ Clear tap target (full header width)
- ✓ + / - icon changes
- ✓ Smooth accordion animation
- ✓ Content readable when expanded

#### 4. Touch Targets
**Expected:** All buttons/controls ≥44px

1. Try tapping buttons with thumb
2. No precision required - easy to hit
3. Buttons don't feel cramped

**Elements to Test:**
- ✓ Add to Cart button
- ✓ Quantity +/- buttons
- ✓ Variant selector buttons (if available)
- ✓ Gallery navigation arrows
- ✓ Accordion headers

#### 5. Image Loading
**Expected:** Images load progressively, no layout shift

1. Reload page with DevTools Network tab open
2. Throttle to "Slow 3G"
3. Observe images loading

**Visual Check:**
- ✓ Images lazy load (below fold loads after scroll)
- ✓ WebP format used (check Network tab)
- ✓ No content jumping as images load
- ✓ Fallback to JPG for older browsers

---

## Performance Test

### Lighthouse Mobile Audit

1. Open Chrome DevTools > Lighthouse tab
2. Select:
   - ✓ Performance
   - ✓ Accessibility
   - Device: Mobile
   - Categories: All
3. Click "Analyze page load"
4. Wait for report...

**Target Scores:**
- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90

**Key Metrics:**
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Total Blocking Time (TBT): <200ms
- Cumulative Layout Shift (CLS): <0.1
- Speed Index: <3.4s

**If Performance < 90:**
Check "Opportunities" section for suggestions:
- Serve images in WebP ✓ (already done)
- Enable lazy loading ✓ (already done)
- Reduce JavaScript execution time
- Eliminate render-blocking resources
- Preload critical assets

---

## Real Device Testing

### iOS (iPhone/iPad)

**Devices to Test:**
- iPhone SE (small screen)
- iPhone 12/13/14 (modern iPhone)
- iPad (tablet)

**Safari-Specific Checks:**
- Sticky bar respects safe areas (notch)
- Swipe gestures don't trigger back navigation
- Smooth scrolling momentum
- Touch targets feel natural
- No zoom on input focus

### Android

**Devices to Test:**
- Samsung Galaxy S21/S22
- Google Pixel 6/7

**Chrome Mobile Checks:**
- Sticky bar works correctly
- Swipe gestures smooth
- Touch targets accessible
- Images load properly

---

## Cross-Browser Testing

### Mobile Browsers to Test
- Safari (iOS)
- Chrome (Android)
- Samsung Internet
- Firefox Mobile

### What to Check
- Layout consistency
- Touch interactions work
- Images display correctly
- JavaScript functionality
- CSS animations smooth

---

## Network Condition Tests

**Test on Various Networks:**
1. Fast 4G/5G - Everything instant
2. 3G - Images should still load reasonably
3. Slow 3G - Page should remain functional
4. Offline - Graceful error handling

**DevTools Network Throttling:**
1. Open DevTools > Network tab
2. Select throttling profile:
   - Fast 3G
   - Slow 3G
   - Offline
3. Reload page
4. Observe loading behavior

**Expected:**
- Images lazy load below fold
- WebP format reduces file size
- Page usable even on slow connections
- No JavaScript errors blocking content

---

## Accessibility Testing

### Screen Reader
1. Enable VoiceOver (iOS) or TalkBack (Android)
2. Navigate through product page
3. All buttons/controls should announce correctly
4. Image alt text should be descriptive

### Keyboard Navigation
1. Connect keyboard to device
2. Tab through interactive elements
3. All controls reachable
4. Focus indicators visible

### Color Contrast
1. Text readable on all backgrounds
2. Buttons have sufficient contrast
3. Works in high contrast mode

---

## Known Issues to Watch For

### iOS Safari
- [ ] Rubber band scrolling conflicts with slider
- [ ] Fixed positioning with keyboard open
- [ ] 100vh issues with address bar

### Android Chrome
- [ ] Pull-to-refresh conflicts with slider
- [ ] Back button handling
- [ ] Safe area insets

### Small Screens (≤375px)
- [ ] Sticky bar text truncation
- [ ] Button text wrapping
- [ ] Image scaling

---

## Quick Checklist

Use this for rapid testing:

- [ ] Page loads in <3 seconds (3G)
- [ ] All buttons ≥44px tap target
- [ ] Sticky add-to-cart appears on scroll
- [ ] Image gallery swipes smoothly
- [ ] Collapsible sections work
- [ ] Images use WebP format
- [ ] Images lazy load
- [ ] No horizontal scroll
- [ ] Content fits viewport
- [ ] Touch targets easy to hit
- [ ] No text too small to read
- [ ] Forms easy to fill on mobile

---

## Reporting Issues

If you find issues, document:
1. Device (iPhone 12, Galaxy S21, etc.)
2. OS version (iOS 16.3, Android 13, etc.)
3. Browser (Safari, Chrome, etc.)
4. Steps to reproduce
5. Expected vs. actual behavior
6. Screenshots/screen recording if possible

---

## Next Steps After Testing

1. Document any issues found
2. Create GitHub issues for bugs
3. Prioritize fixes (critical, high, medium, low)
4. Re-test after fixes
5. Conduct user acceptance testing
6. Deploy to production

---

## Resources

- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [WebPageTest](https://www.webpagetest.org/) - Real device testing
- [BrowserStack](https://www.browserstack.com/) - Cross-browser testing
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated testing
- [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals/)
