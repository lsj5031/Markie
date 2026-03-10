import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { MobileNavBar } from "./components/MobileNavBar";
import { THEMES, INITIAL_MARKDOWN } from "./constants/themes";
import { ExportFormat, ExportSize, ExportMode, Theme } from "./types";
import { exportPreview } from "./services/exportService";
import { usePagination } from "./hooks/usePagination";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";
import * as Icons from "./components/Icons";
import { generateCuteName } from "./utils/nameGenerator";
import { useThemeVars } from "./hooks/useThemeVars";
import { marked } from "marked";
import DOMPurify from "dompurify";

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(
    () => localStorage.getItem("markie_md") || INITIAL_MARKDOWN,
  );
  const [themeId, setThemeId] = useState<string>(
    () => localStorage.getItem("markie_theme") || THEMES[0].id,
  );
  const [projectName, setProjectName] = useState<string>(() =>
    generateCuteName(),
  );
  const [exportSize, setExportSize] = useState<ExportSize>("A4");
  const [exportMode, setExportMode] = useState<ExportMode>("PAGES");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [_isManualZoom, setIsManualZoom] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [exportPadding, setExportPadding] = useState<number>(64);
  const [currentPage, setCurrentPage] = useState(0);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [showMobileThemes, setShowMobileThemes] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [previewLayout, setPreviewLayout] = useState<"single" | "double">(
    "single",
  );
  const [fitMode, setFitMode] = useState<"page" | "width">("page");
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const previewRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const animationKeyRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const renderedHtml = useMemo(
    () => DOMPurify.sanitize(marked.parse(markdown) as string),
    [markdown],
  );

  const activeTheme: Theme = useMemo(
    () => THEMES.find((t) => t.id === themeId) || THEMES[0],
    [themeId],
  );

  const { pages, isLoading, pageCount } = usePagination(
    renderedHtml,
    activeTheme,
    exportSize,
    exportMode === "PAGES",
    exportPadding,
  );

  const themeVars = useThemeVars(activeTheme, exportPadding);

  const goToPreviousPage = useCallback(() => {
    setDirection("prev");
    animationKeyRef.current += 1;
    setCurrentPage((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setDirection("next");
    animationKeyRef.current += 1;
    setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1));
  }, [pageCount]);

  useEffect(() => {
    if (currentPage >= pageCount && pageCount > 0) {
      setCurrentPage(pageCount - 1);
    }
  }, [pageCount, currentPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "INPUT" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        goToPreviousPage();
      } else if (e.key === "ArrowRight") {
        goToNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPreviousPage]);

  useEffect(() => {
    localStorage.setItem("markie_md", markdown);
    localStorage.setItem("markie_theme", themeId);
    localStorage.setItem("markie_project", projectName);
    localStorage.setItem("markie_export_size", exportSize);
  }, [markdown, themeId, projectName, exportSize]);

  // Draggable divider logic
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !mainRef.current) return;
      const mainRect = mainRef.current.getBoundingClientRect();
      const sidebarWidth = isSidebarCollapsed ? 0 : 320;
      const availableWidth = mainRect.width - sidebarWidth;
      const offsetX = e.clientX - mainRect.left - sidebarWidth;
      const newWidth = Math.min(
        Math.max((offsetX / availableWidth) * 100, 25),
        75,
      );
      setEditorWidth(newWidth);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, isSidebarCollapsed]);

  const handleExport = async (format: ExportFormat) => {
    if (previewRef.current) {
      await exportPreview(
        previewRef.current,
        format,
        exportSize,
        projectName.toLowerCase().replace(/\s+/g, "-"),
        activeTheme,
        renderedHtml,
        exportPadding,
        exportMode,
      );
    }
  };

  return (
    <div
      className="relative flex flex-col h-[100dvh] overflow-hidden text-sm selection:bg-[#eb3b5a]/20"
      style={{
        backgroundColor: "var(--studio-bg)",
        color: "var(--studio-text)",
      }}
    >
      <Header
        projectName={projectName}
        setProjectName={setProjectName}
        exportSize={exportSize}
        setExportSize={setExportSize}
        exportMode={exportMode}
        setExportMode={setExportMode}
        padding={exportPadding}
        setPadding={setExportPadding}
        onExport={handleExport}
        onToggleThemes={() => setShowMobileThemes(!showMobileThemes)}
        isThemesOpen={showMobileThemes}
      />

      <main
        ref={mainRef}
        className="flex-1 flex overflow-hidden relative pb-16 lg:pb-0"
      >
        {isMobile && showMobileThemes && (
          <div
            className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowMobileThemes(false)}
          />
        )}

        <Sidebar
          themeId={themeId}
          setThemeId={setThemeId}
          isMobile={isMobile}
          showMobileThemes={showMobileThemes}
          setShowMobileThemes={setShowMobileThemes}
          isSidebarCollapsed={isSidebarCollapsed}
          isFocusMode={isFocusMode}
          isReaderMode={isReaderMode}
        />

        {!isFocusMode && !isReaderMode && (
          <button
            onClick={() =>
              isMobile
                ? setShowMobileThemes(!showMobileThemes)
                : setIsSidebarCollapsed(!isSidebarCollapsed)
            }
            className={`sidebar-toggle ${
              isSidebarCollapsed || isMobile ? "collapsed" : ""
            }`}
          >
            {isMobile ? (
              <Icons.Palette />
            ) : (
              <div
                style={{
                  transition:
                    "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: isSidebarCollapsed
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                <Icons.ChevronLeft />
              </div>
            )}
          </button>
        )}

        <Editor
          markdown={markdown}
          setMarkdown={setMarkdown}
          isFocusMode={isFocusMode}
          setIsFocusMode={setIsFocusMode}
          setIsReaderMode={setIsReaderMode}
          isMobile={isMobile}
          mobileTab={mobileTab}
          editorWidth={editorWidth}
        />

        {!isFocusMode && !isReaderMode && (
          <div
            className={`resizable-divider hidden lg:block ${
              isDragging ? "dragging" : ""
            }`}
            onMouseDown={handleMouseDown}
          />
        )}

        <Preview
          previewRef={previewRef}
          previewContainerRef={previewContainerRef}
          themeVars={themeVars}
          canvasScale={canvasScale}
          setCanvasScale={setCanvasScale}
          setIsManualZoom={setIsManualZoom}
          fitMode={fitMode}
          setFitMode={setFitMode}
          previewLayout={previewLayout}
          setPreviewLayout={setPreviewLayout}
          isReaderMode={isReaderMode}
          setIsReaderMode={setIsReaderMode}
          setIsFocusMode={setIsFocusMode}
          isFocusMode={isFocusMode}
          exportSize={exportSize}
          markdown={markdown}
          renderedHtml={renderedHtml}
          isLoading={isLoading}
          exportMode={exportMode}
          pages={pages}
          currentPage={currentPage}
          pageCount={pageCount}
          direction={direction}
          animationKeyRef={animationKeyRef}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          activeTheme={activeTheme}
          isMobile={isMobile}
          mobileTab={mobileTab}
        />

        <MobileNavBar
          activeTab={mobileTab}
          setActiveTab={setMobileTab}
          showPagination={exportMode === "PAGES"}
          currentPage={currentPage}
          totalPages={pageCount}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </main>
    </div>
  );
};

export default App;
