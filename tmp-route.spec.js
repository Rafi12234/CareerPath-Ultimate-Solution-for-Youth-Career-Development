import { test, expect } from '@playwright/test';

test('course player navbar navigation works', async ({ page }) => {
  await page.goto('http://localhost:3000/course-player/1', { waitUntil: 'networkidle' });

  await page.getByRole('link', { name: 'Dashboard' }).first().click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole('link', { name: 'Jobs' }).first().click();
  await expect(page).toHaveURL(/\/jobs/);
});
