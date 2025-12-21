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
 * Applies theme styles to an element
 */
const applyThemeStyles = (element: HTMLElement, theme: Theme): void => {
  Object.assign(element.style, {
    fontFamily: theme.styles.fontFamily,
    color: theme.styles.textColor,
    backgroundColor: theme.styles.backgroundColor,
  });

  // Add internal styling for markdown elements
  const style = document.createElement("style");
  style.textContent = `
    h1, h2, h3 { font-family: ${theme.styles.headingFont}; color: ${theme.styles.textColor}; }
    pre { background: ${theme.styles.codeBackground}; color: ${theme.styles.textColor}; padding: 1.25em; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); overflow-x: auto; }
    code { background: rgba(0,0,0,0.08); color: ${theme.styles.accentColor}; padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.9em; }
    a { color: ${theme.styles.accentColor}; border-bottom: 1px solid ${theme.styles.accentColor}; text-decoration: none; }
    strong { color: ${theme.styles.accentColor}; font-weight: 700; }
    hr { border-color: ${theme.styles.textColor}; opacity: 0.15; }
    ul li::marker, ol li::marker { color: ${theme.styles.accentColor}; }
    ol { list-style-type: decimal; padding-left: 1.5em; }
    ul { list-style-type: disc; padding-left: 1.5em; }
  `;
  element.appendChild(style);
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
  theme: Theme,
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

  // Apply theme styles to the clone
  applyThemeStyles(clone, theme);
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
  theme: Theme,
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

    // Apply theme styles to the continuous export
    applyThemeStyles(container, theme);

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
      prepareCloneForSinglePageExport(
        element,
        clone,
        width,
        height,
        padding,
        theme,
      );
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
            theme,
          );
          break;

        case "PAGES":
        default:
          // Original paginated export (multiple page PNGs)
          const pages = await paginateHtml(
            originalContent.innerHTML,
            size,
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

            // Apply theme styles to each page
            applyThemeStyles(pageContainer, theme);

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
