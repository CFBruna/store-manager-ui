import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class HomePage extends BasePage {
  private readonly searchInput: Locator
  private readonly filtersButton: Locator
  private readonly categoriesButton: Locator
  private readonly exportButton: Locator
  private readonly addProductButton: Locator
  private readonly productCards: Locator
  private readonly productTableRows: Locator
  private readonly metricsCards: Locator

  constructor(page: Page) {
    super(page)
    this.searchInput = page.locator('input[placeholder="Item ou código"]')
    this.filtersButton = page.getByRole('button', { name: 'Filtros' })
    this.categoriesButton = page.getByRole('button', { name: /Categorias/ })
    this.exportButton = page.getByRole('button', { name: 'Exportar' })
    this.addProductButton = page
      .getByRole('link', { name: /Produto/ })
      .locator('button')
    this.productCards = page
      .locator('div.p-4.flex.gap-3')
      .filter({ has: page.locator('img[alt]') })
    this.productTableRows = page
      .locator('table tbody tr')
      .filter({ has: page.locator('a') })
    this.metricsCards = page
      .locator('.bg-white.p-3')
      .filter({ has: page.locator('p.text-gray-500') })
  }

  async goto() {
    await super.goto('/')
    await this.page.waitForLoadState('networkidle')
  }

  async searchProduct(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForTimeout(800)
  }

  async openCategoriesDropdown() {
    await this.categoriesButton.click({ force: true })
    await this.page.waitForTimeout(1000)
  }

  async selectCategory(category: string) {
    await this.openCategoriesDropdown()
    await this.page.getByRole('menuitemcheckbox', { name: category }).click()
    await this.page.waitForTimeout(500)
  }

  async clickAddProduct() {
    await this.addProductButton.click()
    await this.page.waitForURL('**/product/new')
  }

  async getProductCount(): Promise<number> {
    const isMobile = this.page.viewportSize()!.width < 768
    const locator = isMobile ? this.productCards : this.productTableRows
    await this.page.waitForTimeout(800)
    const count = await locator.count()
    console.log(`Product count (mobile=${isMobile}): ${count}`)
    return count
  }

  async expectProductsVisible(count: number) {
    const isMobile = this.page.viewportSize()!.width < 768
    const locator = isMobile ? this.productCards : this.productTableRows
    await this.expectCount(locator, count)
  }

  async expectProductInList(productName: string) {
    await this.page.waitForTimeout(800)
    const productLink = this.page
      .getByRole('link', { name: productName })
      .first()
    await this.expectVisible(productLink)
  }

  async clickProductByName(productName: string) {
    const cleanName = productName.trim()
    // Try finding by row first (Desktop)
    const row = this.productTableRows.filter({ hasText: cleanName })
    if ((await row.count()) > 0) {
      await row.first().locator('a').first().click()
    } else {
      // Fallback for Mobile (Cards) or if row not found
      // Use exact text match on any element inside a link to avoid complex role matching
      await this.page
        .locator('a')
        .filter({ hasText: cleanName })
        .first()
        .click()
    }
    await this.page.waitForLoadState('networkidle')
  }

  async expectMetricsLoaded() {
    await this.page.waitForSelector('.bg-white.p-3', { state: 'visible' })
    const count = await this.metricsCards.count()
    if (count !== 6) {
      throw new Error(`Expected 6 metrics cards, got ${count}`)
    }
  }

  async getMetricValue(metricName: string): Promise<string> {
    const metric = this.page.locator(`p:has-text("${metricName}") + p`)
    return (await metric.textContent()) || ''
  }
}
