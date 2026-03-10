import React from "react";
import { SinglePageViewer } from "./SinglePageViewer";
import { ExportSize, ExportMode, Theme } from "../types";
import { getDimensions } from "../utils/pagination";

interface PreviewProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  previewContainerRef: React.RefObject<HTMLDivElement | null>;
  themeVars: React.CSSProperties;
  canvasScale: number;
  setCanvasScale: React.Dispatch<React.SetStateAction<number>>;
  setIsManualZoom: React.Dispatch<React.SetStateAction<boolean>>;
  fitMode: "page" | "width";
  setFitMode: React.Dispatch<React.SetStateAction<"page" | "width">>;
  previewLayout: "single" | "double";
  setPreviewLayout: React.Dispatch<React.SetStateAction<"single" | "double">>;
  isReaderMode: boolean;
  setIsReaderMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  isFocusMode: boolean;
  exportSize: ExportSize;
  markdown: string;
  renderedHtml: string;
  isLoading: boolean;
  exportMode: ExportMode;
  pages: string[];
  currentPage: number;
  pageCount: number;
  direction: "next" | "prev";
  animationKeyRef: React.MutableRefObject<number>;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  activeTheme: Theme;
  isMobile: boolean;
  mobileTab: "editor" | "preview";
}

export const Preview: React.FC<PreviewProps> = ({
  previewRef,
  previewContainerRef,
  themeVars,
  canvasScale,
  setCanvasScale,
  setIsManualZoom,
  fitMode,
  setFitMode,
  previewLayout,
  setPreviewLayout,
  isReaderMode,
  setIsReaderMode,
  setIsFocusMode,
  isFocusMode,
  exportSize,
  markdown,
  renderedHtml,
  isLoading,
  exportMode,
  pages,
  currentPage,
  pageCount,
  direction,
  animationKeyRef,
  goToPreviousPage,
  goToNextPage,
  activeTheme,
  isMobile,
  mobileTab,
}) => {
  return (
    <section
      className={`flex-col overflow-hidden relative canvas-background ${
        isFocusMode && !isMobile ? "hidden" : ""
      } lg:flex ${
        isMobile
          ? `mobile-pane ${mobileTab === "preview" ? "active flex" : "inactive"}`
          : "flex"
      }`}
      style={{ flex: 1 }}
    >
      <div className="pane-header">
        <div className="pane-header-label">
          <div
            className="indicator"
            style={{ backgroundColor: "var(--studio-tertiary)" }}
          />
          <span>Preview</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Zoom Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              padding: "4px",
              backgroundColor: "var(--studio-border-5)",
              border: "1px solid var(--studio-border)",
              borderRadius: "8px",
            }}
          >
            <button
              onClick={() => {
                setCanvasScale((s) => Math.max(0.1, s - 0.1));
                setIsManualZoom(true);
              }}
              style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                backgroundColor: "transparent",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--studio-text)",
              }}
              title="Zoom out"
            >
              -
            </button>
            <span
              style={{
                width: "42px",
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "monospace",
                color: "var(--studio-text)",
              }}
            >
              {Math.round(canvasScale * 100)}%
            </span>
            <button
              onClick={() => {
                setCanvasScale((s) => Math.min(2, s + 0.1));
                setIsManualZoom(true);
              }}
              style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                backgroundColor: "transparent",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--studio-text)",
              }}
              title="Zoom in"
            >
              +
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "2px",
              backgroundColor: "var(--studio-border-5)",
              borderRadius: "6px",
              padding: "2px",
              border: "1px solid var(--studio-border)",
            }}
          >
            <button
              onClick={() => {
                setFitMode("page");
                setIsManualZoom(false);
              }}
              title="Fit whole page to screen"
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "4px",
                backgroundColor:
                  fitMode === "page" && !isManualZoom
                    ? "var(--studio-accent)"
                    : "transparent",
                color:
                  fitMode === "page" && !isManualZoom
                    ? "white"
                    : "var(--studio-text)",
                cursor: "pointer",
                border: "none",
              }}
            >
              Fit P
            </button>
            <button
              onClick={() => {
                setFitMode("width");
                setIsManualZoom(false);
              }}
              title="Fit content to width"
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "4px",
                backgroundColor:
                  fitMode === "width" && !isManualZoom
                    ? "var(--studio-accent)"
                    : "transparent",
                color:
                  fitMode === "width" && !isManualZoom
                    ? "white"
                    : "var(--studio-text)",
                cursor: "pointer",
                border: "none",
              }}
            >
              Fit W
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "2px",
              backgroundColor: "var(--studio-border-5)",
              borderRadius: "6px",
              padding: "2px",
              border: "1px solid var(--studio-border)",
            }}
          >
            <button
              onClick={() => setPreviewLayout("single")}
              title="Single page layout"
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "4px",
                backgroundColor:
                  previewLayout === "single"
                    ? "var(--studio-text)"
                    : "transparent",
                color:
                  previewLayout === "single"
                    ? "var(--studio-bg)"
                    : "var(--studio-text)",
                cursor: "pointer",
                border: "none",
              }}
            >
              1 Pg
            </button>
            <button
              onClick={() => setPreviewLayout("double")}
              title="Double page layout"
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "4px",
                backgroundColor:
                  previewLayout === "double"
                    ? "var(--studio-text)"
                    : "transparent",
                color:
                  previewLayout === "double"
                    ? "var(--studio-bg)"
                    : "var(--studio-text)",
                cursor: "pointer",
                border: "none",
              }}
            >
              2 Pg
            </button>
          </div>

          <button
            onClick={() => {
              setIsReaderMode(!isReaderMode);
              setIsFocusMode(false);
              setIsManualZoom(false);
            }}
            title={isReaderMode ? "Exit reader mode" : "Enter reader mode"}
            style={{
              padding: "6px 12px",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderRadius: "6px",
              border: !isReaderMode ? "1px solid var(--studio-border)" : "none",
              backgroundColor: !isReaderMode
                ? "transparent"
                : "var(--studio-accent)",
              color: !isReaderMode ? "var(--studio-text)" : "white",
              cursor: "pointer",
              boxShadow: !isReaderMode
                ? "none"
                : "0 2px 8px var(--studio-accent-25)",
            }}
          >
            Read
          </button>

          <div
            style={{
              width: "1px",
              height: "18px",
              backgroundColor: "var(--studio-border-15)",
            }}
          />

          <span
            style={{
              padding: "6px 12px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "monospace",
              textTransform: "uppercase",
              backgroundColor: "var(--studio-border-5)",
              color: "var(--studio-text)",
              border: "1px solid var(--studio-border)",
              borderRadius: "6px",
            }}
          >
            {exportSize}
          </span>
          <div
            style={{
              width: "1px",
              height: "18px",
              backgroundColor: "var(--studio-border-15)",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontFamily: "monospace",
              color: "var(--studio-muted)",
            }}
          >
            {markdown.length} chars
          </span>
        </div>
      </div>

      <div
        ref={previewContainerRef}
        className="flex-1 overflow-auto scroll-smooth flex items-start justify-center"
        style={{
          backgroundColor: "var(--studio-bg)",
          padding: isMobile ? "32px 16px 120px 16px" : "32px 32px 120px 32px",
          minHeight: "100%",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: `${(previewLayout === "double" && exportMode === "PAGES" ? getDimensions(exportSize).width * 2 + 32 : getDimensions(exportSize).width) * canvasScale}px`,
              height: `${getDimensions(exportSize).height * canvasScale}px`,
              flexShrink: 0,
              transition:
                "width 0.5s cubic-bezier(0.19, 1, 0.22, 1), height 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
            }}
          >
            <div
              style={{
                transformOrigin: "top left",
                transform: `scale(${canvasScale})`,
                display: "flex",
                gap: "32px",
                transition: "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
              }}
            >
              <div
                ref={previewRef}
                id="designer-canvas"
                className="canvas-shadow transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] markdown-body relative overflow-hidden"
                style={{
                  ...themeVars,
                  width: `${getDimensions(exportSize).width}px`,
                  height: `${getDimensions(exportSize).height}px`,
                  backgroundColor: "var(--theme-bg)",
                  color: "var(--theme-text)",
                  fontFamily: "var(--theme-font)",
                  padding: "var(--theme-padding)",
                  borderRadius: "var(--theme-radius)",
                  border: "var(--theme-border)",
                  boxShadow: "var(--theme-shadow)",
                }}
              >
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                    .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
                      font-family: var(--theme-heading-font);
                      border-color: var(--theme-accent);
                      opacity: 1;
                      color: var(--theme-accent);
                    }
                    .markdown-body pre {
                      background: var(--theme-code-bg);
                      color: var(--theme-code-text);
                      padding: 1.25em;
                      border-radius: 4px;
                      border: 1px solid var(--theme-code-border);
                      overflow-x: auto;
                    }
                    .markdown-body pre code {
                      background: transparent;
                      color: inherit;
                      padding: 0;
                      border: none;
                    }
                    .markdown-body code {
                      background: var(--theme-code-bg);
                      color: var(--theme-code-text);
                      padding: 0.15em 0.4em;
                      border-radius: 3px;
                      font-size: 0.9em;
                      border: 1px solid var(--theme-code-border);
                    }
                    .markdown-body a { color: var(--theme-accent); border-bottom: 1px solid var(--theme-accent); text-decoration: none; }
                    .markdown-body strong { color: var(--theme-accent); font-weight: 700; }
                    .markdown-body hr { border-color: var(--theme-hr-color); border-style: var(--theme-hr-style); opacity: 0.5; }
                    .markdown-body ul li::marker, .markdown-body ol li::marker { color: var(--theme-accent); }
                    .markdown-body ol { list-style-type: decimal; padding-left: 1.5em; }
                    .markdown-body ul { list-style-type: disc; padding-left: 1.5em; }
                    .markdown-body blockquote {
                      padding-left: 1rem;
                      border-left: 4px solid var(--theme-blockquote-border);
                      background: var(--theme-blockquote-bg);
                      color: var(--theme-blockquote-text);
                    }
                    .markdown-body table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    .markdown-body th {
                      background: var(--theme-table-header-bg);
                      color: var(--theme-table-header-text);
                      border: 1px solid var(--theme-table-border);
                      padding: 0.5rem;
                      font-weight: 600;
                    }
                    .markdown-body td {
                      background: var(--theme-table-row-bg);
                      border: 1px solid var(--theme-table-border);
                      padding: 0.5rem;
                    } 
                 `,
                  }}
                />

                {isLoading && exportMode === "PAGES" ? (
                  <div className="flex items-center justify-center w-full h-full text-gray-500/50 mix-blend-difference font-mono text-sm leading-10">
                    Working formatting magic...
                  </div>
                ) : exportMode === "PAGES" ? (
                  <div className="w-full h-full relative overflow-hidden">
                    <div
                      key={`page-${currentPage}-${animationKeyRef.current}`}
                      className={`absolute inset-0 ${direction === "next" ? "animate-slide-in-right" : "animate-slide-in"}`}
                      dangerouslySetInnerHTML={{
                        __html: pages[currentPage] || "",
                      }}
                    />
                  </div>
                ) : (
                  <SinglePageViewer
                    htmlContent={renderedHtml}
                    theme={activeTheme}
                    exportSize={exportSize}
                  />
                )}
              </div>

              {previewLayout === "double" && exportMode === "PAGES" && (
                <div
                  id="designer-canvas-2"
                  className="canvas-shadow transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] markdown-body relative overflow-hidden"
                  style={{
                    ...themeVars,
                    width: `${getDimensions(exportSize).width}px`,
                    height: `${getDimensions(exportSize).height}px`,
                    backgroundColor: "var(--theme-bg)",
                    color: "var(--theme-text)",
                    fontFamily: "var(--theme-font)",
                    padding: "var(--theme-padding)",
                    borderRadius: "var(--theme-radius)",
                    border: "var(--theme-border)",
                    boxShadow: "var(--theme-shadow)",
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full h-full text-gray-500/50 mix-blend-difference font-mono text-sm leading-10">
                      Pagination in progress...
                    </div>
                  ) : (
                    <div className="w-full h-full relative overflow-hidden">
                      <div
                        key={`page-${currentPage + 1}-${animationKeyRef.current}`}
                        className={`absolute inset-0 ${direction === "next" ? "animate-slide-in-right" : "animate-slide-in"}`}
                        dangerouslySetInnerHTML={{
                          __html: pages[currentPage + 1] || "",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {exportMode === "PAGES" && pageCount > 1 && (
            <div
              data-testid="pagination-controls"
              style={{
                position: "absolute",
                bottom: "-50px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                backgroundColor: "var(--studio-surface)",
                border: "1px solid var(--studio-border)",
                borderRadius: "8px",
                boxShadow: "var(--studio-shadow-md)",
                zIndex: 10,
              }}
            >
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: currentPage === 0 ? "not-allowed" : "pointer",
                  opacity: currentPage === 0 ? 0.3 : 1,
                  color: "var(--studio-text)",
                  transition: "all 0.2s",
                }}
                title="Previous Page"
              >
                <svg
                  style={{ width: "14px", height: "14px" }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div
                data-testid="page-indicator"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  backgroundColor: "var(--studio-border-4)",
                  borderRadius: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "var(--studio-text)",
                    minWidth: "60px",
                    textAlign: "center",
                  }}
                >
                  {currentPage + 1} / {pageCount}
                </span>
              </div>

              <button
                onClick={goToNextPage}
                disabled={
                  previewLayout === "double"
                    ? currentPage >= pageCount - 2
                    : currentPage === pageCount - 1
                }
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: (
                    previewLayout === "double"
                      ? currentPage >= pageCount - 2
                      : currentPage === pageCount - 1
                  )
                    ? "not-allowed"
                    : "pointer",
                  opacity: (
                    previewLayout === "double"
                      ? currentPage >= pageCount - 2
                      : currentPage === pageCount - 1
                  )
                    ? 0.3
                    : 1,
                  color: "var(--studio-text)",
                  transition: "all 0.2s",
                }}
                title="Next Page"
              >
                <svg
                  style={{ width: "14px", height: "14px" }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
