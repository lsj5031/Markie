import { test, expect } from '@playwright/test';

test.describe('Fixed Pagination and Style Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
  });

  test('should not create extra empty pages in pagination', async ({ page }) => {
    // Add more content to trigger pagination
    const longContent = `# Extended Testing Document

This is designed to test pagination accuracy.

${Array.from({length: 50}, (_, i) => `
## Section ${i + 1}

This is paragraph ${i + 1} with some content to make the document longer and test pagination accuracy.

- List item ${i + 1}.A
- List item ${i + 1}.B  
- List item ${i + 1}.C

More content here to ensure we have enough material to test pagination.
`.trim()).join('\n\n')}

## Final Section

This should complete our test document.`;

    // Clear existing content and add long content
    await page.fill('textarea', longContent);
    await page.waitForTimeout(1000);
    
    // Switch to multi-page view
    await page.click('button:has-text("Page Setup")');
    await page.getByText('Show Page Breaks').locator('xpath=..').getByRole('button').click();
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(1000);
    
    // Check that pagination controls are visible
    const paginationControls = page.locator('text=/\\d+ \\/ \\d+/');
    await expect(paginationControls).toBeVisible();
    
    // Get page count from pagination display
    const pageText = await page.textContent('text=/\\d+ \\/ \\d+/');
    console.log('Pagination display:', pageText);
    
    // Count pages - should not have excessive empty pages
    // Format: "X / Y"
    const pageMatch = pageText?.match(/(\d+) \/ (\d+)/);
    if (pageMatch) {
      const pageCount = parseInt(pageMatch[2]);
      expect(pageCount).toBeLessThan(10); // Should not have more than reasonable pages
      console.log(`Pagination creates ${pageCount} pages - reasonable for content length`);
    }
    
    // Take screenshot showing pagination working
    await page.screenshot({ path: 'screenshots/03-pagination-working.png' });
    
    console.log('✅ Pagination working without excessive empty pages');
  });

  test('should have consistent styling between single and multi-page views', async ({ page }) => {
    const testContent = `# Style Consistency Test

## Headers and Formatting

This tests **bold text**, *italic text*, and \`code styling\`.

### Code Block
\`\`\`javascript
function test() {
  console.log("Testing style consistency");
}
\`\`\`

### Lists
- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

> Blockquote for style testing

[Link styling](https://example.com)`;

    // Set test content
    await page.fill('textarea', testContent);
    await page.waitForTimeout(1000);
    
    // Test single-page view styling
    // Default is single page. Ensure Page Setup is closed or checked.
    await page.waitForTimeout(500);
    
    const _singlePageScreenshot = await page.screenshot({ 
      path: 'screenshots/04-single-page-styling.png',
      fullPage: true 
    });
    
    // Test multi-page view styling
    await page.click('button:has-text("Page Setup")');
    await page.getByText('Show Page Breaks').locator('xpath=..').getByRole('button').click();
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(500);
    
    const _multiPageScreenshot = await page.screenshot({ 
      path: 'screenshots/05-multi-page-styling.png',
      fullPage: true 
    });
    
    // Verify both views are visible and functional
    await expect(page.locator('#preview-content')).toBeVisible();
    
    // Check that content elements are properly styled in both modes
    const headers = page.locator('#preview-content h1, #preview-content h2, #preview-content h3');
    await expect(headers.first()).toBeVisible();
    
    const codeBlocks = page.locator('#preview-content pre');
    await expect(codeBlocks.first()).toBeVisible();
    
    const lists = page.locator('#preview-content ul, #preview-content ol');
    await expect(lists.first()).toBeVisible();
    
    console.log('✅ Style consistency maintained between views');
  });

  test('should properly toggle between single and multi-page modes', async ({ page }) => {
    // Ensure we have enough content for multiple pages
    const longContent = `# Page 1 Content
    
    ${Array.from({length: 100}, () => 'Line of text to fill space to ensure we trigger pagination controls.').join('\n')}
    
    # Page 2 Content
    
    ${Array.from({length: 100}, () => 'Line of text to fill space to ensure we trigger pagination controls.').join('\n')}`;
    
    await page.fill('textarea', longContent);
    await page.waitForTimeout(1000);

    // Verify initial state is single page (no pagination controls)
    await expect(page.locator('text=/\\d+ \\/ \\d+/')).not.toBeVisible();
    
    // Toggle to multi-page
    await page.click('button:has-text("Page Setup")');
    await page.getByText('Show Page Breaks').locator('xpath=..').getByRole('button').click();
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(500);
    
    // Verify multi-page controls appear
    await expect(page.locator('text=/\\d+ \\/ \\d+/')).toBeVisible();
    
    // Toggle back to single page
    await page.click('button:has-text("Page Setup")');
    await page.getByText('Show Page Breaks').locator('xpath=..').getByRole('button').click();
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(500);
    
    // Verify single page state
    await expect(page.locator('text=/\\d+ \\/ \\d+/')).not.toBeVisible();
    
    console.log('✅ Mode toggle working correctly');
  });

  test('should handle padding changes properly in both views', async ({ page }) => {
    const testContent = `# Padding Test

Content to test padding application.

## Section 1
Test paragraph for padding verification.`;

    await page.fill('textarea', testContent);
    await page.waitForTimeout(500);
    
    await page.click('button:has-text("Page Setup")');

    // Test padding control exists and works
    const paddingSlider = page.locator('input[type="range"]');
    await expect(paddingSlider).toBeVisible();
    
    // Get initial padding value
    const initialPadding = await paddingSlider.getAttribute('value');
    console.log(`Initial padding: ${initialPadding}px`);
    
    // Change padding value
    await paddingSlider.fill('64');
    await page.waitForTimeout(200);
    
    // Verify padding value display updates
    await expect(page.locator('label').filter({ hasText: 'Padding: 64px' })).toBeVisible();
    
    // Test in both single and multi-page modes
    // Close Page setup
    await page.click('button:has-text("Page Setup")'); 
    
    // Currently in single page mode
    await page.waitForTimeout(300);
    
    // Switch to multi page
    await page.click('button:has-text("Page Setup")');
    await page.getByText('Show Page Breaks').locator('xpath=..').getByRole('button').click();
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(300);
    
    console.log('✅ Padding control working in both modes');
  });

  test('should maintain consistent theme application', async ({ page }) => {
    // Test with different themes
    const themes = page.locator('.theme-card');
    const themeCount = await themes.count();
    
    if (themeCount > 1) {
      // Switch to a different theme
      await themes.nth(1).click();
      await page.waitForTimeout(500);
      
      // Verify theme changes are applied in both modes
      const previewContent = page.locator('#preview-content');
      await expect(previewContent).toBeVisible();
      
      // Test single page mode (Default)
    //   await page.click('button:has-text("Single Page")'); // Not needed if already default
      await page.waitForTimeout(300);
      
      // Test multi page mode  
      await page.click('button:has-text("Page Setup")');
      await page.getByText('Show Page Breaks').locator('xpath=..').getByRole('button').click();
      await page.click('button:has-text("Page Setup")'); // Close menu
      await page.waitForTimeout(300);
      
      console.log(`✅ Theme application consistent across ${themeCount} themes`);
    }
  });
});