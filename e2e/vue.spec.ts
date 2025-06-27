import { expect, test } from '@playwright/test'
import pkg from '../package.json' assert { type: 'json' }

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/')

  await expect(await page.title()).toBe(pkg.productName as string)
})
