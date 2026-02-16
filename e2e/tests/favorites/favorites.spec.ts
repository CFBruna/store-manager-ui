import { test, expect } from '../../fixtures/base'

test.describe('Favorites Management', () => {
  test('should display empty state when no favorites', async ({
    favoritesPage,
    page,
  }) => {
    await favoritesPage.goto()

    const count = await favoritesPage.getFavoritesCount()
    if (count > 0) {
      test.skip()
    }

    await expect(page.locator('text=/nenhum.*favorito/i')).toBeVisible()
  })
})
