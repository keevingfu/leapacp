#!/usr/bin/env node

/**
 * Quick Test for Data Pipeline Monitor Page
 */

import { chromium } from 'playwright'

const BASE_URL = 'http://localhost:5174'
const TIMEOUT = 30000 // Increased timeout to 30s

async function testMonitorPage() {
  console.log('🧪 Testing Data Pipeline Monitor Page\n')

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    console.log(`Navigating to ${BASE_URL}/data-pipeline-monitor...`)

    const response = await page.goto(`${BASE_URL}/data-pipeline-monitor`, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    })

    console.log(`✓ Page loaded with status: ${response.status()}`)

    // Wait for specific h1
    await page.waitForSelector('h1:has-text("Data Pipeline Monitor")', { timeout: TIMEOUT })
    const h1 = await page.locator('h1:has-text("Data Pipeline Monitor")').textContent()
    console.log(`✓ Found h1: "${h1}"`)

    // Check for service status cards
    const cards = await page.locator('[class*="card"]').count()
    console.log(`✓ Found ${cards} cards`)

    // Check for buttons
    const refreshBtn = await page.locator('button:has-text("Refresh")').count()
    const reportBtn = await page.locator('button:has-text("Generate Report")').count()
    console.log(`✓ Found Refresh button: ${refreshBtn > 0}`)
    console.log(`✓ Found Generate Report button: ${reportBtn > 0}`)

    // Take a screenshot
    await page.screenshot({ path: 'monitor-page-test.png', fullPage: true })
    console.log('✓ Screenshot saved as monitor-page-test.png')

    console.log('\n✅ Test passed!')

  } catch (error) {
    console.error('\n❌ Test failed:', error.message)

    // Try to get page content for debugging
    try {
      const content = await page.content()
      console.log('\nPage HTML (first 500 chars):')
      console.log(content.substring(0, 500))
    } catch (e) {
      console.log('Could not get page content')
    }

    process.exit(1)
  } finally {
    await browser.close()
  }
}

testMonitorPage().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
