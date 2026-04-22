const { test, expect } = require('@playwright/test');
const testCases = require('./data/testCases.json');

async function login(page) {
  await page.goto('/');
  await page.locator('input[type="text"], input[type="email"]').fill(process.env.Email.trim());
  await page.locator('input[type="password"]').fill(process.env.Password.trim());
  await page.getByRole('button', { name: /login|sign in/i }).click();
  await page.waitForLoadState('networkidle');
}

for (const { id, project, task, column, tags } of testCases) {
  test(`TC${id}: [${project}] "${task}" is in "${column}" with tags: ${tags.join(', ')}`, async ({ page }) => {
    await login(page);

    // Sidebar uses buttons, not links
    await page.locator('button').filter({ has: page.locator('h2').filter({ hasText: project }) }).click();
    await page.waitForLoadState('networkidle');

    // Column h2 headings include a count e.g. "To Do (2)", so use partial match
    const columnLocator = page.locator('div:has(> h2)').filter({
      has: page.locator('h2').filter({ hasText: column }),
    });

    // Card has an h3 title; scope tag assertions inside the card
    const card = columnLocator.locator('div:has(> h3)').filter({ hasText: task });

    await expect(card).toBeVisible();

    for (const tag of tags) {
      await expect(card.locator('span').filter({ hasText: tag })).toBeVisible();
    }
  });
}
