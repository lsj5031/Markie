import * as htmlToImage from "html-to-image";
import { ExportFormat, ExportSize, Theme } from "../types";
import { paginateHtml } from "../utils/pagination";

/**
 * Creates and configures a sandbox container for exports.
 * The sandbox is a hidden div that hosts the content to be exported,
 * ensuring that it is rendered with the correct dimensions and styles.
 */
const createSandbox = (): HTMLElement => {
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
 * Configures the dimensions for the exported image based on the selected size.
 */
const getExportDimensions = (
  size: ExportSize,
): { width: number; height: number } => {
  const baseWidth = 1240; // A good resolution for print quality (approx. 10.5 inches at 120 DPI)
  const exportWidth = baseWidth;
  const exportHeight =
    size === "A4" ? Math.round(baseWidth * 1.4142) : baseWidth;
  return { width: exportWidth, height: exportHeight };
};

/**
 * Prepares a cloned element for single-page export.
 * This function ensures the clone has the correct dimensions and styles.
 */
const prepareCloneForSinglePageExport = (
  originalElement: HTMLElement,
  clone: HTMLElement,
  width: number,
  height: number,
): void => {
  const originalPadding =
    getComputedStyle(originalElement).getPropertyValue("--theme-padding") ||
    "4rem";

  Object.assign(clone.style, {
    width: `${width}px`,
    height: `${height}px`,
    padding: originalPadding,
    margin: "0",
    aspectRatio: "auto",
    transform: "none",
    display: "block",
    boxSizing: "border-box",
  });
};

/**
 * Downloads a file from a data URL.
 */
const downloadFile = (dataUrl: string, name: string): void => {
  const link = document.createElement("a");
  link.download = name;
  link.href = dataUrl;
  link.click();
};

/**
 * Exports the provided element to the specified format (PNG, SVG).
 * Handles both single-page and multi-page exports.
 */
export const exportPreview = async (
  element: HTMLElement,
  format: ExportFormat,
  size: ExportSize,
  fileName: string,
  theme: Theme, // The active theme is now required for pagination
): Promise<void> => {
  if (!element) return;

  const originalContent = element.querySelector(
    "#preview-content",
  ) as HTMLElement;
  if (!originalContent) {
    console.error("Could not find #preview-content to export.");
    return;
  }

  const sandbox = createSandbox();
  try {
    const { width, height } = getExportDimensions(size);

    // SVG is always single-page and uses a simplified export path.
    if (format === "SVG") {
      const clone = element.cloneNode(true) as HTMLElement;
      prepareCloneForSinglePageExport(element, clone, width, height);
      sandbox.appendChild(clone);

      await (document as any).fonts?.ready;
      await new Promise((resolve) => setTimeout(resolve, 200));

      const dataUrl = await htmlToImage.toSvg(clone, {
        quality: 1.0,
        pixelRatio: 1,
        backgroundColor: getComputedStyle(element).backgroundColor,
      });
      downloadFile(dataUrl, `${fileName}.svg`);
      return;
    }

    // For PNG, use the new pagination utility.
    if (format === "PNG") {
      const pages = await paginateHtml(
        originalContent.innerHTML,
        width,
        height,
        theme,
      );

      for (let i = 0; i < pages.length; i++) {
        const pageHtml = pages[i];

        // Create a container for the page that matches the preview canvas styles.
        const pageContainer = document.createElement("div");
        pageContainer.className = element.className;
        pageContainer.style.cssText = element.style.cssText;

        Object.assign(pageContainer.style, {
          width: `${width}px`,
          height: `${height}px`,
          padding: "0", // Padding is part of the paginated content now
          margin: "0",
          display: "block",
          overflow: "hidden", // Important for the CSS transform trick
        });

        pageContainer.innerHTML = pageHtml;
        sandbox.appendChild(pageContainer);

        await (document as any).fonts?.ready;
        await new Promise((resolve) => setTimeout(resolve, 200));

        const dataUrl = await htmlToImage.toPng(pageContainer, {
          quality: 1.0,
          pixelRatio: 2, // Higher pixel ratio for sharper images
          backgroundColor: getComputedStyle(element).backgroundColor,
        });

        const pageFileName =
          pages.length > 1
            ? `${fileName}-page-${i + 1}.png`
            : `${fileName}.png`;
        downloadFile(dataUrl, pageFileName);

        sandbox.removeChild(pageContainer); // Clean up after each page
      }
    }
  } catch (error: any) {
    console.error("Export failed:", error);
    alert(`Export failed: ${error.message || "Unknown error"}`);
  } finally {
    document.body.removeChild(sandbox);
  }
};
