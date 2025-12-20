import * as htmlToImage from "html-to-image";
import { ExportFormat, ExportSize, ExportMode, Theme } from "../types";
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
  padding: number = 40,
): void => {
  const originalPadding =
    getComputedStyle(originalElement).getPropertyValue("--theme-padding") ||
    `${padding}px`;

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
 * Creates a continuous export by rendering the entire content as one tall image.
 */
const createContinuousExport = async (
  element: HTMLElement,
  fileName: string,
  width: number,
  height: number,
  padding: number,
  backgroundColor: string,
): Promise<void> => {
  const sandbox = createSandbox();
  
  try {
    const container = document.createElement("div");
    Object.assign(container.style, {
      width: `${width}px`,
      height: "auto",
      padding: `${padding}px`,
      margin: "0",
      display: "block",
      boxSizing: "border-box",
      backgroundColor,
    });

    const contentClone = element.cloneNode(true) as HTMLElement;
    Object.assign(contentClone.style, {
      width: "100%",
      height: "auto",
      margin: "0",
      padding: "0",
      transform: "none",
    });

    container.appendChild(contentClone);
    sandbox.appendChild(container);

    await (document as any).fonts?.ready;
    await new Promise((resolve) => setTimeout(resolve, 200));

    const dataUrl = await htmlToImage.toPng(container, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor,
    });

    downloadFile(dataUrl, `${fileName}-continuous.png`);
  } finally {
    document.body.removeChild(sandbox);
  }
};

/**
 * Creates a square export by cropping or resizing the content.
 */
const createSquareExport = async (
  element: HTMLElement,
  fileName: string,
  width: number,
  height: number,
  padding: number,
  backgroundColor: string,
): Promise<void> => {
  const sandbox = createSandbox();
  
  try {
    const container = document.createElement("div");
    const squareSize = Math.min(width, height);
    
    Object.assign(container.style, {
      width: `${squareSize}px`,
      height: `${squareSize}px`,
      padding: `${padding}px`,
      margin: "0",
      display: "block",
      boxSizing: "border-box",
      backgroundColor,
      overflow: "hidden",
    });

    const contentClone = element.cloneNode(true) as HTMLElement;
    Object.assign(contentClone.style, {
      width: "100%",
      height: "100%",
      margin: "0",
      padding: "0",
      transform: "none",
      objectFit: "contain",
    });

    container.appendChild(contentClone);
    sandbox.appendChild(container);

    await (document as any).fonts?.ready;
    await new Promise((resolve) => setTimeout(resolve, 200));

    const dataUrl = await htmlToImage.toPng(container, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor,
    });

    downloadFile(dataUrl, `${fileName}-square.png`);
  } finally {
    document.body.removeChild(sandbox);
  }
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
 * Handles both single-page and multi-page exports with configurable padding and modes.
 */
export const exportPreview = async (
  element: HTMLElement,
  format: ExportFormat,
  size: ExportSize,
  fileName: string,
  theme: Theme, // The active theme is now required for pagination
  padding: number = 40, // Default padding
  mode: ExportMode = "PAGES", // Default to pages mode
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
    const backgroundColor = getComputedStyle(element).backgroundColor;

    // SVG is always single-page and uses a simplified export path.
    if (format === "SVG") {
      const clone = element.cloneNode(true) as HTMLElement;
      prepareCloneForSinglePageExport(element, clone, width, height, padding);
      sandbox.appendChild(clone);

      await (document as any).fonts?.ready;
      await new Promise((resolve) => setTimeout(resolve, 200));

      const dataUrl = await htmlToImage.toSvg(clone, {
        quality: 1.0,
        pixelRatio: 1,
        backgroundColor,
      });
      downloadFile(dataUrl, `${fileName}.svg`);
      return;
    }

    // Handle PNG exports with different modes
    if (format === "PNG") {
      switch (mode) {
        case "CONTINUOUS":
          // Export as one continuous tall image
          await createContinuousExport(
            originalContent,
            fileName,
            width,
            height,
            padding,
            backgroundColor,
          );
          break;
          
        case "SQUARE":
          // Export as a square image
          await createSquareExport(
            originalContent,
            fileName,
            width,
            height,
            padding,
            backgroundColor,
          );
          break;
          
        case "PAGES":
        default:
          // Original paginated export (multiple page PNGs)
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
              padding: `${padding}px`, // Apply configurable padding
              margin: "0",
              display: "block",
              overflow: "hidden",
            });

            pageContainer.innerHTML = pageHtml;
            sandbox.appendChild(pageContainer);

            await (document as any).fonts?.ready;
            await new Promise((resolve) => setTimeout(resolve, 200));

            const dataUrl = await htmlToImage.toPng(pageContainer, {
              quality: 1.0,
              pixelRatio: 2, // Higher pixel ratio for sharper images
              backgroundColor,
            });

            const pageFileName =
              pages.length > 1
                ? `${fileName}-page-${i + 1}.png`
                : `${fileName}.png`;
            downloadFile(dataUrl, pageFileName);

            sandbox.removeChild(pageContainer); // Clean up after each page
          }
          break;
      }
    }
  } catch (error: any) {
    console.error("Export failed:", error);
    alert(`Export failed: ${error.message || "Unknown error"}`);
  } finally {
    document.body.removeChild(sandbox);
  }
};
