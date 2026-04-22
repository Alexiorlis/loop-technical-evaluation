const { test, expect } = require('@playwright/test');

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});

test('homepage loads successfully', async ({ page }) => {
  const response = await page.goto('/');
  expect(response.status()).toBeLessThan(400);
});
