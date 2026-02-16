import { test, expect } from '../../fixtures/base'
import { generateTestProduct } from '../../fixtures/test-data'

test.describe('Product CRUD Operations', () => {
  test('should create a new product', async ({ homePage, productFormPage }) => {
    const newProduct = generateTestProduct({
      title: 'E2E Test Product',
      category: 'electronics',
    })

    await homePage.goto()
    await homePage.clickAddProduct()

    await productFormPage.expectFormTitle('Novo Produto')
    await productFormPage.fillProductForm(newProduct)
    await productFormPage.clickSave()

    await homePage.expectProductInList(newProduct.title)
  })

  test('should view product details', async ({
    homePage,
    productDetailsPage,
    productFormPage,
  }) => {
    const product = generateTestProduct()
    await productFormPage.gotoNew()
    await productFormPage.fillProductForm(product)
    await productFormPage.clickSave()

    await homePage.expectProductInList(product.title)
    await homePage.clickProductByName(product.title)
    await productDetailsPage.expectProductDetails({ title: product.title })
  })

  test('should edit existing product', async ({
    homePage,
    productDetailsPage,
    productFormPage,
  }) => {
    const product = generateTestProduct()
    await productFormPage.gotoNew()
    await productFormPage.fillProductForm(product)
    await productFormPage.clickSave()

    await homePage.expectProductInList(product.title)
    await homePage.clickProductByName(product.title)
    await productDetailsPage.clickEdit()

    const updatedTitle = `${product.title} - Edited`
    await productFormPage.fillProductForm({
      ...generateTestProduct(),
      title: updatedTitle,
    })
    await productFormPage.clickSave()

    await homePage.expectProductInList(updatedTitle)
  })

  test('should delete a product', async ({
    homePage,
    productDetailsPage,
    productFormPage,
    page,
  }) => {
    const product = generateTestProduct()
    await productFormPage.gotoNew()
    await productFormPage.fillProductForm(product)
    await productFormPage.clickSave()

    await homePage.expectProductInList(product.title)
    const initialCount = await homePage.getProductCount()

    await homePage.clickProductByName(product.title)
    await productDetailsPage.clickDelete()

    await page.getByRole('button', { name: 'Excluir', exact: true }).click()
    await page.waitForURL('/')
    await expect(page.locator(`text=${product.title}`)).toBeHidden()

    const finalCount = await homePage.getProductCount()
    expect(finalCount).toBe(initialCount - 1)
  })
})
