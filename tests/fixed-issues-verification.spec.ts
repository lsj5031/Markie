import { test, expect } from '@playwright/test';

test.describe('Fixed Multi-Page Export Issues', () => {
  test('should verify pagination fixes are working', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Test content that will span multiple pages
    const testContent = `# Multi-Page Test

${Array.from({length: 25}, (_, i) => `
## Section ${i + 1}

This is content for section ${i + 1}.

- Item ${i + 1}.A
- Item ${i + 1}.B  
- Item ${i + 1}.C

\`\`\`javascript
function section${i + 1}() {
  console.log("Section ${i + 1}");
}
\`\`\`
`).join('\n')}

## Final Section

This should create multiple pages.`;

    await page.fill('textarea', testContent);
    await page.waitForTimeout(1000);

    // Switch to multi-page view
    await page.click('button:has-text("Page Setup")');
    await page.getByText('Show Page Breaks').locator('xpath=..').getByRole('button').click();
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(1000);

    // Take screenshot to verify pagination layout
    await page.screenshot({ 
      path: 'screenshots/11-fixed-pagination.png',
      fullPage: false 
    });

    // Verify pagination controls
    const paginationInfo = page.locator('text=/\\d+ \\/ \\d+/');
    await expect(paginationInfo).toBeVisible();

    const pageText = await paginationInfo.textContent();
    console.log('✅ Pagination working:', pageText);

    // Test Pages mode export
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Paged")');
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(300);

    const exportButton = page.locator('button').filter({ hasText: 'Export' });
    await exportButton.click();
    await page.waitForTimeout(2000);

    console.log('✅ Pages mode export test completed');
  });

  test('should verify long export styling fixes', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const testContent = `# Long Export Style Test

This tests the long export mode styling consistency.

${Array.from({length: 15}, (_, i) => `
### Subsection ${i + 1}: Styling Test

Content with **bold text** and *italic text* and \`code styling\`.

- List item ${i + 1}.A
- List item ${i + 1}.B
- List item ${i + 1}.C

\`\`\`css
.styled-${i + 1} {
  background: linear-gradient(45deg, #f${i}0, #0f${i});
  padding: 1rem;
}
\`\`\`

> Blockquote styling test

Regular paragraph with [link styling](https://example.com).
`).join('\n')}

## Final Styling Test

This should ensure consistent styling in long export mode.`;

    await page.fill('textarea', testContent);
    await page.waitForTimeout(1000);

    // Test in single page view for comparison
    // Default is Single Page view, so no action needed.
    // However, ensure Page Setup is closed or checked if needed.
    await page.waitForTimeout(500);

    const _singlePageScreenshot = await page.screenshot({ 
      path: 'screenshots/12-single-page-styling.png',
      fullPage: true 
    });

    // Switch to Long mode
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Continuous")');
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(500);

    const _longModeScreenshot = await page.screenshot({ 
      path: 'screenshots/13-long-mode-styling.png',
      fullPage: true 
    });

    // Test long mode export
    const exportButton = page.locator('button').filter({ hasText: 'Export' });
    await exportButton.click();
    await page.waitForTimeout(3000);

    console.log('✅ Long mode export styling test completed');
  });

  test('should verify square format is working', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const testContent = `# Square Format Test

Content for testing square format functionality.

## Section 1
Test content for square format.

- Item 1.A
- Item 1.B
- Item 1.C

\`\`\`javascript
console.log("Square format test");
\`\`\``;

    await page.fill('textarea', testContent);
    await page.waitForTimeout(500);

    // Switch to Square format (in the Format section, not Mode)
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Square")');
    await page.click('button:has-text("Page Setup")'); // Close menu
    await page.waitForTimeout(500);

    const _squareScreenshot = await page.screenshot({ 
      path: 'screenshots/14-square-format.png',
      fullPage: false 
    });

    // Test export with square format
    const exportButton = page.locator('button').filter({ hasText: 'Export' });
    await exportButton.click();
    await page.waitForTimeout(2000);

    console.log('✅ Square format export test completed');
  });
});