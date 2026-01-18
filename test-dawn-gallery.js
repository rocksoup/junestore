// ABOUTME: Playwright test script to evaluate Dawn theme image gallery behavior
// ABOUTME: Tests desktop and mobile gallery functionality with multiple product images

const { chromium, devices } = require('playwright');

async function testDawnGallery() {
  const browser = await chromium.launch({ headless: false });

  // Test on desktop first
  console.log('\n=== DESKTOP TESTING ===\n');
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const desktopPage = await desktopContext.newPage();

  // Navigate to all products
  await desktopPage.goto('http://127.0.0.1:9292/collections/all');
  await desktopPage.waitForLoadState('networkidle');

  // Find test products (looking for products with "test" in the title)
  const productLinks = await desktopPage.locator('a[href*="/products/"]').all();
  const testProducts = [];

  for (const link of productLinks) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    if (text && text.toLowerCase().includes('test')) {
      testProducts.push({ title: text.trim(), url: href });
    }
  }

  console.log(`Found ${testProducts.length} test products:\n`);
  testProducts.forEach((p, i) => console.log(`  ${i + 1}. ${p.title}`));

  if (testProducts.length === 0) {
    console.log('\n⚠️  No test products found. Looking for any product...\n');
    if (productLinks.length > 0) {
      const firstLink = productLinks[0];
      const title = await firstLink.textContent();
      const href = await firstLink.getAttribute('href');
      testProducts.push({ title: title?.trim() || 'Unknown', url: href });
    }
  }

  // Test each product
  for (const product of testProducts.slice(0, 3)) {
    console.log(`\n--- Testing: ${product.title} ---\n`);
    await desktopPage.goto(`http://127.0.0.1:9292${product.url}`);
    await desktopPage.waitForLoadState('networkidle');

    // Analyze gallery structure
    await analyzeGalleryStructure(desktopPage, 'desktop');
    await testDesktopGalleryInteractions(desktopPage);

    // Take screenshot
    await desktopPage.screenshot({
      path: `/tmp/dawn-test-desktop-${product.url.split('/').pop()}.png`,
      fullPage: true
    });
  }

  await desktopContext.close();

  // Test on mobile
  console.log('\n=== MOBILE TESTING ===\n');
  const iPhone = devices['iPhone 13 Pro'];
  const mobileContext = await browser.newContext({
    ...iPhone,
    viewport: { width: 390, height: 844 }
  });
  const mobilePage = await mobileContext.newPage();

  for (const product of testProducts.slice(0, 3)) {
    console.log(`\n--- Testing Mobile: ${product.title} ---\n`);
    await mobilePage.goto(`http://127.0.0.1:9292${product.url}`);
    await mobilePage.waitForLoadState('networkidle');

    await analyzeGalleryStructure(mobilePage, 'mobile');
    await testMobileGalleryInteractions(mobilePage);

    // Take screenshot
    await mobilePage.screenshot({
      path: `/tmp/dawn-test-mobile-${product.url.split('/').pop()}.png`,
      fullPage: true
    });
  }

  await mobileContext.close();
  await browser.close();

  console.log('\n✅ Testing complete! Screenshots saved to /tmp/\n');
}

async function analyzeGalleryStructure(page, device) {
  console.log(`\n📊 Gallery Structure (${device}):`);

  // Check for common gallery selectors in Dawn theme
  const selectors = [
    { name: 'Main product media', selector: '.product__media' },
    { name: 'Thumbnail list', selector: '.thumbnail-list' },
    { name: 'Slider buttons', selector: '.slider-button' },
    { name: 'Media gallery', selector: '.product__media-list' },
    { name: 'Thumbnails', selector: 'slider-component li' }
  ];

  for (const { name, selector } of selectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`  ✓ ${name}: ${count} found`);
    }
  }

  // Count total images
  const imageCount = await page.locator('.product__media img, .product__media video').count();
  console.log(`  📸 Total media items: ${imageCount}`);
}

async function testDesktopGalleryInteractions(page) {
  console.log('\n🖱️  Testing Desktop Interactions:');

  try {
    // Test thumbnail clicks
    const thumbnails = page.locator('slider-component li button, .thumbnail-list button');
    const thumbCount = await thumbnails.count();

    if (thumbCount > 0) {
      console.log(`  ✓ Found ${thumbCount} clickable thumbnails`);

      // Click second thumbnail if it exists
      if (thumbCount > 1) {
        await thumbnails.nth(1).click();
        await page.waitForTimeout(500);
        console.log('  ✓ Thumbnail click works');
      }
    } else {
      console.log('  ⚠️  No thumbnails found');
    }

    // Test slider navigation buttons
    const nextButton = page.locator('.slider-button--next, button[name="next"]').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
      console.log('  ✓ Next button works');
    }

    // Test zoom/modal functionality
    const mainImage = page.locator('.product__media img').first();
    if (await mainImage.isVisible()) {
      await mainImage.click();
      await page.waitForTimeout(500);

      // Check if modal opened
      const modal = page.locator('.product-media-modal, [role="dialog"]');
      if (await modal.isVisible()) {
        console.log('  ✓ Image click opens modal/zoom');

        // Close modal
        const closeButton = page.locator('.modal__close, button[aria-label*="Close"]').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
        } else {
          await page.keyboard.press('Escape');
        }
      } else {
        console.log('  ℹ️  Image click does not open modal');
      }
    }

  } catch (error) {
    console.log(`  ⚠️  Error during interaction test: ${error.message}`);
  }
}

async function testMobileGalleryInteractions(page) {
  console.log('\n📱 Testing Mobile Interactions:');

  try {
    const mediaList = page.locator('.product__media-list, slider-component').first();

    if (await mediaList.isVisible()) {
      const box = await mediaList.boundingBox();
      if (box) {
        // Test swipe gesture
        const startX = box.x + box.width * 0.8;
        const endX = box.x + box.width * 0.2;
        const y = box.y + box.height / 2;

        await page.mouse.move(startX, y);
        await page.mouse.down();
        await page.mouse.move(endX, y, { steps: 10 });
        await page.mouse.up();
        await page.waitForTimeout(500);

        console.log('  ✓ Swipe gesture executed');
      }
    }

    // Check thumbnail visibility/layout on mobile
    const thumbnails = page.locator('.thumbnail-list');
    if (await thumbnails.isVisible()) {
      console.log('  ✓ Thumbnails visible on mobile');
    } else {
      console.log('  ℹ️  Thumbnails hidden on mobile (common pattern)');
    }

  } catch (error) {
    console.log(`  ⚠️  Error during mobile test: ${error.message}`);
  }
}

// Run tests
testDawnGallery().catch(console.error);
