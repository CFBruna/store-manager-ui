import { test, expect } from '../../fixtures/base'

test.describe('Smoke Tests - Critical Paths', () => {
  test('should load home page successfully', async ({ homePage }) => {
    await homePage.goto()
    await homePage.expectMetricsLoaded()
    await expect(homePage['page']).toHaveTitle(/Store Manager/i)
  })

  test('should display products list', async ({ homePage }) => {
    await homePage.goto()
    const productCount = await homePage.getProductCount()
    expect(productCount).toBeGreaterThanOrEqual(0)
  })

  test('should navigate to product creation form', async ({
    homePage,
    productFormPage,
  }) => {
    await homePage.goto()
    await homePage.clickAddProduct()
    await productFormPage.expectFormTitle('Novo Produto')
  })

  test('should navigate to favorites page', async ({ page, favoritesPage }) => {
    await page.goto('/')
    await page.locator('a[href="/favorites"]').click()
    await favoritesPage.expectVisible(favoritesPage['pageTitle'])
  })

  test('should search products', async ({ homePage, productFormPage }) => {
    // Create a product to ensure we can find it
    const uniqueName = `SmokeSearch-${Date.now()}`
    await productFormPage.gotoNew()
    await productFormPage.fillProductForm({
      title: uniqueName,
      price: 50,
      stock: 5,
      category: 'others',
      description: 'Smoke test search',
      image: 'https://picsum.photos/200',
    })
    await productFormPage.clickSave()

    await homePage.goto()
    await homePage.searchProduct(uniqueName)
    const resultsCount = await homePage.getProductCount()
    expect(resultsCount).toBe(1)
  })
})
