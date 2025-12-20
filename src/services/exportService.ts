import * as htmlToImage from "html-to-image";
import { ExportFormat, ExportSize } from "../types";

interface PageContent {
  container: HTMLElement;
  content: HTMLElement;
}

/**
 * Splits markdown content into pages based on export size.
 * Attempts to paginate content at logical breakpoints.
 */
const paginateContent = (
  originalContent: HTMLElement,
  size: ExportSize,
): PageContent[] => {
  console.log(`📄 Starting pagination for ${size} format`);
  const pages: PageContent[] = [];

  // Get all top-level markdown elements
  const elements = originalContent.children;
  if (elements.length === 0) {
    return [
      {
        container: originalContent.cloneNode(true) as HTMLElement,
        content: originalContent.cloneNode(true) as HTMLElement,
      },
    ];
  }

  // Use more realistic page dimensions based on actual preview canvas
  const pageHeight = size === "A4" ? 1200 : 800; // More conservative page heights
  const pageWidth = 800; // Match preview canvas width

  // Calculate usable content area after padding
  const originalPadding =
    getComputedStyle(originalContent).getPropertyValue("--theme-padding") ||
    "4rem";
  const paddingValue = parseInt(originalPadding, 10) || 64; // Default to 4rem (64px)
  const usablePageHeight = pageHeight - (paddingValue * 2);

  console.log(`📏 Page dimensions: ${pageWidth}x${pageHeight}, usable: ${pageWidth}x${usablePageHeight}`);

  // Create a temporary container to measure element heights
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "fixed";
  tempContainer.style.left = "0";
  tempContainer.style.top = "0";
  tempContainer.style.visibility = "visible";
  tempContainer.style.zIndex = "-9999";
  tempContainer.style.width = `${pageWidth}px`; // Same width as export
  tempContainer.style.boxSizing = "border-box";
  tempContainer.style.padding = originalPadding; // Match export padding
  document.body.appendChild(tempContainer);
  const pageBreakTags = new Set(["H1", "H2", "H3", "H4", "H5", "HR"]);
  let currentPageElements: Element[] = [];
  let currentPageHeight = 0;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const tagName = element.tagName;

    // Measure the height of this element
    tempContainer.innerHTML = element.outerHTML;
    const elementHeight = tempContainer.offsetHeight;

    // Check if adding this element would exceed usable page height
    const wouldExceedPage = currentPageHeight + elementHeight > usablePageHeight;

    // Much simpler logic - pack as much as possible
    // Only break for H1 headings when we have content already, or if we must due to space
    const shouldBreak = (tagName === "H1" && currentPageElements.length > 0) || (wouldExceedPage && currentPageElements.length > 0);

    // Handle large elements that can span pages
    const isLargeElement = elementHeight > usablePageHeight;

    if (isLargeElement) {
      // Add large element to current page even if it exceeds height
      currentPageElements.push(element);
      currentPageHeight += elementHeight;
    } else if (shouldBreak) {
      // Create new page with current elements
      const pageDiv = document.createElement("div");
      pageDiv.className = originalContent.className;
      pageDiv.style.cssText = originalContent.style.cssText;
      pageDiv.innerHTML = currentPageElements
        .map((el) => el.outerHTML)
        .join("");

      pages.push({
        container: pageDiv,
        content: pageDiv,
      });

      // Start new page with current element
      currentPageElements = [element];
      currentPageHeight = elementHeight;
    } else {
      // Add to current page
      currentPageElements.push(element);
      currentPageHeight += elementHeight;
    }
  }

  // Add remaining elements as final page
  if (currentPageElements.length > 0) {
    const pageDiv = document.createElement("div");
    pageDiv.className = originalContent.className;
    pageDiv.style.cssText = originalContent.style.cssText;
    pageDiv.innerHTML = currentPageElements.map((el) => el.outerHTML).join("");

    // For the last page, ensure it fills the whole page by adding explicit height
    if (pages.length > 0) {
      pageDiv.style.minHeight = `${pageHeight}px`;
      pageDiv.style.height = `${pageHeight}px`;
    }

    pages.push({
      container: pageDiv,
      content: pageDiv,
    });
  }

  // Clean up temporary container
  document.body.removeChild(tempContainer);

  console.log(`📊 Pagination complete: ${pages.length} pages created`);
  pages.forEach((page, index) => {
    const contentHeight = page.content.offsetHeight;
    console.log(`  Page ${index + 1}: ${contentHeight}px content height`);
  });

  return pages;
};

/**
 * Creates and configures a sandbox container for exports
 */
const createSandbox = () => {
  const sandbox = document.createElement("div");
  Object.assign(sandbox.style, {
    position: "fixed",
    left: "-9999px",
    top: "-9999px",
    width: "auto",
    height: "auto",
    opacity: "0",
    pointerEvents: "none",
    zIndex: "-1",
  });
  document.body.appendChild(sandbox);
  return sandbox;
};

/**
 * Configures export dimensions based on size and format
 */
const getExportDimensions = (size: ExportSize) => {
  const baseWidth = 1240;
  const exportWidth = baseWidth;
  const exportHeight =
    size === "A4" ? Math.round(baseWidth * 1.4142) : baseWidth;
  return { width: exportWidth, height: exportHeight };
};

/**
 * Prepares a cloned element for export with proper styling and dimensions
 */
const prepareCloneForExport = (
  originalElement: HTMLElement,
  clone: HTMLElement,
  width: number,
  height: number,
  content: HTMLElement | null,
) => {
  // Get original padding to preserve layout
  const originalPadding =
    getComputedStyle(originalElement).getPropertyValue("--theme-padding") ||
    "4rem";

  // Ensure element has proper layout and dimensions
  Object.assign(clone.style, {
    width: `${width}px`,
    height: `${height}px`,
    minWidth: `${width}px`,
    minHeight: `${height}px`,
    maxWidth: `${width}px`,
    maxHeight: `${height}px`,
    aspectRatio: "auto",
    transform: "none",
    margin: "0",
    padding: originalPadding,
    display: "block",
    visibility: "visible",
    boxSizing: "border-box",
    overflow: "visible",
    position: "relative",
  });

  if (content) {
    // For fit-to-width: set explicit width to prevent overflow
    const paddingValue = parseInt(originalPadding, 10) || 64; // Default to 4rem (64px)
    const contentWidth = width - paddingValue * 2;

    content.style.width = `${contentWidth}px`;
    content.style.maxWidth = `${contentWidth}px`;
    content.style.boxSizing = "border-box";
    content.style.overflow = "visible";
    content.style.margin = "0";
    content.style.wordWrap = "break-word";
    content.style.overflowWrap = "break-word";
  }

  // Ensure all children have proper sizing
  const allElements = clone.querySelectorAll("*");
  allElements.forEach((el) => {
    const element = el as HTMLElement;
    element.style.boxSizing = "border-box";
    // Ensure text content doesn't overflow
    if (element.tagName !== "IMG" && element.tagName !== "CANVAS") {
      element.style.maxWidth = "100%";
      element.style.overflow = "visible";
    }
  });
};

/**
 * Exports the provided element with support for multiple pages and improved ratio handling
 */
export const exportPreview = async (
  element: HTMLElement,
  format: ExportFormat,
  size: ExportSize,
  fileName: string = "lumina-document",
) => {
  if (!element) return;

  // Find the content container
  const originalContent = element.querySelector(
    "#preview-content",
  ) as HTMLElement;
  if (!originalContent) return;

  // For single-page exports (SVG doesn't support multi-page well)
  if (format === "SVG") {
    const sandbox = createSandbox();

    try {
      const { width, height } = getExportDimensions(size);

      // Use original element for single-page SVG
      const clone = element.cloneNode(true) as HTMLElement;
      const content = clone.querySelector("#preview-content") as HTMLElement;

      prepareCloneForExport(element, clone, width, height, content);
      sandbox.appendChild(clone);

      if ("fonts" in document) {
        await (document as any).fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));

      const options = {
        quality: 1.0,
        pixelRatio: 1, // SVG is vector-based, 1x is sufficient
        cacheBust: true,
        backgroundColor: getComputedStyle(element).backgroundColor,
        skipFonts: true,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      };

      const dataUrl = await htmlToImage.toSvg(clone, options);
      downloadFile(dataUrl, `${fileName}.svg`);
    } catch (error: any) {
      console.error("SVG export failed:", error);
      alert(`SVG export failed: ${error.message || "Unknown error"}`);
    } finally {
      document.body.removeChild(sandbox);
    }
  }
  // Multi-page PNG export - render full document then slice into pages
  else if (format === "PNG") {
    const sandbox = createSandbox();

    try {
      const { width, height } = getExportDimensions(size);

      // Paginate content to determine if we need multi-page export
      const pages = paginateContent(originalContent, size);
      const needsMultiPage = pages.length > 1;

      if (needsMultiPage) {
        // For multi-page, render each page separately for better quality
        const { width, height } = getExportDimensions(size);

        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
          const page = pages[pageIndex];

          // Create container for this page
          const pageContainer = document.createElement("div");
          pageContainer.className = element.className;
          pageContainer.style.cssText = element.style.cssText;

          // Set page dimensions
          Object.assign(pageContainer.style, {
            width: `${width}px`,
            height: `${height}px`,
            minWidth: `${width}px`,
            minHeight: `${height}px`,
            maxWidth: `${width}px`,
            maxHeight: `${height}px`,
            overflow: "hidden",
            position: "relative",
          });

          // Add the page content
          pageContainer.appendChild(page.content.cloneNode(true));
          sandbox.appendChild(pageContainer);

          // Render this page
          if ("fonts" in document) {
            await (document as any).fonts.ready;
          }
          await new Promise((resolve) => setTimeout(resolve, 300));

          const options = {
            quality: 1.0,
            pixelRatio: 2,
            cacheBust: true,
            backgroundColor: getComputedStyle(element).backgroundColor,
            skipFonts: true,
            style: {
              transform: "scale(1)",
              transformOrigin: "top left",
            },
          };

          const dataUrl = await htmlToImage.toPng(pageContainer, options);
          const pageFileName =
            pages.length > 1
              ? `${fileName}-page-${pageIndex + 1}.png`
              : `${fileName}.png`;

          downloadFile(dataUrl, pageFileName);

          // Clean up
          sandbox.removeChild(pageContainer);
        }
      } else {
        // Single page export - use existing logic
        const clone = element.cloneNode(true) as HTMLElement;
        const content = clone.querySelector("#preview-content") as HTMLElement;

        prepareCloneForExport(element, clone, width, height, content);
        sandbox.appendChild(clone);

        if ("fonts" in document) {
          await (document as any).fonts.ready;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));

        const options = {
          quality: 1.0,
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: getComputedStyle(element).backgroundColor,
          skipFonts: true,
          style: {
            transform: "scale(1)",
            transformOrigin: "top left",
          },
        };

        const dataUrl = await htmlToImage.toPng(clone, options);
        downloadFile(dataUrl, `${fileName}.png`);
      }
    } catch (error: any) {
      console.error("PNG export failed:", error);
      alert(`PNG export failed: ${error.message || "Unknown error"}`);
    } finally {
      document.body.removeChild(sandbox);
    }
  }
};

/**
 * Slices a large PNG into multiple pages based on the specified size
 * NOTE: This function is no longer used in the main export flow but kept for reference
 */
const slicePngIntoPages = async (
  fullImage: HTMLImageElement,
  pageWidth: number,
  pageHeight: number,
  fileName: string,
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to create canvas context");
  }

  // Calculate how many pages we need
  const totalPages = Math.ceil(fullImage.height / pageHeight);

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    // Set canvas dimensions for this page
    canvas.width = pageWidth;
    canvas.height = pageHeight;

    // Calculate source coordinates
    const sourceY = pageIndex * pageHeight;
    const sourceHeight = Math.min(pageHeight, fullImage.height - sourceY);

    // Clear canvas with white background first
    const originalElement = document.querySelector(
      ".preview-container",
    ) as HTMLElement;
    const backgroundColor = originalElement
      ? getComputedStyle(originalElement).backgroundColor
      : "#ffffff";

    ctx.fillStyle = backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, pageWidth, pageHeight);

    // Draw the slice
    ctx.drawImage(
      fullImage,
      0, // sourceX
      sourceY, // sourceY
      pageWidth, // sourceWidth
      sourceHeight, // sourceHeight
      0, // destX
      0, // destY
      pageWidth, // destWidth
      sourceHeight, // destHeight
    );

    // If this is the last page and it's not full height, fill the remaining space
    if (pageIndex === totalPages - 1 && sourceHeight < pageHeight) {
      // Create a filled background for the remaining space
      const originalElement = document.querySelector(
        ".preview-container",
      ) as HTMLElement;
      const backgroundColor = originalElement
        ? getComputedStyle(originalElement).backgroundColor
        : getComputedStyle(document.body).backgroundColor;

      ctx.fillStyle = backgroundColor || "#ffffff";
      ctx.fillRect(0, sourceHeight, pageWidth, pageHeight - sourceHeight);
    }

    // Convert to PNG and download
    const dataUrl = canvas.toDataURL("image/png");
    const pageFileName =
      totalPages > 1
        ? `${fileName}-page-${pageIndex + 1}.png`
        : `${fileName}.png`;

    downloadFile(dataUrl, pageFileName);
  }
};

const downloadFile = (dataUrl: string, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = dataUrl;
  link.click();
};
