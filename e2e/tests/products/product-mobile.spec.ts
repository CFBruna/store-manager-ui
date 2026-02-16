import { test, expect } from '@playwright/test'
import { HomePage } from '../../pages/home.page'

test.use({
  viewport: { width: 375, height: 667 },
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
})

test.describe('Mobile Responsiveness', () => {
  test('should display mobile card layout', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    const cards = page.locator('.md\\:hidden > div[class*="p-4"]')
    await expect(cards.first()).toBeVisible()

    const table = page.locator('table')
    await expect(table).toBeHidden()
  })

  test('should have touch-friendly buttons (min 48px)', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    const addButton = page.locator('button:has-text("Produto")')
    const buttonSize = await addButton.boundingBox()

    expect(buttonSize?.height).toBeGreaterThanOrEqual(48)
  })

  test('should display metrics in 2 columns on mobile', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    const metricsGrid = page.locator('[class*="grid"]').first()
    const gridClass = await metricsGrid.getAttribute('class')

    expect(gridClass).toContain('grid-cols-2')
  })
})
