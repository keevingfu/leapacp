#!/usr/bin/env node

/**
 * Complete Application E2E Test Suite
 * Tests all 15 pages and identifies issues
 */

import { chromium } from 'playwright'

const BASE_URL = 'http://localhost:5173'
const TIMEOUT = 10000
const SCREENSHOT_DIR = './test-screenshots'

// Test configuration
const TESTS = [
  // Overview Pages
  { name: 'Dashboard', path: '/', selector: 'h1:has-text("Dashboard")' },
  { name: 'Analytics', path: '/analytics', selector: 'h1:has-text("Analytics")' },

  // GEO Pages
  { name: 'Knowledge Graph', path: '/knowledge-graph', selector: 'h1:has-text("Knowledge Graph")' },
  { name: 'Data Collection', path: '/data-collection', selector: 'h1:has-text("Data Collection")' },
  { name: 'Data Pipeline Monitor', path: '/data-pipeline-monitor', selector: 'h1:has-text("Data Pipeline Monitor")' },
  { name: 'Content Generation', path: '/content-generation', selector: 'h1:has-text("Content Generation")' },
  { name: 'Content Library', path: '/content-library', selector: 'h1:has-text("Content Library")' },

  // GEO Workflow Pages
  { name: 'Workflow Dashboard', path: '/geo-workflow/dashboard', selector: 'h1:has-text("GEO Workflow")' },
  { name: 'On-site GEO', path: '/geo-workflow/onsite', selector: 'h1:has-text("On-site GEO")' },
  { name: 'Off-site GEO', path: '/geo-workflow/offsite', selector: 'h1:has-text("Off-site GEO")' },
  { name: 'GEO Monitoring', path: '/geo-workflow/monitoring', selector: 'h1:has-text("GEO Monitoring")' },

  // Commerce Pages
  { name: 'Shopify GEO', path: '/shopify-geo', selector: 'h1:has-text("Shopify GEO")' },
  { name: 'Amazon GEO', path: '/amazon-geo', selector: 'h1:has-text("Amazon GEO")' },
  { name: 'Offers', path: '/offers', selector: 'h1:has-text("Offers")' },
  { name: 'Orders', path: '/orders', selector: 'h1:has-text("Orders")' },

  // System Pages
  { name: 'Settings', path: '/settings', selector: 'h1:has-text("Settings")' },
]

// Additional interactive tests
const INTERACTIVE_TESTS = [
  {
    name: 'Knowledge Graph - Switch Views',
    path: '/knowledge-graph',
    actions: async (page) => {
      // Wait for page load
      await page.waitForSelector('h1:has-text("Knowledge Graph")', { timeout: TIMEOUT })

      // Test Pyramid View button
      const pyramidBtn = page.locator('button:has-text("Pyramid View")')
      if (await pyramidBtn.isVisible()) {
        await pyramidBtn.click()
        await page.waitForTimeout(1000)
        console.log('  ✓ Pyramid View loaded')
      }

      // Test Graph View button
      const graphBtn = page.locator('button:has-text("Graph View")')
      if (await graphBtn.isVisible()) {
        await graphBtn.click()
        await page.waitForTimeout(1000)
        console.log('  ✓ Graph View loaded')
      }

      return true
    }
  },
  {
    name: 'Analytics - Tab Navigation',
    path: '/analytics',
    actions: async (page) => {
      await page.waitForSelector('h1:has-text("Analytics")', { timeout: TIMEOUT })

      // Test all analytics tabs
      const tabs = ['Overview', 'Content', 'Platforms', 'ROI', 'Quality', 'Users', 'Geographic']
      for (const tab of tabs) {
        const tabBtn = page.locator(`button:has-text("${tab}")`)
        if (await tabBtn.isVisible()) {
          await tabBtn.click()
          await page.waitForTimeout(500)
          console.log(`  ✓ ${tab} tab loaded`)
        }
      }

      return true
    }
  },
  {
    name: 'Dashboard - Charts Rendering',
    path: '/',
    actions: async (page) => {
      await page.waitForSelector('h1:has-text("Dashboard")', { timeout: TIMEOUT })

      // Check for chart elements (Recharts uses SVG)
      const charts = await page.locator('svg.recharts-surface').count()
      console.log(`  ✓ Found ${charts} charts on Dashboard`)

      return charts > 0
    }
  },
  {
    name: 'Data Pipeline Monitor - Interactive Features',
    path: '/data-pipeline-monitor',
    actions: async (page) => {
      await page.waitForSelector('h1:has-text("Data Pipeline Monitor")', { timeout: TIMEOUT })

      // Test manual refresh button (use exact text match)
      const refreshBtn = page.getByRole('button', { name: 'Refresh', exact: true })
      if (await refreshBtn.isVisible()) {
        await refreshBtn.click()
        await page.waitForTimeout(500)
        console.log('  ✓ Manual refresh button works')
      }

      // Test tab switching
      const tabs = ['Collection Tasks', 'ETL Tasks', 'Neo4j Data']
      for (const tab of tabs) {
        const tabBtn = page.locator(`button:has-text("${tab}")`)
        if (await tabBtn.isVisible()) {
          await tabBtn.click()
          await page.waitForTimeout(300)
          console.log(`  ✓ ${tab} tab loaded`)
        }
      }

      // Test generate report button
      const reportBtn = page.locator('button:has-text("Generate Report")')
      if (await reportBtn.isVisible()) {
        console.log('  ✓ Generate Report button found')
      }

      // Check for service status cards
      const statusCards = await page.locator('div:has-text("Data Collection"), div:has-text("ETL Processing")').count()
      console.log(`  ✓ Found ${statusCards} service status cards`)

      return true
    }
  }
]

async function runTests() {
  console.log('🚀 Starting Complete Application E2E Tests\n')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Total Tests: ${TESTS.length + INTERACTIVE_TESTS.length}\n`)

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  const results = {
    passed: [],
    failed: [],
    warnings: [],
  }

  try {
    // Test all pages
    console.log('📄 Testing Page Navigation...\n')

    for (const test of TESTS) {
      try {
        console.log(`Testing: ${test.name} (${test.path})`)

        // Navigate to page
        await page.goto(`${BASE_URL}${test.path}`, {
          waitUntil: 'networkidle',
          timeout: TIMEOUT
        })

        // Wait for expected element
        await page.waitForSelector(test.selector, { timeout: TIMEOUT })

        // Check for console errors
        const errors = []
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text())
          }
        })

        // Check for API errors
        const apiErrors = []
        page.on('response', response => {
          if (response.status() >= 400 && response.url().includes('/api/')) {
            apiErrors.push(`${response.status()} ${response.url()}`)
          }
        })

        await page.waitForTimeout(1000)

        if (errors.length > 0) {
          results.warnings.push({
            test: test.name,
            issues: errors
          })
          console.log(`  ⚠️  Console errors: ${errors.length}`)
        }

        if (apiErrors.length > 0) {
          results.warnings.push({
            test: test.name,
            issues: apiErrors
          })
          console.log(`  ⚠️  API errors: ${apiErrors.length}`)
        }

        results.passed.push(test.name)
        console.log(`  ✅ Passed\n`)

      } catch (error) {
        results.failed.push({
          test: test.name,
          error: error.message
        })
        console.log(`  ❌ Failed: ${error.message}\n`)
      }
    }

    // Run interactive tests
    console.log('\n🎯 Running Interactive Tests...\n')

    for (const test of INTERACTIVE_TESTS) {
      try {
        console.log(`Testing: ${test.name}`)

        await page.goto(`${BASE_URL}${test.path}`, {
          waitUntil: 'networkidle',
          timeout: TIMEOUT
        })

        const success = await test.actions(page)

        if (success) {
          results.passed.push(test.name)
          console.log(`  ✅ Passed\n`)
        } else {
          results.warnings.push({
            test: test.name,
            issues: ['Test returned false']
          })
          console.log(`  ⚠️  Warning: Test returned false\n`)
        }

      } catch (error) {
        results.failed.push({
          test: test.name,
          error: error.message
        })
        console.log(`  ❌ Failed: ${error.message}\n`)
      }
    }

  } finally {
    await browser.close()
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Test Results Summary')
  console.log('='.repeat(60))
  console.log(`✅ Passed: ${results.passed.length}`)
  console.log(`❌ Failed: ${results.failed.length}`)
  console.log(`⚠️  Warnings: ${results.warnings.length}`)
  console.log('='.repeat(60))

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:')
    results.failed.forEach(({ test, error }) => {
      console.log(`  - ${test}: ${error}`)
    })
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    results.warnings.forEach(({ test, issues }) => {
      console.log(`  - ${test}:`)
      issues.slice(0, 3).forEach(issue => {
        console.log(`    • ${issue}`)
      })
      if (issues.length > 3) {
        console.log(`    ... and ${issues.length - 3} more`)
      }
    })
  }

  console.log('\n')

  const exitCode = results.failed.length > 0 ? 1 : 0
  process.exit(exitCode)
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test runner error:', error)
  process.exit(1)
})
