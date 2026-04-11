import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  // This is a placeholder E2E test
  // Replace with actual tests for your application
  
  await page.goto('/');
  // Verify page loaded successfully
  expect(page.url()).toContain('localhost');
});
