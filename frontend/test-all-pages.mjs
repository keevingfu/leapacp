import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

const results = [];
const errors = [];

// Capture page errors
page.on('pageerror', error => {
  errors.push(`[${new Date().toISOString()}] ${error.message}`);
  console.error('❌ Page Error:', error.message);
});

// Navigate to homepage
console.log('🚀 Starting comprehensive page test...\n');
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Define all navigation items to test
const navItems = [
  { name: 'Dashboard', href: '/', section: 'Overview' },
  { name: 'Analytics', href: '/analytics', section: 'Overview' },
  { name: 'Knowledge Graph', href: '/geo/knowledge-graph', section: 'GEO' },
  { name: 'Data Collection', href: '/geo/data-collection', section: 'GEO' },
  { name: 'Content Generation', href: '/geo/content-generation', section: 'GEO' },
  { name: 'Content Library', href: '/geo/content-library', section: 'GEO' },
  { name: 'Workflow Dashboard', href: '/geo-workflow/dashboard', section: 'GEO Workflow' },
  { name: 'On-site GEO', href: '/geo-workflow/onsite', section: 'GEO Workflow' },
  { name: 'Off-site GEO', href: '/geo-workflow/offsite', section: 'GEO Workflow' },
  { name: 'GEO Monitoring', href: '/geo-workflow/monitoring', section: 'GEO Workflow' },
  { name: 'Shopify GEO', href: '/geo-workflow/sweetnight-shopify', section: 'Commerce' },
  { name: 'Amazon GEO', href: '/geo-workflow/amazon', section: 'Commerce' },
  { name: 'Orders', href: '/commerce/orders', section: 'Commerce' },
  { name: 'Offers', href: '/commerce/offers', section: 'Commerce' },
  { name: 'Settings', href: '/settings', section: 'System' },
];

console.log(`Testing ${navItems.length} pages...\n`);

// Test each navigation item
for (const item of navItems) {
  const errorsBefore = errors.length;

  try {
    console.log(`\n📄 Testing: ${item.section} > ${item.name}`);
    console.log(`   URL: ${item.href}`);

    // Click the navigation link
    const linkSelector = `a[href="${item.href}"]`;
    await page.click(linkSelector);

    // Wait for navigation and content
    await page.waitForTimeout(1500);

    // Check page state
    const pageState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasContent: document.body.innerText.length > 100,
      h1Text: document.querySelector('h1')?.textContent || 'No h1',
      h2Count: document.querySelectorAll('h2').length,
      hasError: document.body.innerText.toLowerCase().includes('error'),
    }));

    // Check for new errors
    const newErrors = errors.length - errorsBefore;
    const hasErrors = newErrors > 0 || pageState.hasError;

    const result = {
      section: item.section,
      name: item.name,
      href: item.href,
      status: hasErrors ? '❌ FAILED' : '✅ PASSED',
      currentUrl: pageState.url,
      h1: pageState.h1Text,
      hasContent: pageState.hasContent,
      h2Count: pageState.h2Count,
      newErrors: newErrors,
    };

    results.push(result);

    // Log result
    console.log(`   Status: ${result.status}`);
    console.log(`   H1: ${result.h1}`);
    console.log(`   Content: ${result.hasContent ? 'Yes' : 'No'}`);
    console.log(`   H2 sections: ${result.h2Count}`);
    if (newErrors > 0) {
      console.log(`   ⚠️  New errors: ${newErrors}`);
    }

  } catch (error) {
    console.error(`   ❌ Failed to test: ${error.message}`);
    results.push({
      section: item.section,
      name: item.name,
      href: item.href,
      status: '❌ FAILED',
      error: error.message,
    });
  }
}

// Generate summary report
console.log('\n' + '='.repeat(70));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(70));

const passed = results.filter(r => r.status === '✅ PASSED').length;
const failed = results.filter(r => r.status === '❌ FAILED').length;

console.log(`\nTotal pages tested: ${results.length}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed > 0) {
  console.log('\n❌ Failed pages:');
  results.filter(r => r.status === '❌ FAILED').forEach(r => {
    console.log(`   - ${r.section} > ${r.name} (${r.href})`);
    if (r.error) console.log(`     Error: ${r.error}`);
  });
}

if (errors.length > 0) {
  console.log(`\n⚠️  Total errors captured: ${errors.length}`);
  console.log('First 5 errors:');
  errors.slice(0, 5).forEach(err => console.log(`   ${err}`));
}

// Group results by section
console.log('\n' + '='.repeat(70));
console.log('📋 DETAILED RESULTS BY SECTION');
console.log('='.repeat(70));

const sections = [...new Set(results.map(r => r.section))];
sections.forEach(section => {
  console.log(`\n${section}:`);
  results.filter(r => r.section === section).forEach(r => {
    console.log(`  ${r.status} ${r.name}`);
    if (r.h1 && r.status === '✅ PASSED') {
      console.log(`     └─ ${r.h1}`);
    }
  });
});

console.log('\n' + '='.repeat(70));
console.log(`\n✨ Test completed! Browser will close in 5 seconds...\n`);

await page.waitForTimeout(5000);
await browser.close();

// Exit with proper code
process.exit(failed > 0 ? 1 : 0);
