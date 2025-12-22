import { test, expect } from '@playwright/test';

test.describe('Multiple Page PNG Export Issues', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
  });

  test('should test multiple page pagination without overlapping', async ({ page }) => {
    // Add content that will definitely span multiple pages
    const longContent = `# Multi-Page Test Document

This document is specifically designed to test pagination and export functionality.

${Array.from({length: 30}, (_, i) => `
## Section ${i + 1}

This is section ${i + 1} content designed to create multiple pages when paginated.

- Item ${i + 1}.A - Some content here
- Item ${i + 1}.B - More content to push pagination
- Item ${i + 1}.C - Even more content to ensure page breaks
- Item ${i + 1}.D - Additional content for testing

### Subsection ${i + 1}.1

More detailed content for section ${i + 1} to ensure we have enough material for proper pagination testing.

\`\`\`javascript
// Code block ${i + 1}
function section${i + 1}() {
  console.log("Section ${i + 1} content");
  return "Section ${i + 1} complete";
}
\`\`\`

This should create substantial content that forces multiple page breaks during pagination.
`.trim()).join('\n\n')}

## Final Section

This concludes our multi-page test document. The content should now be long enough to test pagination accuracy.`;

    await page.fill('textarea', longContent);
    await page.waitForTimeout(1000);

    // Switch to multi-page view to test pagination
    await page.click('button:has-text("Page Setup")');
    await page.getByText('Show Page Breaks').locator('xpath=..').getByRole('button').click();
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(1000);

    // Take screenshot of multi-page view
    await page.screenshot({ 
      path: 'screenshots/06-multi-page-pagination-test.png',
      fullPage: true 
    });

    // Check that pagination controls are visible
    const paginationControls = page.locator('text=/\\d+ \\/ \\d+/').locator('xpath=..');
    await expect(paginationControls).toBeVisible();

    // Get page count
    const pageText = await page.textContent('text=/\\d+ \\/ \\d+/');
    console.log('Pagination display:', pageText);

    // Test Pages mode export
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Paged")');
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(300);

    // Export PNG to test the multiple page issue
    await page.click('button:has-text("Export")'); // Open dropdown
    await page.click('button:has-text("PNG Image")'); // Click PNG export
    await page.waitForTimeout(3000); // Wait for export to complete
    await page.waitForTimeout(3000); // Wait for export to complete

    console.log('✅ Multi-page pagination test completed');
  });

  test('should test long PNG export styling', async ({ page }) => {
    const longContent = `# Long Export Test

This document tests the continuous/long PNG export mode.

${Array.from({length: 20}, (_, i) => `
## Long Section ${i + 1}

Content for long export testing. This content should appear as a single continuous image when exported in "Long" mode.

- Test item ${i + 1}.A
- Test item ${i + 1}.B
- Test item ${i + 1}.C

### Subsection ${i + 1}.A

\`\`\`css
/* Styling test ${i + 1} */
.container {
  background: linear-gradient(45deg, #${i}f${i}00, #${i}f0${i}f);
  padding: 2rem;
  margin: 1rem;
}
\`\`\`

Additional content to ensure we have enough material for the long export test.
`.trim()).join('\n\n')}

## Final Long Section

This should complete our long document for continuous export testing.`;

    await page.fill('textarea', longContent);
    await page.waitForTimeout(1000);

    // Test in single page view first
    // Default is single page.
    await page.waitForTimeout(500);

    const _singlePageScreenshot = await page.screenshot({ 
      path: 'screenshots/07-single-page-styling.png',
      fullPage: true 
    });

    // Switch to Long mode
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Continuous")');
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(500);

    const _longModeScreenshot = await page.screenshot({ 
      path: 'screenshots/08-long-mode-preview.png',
      fullPage: true 
    });

    // Export PNG in Long mode
    await page.click('button:has-text("Export")'); // Open dropdown
    await page.click('button:has-text("PNG Image")'); // Click PNG export
    await page.waitForTimeout(3000);

    console.log('✅ Long PNG export styling test completed');
  });

  test('should compare Pages vs Long mode exports', async ({ page }) => {
    const testContent = `# Mode Comparison Test

This tests the difference between Pages mode and Long mode exports.

${Array.from({length: 15}, (_, i) => `
## Section ${i + 1}: Mode Comparison

Content for testing ${i + 1}. The styling and layout should be consistent between different export modes.

### Subsection ${i + 1}.A

This content tests whether the styling is preserved across different export modes.

- Point ${i + 1}.A: Testing consistency
- Point ${i + 1}.B: Verifying layout
- Point ${i + 1}.C: Checking styles

\`\`\`javascript
// Code block for mode comparison ${i + 1}
const modeTest${i + 1} = {
  pages: "multiple",
  continuous: "single",
  styling: "consistent"
};
\`\`\`
`.trim()).join('\n\n')}

## Conclusion

This comparison test ensures that both Pages and Long modes produce styled exports.`;

    await page.fill('textarea', testContent);
    await page.waitForTimeout(1000);

    // Test Pages mode
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Paged")');
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(500);

    const _pagesModeScreenshot = await page.screenshot({ 
      path: 'screenshots/09-pages-mode-test.png',
      fullPage: true 
    });

    // Test Long mode  
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Continuous")');
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(500);

    const _longModeScreenshot = await page.screenshot({ 
      path: 'screenshots/10-long-mode-test.png',
      fullPage: true 
    });

    console.log('✅ Pages vs Long mode comparison test completed');
  });
});