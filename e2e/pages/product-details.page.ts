import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class ProductDetailsPage extends BasePage {
  private readonly productTitle: Locator
  private readonly productPrice: Locator
  private readonly productStock: Locator
  private readonly productCategory: Locator
  private readonly productDescription: Locator
  private readonly productImage: Locator
  private readonly editButton: Locator
  private readonly deleteButton: Locator
  private readonly favoriteButton: Locator
  private readonly catalogToggle: Locator
  private readonly backButton: Locator

  constructor(page: Page) {
    super(page)
    this.productTitle = page
      .locator('h1')
      .filter({ hasNotText: 'Detalhes do Produto' })
    this.productPrice = page.locator('text=/R\\$.*/')
    this.productStock = page.locator('text=/Estoque:/')
    this.productCategory = page.locator('[class*="bg-gray-100"]')
    this.productDescription = page.locator('p[class*="text-gray-600"]')
    this.productImage = page.locator('img[alt]')
    this.editButton = page.getByRole('link', { name: 'Editar' })
    this.deleteButton = page.getByRole('button', { name: 'Excluir Produto' })
    this.favoriteButton = page
      .locator('button:has(svg)')
      .filter({ hasText: /^$/ })
      .first()
    this.catalogToggle = page.locator('button[role="switch"]')
    this.backButton = page.locator('a:has-text("Produtos")')
  }

  async goto(productId: number) {
    await super.goto(`/product/${productId}`)
  }

  async expectProductDetails(product: {
    title?: string
    price?: string
    stock?: number
    category?: string
  }) {
    if (product.title) {
      await this.expectText(this.productTitle, product.title)
    }
    if (product.price) {
      await this.expectVisible(this.page.locator(`text=${product.price}`))
    }
    if (product.stock !== undefined) {
      await this.expectVisible(
        this.page.locator(`text=Estoque: ${product.stock}`),
      )
    }
    if (product.category) {
      await this.expectVisible(this.page.locator(`text=${product.category}`))
    }
  }

  async clickEdit() {
    await this.clickAndWait(this.editButton)
  }

  async clickDelete() {
    await this.deleteButton.click()
  }

  async toggleFavorite() {
    await this.favoriteButton.click()
    await this.page.waitForTimeout(300)
  }

  async toggleCatalog() {
    await this.catalogToggle.click()
    await this.page.waitForTimeout(300)
  }

  async goBack() {
    await this.clickAndWait(this.backButton)
  }
}
