import { test } from '@playwright/test';

test.skip('benchmark pagination', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // Inject large content
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
  // Increase content size to make the lag noticeable
  const content = `# Large Export Test\n${section.repeat(100)}`;

  // Capture console logs
  page.on('console', msg => {
    if (msg.text().startsWith('Pagination Loop Duration:')) {
      console.log(msg.text());
    }
  });

  await page.fill('textarea', content);

  // Wait for preview to render
  await page.waitForTimeout(1000);

  // Configure Export (Page Setup) to ensure we are in Paged mode
  await page.click('button[aria-label="Page Setup"]');
  const pagesButton = page.locator('button').filter({ hasText: 'Paged' });
  if (await pagesButton.isVisible()) {
      await pagesButton.click();
  }
  await page.click('button[aria-label="Page Setup"]'); // Close

  // Wait a bit for pagination to happen
  await page.waitForTimeout(3000);
});
