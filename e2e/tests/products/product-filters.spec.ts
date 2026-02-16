import { test, expect } from '../../fixtures/base'

test.describe('Product Filters and Search', () => {
  test('should filter products by search query', async ({
    homePage,
    productFormPage,
  }) => {
    const uniqueName = `Unique Search Item ${Date.now()}`
    await productFormPage.gotoNew()
    await productFormPage.fillProductForm({
      title: uniqueName,
      price: 100,
      stock: 10,
      category: 'electronics',
      description: 'Test description',
      image: 'https://picsum.photos/200',
    })
    await productFormPage.clickSave()

    await homePage.goto()
    const initialCount = await homePage.getProductCount()

    await homePage.searchProduct(uniqueName)
    const filteredCount = await homePage.getProductCount()

    expect(filteredCount).toBe(1)
    expect(filteredCount).toBeLessThan(initialCount)
    await homePage.expectProductInList(uniqueName)
  })

  test('should filter products by category', async ({ homePage, page }) => {
    await homePage.goto()

    await homePage.selectCategory('Eletrônicos')

    await page.waitForTimeout(500)
    const count = await homePage.getProductCount()
    expect(count).toBeGreaterThan(0)
  })

  test('should show no results for invalid search', async ({
    homePage,
    page,
  }) => {
    await homePage.goto()

    await homePage.searchProduct('XXXNONEXISTENTPRODUCTXXX')

    await expect(page.locator('text=/nenhum produto/i')).toBeVisible()
  })

  test('should clear search and show all products', async ({ homePage }) => {
    await homePage.goto()
    const initialCount = await homePage.getProductCount()

    await homePage.searchProduct('Test')
    await homePage.searchProduct('')

    const finalCount = await homePage.getProductCount()
    expect(finalCount).toBe(initialCount)
  })
})
