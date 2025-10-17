import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';
const LOGIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const pages = [
  { name: 'Dashboard', path: '/', selector: 'h1:has-text("Dashboard")' },
  { name: 'Analytics', path: '/analytics', selector: 'h1:has-text("Analytics")' },
  { name: 'Knowledge Graph', path: '/knowledge-graph', selector: 'h1:has-text("Knowledge Graph")' },
  { name: 'Data Collection', path: '/data-collection', selector: 'h1:has-text("Data Collection")' },
  { name: 'Data Pipeline Monitor', path: '/data-pipeline-monitor', selector: 'h1:has-text("Data Pipeline Monitor")' },
  { name: 'Content Generation', path: '/content-generation', selector: 'h1:has-text("Content Generation")' },
  { name: 'Content Library', path: '/content-library', selector: 'h1:has-text("Content Library")' },
  { name: 'Workflow Dashboard', path: '/geo-workflow/dashboard', selector: 'h1:has-text("GEO Workflow")' },
  { name: 'On-site GEO', path: '/geo-workflow/onsite', selector: 'h1:has-text("On-site GEO")' },
  { name: 'Off-site GEO', path: '/geo-workflow/offsite', selector: 'h1:has-text("Off-site GEO")' },
  { name: 'GEO Monitoring', path: '/geo-workflow/monitoring', selector: 'h1:has-text("GEO Monitoring")' },
  { name: 'Shopify GEO', path: '/shopify-geo', selector: 'h1:has-text("Shopify GEO")' },
  { name: 'Amazon GEO', path: '/amazon-geo', selector: 'h1:has-text("Amazon GEO")' },
  { name: 'Orders', path: '/orders', selector: 'h1:has-text("Orders")' },
  { name: 'Offers', path: '/offers', selector: 'h1:has-text("Offers")' },
  { name: 'Settings', path: '/settings', selector: 'h1:has-text("Settings")' },
];

async function login(page) {
  console.log('\n🔐 Logging in...');

  // Navigate to login page
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');

  // Fill in credentials
  await page.fill('input[type="text"]', LOGIN_CREDENTIALS.username);
  await page.fill('input[type="password"]', LOGIN_CREDENTIALS.password);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });

  console.log('  ✅ Login successful\n');
}

async function runTests() {
  console.log('🚀 Starting Complete Application E2E Tests (With Authentication)\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Total Tests: ${pages.length}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let passed = 0;
  let failed = 0;
  const failedTests = [];

  try {
    // Login first
    await login(page);

    console.log('📄 Testing Page Navigation...\n');

    for (const pageTest of pages) {
      try {
        console.log(`Testing: ${pageTest.name} (${pageTest.path})`);

        // Navigate to page
        await page.goto(`${BASE_URL}${pageTest.path}`, { waitUntil: 'networkidle', timeout: 10000 });

        // Wait for page to load
        await page.waitForSelector(pageTest.selector, { timeout: 10000 });

        console.log(`  ✅ Passed\n`);
        passed++;
      } catch (error) {
        console.log(`  ❌ Failed: ${error.message}\n`);
        failed++;
        failedTests.push({
          name: pageTest.name,
          path: pageTest.path,
          error: error.message
        });
      }
    }

    // Test logout functionality
    console.log('\n🔐 Testing Logout...');
    try {
      // Find and click logout button
      const logoutButton = await page.locator('button:has-text("Logout")');
      await logoutButton.click();

      // Wait for redirect to login page
      await page.waitForURL(`${BASE_URL}/login`, { timeout: 5000 });

      console.log('  ✅ Logout successful\n');
      passed++;
    } catch (error) {
      console.log(`  ❌ Logout failed: ${error.message}\n`);
      failed++;
      failedTests.push({
        name: 'Logout',
        path: '/login',
        error: error.message
      });
    }

  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}/${pages.length + 1}`);
  console.log(`❌ Failed: ${failed}/${pages.length + 1}`);
  console.log(`📈 Success Rate: ${((passed / (pages.length + 1)) * 100).toFixed(2)}%`);

  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests:');
    failedTests.forEach(test => {
      console.log(`  - ${test.name} (${test.path})`);
      console.log(`    Error: ${test.error}`);
    });
  }

  console.log('\n' + '='.repeat(50));
  console.log(failed === 0 ? '✅ All tests passed!' : '⚠️  Some tests failed');
  console.log('='.repeat(50) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
