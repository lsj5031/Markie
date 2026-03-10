// import * as htmlToImage from "html-to-image"; // Removed for lazy loading
import { ExportFormat, ExportSize, ExportMode, Theme } from "../types";
import { paginateHtml } from "../utils/pagination";
import { getThemeStyles } from "../utils/themeHelpers";

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
  const baseWidth = 794; // Standard A4 width at 96 DPI (keeps content proportional)
  const exportWidth = baseWidth;
  const exportHeight =
    size === "A4" ? Math.round(baseWidth * 1.4142) : baseWidth;
  return { width: exportWidth, height: exportHeight };
};

/**
 * Applies unified theme and markdown styles to an element for export.
 * This consolidates both theme styling and markdown-body styling to avoid conflicts.
 * NOTE: This function does NOT reset padding - container padding should be set before calling this
 */
const applyExportStyles = (element: HTMLElement, theme: Theme): void => {
  const styles = getThemeStyles(theme);
  // Apply base styles - NOTE: padding is intentionally NOT reset here
  // to preserve container padding set before this function is called
  Object.assign(element.style, {
    fontFamily: styles.fontFamily,
    color: styles.textColor,
    backgroundColor: styles.backgroundColor,
    lineHeight: "1.65",
    margin: "0",
    // padding is NOT set here to preserve containerPadding
  });

  // Remove any existing style tags to avoid conflicts
  const existingStyles = element.querySelectorAll('style[data-export="true"]');
  existingStyles.forEach((style) => style.remove());

  // Add unified styling that matches the preview appearance
  const style = document.createElement("style");
  style.setAttribute("data-export", "true");
  style.textContent = `
    * { box-sizing: border-box; }
    
    body { 
      font-family: ${styles.fontFamily};
      color: ${styles.textColor};
      background-color: ${styles.backgroundColor};
      margin: 0;
      padding: 0;
      line-height: 1.65;
    }
    
    .markdown-body {
      line-height: 1.65;
      color: ${styles.textColor};
      font-family: ${styles.fontFamily};
    }
    
    .markdown-body h1,
    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4,
    .markdown-body h5,
    .markdown-body h6 {
      color: ${styles.accentColor};
      font-family: ${styles.headingFont};
    }
    
    .markdown-body p,
    .markdown-body li,
    .markdown-body td,
    .markdown-body blockquote {
      color: ${styles.textColor};
    }
    
    .markdown-body h1 {
      font-size: 1.8em;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 0.5em;
      letter-spacing: -0.02em;
    }
    
    .markdown-body h2 {
      font-size: 1.4em;
      font-weight: 700;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      letter-spacing: -0.01em;
    }
    
    .markdown-body h3 {
      font-size: 1.1em;
      font-weight: 600;
      margin-top: 1.2em;
      margin-bottom: 0.4em;
    }
    
    .markdown-body p {
      font-size: 0.95em;
      margin-bottom: 1.2em;
    }
    
    .markdown-body blockquote {
      padding-left: 1.5em;
      border-left: 2px solid ${styles.accentColor};
      font-style: italic;
      opacity: 0.8;
      margin: 2em 0;
    }
    
    .markdown-body pre {
      padding: 1.5em;
      border-radius: 0px;
      overflow: visible;
      margin: 1.5em 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85em;
      line-height: 1.6;
      background: #1e1e2e;
      border: 2px solid #313244;
      color: #cdd6f4;
      white-space: pre-wrap;
      word-break: break-word;
    }
    
    .markdown-body pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      font-size: inherit;
      border: none;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    .markdown-body code {
      font-family: 'JetBrains Mono', monospace;
      padding: 0.2em 0.5em;
      border-radius: 2px;
      font-size: 0.88em;
      background: #313244;
      color: #cdd6f4;
      border: 1px solid #45475a;
    }
    
    .markdown-body a {
      color: ${styles.accentColor};
      border-bottom: 1px solid ${styles.accentColor};
      text-decoration: none;
    }
    
    .markdown-body strong {
      color: ${styles.accentColor};
      font-weight: 700;
    }
    
    .markdown-body hr {
      margin: 3em 0;
      border: 0;
      border-top: 1px solid ${styles.textColor};
      opacity: 0.2;
    }
    
    .markdown-body ul li::marker,
    .markdown-body ol li::marker {
      color: ${styles.accentColor};
    }
    
    .markdown-body ol {
      list-style-type: decimal;
      padding-left: 1.5em;
    }
    
    .markdown-body ul {
      list-style-type: disc;
      padding-left: 1.5em;
    }
    
    .markdown-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 2em 0;
    }
    
    .markdown-body th,
    .markdown-body td {
      border: 2px solid ${styles.accentColor};
      padding: 1em;
      text-align: left;
    }
    
    .markdown-body th {
      font-weight: 700;
      opacity: 1;
      background: ${styles.accentColor};
      color: ${styles.backgroundColor};
    }
    
    .markdown-body img {
      border-radius: 0px;
      margin: 2em 0;
      width: 100%;
      object-fit: cover;
      border: 4px solid ${styles.textColor};
    }
  `;
  element.appendChild(style);
};

/**
 * Creates a continuous export by rendering the entire content as one tall image.
 */
const createContinuousExport = async (
  htmlContent: string,
  fileName: string,
  width: number,
  backgroundColor: string,
  theme: Theme,
  padding: number,
): Promise<void> => {
  const styles = getThemeStyles(theme);
  const htmlToImage = await import("html-to-image");
  const sandbox = createSandbox();

  try {
    // Use the theme's containerPadding for consistent appearance with preview
    // const themePadding = theme.styles.containerPadding;

    const container = document.createElement("div");
    Object.assign(container.style, {
      width: `${width}px`,
      height: "auto",
      padding: `${padding}px`, // Use explicit padding
      margin: "0",
      display: "block",
      boxSizing: "border-box",
      backgroundColor,
    });

    // Create content div with the HTML
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("markdown-body");
    contentDiv.innerHTML = htmlContent;
    Object.assign(contentDiv.style, {
      width: "100%",
      height: "auto",
      margin: "0",
      padding: "0",
      transform: "none",
      color: styles.textColor,
      fontFamily: styles.fontFamily,
    });

    container.appendChild(contentDiv);
    sandbox.appendChild(container);

    // Apply unified export styles for consistent appearance
    applyExportStyles(container, theme);

    await (document as any).fonts?.ready;
    await new Promise((resolve) => setTimeout(resolve, 200));

    const dataUrl = await htmlToImage.toPng(container, {
      quality: 1.0,
      pixelRatio: 4, // Increased from 3 to 4 for ultra-high resolution
      backgroundColor,

      width: width, // Explicitly set width to match container
      height: container.scrollHeight, // Explicitly set height to content height
      skipFonts: true, // Prevent font embedding errors on Firefox
      // Prevent crash on image error - use a transparent 1x1 pixel
      imagePlaceholder:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      // Enable anti-aliasing for smoother edges
      style: {
        imageRendering: "optimizeQuality",
        shapeRendering: "geometricPrecision",
      },
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
 * Handles both single-page and multi-page exports using theme padding for consistency.
 *
 * @param element - The preview container element (used for styles like background color)
 * @param format - Export format (PNG or SVG)
 * @param size - Export size (A4 or SQUARE)
 * @param fileName - Base filename for the export
 * @param theme - The active theme for styling
 * @param htmlContent - The raw rendered HTML content to export
 * @param mode - Export mode (PAGES or CONTINUOUS)
 */
export const exportPreview = async (
  element: HTMLElement,
  format: ExportFormat,
  size: ExportSize,
  fileName: string,
  theme: Theme,
  htmlContent: string, // Raw rendered HTML content
  padding: number, // Use explicit padding passed from state
  mode: ExportMode = "PAGES",
): Promise<void> => {
  if (!element) return;
  const styles = getThemeStyles(theme);
  if (!htmlContent) {
    console.error("No HTML content provided for export.");
    return;
  }

  // Sanitize HTML content to remove invalid XML characters (like ESC - char 27)
  // which might cause SVG export errors or other issues.
  // We preserve Tab (9), Newline (10), and Carriage Return (13).
  const sanitizedHtml = htmlContent.replace(
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g,
    "",
  );

  const htmlToImage = await import("html-to-image");
  const sandbox = createSandbox();
  try {
    const { width, height } = getExportDimensions(size);
    const backgroundColor = getComputedStyle(element).backgroundColor;

    // SVG export - captures full content without cropping (like continuous mode)
    if (format === "SVG") {
      // Use the theme's containerPadding for consistent appearance with preview
      // const themePadding = theme.styles.containerPadding;

      const container = document.createElement("div");
      Object.assign(container.style, {
        width: `${width}px`,
        height: "auto", // Allow full height to prevent cropping
        padding: `${padding}px`, // Use explicit padding passed from state
        margin: "0",
        display: "block",
        boxSizing: "border-box",
        backgroundColor,
      });

      const contentDiv = document.createElement("div");
      contentDiv.classList.add("markdown-body");
      contentDiv.innerHTML = sanitizedHtml;
      Object.assign(contentDiv.style, {
        width: "100%",
        height: "auto",
        margin: "0",
        padding: "0",
        transform: "none",
        color: styles.textColor,
        fontFamily: styles.fontFamily,
      });

      container.appendChild(contentDiv);
      sandbox.appendChild(container);

      // Apply unified export styles for consistent appearance
      applyExportStyles(container, theme);

      await (document as any).fonts?.ready;
      await new Promise((resolve) => setTimeout(resolve, 200));

      const dataUrl = await htmlToImage.toSvg(container, {
        quality: 1.0,
        pixelRatio: 3, // Increased from 2 to 3 for higher resolution
        backgroundColor,
        skipFonts: true, // Prevent font embedding errors on Firefox
        // Prevent crash on image error - use a transparent 1x1 pixel
        imagePlaceholder:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        // Enable anti-aliasing for smoother edges
        style: {
          imageRendering: "optimizeQuality",
          shapeRendering: "geometricPrecision",
        },
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
            sanitizedHtml,
            fileName,
            width,
            backgroundColor,
            theme,
            padding,
          );
          break;

        case "PAGES":
        default:
          // Original paginated export (multiple page PNGs)
          const pages = await paginateHtml(
            sanitizedHtml,
            size,
            theme,
            padding, // Pass explicit padding for consistency with export
          );

          for (let i = 0; i < pages.length; i++) {
            const pageHtml = pages[i];

            // Create a container for the page that matches the export dimensions.
            // IMPORTANT: The pageHtml from paginateHtml already contains content
            // sized to usablePageHeight (height - padding*2) with padding applied
            // within. We set the container to full page dimensions WITHOUT extra
            // padding to avoid double-padding that creates blank spaces.
            const pageContainer = document.createElement("div");
            pageContainer.className = element.className;

            Object.assign(pageContainer.style, {
              width: `${width}px`,
              height: `${height}px`,
              padding: `${padding}px`, // Padding creates the margins around the content
              margin: "0",
              display: "block",
              overflow: "hidden",
              boxSizing: "border-box",
              backgroundColor,
            });

            // Wrap pageHtml in a container that fills the usable space
            const contentWrapper = document.createElement("div");
            contentWrapper.className = "markdown-body";
            Object.assign(contentWrapper.style, {
              width: "100%",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            });
            contentWrapper.innerHTML = pageHtml;
            pageContainer.appendChild(contentWrapper);
            sandbox.appendChild(pageContainer);

            // Apply unified export styles to each page
            applyExportStyles(pageContainer, theme);

            await (document as any).fonts?.ready;
            await new Promise((resolve) => setTimeout(resolve, 200));

            const dataUrl = await htmlToImage.toPng(pageContainer, {
              quality: 1.0,
              pixelRatio: 4, // Increased from 3 to 4 for ultra-high resolution
              backgroundColor,

              width: width, // Explicitly set width to match page size
              height: height, // Explicitly set height to match page size
              skipFonts: true, // Prevent font embedding errors on Firefox
              // Prevent crash on image error - use a transparent 1x1 pixel
              imagePlaceholder:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
              // Enable anti-aliasing for smoother edges
              style: {
                imageRendering: "optimizeQuality",
                shapeRendering: "geometricPrecision",
              },
            });

            const pageFileName =
              pages.length > 1
                ? `${fileName}-page-${i + 1}.png`
                : `${fileName}.png`;
            downloadFile(dataUrl, pageFileName);

            // Yield to the main thread to allow the browser to process the download
            if (i < pages.length - 1) {
              await new Promise((resolve) =>
                requestAnimationFrame(() => resolve(undefined)),
              );
            }

            sandbox.removeChild(pageContainer); // Clean up after each page
          }
          break;
      }
    }
  } catch (error: any) {
    console.error("Export failed:", error);

    // Check if it's an image loading error (Event object from img tag)
    if (
      error instanceof Event &&
      (error.target as HTMLElement)?.tagName === "IMG"
    ) {
      alert(
        "Export warning: One or more images failed to load. The export has completed with placeholders.",
      );
    } else {
      alert(`Export failed: ${error.message || "Unknown error"}`);
    }
  } finally {
    document.body.removeChild(sandbox);
  }
};
