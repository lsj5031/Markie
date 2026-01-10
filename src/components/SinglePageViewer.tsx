import React from "react";
import { usePagination } from "../hooks/usePagination";
import { ExportSize, Theme } from "../types";

interface SinglePageViewerProps {
  htmlContent: string;
  theme: Theme;
  exportSize: ExportSize;
}

import { getThemeStyles } from "../utils/themeHelpers";

export const SinglePageViewer: React.FC<SinglePageViewerProps> = ({
  htmlContent,
  theme,
  exportSize,
}) => {
  const { pages, isLoading } = usePagination(
    htmlContent,
    theme,
    exportSize,
    false, // Pagination disabled - shows single page
  );

  const styles = getThemeStyles(theme);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-gray-500">Loading content...</p>
      </div>
    );
  }

  return (
    <div
      id="preview-content"
      className="w-full h-full"
      style={{
        overflowY: "auto",
        height: "100%",
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
      }}
      dangerouslySetInnerHTML={{ __html: pages[0] || "" }}
    />
  );
};
