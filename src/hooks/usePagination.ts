import { useState, useEffect, useMemo } from "react";
import { ExportSize, Theme } from "../types";
import { paginateHtml } from "../utils/pagination";

// Corresponds to the A4 aspect ratio for height calculation
const A4_ASPECT_RATIO = 1.414;

// Base width for pagination calculations, can be adjusted
const PAGINATION_BASE_WIDTH = 800;

interface PaginationResult {
  pages: string[];
  isLoading: boolean;
  pageCount: number;
}

/**
 * A React hook to handle the logic of paginating HTML content.
 *
 * @param htmlContent - The raw HTML string to be paginated.
 * @param theme - The active theme object.
 * @param exportSize - The target size format ('A4' or 'Square').
 * @param isEnabled - A boolean to enable or disable the pagination process.
 * @returns An object containing the paginated content, loading state, and page count.
 */
export const usePagination = (
  htmlContent: string,
  theme: Theme,
  exportSize: ExportSize,
  isEnabled: boolean,
): PaginationResult => {
  const [pages, setPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memoize dimensions to avoid recalculating on every render
  const dimensions = useMemo(() => {
    const width = PAGINATION_BASE_WIDTH;
    const height =
      exportSize === "A4" ? Math.round(width * A4_ASPECT_RATIO) : width;
    return { width, height };
  }, [exportSize]);

  useEffect(() => {
    // If pagination is not enabled, reset to a single page containing the original content.
    if (!isEnabled) {
      setPages([htmlContent]);
      return;
    }

    const processPagination = async () => {
      setIsLoading(true);
      try {
        const paginatedPages = await paginateHtml(
          htmlContent,
          exportSize,
          theme,
        );
        setPages(paginatedPages);
      } catch (error) {
        console.error("Failed to paginate content:", error);
        // On error, fallback to a single page view.
        setPages([htmlContent]);
      } finally {
        setIsLoading(false);
      }
    };

    processPagination();
  }, [htmlContent, theme, dimensions, isEnabled]);

  return {
    pages,
    isLoading,
    pageCount: pages.length,
  };
};
