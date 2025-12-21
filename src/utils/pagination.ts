import { Theme } from "../types";

/**
 * Corresponds to the A4 aspect ratio for height calculation
 */
const A4_ASPECT_RATIO = 1.414;

/**
 * Corresponds to the square aspect ratio
 */
const SQUARE_ASPECT_RATIO = 1.0;

/**
 * Calculates dimensions based on export size
 */
const getDimensions = (
  exportSize: string,
): { width: number; height: number } => {
  const baseWidth = 800; // Base width for pagination calculations
  const width = baseWidth;
  const height =
    exportSize === "A4"
      ? Math.round(width * A4_ASPECT_RATIO)
      : Math.round(width * SQUARE_ASPECT_RATIO);
  return { width, height };
};

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
  exportSize: string,
  theme: Theme,
  renderedHtml: string,
): Promise<{
  iframe: HTMLIFrameElement;
  contentWrapper: HTMLElement;
  totalHeight: number;
  paddingTop: number;
}> => {
  const { width, height } = getDimensions(exportSize);

  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "absolute",
    left: "-9999px", // Position off-screen
    top: "-9999px",
    width: `${width}px`,
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
            }; background-color: ${theme.styles.backgroundColor}; }
            .content-wrapper { padding: ${
              theme.styles.containerPadding
            }; width: 100%; }
            h1, h2, h3 { font-family: ${theme.styles.headingFont}; color: ${
              theme.styles.textColor
            }; }
            img, svg { max-width: 100%; height: auto; display: block; }
            pre, code { white-space: pre-wrap; word-break: break-word; }
            pre { background: ${theme.styles.codeBackground}; color: ${
              theme.styles.textColor
            }; padding: 1.25em; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); overflow-x: auto; }
            code { background: rgba(0,0,0,0.08); color: ${
              theme.styles.accentColor
            }; padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.9em; }
            a { color: ${theme.styles.accentColor}; border-bottom: 1px solid ${
              theme.styles.accentColor
            }; text-decoration: none; }
            strong { color: ${theme.styles.accentColor}; font-weight: 700; }
            hr { border-color: ${theme.styles.textColor}; opacity: 0.15; }
            ul li::marker, ol li::marker { color: ${theme.styles.accentColor}; }
            ol { list-style-type: decimal; padding-left: 1.5em; }
            ul { list-style-type: disc; padding-left: 1.5em; }
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
 * @param exportSize - The target size format ('A4' or 'Square').
 * @param theme - The active theme.
 * @returns A promise that resolves to an array of HTML strings, each representing a page.
 */
export const paginateHtml = async (
  renderedHtml: string,
  exportSize: string,
  theme: Theme,
): Promise<string[]> => {
  let iframe: HTMLIFrameElement | null = null;

  try {
    const {
      iframe: measurementIframe,
      contentWrapper,
      totalHeight,
      paddingTop,
    } = await createMeasurementIframe(exportSize, theme, renderedHtml);
    iframe = measurementIframe;

    const { width, height } = getDimensions(exportSize);
    const usablePageHeight = height - paddingTop * 2;

    const pages: string[] = [];
    const fullContentHtml = contentWrapper.innerHTML;

    // Calculate number of pages based on content height
    let numPages = Math.ceil(totalHeight / usablePageHeight);
    
    // More robust check for extra pages: if the last page has very little content (less than 10% of page height),
    // and it's mostly empty, we should remove it unless it's substantial content
    if (numPages > 1) {
      const lastPageStartHeight = (numPages - 1) * usablePageHeight;
      const lastPageContentHeight = totalHeight - lastPageStartHeight;
      
      // If last page has less than 15% content or less than 50px, it's likely an artifact
      if (lastPageContentHeight < Math.min(usablePageHeight * 0.15, 50)) {
        numPages--;
      }
    }

    // Ensure at least one page for content that exists.
    if (totalHeight > 0 && numPages === 0) {
      numPages = 1;
    }

    // Verify that the content actually needs the calculated number of pages
    const actualContentHeight = numPages * usablePageHeight;
    if (numPages > 1 && totalHeight <= (numPages - 1) * usablePageHeight + 10) {
      // If content fits in one fewer page with 10px buffer, reduce page count
      numPages--;
    }

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
