import { test, expect } from '@playwright/test';

test.describe('PNG Export Issues - After Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for app to load
  });

  test('should show multi-page preview toggle', async ({ page }) => {
    // Take a screenshot to show the interface
    await page.screenshot({ path: 'screenshots/02-after-controls-added.png' });
    
    // Check if multi-page preview toggle is now visible
    const multiPageToggle = page.locator('button').filter({ hasText: /Multi Page|Single Page/ });
    await expect(multiPageToggle).toBeVisible();
    
    console.log('✓ Multi-page preview toggle is now visible');
  });

  test('should show padding control', async ({ page }) => {
    // Check if padding control is visible
    const paddingControl = page.locator('input[type="range"]');
    await expect(paddingControl).toBeVisible();
    
    // Check if padding value is displayed
    const paddingValue = page.locator('span').filter({ hasText: /\d+px/ });
    await expect(paddingValue).toBeVisible();
    
    console.log('✓ Padding control is now visible');
  });

  test('should show export mode controls', async ({ page }) => {
    // Check if export mode segmented control is visible
    const modeControl = page.locator('text=Mode');
    await expect(modeControl).toBeVisible();
    
    // Check for mode options
    await expect(page.locator('button').filter({ hasText: 'Pages' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Long' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Square' })).toBeVisible();
    
    console.log('✓ Export mode controls are now visible');
  });

  test('should toggle multi-page preview', async ({ page }) => {
    const multiPageToggle = page.locator('button').filter({ hasText: /Multi Page|Single Page/ });
    
    // Initially should show "Multi Page" option
    await expect(multiPageToggle).toContainText('Multi Page');
    
    // Click to toggle
    await multiPageToggle.click();
    await page.waitForTimeout(500);
    
    // Should now show "Single Page" option
    await expect(multiPageToggle).toContainText('Single Page');
    
    console.log('✓ Multi-page preview toggle works');
  });

  test('should change padding value', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    
    // Get initial value
    const initialValue = await slider.getAttribute('value');
    console.log(`Initial padding: ${initialValue}px`);
    
    // Set new value
    await slider.fill('60');
    
    // Check if value display updates
    const paddingDisplay = page.locator('span').filter({ hasText: /60px/ });
    await expect(paddingDisplay).toBeVisible();
    
    console.log('✓ Padding control works');
  });

  test('should change export mode', async ({ page }) => {
    // Test switching to "Long" mode
    const longButton = page.locator('button').filter({ hasText: 'Long' });
    await longButton.click();
    await page.waitForTimeout(200);
    
    // Check if it becomes active
    await expect(longButton).toHaveClass(/active/);
    
    // Test switching to "Square" mode
    const squareButton = page.locator('button').filter({ hasText: 'Square' });
    await squareButton.click();
    await page.waitForTimeout(200);
    
    // Check if it becomes active
    await expect(squareButton).toHaveClass(/active/);
    
    console.log('✓ Export mode controls work');
  });
});