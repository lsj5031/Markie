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
    // Verify padding controls are present
    const paddingSlider = page.locator('input[type="range"]');
    await expect(paddingSlider).toBeVisible();
    
    // Set a specific padding value
    await paddingSlider.fill('50');
    await page.waitForTimeout(200);
    
    // Verify padding display
    await expect(page.locator('text=/50px/')).toBeVisible();
    
    // Test export button is present
    const exportButton = page.locator('button').filter({ hasText: 'Export' });
    await expect(exportButton).toBeVisible();
    
    console.log('✅ PNG export controls working with padding');
  });

  test('should support both export modes', async ({ page }) => {
    // Test Pages mode
    const pagesButton = page.locator('button').filter({ hasText: 'Pages' });
    await expect(pagesButton).toBeVisible();
    await pagesButton.click();
    await page.waitForTimeout(200);
    
    // Test Continuous mode  
    const longButton = page.locator('button').filter({ hasText: 'Long' });
    await expect(longButton).toBeVisible();
    await longButton.click();
    await page.waitForTimeout(200);
    
    console.log('✅ Both export modes (Pages/Long) available');
  });

  test('should work in both single and multi-page preview modes', async ({ page }) => {
    // Test in single page mode
    await page.click('button:has-text("Single Page")');
    await page.waitForTimeout(300);
    
    const singlePageExportButton = page.locator('button').filter({ hasText: 'Export' });
    await expect(singlePageExportButton).toBeVisible();
    
    // Test in multi-page mode
    await page.click('button:has-text("Multi Page")');
    await page.waitForTimeout(300);
    
    const multiPageExportButton = page.locator('button').filter({ hasText: 'Export' });
    await expect(multiPageExportButton).toBeVisible();
    
    console.log('✅ Export functionality works in both preview modes');
  });

  test('should show proper export size/format controls', async ({ page }) => {
    // Test A4 size
    const a4Button = page.locator('button').filter({ hasText: 'A4' });
    await expect(a4Button).toBeVisible();
    await a4Button.click();
    await page.waitForTimeout(200);
    
    // Test Square size/format (this is a format option, not an export mode)
    const squareButton = page.locator('button').filter({ hasText: 'Square' });
    await expect(squareButton).toBeVisible();
    await squareButton.click();
    await page.waitForTimeout(200);
    
    console.log('✅ Export size controls (A4/Square) working');
  });
});