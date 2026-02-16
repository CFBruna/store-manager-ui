import { test as base } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ProductDetailsPage } from '../pages/product-details.page'
import { ProductFormPage } from '../pages/product-form.page'
import { FavoritesPage } from '../pages/favorites.page'

type Pages = {
  homePage: HomePage
  productDetailsPage: ProductDetailsPage
  productFormPage: ProductFormPage
  favoritesPage: FavoritesPage
}

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await use(homePage)
  },

  productDetailsPage: async ({ page }, use) => {
    const productDetailsPage = new ProductDetailsPage(page)
    await use(productDetailsPage)
  },

  productFormPage: async ({ page }, use) => {
    const productFormPage = new ProductFormPage(page)
    await use(productFormPage)
  },

  favoritesPage: async ({ page }, use) => {
    const favoritesPage = new FavoritesPage(page)
    await use(favoritesPage)
  },
})

export { expect } from '@playwright/test'
