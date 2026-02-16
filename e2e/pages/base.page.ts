import { Page, Locator, expect } from '@playwright/test'

export abstract class BasePage {
  protected readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(path: string = '') {
    await this.page.goto(path)
    await this.waitForPageLoad()
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  async clickAndWait(locator: Locator) {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      locator.click(),
    ])
  }

  async fillAndBlur(locator: Locator, value: string) {
    await locator.fill(value)
    await locator.blur()
  }

  async screenshot(name: string) {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    })
  }

  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible()
  }

  async expectHidden(locator: Locator) {
    await expect(locator).toBeHidden()
  }

  async expectText(locator: Locator, text: string | RegExp) {
    await expect(locator).toHaveText(text)
  }

  async expectCount(locator: Locator, count: number) {
    await expect(locator).toHaveCount(count)
  }

  async waitForResponse(
    urlPattern: string | RegExp,
    action: () => Promise<void>,
  ) {
    return await Promise.all([this.page.waitForResponse(urlPattern), action()])
  }
}
