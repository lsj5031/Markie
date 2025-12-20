import React, { useState } from "react";
import { usePagination } from "../hooks/usePagination";
import { ExportSize, Theme } from "../types";

interface MultiPageViewerProps {
  htmlContent: string;
  theme: Theme;
  exportSize: ExportSize;
}

const Icons = {
  ChevronLeft: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
};

export const MultiPageViewer: React.FC<MultiPageViewerProps> = ({
  htmlContent,
  theme,
  exportSize,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { pages, isLoading, pageCount } = usePagination(
    htmlContent,
    theme,
    exportSize,
    true, // Pagination is always enabled for this component
  );

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1));
  };

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

      {/* Pagination controls */}
      {pageCount > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 p-2 rounded-lg"
          style={{ backgroundColor: "rgba(26, 26, 27, 0.1)" }}
        >
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="pagination-button disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <Icons.ChevronLeft />
          </button>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--studio-text)" }}
          >
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === pageCount - 1}
            className="pagination-button disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next Page"
          >
            <Icons.ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};
