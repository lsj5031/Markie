import React from "react";

interface SinglePageViewerProps {
  htmlContent: string;
}

export const SinglePageViewer: React.FC<SinglePageViewerProps> = ({
  htmlContent,
}) => {
  return (
    <div
      id="preview-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
