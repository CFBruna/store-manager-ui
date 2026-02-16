import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class ProductFormPage extends BasePage {
  private readonly titleInput: Locator
  private readonly priceInput: Locator
  private readonly stockInput: Locator
  private readonly categorySelect: Locator
  private readonly descriptionTextarea: Locator
  private readonly imageUrlInput: Locator
  private readonly saveButton: Locator
  private readonly cancelButton: Locator
  private readonly formTitle: Locator

  constructor(page: Page) {
    super(page)
    this.titleInput = page.locator('input#title')
    this.priceInput = page.locator('input#price')
    this.stockInput = page.locator('input#stock')
    this.categorySelect = page.locator('select#category')
    this.descriptionTextarea = page.locator('textarea#description')
    this.imageUrlInput = page.locator('input#image')
    this.saveButton = page.getByRole('button', {
      name: /Criar Produto|Salvar Alterações/,
    })
    this.cancelButton = page.getByRole('link', { name: 'Cancelar' })
    this.formTitle = page
      .getByRole('main')
      .getByRole('heading', { name: /Produto/ })
  }

  async gotoNew() {
    await super.goto('/product/new')
  }

  async gotoEdit(productId: number) {
    await super.goto(`/product/${productId}/edit`)
  }

  async fillProductForm(product: {
    title: string
    price: number
    stock: number
    category: string
    description: string
    image: string
  }) {
    await this.titleInput.fill(product.title)
    await this.priceInput.fill(product.price.toString())
    await this.stockInput.fill(product.stock.toString())

    const optionExists =
      (await this.categorySelect
        .locator(`option[value="${product.category}"]`)
        .count()) > 0
    if (optionExists) {
      await this.categorySelect.selectOption(product.category)
    } else {
      await this.categorySelect.selectOption('NEW_CATEGORY')
      await this.page.locator('input#category').fill(product.category)
    }
    await this.descriptionTextarea.fill(product.description)
    await this.imageUrlInput.fill(product.image)
  }

  async clickSave() {
    await Promise.all([
      this.page.waitForURL('/', { timeout: 15000 }),
      this.saveButton.click(),
    ])
  }

  async clickCancel() {
    await this.cancelButton.click()
    await this.waitForPageLoad()
  }

  async selectCategory(category: string) {
    console.log(`Selecting category: ${category}`)
  }

  async expectFormTitle(text: string) {
    await this.expectText(this.formTitle, new RegExp(text))
  }

  async expectFormValues(
    product: Partial<{
      title: string
      price: number
      stock: number
      category: string
    }>,
  ) {
    if (product.title) {
      await this.page.waitForFunction(
        (title) =>
          (document.querySelector('input#title') as HTMLInputElement)?.value ===
          title,
        product.title,
        { timeout: 5000 },
      )
    }
    if (product.price) {
      await this.page.waitForFunction(
        (price) =>
          (document.querySelector('input#price') as HTMLInputElement)?.value ===
          price.toString(),
        product.price,
        { timeout: 5000 },
      )
    }
  }
}
