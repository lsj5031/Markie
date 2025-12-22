import React, { useState, useEffect } from "react";
import { usePagination } from "../hooks/usePagination";
import { ExportSize, Theme } from "../types";

interface MultiPageViewerProps {
  htmlContent: string;
  theme: Theme;
  exportSize: ExportSize;
  onPageChange?: (currentPage: number, totalPages: number) => void;
}

export const MultiPageViewer: React.FC<MultiPageViewerProps> = ({
  htmlContent,
  theme,
  exportSize,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages, isLoading, pageCount } = usePagination(
    htmlContent,
    theme,
    exportSize,
    true,
  );

  // Notify parent of page changes
  useEffect(() => {
    if (onPageChange && !isLoading) {
      onPageChange(currentPage, pageCount);
    }
  }, [currentPage, pageCount, isLoading, onPageChange]);

  // Expose navigation functions globally for parent to use
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__multiPageNav = {
      goToPreviousPage: () => setCurrentPage((prev) => Math.max(0, prev - 1)),
      goToNextPage: () =>
        setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1)),
      currentPage,
      pageCount,
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__multiPageNav;
    };
  }, [currentPage, pageCount]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-gray-500">Paginating content...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* The container for the paginated content */}
      <div
        id="preview-content"
        className="absolute inset-0"
        dangerouslySetInnerHTML={{ __html: pages[currentPage] || "" }}
      />
    </div>
  );
};
