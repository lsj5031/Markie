
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { ExportFormat, ExportSize } from '../types';

/**
 * Exports the provided element by cloning it into a hidden container.
 * This preserves fonts, colors, and prevents UI resizing artifacts.
 */
export const exportPreview = async (
  element: HTMLElement,
  format: ExportFormat,
  size: ExportSize,
  fileName: string = 'lumina-document'
) => {
  if (!element) return;

  // 1. Create a hidden sandbox container
  const sandbox = document.createElement('div');
  Object.assign(sandbox.style, {
    position: 'fixed',
    left: '-9999px',
    top: '-9999px',
    width: 'auto',
    height: 'auto',
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '-1'
  });
  document.body.appendChild(sandbox);

  // 2. Clone the target element
  const clone = element.cloneNode(true) as HTMLElement;
  
  // 3. Set explicit high-res dimensions for the export
  // A4 (300 DPI approx) = 2480 x 3508. Let's go for a crisp 1.5k-ish range for performance/quality balance.
  const baseWidth = 1240;
  const exportWidth = baseWidth;
  const exportHeight = size === 'A4' ? Math.round(baseWidth * 1.4142) : baseWidth;

  // Apply dimensions and reset transforms
  Object.assign(clone.style, {
    width: `${exportWidth}px`,
    height: `${exportHeight}px`,
    minHeight: `${exportHeight}px`,
    maxHeight: `${exportHeight}px`,
    aspectRatio: 'auto', // Override the CSS aspect-ratio for fixed px
    transform: 'none',
    margin: '0',
    padding: getComputedStyle(element).getPropertyValue('--theme-padding') || '4rem',
    display: 'block',
    visibility: 'visible'
  });

  // Ensure internal content fits the new width
  const content = clone.querySelector('#preview-content') as HTMLElement;
  if (content) {
    content.style.width = '100%';
  }

  sandbox.appendChild(clone);

  // 4. Wait for fonts and styles to be ready
  try {
    if ('fonts' in document) {
      await (document as any).fonts.ready;
    }
    // Small buffer for variable resolution
    await new Promise(resolve => setTimeout(resolve, 500));

    const options = {
      quality: 1.0,
      pixelRatio: 2, // 2x for retina-like quality
      cacheBust: true,
      backgroundColor: getComputedStyle(element).backgroundColor,
      // Pass the computed styles explicitly if needed
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      },
    };

    if (format === 'PNG') {
      const dataUrl = await htmlToImage.toPng(clone, options);
      downloadFile(dataUrl, `${fileName}.png`);
    } else if (format === 'SVG') {
      // SVG captures better at 1x as it is vector based
      const dataUrl = await htmlToImage.toSvg(clone, { ...options, pixelRatio: 1 });
      downloadFile(dataUrl, `${fileName}.svg`);
    } else if (format === 'PDF') {
      const dataUrl = await htmlToImage.toPng(clone, { ...options, quality: 0.95 });
      const pdf = new jsPDF({
        orientation: exportHeight > exportWidth ? 'portrait' : 'landscape',
        unit: 'px',
        format: [exportWidth, exportHeight]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, exportWidth, exportHeight);
      pdf.save(`${fileName}.pdf`);
    }
  } catch (error: any) {
    console.error('Export failed:', error);
    alert(`Export failed: ${error.message || 'Unknown error'}. This usually happens if cross-origin fonts are blocked.`);
  } finally {
    // 5. Cleanup
    document.body.removeChild(sandbox);
  }
};

const downloadFile = (dataUrl: string, name: string) => {
  const link = document.createElement('a');
  link.download = name;
  link.href = dataUrl;
  link.click();
};
