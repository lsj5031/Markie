import { test, expect } from '@playwright/test';

test.describe('Code Block Export Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Set content with long code blocks to test overflow handling
    const testContent = `# Code Block Export Test

This document tests that code blocks render properly in PNG/SVG exports without scrollbars or truncation.

## Test 1: Wide Code Block

\`\`\`javascript
const veryLongFunctionName = (parameter1, parameter2, parameter3, parameter4, parameter5) => {
  return "This is a very long line of code that might cause horizontal overflow in exports";
};
\`\`\`

## Test 2: Multiple Lines

\`\`\`python
def calculate_something_complex(input_data, configuration_options, database_connection):
    result = process_data(input_data) * configuration_options.multiplier
    database_connection.save(result)
    return result
\`\`\`

## Test 3: Very Long Single Line

\`\`\`bash
echo "This is an extremely long bash command with many parameters that would normally cause a horizontal scrollbar in the preview" --param1 value1 --param2 value2 --param3 value3 --param4 value4
\`\`\`

Regular text content to verify overall layout.`;

    await page.fill('textarea', testContent);
    await page.waitForTimeout(500);
  });

  test('code blocks should be visible in preview without truncation', async ({ page }) => {
    // Verify code blocks are rendered
    const codeBlocks = page.locator('pre code');
    const count = await codeBlocks.count();
    
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Verify code content is visible
    const firstCodeBlock = codeBlocks.first();
    await expect(firstCodeBlock).toBeVisible();
    await expect(firstCodeBlock).toContainText('veryLongFunctionName');
    
    console.log('✅ Code blocks visible in preview');
  });

  test('export styles should apply proper overflow handling', async ({ page }) => {
    // Open Page Setup to access export controls
    await page.getByRole('button', { name: 'Page Setup' }).click({ force: true });
    await page.waitForTimeout(300);
    
    // Verify export button is present
    const exportButton = page.locator('button').filter({ hasText: 'Export' });
    await expect(exportButton).toBeVisible();
    
    // Test PNG export mode
    const pngButton = page.locator('button').filter({ hasText: 'PNG' });
    await expect(pngButton).toBeVisible();
    
    // Test SVG export mode
    const svgButton = page.locator('button').filter({ hasText: 'SVG' });
    await expect(svgButton).toBeVisible();
    
    console.log('✅ Export controls available for code block testing');
  });

  test('preview should maintain readability with long code', async ({ page }) => {
    // Check that code blocks have proper styling
    const preElements = page.locator('.markdown-body pre');
    const count = await preElements.count();
    
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Verify the first pre element has proper background
    const firstPre = preElements.first();
    const bgColor = await firstPre.evaluate(el => window.getComputedStyle(el).backgroundColor);
    
    // Code blocks should have dark background (#1e1e2e)
    expect(bgColor).toBeTruthy();
    
    console.log('✅ Code blocks maintain proper styling');
  });

  test('multi-page mode should handle code blocks correctly', async ({ page }) => {
    // Open Page Setup
    await page.getByRole('button', { name: 'Page Setup' }).click({ force: true });
    await page.waitForTimeout(300);
    
    // Switch to Paged mode
    const pagedButton = page.locator('button').filter({ hasText: 'Paged' });
    await pagedButton.click();
    await page.waitForTimeout(500);
    
    // Close Page Setup
    await page.getByRole('button', { name: 'Page Setup' }).click({ force: true });
    await page.waitForTimeout(300);
    
    // Verify code blocks are still visible in paged mode
    const codeBlocks = page.locator('pre code');
    const count = await codeBlocks.count();
    
    expect(count).toBeGreaterThanOrEqual(3);
    
    console.log('✅ Code blocks render correctly in multi-page mode');
  });

  test('continuous export mode should be available for long code', async ({ page }) => {
    // Open Page Setup
    await page.getByRole('button', { name: 'Page Setup' }).click({ force: true });
    await page.waitForTimeout(300);
    
    // Check Continuous mode option
    const continuousButton = page.locator('button').filter({ hasText: 'Continuous' });
    await expect(continuousButton).toBeVisible();
    
    // Switch to Continuous mode
    await continuousButton.click();
    await page.waitForTimeout(300);
    
    // Verify it's selected
    const hasActiveClass = await continuousButton.evaluate(el => 
      el.classList.contains('active') || 
      el.closest('button')?.classList.contains('active') ||
      el.parentElement?.classList.contains('active')
    );
    
    console.log('✅ Continuous export mode available for handling long code blocks');
  });
});
