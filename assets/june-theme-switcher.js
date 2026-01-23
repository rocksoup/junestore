/**
 * June Theme Switcher
 * Enables URL-based theme switching for client demos
 * Usage: ?theme=editorial or ?theme=refined
 */

(function() {
  'use strict';

  // Theme configuration
  const THEMES = {
    'editorial': 'june-theme-editorial.css',
    'refined': 'june-theme-refined.css'
  };

  // Get theme from URL parameter or sessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const urlTheme = urlParams.get('theme');
  const storedTheme = sessionStorage.getItem('juneTheme');

  const activeTheme = urlTheme || storedTheme;

  // Load theme CSS if valid
  if (activeTheme && THEMES[activeTheme]) {
    // Store in session for navigation persistence
    sessionStorage.setItem('juneTheme', activeTheme);

    // Create and inject CSS link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = window.Shopify.routes.root + 'cdn/shop/t/' + window.Shopify.theme.id + '/assets/' + THEMES[activeTheme];
    link.media = 'all';
    link.dataset.themeStylesheet = activeTheme;
    document.head.appendChild(link);

    // Add body class for additional scoping if needed
    document.documentElement.classList.add('theme-' + activeTheme);

    // Log for debugging
    console.log('[June Theme] Loaded:', activeTheme);
  }

  // Clear theme if ?theme=default
  if (urlTheme === 'default') {
    sessionStorage.removeItem('juneTheme');
    document.documentElement.classList.remove('theme-editorial', 'theme-refined');
    console.log('[June Theme] Reset to default');
  }

  // Console helper for easy switching during demo
  window.juneSetTheme = function(themeName) {
    if (themeName === 'default') {
      sessionStorage.removeItem('juneTheme');
      console.log('[June Theme] Cleared. Reload page to see default theme.');
    } else if (THEMES[themeName]) {
      sessionStorage.setItem('juneTheme', themeName);
      console.log('[June Theme] Set to:', themeName, '- Reload page to apply.');
    } else {
      console.log('[June Theme] Available themes:', Object.keys(THEMES).concat(['default']));
      return;
    }
    location.reload();
  };

  // Log current theme for debugging
  if (activeTheme) {
    console.log('[June Theme] Active:', activeTheme);
    console.log('[June Theme] Switch with: juneSetTheme("editorial"), juneSetTheme("refined"), or juneSetTheme("default")');
  } else {
    console.log('[June Theme] Default theme active');
    console.log('[June Theme] Switch with: juneSetTheme("editorial") or juneSetTheme("refined")');
    console.log('[June Theme] Or use URL: ?theme=editorial or ?theme=refined');
  }
})();
