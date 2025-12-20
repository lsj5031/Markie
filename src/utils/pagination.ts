import { Theme } from "../types";

/**
 * Creates a promise that resolves when an iframe has loaded and its content is ready.
 */
const iframeReady = (iframe: HTMLIFrameElement): Promise<void> =>
  new Promise((resolve) => {
    const checkReady = () => {
      // Check both document readyState and that the body has content.
      if (
        iframe.contentDocument?.readyState === "complete" &&
        iframe.contentDocument?.body?.scrollHeight > 0
      ) {
        resolve();
      } else {
        iframe.onload = () => resolve(); // Fallback to onload event
      }
    };
    iframe.addEventListener("load", checkReady);
  });

/**
 * Creates and prepares an iframe for content measurement.
 * It renders the full HTML content inside and waits for it to be ready.
 * @returns An object containing the iframe, the content wrapper, and calculated dimensions.
 */
const createMeasurementIframe = async (
  pageWidth: number,
  theme: Theme,
  renderedHtml: string,
): Promise<{
  iframe: HTMLIFrameElement;
  contentWrapper: HTMLElement;
  totalHeight: number;
  paddingTop: number;
}> => {
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "absolute",
    left: "-9999px", // Position off-screen
    top: "-9999px",
    width: `${pageWidth}px`,
    height: "auto", // Auto height to measure full scrollHeight
    border: "none",
  });

  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("Could not access iframe document.");

    // A modern CSS reset and basic styling for accurate measurement.
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            *, *::before, *::after { box-sizing: border-box; }
            body { margin: 0; font-family: ${theme.styles.fontFamily}; color: ${
              theme.styles.textColor
            }; }
            .content-wrapper { padding: ${
              theme.styles.containerPadding
            }; width: 100%; }
            h1, h2, h3 { font-family: ${theme.styles.headingFont}; }
            img, svg { max-width: 100%; height: auto; display: block; }
            pre, code { white-space: pre-wrap; word-break: break-word; }
          </style>
        </head>
        <body><div class="content-wrapper"></div></body>
      </html>
    `);
    doc.close();

    await iframeReady(iframe);

    const contentWrapper = doc.querySelector(".content-wrapper") as HTMLElement;
    if (!contentWrapper) throw new Error("Could not find content wrapper.");

    contentWrapper.innerHTML = renderedHtml;

    // Wait for all images to load, which can affect layout.
    await Promise.all(
      Array.from(contentWrapper.querySelectorAll("img")).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve(true);
            } else {
              img.onload = resolve;
              img.onerror = resolve; // Resolve even on error to not block pagination.
            }
          }),
      ),
    );

    // Allow a render tick for layout to settle after images load.
    await new Promise((res) => setTimeout(res, 50));

    const totalHeight = contentWrapper.scrollHeight;
    const paddingTop = parseFloat(
      doc.defaultView?.getComputedStyle(contentWrapper).paddingTop || "0",
    );

    return { iframe, contentWrapper, totalHeight, paddingTop };
  } catch (error) {
    document.body.removeChild(iframe); // Clean up on error.
    throw error;
  }
};

/**
 * Paginates HTML content into an array of page strings.
 * This method uses CSS transforms to "scroll" the content within a fixed-size container for each page.
 *
 * @param renderedHtml - The HTML string to paginate.
 * @param pageWidth - The width of the page.
 * @param pageHeight - The height of the page.
 * @param theme - The active theme.
 * @returns A promise that resolves to an array of HTML strings, each representing a page.
 */
export const paginateHtml = async (
  renderedHtml: string,
  pageWidth: number,
  pageHeight: number,
  theme: Theme,
): Promise<string[]> => {
  let iframe: HTMLIFrameElement | null = null;

  try {
    const {
      iframe: measurementIframe,
      contentWrapper,
      totalHeight,
      paddingTop,
    } = await createMeasurementIframe(pageWidth, theme, renderedHtml);
    iframe = measurementIframe;

    const usablePageHeight = pageHeight - paddingTop * 2;

    // If content fits on one page, no need to paginate.
    if (totalHeight <= usablePageHeight) {
      return [contentWrapper.innerHTML];
    }

    const pages: string[] = [];
    const fullContentHtml = contentWrapper.innerHTML;
    const numPages = Math.ceil(totalHeight / usablePageHeight);

    for (let i = 0; i < numPages; i++) {
      const yOffset = -(i * usablePageHeight);

      // Each page is a div that contains the *full* content,
      // but the content is shifted using a transform to show the correct "slice".
      const pageHtml = `
        <div style="width: 100%; height: 100%; overflow: hidden; position: relative;">
          <div style="position: absolute; width: 100%; transform: translateY(${yOffset}px);">
            ${fullContentHtml}
          </div>
        </div>
      `;
      pages.push(pageHtml);
    }

    console.log(`📊 Pagination complete: ${pages.length} pages created.`);
    return pages;
  } catch (error) {
    console.error("Pagination failed:", error);
    return [renderedHtml]; // Fallback to a single page on error.
  } finally {
    if (iframe) {
      document.body.removeChild(iframe);
    }
  }
};
