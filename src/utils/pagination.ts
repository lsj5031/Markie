import { Theme } from "../types";
import { getThemeStyles } from "./themeHelpers";

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
 * Exported for use in preview canvas to ensure WYSIWYG consistency
 */
export const getDimensions = (
  exportSize: string,
): { width: number; height: number } => {
  const baseWidth = 794; // Match export dimensions (A4 @ 96 DPI)
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
 * @param exportSize - The target size format ('A4' or 'Square').
 * @param theme - The active theme.
 * @param renderedHtml - The HTML content to measure.
 * @param padding - Explicit padding in pixels for the content container.
 * @returns An object containing the iframe, the content wrapper, and calculated dimensions.
 */
const createMeasurementIframe = async (
  exportSize: string,
  theme: Theme,
  renderedHtml: string,
  padding: number,
): Promise<{
  iframe: HTMLIFrameElement;
  contentWrapper: HTMLElement;
  totalHeight: number;
  paddingTop: number;
}> => {
  const styles = getThemeStyles(theme);
  const { width: _width } = getDimensions(exportSize);

  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "absolute",
    left: "-9999px", // Position off-screen
    top: "-9999px",
    width: `${_width}px`,
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
            body { margin: 0; font-family: ${styles.fontFamily}; color: ${styles.textColor}; background-color: ${styles.backgroundColor}; }
            .content-wrapper { padding: ${padding}px; width: 100%; }
            h1, h2, h3, h4, h5, h6 { font-family: ${styles.headingFont}; color: ${styles.accentColor}; }
            img, svg { max-width: 100%; height: auto; display: block; }
            pre, code { white-space: pre-wrap; word-break: break-word; }
            pre { background: ${styles.codeBackground}; color: ${styles.textColor}; padding: 1.25em; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); overflow-x: auto; }
            code { background: rgba(0,0,0,0.08); color: ${styles.accentColor}; padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.9em; }
            a { color: ${styles.accentColor}; border-bottom: 1px solid ${styles.accentColor}; text-decoration: none; }
            strong { color: ${styles.accentColor}; font-weight: 700; }
            hr { border-color: ${styles.textColor}; opacity: 0.15; }
            ul li::marker, ol li::marker { color: ${styles.accentColor}; }
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

interface NodeMetrics {
  height: number;
  marginTop: number;
  marginBottom: number;
  outerHTML: string;
}

/**
 * Paginates HTML content into an array of page strings.
 * This method uses CSS transforms to "scroll" the content within a fixed-size container for each page.
 *
 * @param renderedHtml - The HTML string to paginate.
 * @param exportSize - The target size format ('A4' or 'Square').
 * @param theme - The active theme.
 * @param padding - Explicit padding in pixels (optional, defaults to 40).
 * @returns A promise that resolves to an array of HTML strings, each representing a page.
 */
export const paginateHtml = async (
  renderedHtml: string,
  exportSize: string,
  theme: Theme,
  padding: number = 40,
): Promise<string[]> => {
  let iframe: HTMLIFrameElement | null = null;

  try {
    const {
      iframe: measurementIframe,
      contentWrapper,
    } = await createMeasurementIframe(exportSize, theme, renderedHtml, padding);
    iframe = measurementIframe;

    const { height: pageHeight } = getDimensions(exportSize);

    // 1. Measure Phase: Get metrics for all children
    const children = Array.from(contentWrapper.children) as HTMLElement[];
    const nodeMetrics: NodeMetrics[] = children.map((node) => {
      const style = window.getComputedStyle(node);
      return {
        height: node.offsetHeight,
        marginTop: parseFloat(style.marginTop) || 0,
        marginBottom: parseFloat(style.marginBottom) || 0,
        outerHTML: node.outerHTML,
      };
    });

    // 2. Calculation Phase: Group nodes into pages
    const pagesNodes: string[][] = [];
    let currentPageNodes: string[] = [];
    
    const wrapperPaddingTop = padding;
    const wrapperPaddingBottom = padding;
    
    let currentY = wrapperPaddingTop;
    let prevMarginBottom = 0;

    for (let i = 0; i < nodeMetrics.length; i++) {
      const node = nodeMetrics[i];
      const isFirstOnPage = currentPageNodes.length === 0;

      let addedHeight = 0;
      let effectiveMargin = 0;
      
      if (isFirstOnPage) {
        // First element on page: Top margin doesn't collapse with container padding
        effectiveMargin = node.marginTop;
      } else {
        // Siblings: Margins collapse
        effectiveMargin = Math.max(prevMarginBottom, node.marginTop);
      }

      addedHeight = effectiveMargin + node.height;

      // Calculate potential total height if we add this node.
      // We do NOT include the bottom margin of the current node in the check.
      // If the node fits but its bottom margin overflows, it's just whitespace at the bottom of the page,
      // which is acceptable (and matches how the browser's scrollHeight often behaves with overflow:visible or how we want to pack content).
      const projectedHeight = currentY + addedHeight + wrapperPaddingBottom;

      // Check if we need to break page
      // Note: If it's the first element on the page, we allow it even if it overflows
      // to avoid infinite loops (same as original logic).
      // We use a small tolerance (1px) because scrollHeight is an integer and might round down
      // slightly differently than our float calculation.
      if (!isFirstOnPage && projectedHeight > pageHeight + 1) {
        // Finish current page
        pagesNodes.push(currentPageNodes);
        currentPageNodes = [];

        // Start new page with this node
        // Reset Y to top padding
        currentY = wrapperPaddingTop;

        // Recalculate metrics for being first on new page
        effectiveMargin = node.marginTop;
        addedHeight = effectiveMargin + node.height;

        currentPageNodes.push(node.outerHTML);
        currentY += addedHeight;
        prevMarginBottom = node.marginBottom;
      } else {
        // Add to current page
        currentPageNodes.push(node.outerHTML);
        currentY += addedHeight;
        prevMarginBottom = node.marginBottom;
      }
    }

    // Push any remaining content as the final page
    if (currentPageNodes.length > 0) {
      pagesNodes.push(currentPageNodes);
    }

    // 3. Render Phase: Create HTML strings
    const pages = pagesNodes.map(nodes => nodes.join(''));

    console.log(`📊 Smart Pagination complete: ${pages.length} pages created.`);
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
