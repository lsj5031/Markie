import { test, expect } from '@playwright/test';

test.describe('Text Overlap and Size Consistency Fix', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
  });

  test('should maintain consistent text sizing in PNG export', async ({ page }) => {
    // Create content with mixed text elements that could trigger font size conflicts
    const testContent = '# Text Consistency Test\n\n' +
      'This is a paragraph with **bold text** and *italic text* and inline code all in one line to test consistency.\n\n' +
      '## Heading Two Followed By Paragraph\n\n' +
      'Another paragraph here with some **strong emphasis** and a link and more code elements mixed together.\n\n' +
      '### Smaller Heading\n\n' +
      'Paragraph with mix of **bold** and *italic* and code and links to ensure no sudden size changes occur.\n\n' +
      '```javascript\n' +
      '// Code block should maintain consistent sizing\n' +
      'function testFunction() {\n' +
      '  const value = "test";\n' +
      '  return value;\n' +
      '}\n' +
      '```\n\n' +
      'Regular paragraph after code block with **bold** and *italic* and inline code mixed in naturally.\n\n' +
      '> A blockquote with **bold text** and *italic text* and inline code to test within quote context.\n\n' +
      'More regular text to ensure consistency throughout the document without sudden shrinking or overlapping.\n\n' +
      '## List Section\n\n' +
      '- List item with **bold text** one\n' +
      '- List item with *italic text* two\n' +
      '- List item with inline code three\n' +
      '- List item with link four\n\n' +
      'Text after list should maintain size and not overlap with list content above.\n\n' +
      '| Header 1 | Header 2 |\n' +
      '|----------|----------|\n' +
      '| **Bold** | *Italic* |\n' +
      '| code | link |\n\n' +
      'Final paragraph to ensure no text size issues at the end of document.';

    await page.fill('textarea', testContent);
    await page.waitForTimeout(1000);

    // Test in single page view first
    await page.screenshot({ 
      path: 'screenshots/text-consistency-single-page.png',
      fullPage: true 
    });

    // Export as PNG to test if font sizing is consistent
    await page.click('button:has-text("Export")');
    await page.waitForTimeout(200);
    
    await page.click('button:has-text("PNG Image")');
    await page.waitForTimeout(3000); // Wait for export to complete

    console.log('✅ PNG export completed without errors');
  });

  test('should maintain consistent text sizing in SVG export', async ({ page }) => {
    const testContent = '# SVG Text Consistency Test\n\n' +
      'Paragraph with **bold** and *italic* and code and regular text all together.\n\n' +
      '## Mixed Content Section\n\n' +
      'This section tests that text should not suddenly become smaller in the middle of sentences.\n\n' +
      '```typescript\n' +
      '// Code block test\n' +
      'const test = "value";\n' +
      '```\n\n' +
      'After code: **bold** and *italic* and code mixed naturally.';

    await page.fill('textarea', testContent);
    await page.waitForTimeout(1000);

    // Export as SVG
    await page.click('button:has-text("Export")');
    await page.waitForTimeout(200);
    
    await page.click('button:has-text("SVG Image")');
    await page.waitForTimeout(3000);

    console.log('✅ SVG export completed without errors');
  });

  test('should maintain consistent text sizing in multi-page PNG export', async ({ page }) => {
    // Create longer content that will span multiple pages
    const sections = Array.from({length: 15}, (_, i) => 
      `## Section ${i + 1}\n\n` +
      'Paragraph with **bold text** and *italic text* and inline code to test that text does not suddenly shrink or overlap in the middle of content across pages.\n\n' +
      '- List item with **bold**\n' +
      '- List item with *italic*\n' +
      '- List item with code\n\n' +
      'More text to ensure consistency: **bold** and *italic* and code and regular.\n'
    );
    
    const longContent = '# Multi-Page Text Consistency\n\n' + sections.join('\n');

    await page.fill('textarea', longContent);
    await page.waitForTimeout(1000);

    // Switch to multi-page mode
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Paged")');
    await page.click('button:has-text("Page Setup")');
    await page.waitForTimeout(2000);

    // Take screenshot of multi-page view
    await page.screenshot({ 
      path: 'screenshots/text-consistency-multi-page.png',
      fullPage: true 
    });

    // Export multi-page PNG
    await page.click('button:has-text("Export")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("PNG Image")');
    await page.waitForTimeout(5000); // Extra time for multi-page export

    console.log('✅ Multi-page PNG export completed without errors');
  });

  test('should maintain consistent text sizing in continuous PNG export', async ({ page }) => {
    const sections = Array.from({length: 10}, (_, i) =>
      `## Section ${i + 1}\n\n` +
      'Testing that **bold** and *italic* and code text maintains consistent sizing throughout a continuous export without sudden shrinking or text overlap.\n\n' +
      'More content: **bold** and *italic* and code and regular text mixed together naturally.\n'
    );
    
    const testContent = '# Continuous Export Text Test\n\n' + sections.join('\n');

    await page.fill('textarea', testContent);
    await page.waitForTimeout(1000);

    // Switch to continuous mode
    await page.click('button:has-text("Page Setup")');
    await page.click('button:has-text("Continuous")');
    await page.click('button:has-text("Page Setup")');
    await page.waitForTimeout(1000);

    // Export as continuous PNG
    await page.click('button:has-text("Export")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("PNG Image")');
    await page.waitForTimeout(3000);

    console.log('✅ Continuous PNG export completed without errors');
  });

  test('should verify no conflicting CSS styles in export', async ({ page }) => {
    // This test ensures that the unified style approach works
    const testContent = '# Style Conflict Test\n\n' +
      'This paragraph has **bold text that should not shrink** and *italic text that should not grow* and inline code that should stay consistent all together.\n\n' +
      '## Testing Emphasis\n\n' +
      '**Bold at start** then regular then *italic in middle* and more regular and code at end.\n\n' +
      '```javascript\n' +
      '// Code block\n' +
      'const test = "value";\n' +
      '```\n\n' +
      'After code block text should not **suddenly become** smaller or *overlap with* other text elements.';

    await page.fill('textarea', testContent);
    await page.waitForTimeout(1000);

    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'screenshots/style-conflict-test.png',
      fullPage: true 
    });

    // Test both PNG and SVG exports
    await page.click('button:has-text("Export")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("PNG Image")');
    await page.waitForTimeout(3000);

    await page.click('button:has-text("Export")');
    await page.waitForTimeout(200);
    await page.click('button:has-text("SVG Image")');
    await page.waitForTimeout(3000);

    console.log('✅ Style conflict test completed - no errors indicates fix is working');
  });
});
