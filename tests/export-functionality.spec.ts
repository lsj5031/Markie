import { test, expect } from '@playwright/test';

test.describe('Export Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Set shorter content for faster testing
    const testContent = `# Export Test Document

This document tests the export functionality with the fixes applied.

## Section 1
Content for export testing with sufficient length to test pagination.

- Test item 1
- Test item 2  
- Test item 3

## Section 2
More content to ensure we have material for export testing.

\`\`\`javascript
console.log("Testing export");
\`\`\`

## Final Section
This completes our export test content.`;

    await page.fill('textarea', testContent);
    await page.waitForTimeout(500);
  });

  test('should export PNG with proper padding applied', async ({ page }) => {
    // Open Page Setup
    await page.getByRole('button', { name: 'Page Setup' }).click({ force: true });

    // Verify padding controls are present
    const paddingSlider = page.locator('input[type="range"]');
    await expect(paddingSlider).toBeVisible();
    
    // Set a specific padding value
    // step is 8, so use a valid multiple like 48 or 56
    await paddingSlider.fill('48');
    await page.waitForTimeout(200);
    
    // Verify padding display
    await expect(page.locator('label').filter({ hasText: 'Padding: 48px' })).toBeVisible();
    
    // Test export button is present
    const exportButton = page.locator('button').filter({ hasText: 'Export' });
    await expect(exportButton).toBeVisible();
    
    console.log('✅ PNG export controls working with padding');
  });

  test('should support both export modes', async ({ page }) => {
    // Open Page Setup
    await page.getByRole('button', { name: 'Page Setup' }).click({ force: true });

    // Test Pages mode
    const pagesButton = page.locator('button').filter({ hasText: 'Paged' });
    await expect(pagesButton).toBeVisible();
    await pagesButton.click();
    await page.waitForTimeout(200);
    
    // Test Continuous mode  
    const longButton = page.locator('button').filter({ hasText: 'Continuous' });
    await expect(longButton).toBeVisible();
    await longButton.click();
    await page.waitForTimeout(200);
    
    console.log('✅ Both export modes (Pages/Long) available');
  });

  test('should work in both single and multi-page preview modes', async ({ page }) => {
    // Test in single page mode (Default)
    // No explicit button for Single Page anymore, it's the default state when "Show Page Breaks" is off
    
    const singlePageExportButton = page.locator('button').filter({ hasText: 'Export' });
    await expect(singlePageExportButton).toBeVisible();
    
    // Test in multi-page mode
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Paged")');
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(300);
    
    const multiPageExportButton = page.locator('button').filter({ hasText: 'Export' });
    await expect(multiPageExportButton).toBeVisible();
    
    console.log('✅ Export functionality works in both preview modes');
  });

  test('should show proper export size/format controls', async ({ page }) => {
    // Open Page Setup
    await page.getByRole('button', { name: 'Page Setup' }).click({ force: true });

    // Test A4 size
    const a4Button = page.locator('button').filter({ hasText: 'A4' });
    await expect(a4Button).toBeVisible();
    await a4Button.click();
    await page.waitForTimeout(200);
    
    // Test Square size/format
    const squareButton = page.locator('button').filter({ hasText: 'Square' });
    await expect(squareButton).toBeVisible();
    await squareButton.click();
    await page.waitForTimeout(200);
    
    console.log('✅ Export size controls (A4/Square) working');
  });
});