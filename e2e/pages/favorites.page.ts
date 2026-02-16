import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class FavoritesPage extends BasePage {
  private readonly pageTitle: Locator
  private readonly favoriteCards: Locator
  private readonly favoriteTableRows: Locator
  private readonly bulkDeleteButton: Locator
  private readonly selectAllCheckbox: Locator
  private readonly emptyState: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.locator('h1:has-text("Favoritos")')
    this.favoriteCards = page.locator('.md\\:hidden > div[class*="p-4"]')
    this.favoriteTableRows = page.locator('table tbody tr')
    this.bulkDeleteButton = page.locator(
      'button:has-text("Excluir selecionados")',
    )
    this.selectAllCheckbox = page.locator('thead input[type="checkbox"]')
    this.emptyState = page.locator('text=/nenhum.*favorito/i')
  }

  async goto() {
    await super.goto('/favorites')
  }

  async getFavoritesCount(): Promise<number> {
    const isMobile = this.page.viewportSize()!.width < 768
    const locator = isMobile ? this.favoriteCards : this.favoriteTableRows
    return await locator.count()
  }

  async expectFavoritesCount(count: number) {
    if (count === 0) {
      await this.expectVisible(this.emptyState)
    } else {
      const isMobile = this.page.viewportSize()!.width < 768
      const locator = isMobile ? this.favoriteCards : this.favoriteTableRows
      await this.expectCount(locator, count)
    }
  }

  async expectProductInFavorites(productName: string) {
    await this.expectVisible(this.page.locator(`text=${productName}`))
  }

  async selectAllFavorites() {
    await this.selectAllCheckbox.click()
  }

  async selectFavoriteByName(productName: string) {
    const productRow = this.page.locator(`tr:has-text("${productName}")`)
    const checkbox = productRow.locator('input[type="checkbox"]')
    await checkbox.click()
  }

  async bulkDelete() {
    await this.bulkDeleteButton.click()
  }
}
