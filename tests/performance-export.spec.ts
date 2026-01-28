import { test, expect } from '@playwright/test';

test.describe('Performance Benchmark: Multi-page Export', () => {
  test('should measure export time and download intervals', async ({ page }) => {
    // 1. Navigate to the app
    await page.goto('/');

    // 2. Inject large content to ensure multiple pages
    // Generating enough content for ~5-10 pages
    const section = `
## Section
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

* Item 1
* Item 2
* Item 3

> This is a blockquote to take up some vertical space.

\`\`\`javascript
// Code block to take up space
function hello() {
  console.log("world");
  return true;
}
\`\`\`

`;
    const content = `# Large Export Test\n${section.repeat(20)}`;

    await page.fill('textarea', content);

    // Wait for preview to render
    await page.waitForTimeout(2000);

    // 3. Configure Export (Page Setup)
    await page.click('button[aria-label="Page Setup"]');

    // Ensure "Paged" is selected
    const pagesButton = page.locator('button').filter({ hasText: 'Paged' });
    if (await pagesButton.isVisible()) {
        await pagesButton.click();
    }

    // Ensure "A4" is selected
    const a4Button = page.locator('button').filter({ hasText: 'A4' });
    if (await a4Button.isVisible()) {
        await a4Button.click();
    }

    // Close Page Setup
    await page.click('button[aria-label="Page Setup"]'); // Toggle off
    await page.waitForTimeout(500);

    // 4. Setup Download Listener
    const downloads: number[] = [];
    page.on('download', (download) => {
      const now = Date.now();
      downloads.push(now);
      console.log(`Download started at: ${now}`);
    });

    // 5. Trigger Export
    await page.click('button[aria-label="Export"]');
    await page.click('text=PNG Image');

    console.log('Export triggered...');

    // 6. Wait for downloads
    // We expect multiple downloads. We'll wait until we have at least 2, and then wait for a timeout of no new downloads.
    // Given the delay is 500ms, and we expect maybe 5-10 pages.

    const startTime = Date.now();

    // Wait loop
    let lastCount = 0;
    let noChangeCount = 0;

    for (let i = 0; i < 30; i++) { // Max wait ~30 seconds
      await page.waitForTimeout(1000);
      if (downloads.length > 0 && downloads.length === lastCount) {
        noChangeCount++;
        if (noChangeCount >= 3) break; // Stop if no new downloads for 3 seconds
      } else {
        noChangeCount = 0;
      }
      lastCount = downloads.length;
      console.log(`Downloads so far: ${downloads.length}`);
    }

    const endTime = Date.now();

    console.log(`Total downloads: ${downloads.length}`);
    console.log(`Total duration (test wall time): ${endTime - startTime}ms`);

    // Calculate intervals
    if (downloads.length > 1) {
      const intervals: number[] = [];
      for (let i = 1; i < downloads.length; i++) {
        intervals.push(downloads[i] - downloads[i-1]);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const minInterval = Math.min(...intervals);
      const maxInterval = Math.max(...intervals);

      console.log(`Intervals: ${intervals.join(', ')}`);
      console.log(`Average Interval: ${avgInterval.toFixed(2)}ms`);
      console.log(`Min Interval: ${minInterval}ms`);
      console.log(`Max Interval: ${maxInterval}ms`);

      // Assertion for baseline (checking if delay is present)
      // If delay is 500ms, intervals should be > 500ms (rendering time + 500ms)
      // We log this for the report.
    } else {
      console.log('Not enough downloads to calculate intervals.');
    }
  });
});
