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

  // Create pages by grouping elements
  const pageBreakTags = new Set(["H1", "H2", "HR"]);
  let currentPageElements: Element[] = [];
  let accumulatedHeight = 0;

  // Estimate character-to-height ratio (rough approximation)
  const basePageHeight = size === "A4" ? 3508 : 2480;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const tagName = element.tagName;

    // Always start a new page when encountering h1-h5 or hr
    if (pageBreakTags.has(tagName) && currentPageElements.length > 0) {
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

      currentPageElements = [element];
      accumulatedHeight = 0;
    } else {
      currentPageElements.push(element);
    }
  }

  // Add remaining elements as final page
  if (currentPageElements.length > 0) {
    const pageDiv = document.createElement("div");
    pageDiv.className = originalContent.className;
    pageDiv.style.cssText = originalContent.style.cssText;
    pageDiv.innerHTML = currentPageElements.map((el) => el.outerHTML).join("");

    pages.push({
      container: pageDiv,
      content: pageDiv,
    });
  }

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
    padding:
      getComputedStyle(originalElement).getPropertyValue("--theme-padding") ||
      "4rem",
    display: "block",
    visibility: "visible",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
  });

  if (content) {
    content.style.width = "100%";
    content.style.maxWidth = "100%";
    content.style.boxSizing = "border-box";
  }

  // Ensure all children have proper sizing
  const allElements = clone.querySelectorAll("*");
  allElements.forEach((el) => {
    const element = el as HTMLElement;
    element.style.boxSizing = "border-box";
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

  // Paginate content for multi-page exports
  const pages = paginateContent(originalContent, size);

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
  // Single PNG export - entire content as one image
  else if (format === "PNG") {
    const sandbox = createSandbox();

    try {
      const { width, height } = getExportDimensions(size);

      // Use original element for single-page PNG (same as SVG)
      const clone = element.cloneNode(true) as HTMLElement;
      const content = clone.querySelector("#preview-content") as HTMLElement;

      prepareCloneForExport(element, clone, width, height, content);
      sandbox.appendChild(clone);

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
    } catch (error: any) {
      console.error("PNG export failed:", error);
      alert(`PNG export failed: ${error.message || "Unknown error"}`);
    } finally {
      document.body.removeChild(sandbox);
    }
  }
};

const downloadFile = (dataUrl: string, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = dataUrl;
  link.click();
};
