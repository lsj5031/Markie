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
      className="w-6 h-6"
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
      className="w-6 h-6"
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

      {/* Side navigation buttons - only show if multiple pages */}
      {pageCount > 1 && (
        <>
          {/* Left navigation button */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="absolute left-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110"
            style={{
              backgroundColor: currentPage === 0 ? "rgba(26, 26, 27, 0.1)" : "var(--studio-accent)",
              color: currentPage === 0 ? "var(--studio-text)" : "#ffffff",
              boxShadow: currentPage === 0 ? "none" : "0 4px 12px rgba(235, 59, 90, 0.4)",
            }}
            title="Previous Page"
          >
            <Icons.ChevronLeft />
          </button>

          {/* Right navigation button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === pageCount - 1}
            className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110"
            style={{
              backgroundColor: currentPage === pageCount - 1 ? "rgba(26, 26, 27, 0.1)" : "var(--studio-accent)",
              color: currentPage === pageCount - 1 ? "var(--studio-text)" : "#ffffff",
              boxShadow: currentPage === pageCount - 1 ? "none" : "0 4px 12px rgba(235, 59, 90, 0.4)",
            }}
            title="Next Page"
          >
            <Icons.ChevronRight />
          </button>

          {/* Page indicator at bottom */}
          <div
            className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full"
            style={{
              backgroundColor: "var(--studio-surface)",
              border: "2px solid rgba(26, 26, 27, 0.15)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {/* Page dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className="transition-all duration-200"
                  style={{
                    width: currentPage === i ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: currentPage === i ? "var(--studio-accent)" : "rgba(26, 26, 27, 0.2)",
                  }}
                  title={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            {/* Page number text */}
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--studio-text)" }}
            >
              {currentPage + 1} / {pageCount}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
