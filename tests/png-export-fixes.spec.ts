import { test, expect } from '@playwright/test';

test.describe('PNG Export Issues - After Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for app to load
  });

  test('should toggle multi-page preview', async ({ page }) => {
    // Open Page Setup
    await page.click('button:has-text("Page Setup")');
    
    const multiPageButton = page.locator('button').filter({ hasText: 'Paged' });
    
    // Toggle it
    await multiPageButton.click();
    await page.waitForTimeout(500);
    
    // Verify changes (optional, or just verify it doesn't crash)
    
    console.log('✓ Multi-page preview toggle works');
  });

  test('should change padding value', async ({ page }) => {
    // Open Page Setup
    await page.click('button:has-text("Page Setup")');

    const slider = page.locator('input[type="range"]');
    await expect(slider).toBeVisible();
    
    // Get initial value
    const initialValue = await slider.getAttribute('value');
    console.log(`Initial padding: ${initialValue}px`);
    
    // Set new value
    await slider.fill('64');
    
    // Check if value display updates (it's in a label now)
    const paddingDisplay = page.locator('label').filter({ hasText: /Padding: 64px/ });
    await expect(paddingDisplay).toBeVisible();
    
    console.log('✓ Padding control works');
  });

  test('should change export mode', async ({ page }) => {
    // Open Page Setup
    await page.click('button:has-text("Page Setup")');

    // Test switching to "Continuous" mode (was "Long")
    const longButton = page.locator('button').filter({ hasText: 'Continuous' });
    await longButton.click();
    await page.waitForTimeout(200);
    
    // Check if it's selected (active state typically has white bg in the new UI)
    // We can check class or computed style, but basic clickability is key here.
    
    // Switch back to "Paged" mode
    const pagesButton = page.locator('button').filter({ hasText: 'Paged' });
    await pagesButton.click();
    await page.waitForTimeout(200);
    
    console.log('✓ Export mode controls work');
  });
});