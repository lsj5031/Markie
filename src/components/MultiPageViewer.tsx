import React, { useState, useEffect, useRef } from "react";
import { usePagination } from "../hooks/usePagination";
import { ExportSize, Theme } from "../types";

interface MultiPageViewerProps {
  htmlContent: string;
  theme: Theme;
  exportSize: ExportSize;
  padding?: number;
  onPageChange?: (currentPage: number, totalPages: number) => void;
}

export const MultiPageViewer: React.FC<MultiPageViewerProps> = ({
  htmlContent,
  theme,
  exportSize,
  padding = 40,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  // Use a counter to force unique keys for animation replay
  const animationKeyRef = useRef(0);
  const { pages, isLoading, pageCount } = usePagination(
    htmlContent,
    theme,
    exportSize,
    true,
    padding, // Pass explicit padding for consistency with export
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
      goToPreviousPage: () => {
        setDirection('prev');
        animationKeyRef.current += 1;
        setCurrentPage((prev) => Math.max(0, prev - 1));
      },
      goToNextPage: () => {
        setDirection('next');
        animationKeyRef.current += 1;
        setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1));
      },
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

  // Use both page number and animation counter as key to force animation replay
  const animationKey = `page-${currentPage}-${animationKeyRef.current}`;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div
        key={animationKey}
        id="preview-content"
        className={`absolute inset-0 ${direction === "next" ? "animate-slide-in-right" : "animate-slide-in"}`}
        dangerouslySetInnerHTML={{ __html: pages[currentPage] || "" }}
      />
    </div>
  );
};
