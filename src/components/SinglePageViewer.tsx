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
      style={{ overflowY: "auto", height: "100%" }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
