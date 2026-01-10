import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { MobileNavBar } from "./components/MobileNavBar";
import { THEMES, INITIAL_MARKDOWN } from "./constants/themes";
import { ExportFormat, ExportSize, ExportMode, Theme } from "./types";
import { exportPreview } from "./services/exportService";
import { getDimensions } from "./utils/pagination";
import { MultiPageViewer } from "./components/MultiPageViewer";
import { SinglePageViewer } from "./components/SinglePageViewer";
import { Header } from "./components/Header";
import * as Icons from "./components/Icons";

import { generateCuteName } from "./utils/nameGenerator";
import { getThemeStyles } from "./utils/themeHelpers";



const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(
    () => localStorage.getItem("markie_md") || INITIAL_MARKDOWN,
  );
  const [themeId, setThemeId] = useState<string>(
    () => localStorage.getItem("markie_theme") || THEMES[0].id,
  );
  const [projectName, setProjectName] = useState<string>(
    () => generateCuteName(),
  );
  const [exportSize, setExportSize] = useState<ExportSize>("A4");
  const [exportMode, setExportMode] = useState<ExportMode>("PAGES"); // Default to pages mode
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [isManualZoom, setIsManualZoom] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [exportPadding, setExportPadding] = useState<number>(64);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [showMobileThemes, setShowMobileThemes] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const previewRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  // Handle page navigation
  const handlePageChange = useCallback((page: number, total: number) => {
    setCurrentPage(page);
    setTotalPages(total);
  }, []);

  const goToPreviousPage = useCallback(() => {
    const nav = (window as unknown as Record<string, unknown>)
      .__multiPageNav as
      | {
        goToPreviousPage?: () => void;
      }
      | undefined;
    nav?.goToPreviousPage?.();
  }, []);

  const goToNextPage = useCallback(() => {
    const nav = (window as unknown as Record<string, unknown>)
      .__multiPageNav as
      | {
        goToNextPage?: () => void;
      }
      | undefined;
    nav?.goToNextPage?.();
  }, []);

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in editor/inputs
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

  const activeTheme: Theme = useMemo(
    () => THEMES.find((t) => t.id === themeId) || THEMES[0],
    [themeId],
  );

  useEffect(() => {
    localStorage.setItem("markie_md", markdown);
    localStorage.setItem("markie_theme", themeId);
    localStorage.setItem("markie_project", projectName);
    localStorage.setItem("markie_export_size", exportSize);
  }, [markdown, themeId, projectName]);

  // Auto-scroll to active theme in sidebar on mount
  useEffect(() => {
    const activeCard = document.querySelector(
      '.theme-card[data-active="true"]',
    );
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []); // Only on mount

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

    const handleMouseUp = () => {
      setIsDragging(false);
    };

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

  // Calculate canvas scale to fit container while maintaining WYSIWYG with pagination
  useEffect(() => {
    const updateScale = () => {
      if (isManualZoom) return;
      if (!previewContainerRef.current) return;

      const containerRect = previewContainerRef.current.getBoundingClientRect();
      const padding = isMobile ? 32 : 160; // 16px each side for mobile, 80px for desktop
      const availableWidth = containerRect.width - padding;

      const { width: canvasWidth } = getDimensions(exportSize);

      // Calculate scale to fit canvas in available width, max 0.65 to look good
      const scale = Math.min(availableWidth / canvasWidth, 0.65);
      setCanvasScale(Math.max(scale, 0.3)); // Min 0.3 to prevent too small
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [exportSize, isManualZoom, isMobile]); // Added isMobile dependency

  // Handle Ctrl+Wheel to zoom
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        // Normalize delta: trackpads send small pixels, mouse wheels send steps (approx 100)
        // We use a small factor to make it smooth for both if possible, or just clamp
        // Using a fixed step is safer for "steps" feel like the buttons
        const delta = e.deltaY > 0 ? -0.1 : 0.1;

        setCanvasScale((s) => {
          const newScale = Math.min(2, Math.max(0.1, s + delta));
          return Number(newScale.toFixed(2)); // Avoid precision float issues
        });
        setIsManualZoom(true);
      }
    };

    // Use { passive: false } to allow preventDefault (preventing browser zoom)
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const handleExport = async (format: ExportFormat) => {
    if (previewRef.current) {
      await exportPreview(
        previewRef.current,
        format,
        exportSize,
        projectName.toLowerCase().replace(/\s+/g, "-"),
        activeTheme,
        renderedHtml, // Pass the raw rendered HTML content
        exportPadding,
        exportMode,
      );
    }
  };

  const renderedHtml = useMemo(
    () => DOMPurify.sanitize(marked.parse(markdown) as string),
    [markdown],
  );

  // Generate CSS variables for the theme (New & Old System Compatibility)
  const themeVars = useMemo(() => {
    // Get unified styles for basic properties - acts as compatibility layer
    const styles = getThemeStyles(activeTheme);

    // Base variables derived primarily from shared styles
    const vars: Record<string, string> = {
      '--theme-bg': styles.backgroundColor,
      '--theme-text': styles.textColor,
      '--theme-accent': styles.accentColor,
      '--theme-border': styles.borderColor,

      // Font families
      '--theme-font': styles.fontFamily,
      '--theme-heading-font': styles.headingFont,
      '--theme-mono-font': styles.monoFont,

      // Component baselines
      '--theme-code-bg': styles.codeBackground,

      // Padding (using state)
      "--theme-padding": `${exportPadding}px`,
    };

    // If it's a new theme, inject all detailed tokens using the correct schema
    // If it's a new theme, inject all detailed tokens using the correct schema
    // if ('tokens' in activeTheme) { // Redundant now
    const t = activeTheme.tokens;

    // Detailed Colors
    vars['--theme-primary'] = t.primary;
    vars['--theme-secondary'] = t.secondary;
    vars['--theme-muted'] = t.muted;

    // Typography weights
    vars['--font-weight-normal'] = t.fontWeight.normal.toString();
    vars['--font-weight-bold'] = t.fontWeight.bold.toString();
    vars['--font-weight-heading'] = t.fontWeight.bold.toString();

    // Radius
    vars['--radius-sm'] = t.borderRadius.sm;
    vars['--radius-md'] = t.borderRadius.md;
    vars['--radius-lg'] = t.borderRadius.lg;
    vars['--radius-full'] = t.borderRadius.full;
    vars['--theme-radius'] = t.borderRadius.md; // Compat

    // Spacing
    vars['--spacing-section'] = t.spacing.section;
    vars['--spacing-container'] = t.spacing.container;
    vars['--spacing-element'] = t.spacing.element;

    // Shadows
    vars['--shadow-sm'] = t.shadow.sm;
    vars['--shadow-md'] = t.shadow.md;
    vars['--shadow-lg'] = t.shadow.lg;
    vars['--theme-shadow'] = t.shadow.md; // Compat

    // Component Specific
    vars['--theme-code-text'] = t.components.code.text;
    vars['--theme-code-border'] = t.components.code.border;

    vars['--theme-blockquote-bg'] = t.components.blockquote.background;
    vars['--theme-blockquote-border'] = t.components.blockquote.border;
    vars['--theme-blockquote-text'] = t.components.blockquote.text;

    vars['--theme-table-header-bg'] = t.components.table.headerBackground;
    vars['--theme-table-header-text'] = t.components.table.headerText;
    vars['--theme-table-row-bg'] = t.components.table.rowBackground;
    vars['--theme-table-border'] = t.components.table.border;

    vars['--theme-hr-color'] = t.components.hr.color;
    vars['--theme-hr-style'] = t.components.hr.style;

    // }

    return vars as React.CSSProperties;
  }, [activeTheme, exportPadding]);

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
        {/* Mobile Theme Backdrop */}
        {isMobile && showMobileThemes && (
          <div
            className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowMobileThemes(false)}
          />
        )}

        {/* Collapsible Sidebar: Enhanced Theme Browser */}
        <aside
          className={`sidebar ${isMobile
            ? `!absolute left-0 top-0 bottom-0 z-50 w-80 shadow-2xl transform transition-transform duration-300 ease-out ${showMobileThemes ? "translate-x-0" : "-translate-x-full"
            }`
            : "relative flex"
            } flex-col gap-0 ${!isMobile && isSidebarCollapsed ? "collapsed" : ""
            }`}
          style={{
            display: isFocusMode && !isMobile ? "none" : undefined,
            backgroundColor: "var(--studio-surface)",
            borderRight: isSidebarCollapsed ? "none" : "3px solid #1a1a1b",
            boxShadow: "inset -8px 0 20px rgba(26, 26, 27, 0.02)",
            transition: "border-right 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Sidebar header - with proper flex layout to prevent clipping */}
          <div className="sidebar-header">
            <div className="sidebar-header-content">
              <div className="sidebar-header-left">
                <div
                  className="w-2 h-2 shrink-0"
                  style={{ backgroundColor: "var(--studio-accent)" }}
                />
                <p
                  className="text-[11px] font-black uppercase tracking-[0.15em] truncate"
                  style={{ color: "var(--studio-text)" }}
                >
                  Design Systems
                </p>
              </div>
              <span className="sidebar-header-badge">
                {THEMES.length} Themes
              </span>
            </div>
          </div>

          {/* Theme list with redesigned cards - auto-scrolls to active theme */}
          {/* Theme list with Grouped Grid Layout */}
          <div className="flex-1 overflow-y-auto p-5">
            {(
              [
                "editorial",
                "modern",
                "technical",
                "artistic",
                "minimalist",
                "other",
              ] as const
            ).map((category) => {
              const categoryThemes = THEMES.filter(
                (t) => ("category" in t ? t.category : "other") === category,
              );

              if (categoryThemes.length === 0) return null;

              return (
                <div key={category} className="mb-6 last:mb-0">
                  <h3
                    className="text-[10px] font-black uppercase tracking-[0.15em] mb-3 px-1 opacity-40 ml-1"
                    style={{ color: "var(--studio-text)" }}
                  >
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {categoryThemes.map((t) => {
                      const isActive = themeId === t.id;
                      const styles = getThemeStyles(t);

                      return (
                        <button
                          key={t.id}
                          onClick={() => setThemeId(t.id)}
                          data-active={isActive}
                          title={`${t.name}: ${t.description}`}
                          className={`theme-card group relative flex flex-col text-left w-full rounded-xl ${isActive ? "active" : ""}`}
                        >
                          {/* Miniature Preview */}
                          <div
                            className="w-full aspect-square rounded-lg mb-2 shadow-inner relative overflow-hidden ring-1 ring-black/5"
                            style={{ backgroundColor: styles.backgroundColor }}
                          >
                            {/* Abstract Content representation */}
                            <div
                              className="absolute top-2 left-2 right-2 h-1 rounded-full opacity-20"
                              style={{ backgroundColor: styles.textColor }}
                            />
                            <div
                              className="absolute top-4 left-2 w-1/2 h-1 rounded-full opacity-20"
                              style={{ backgroundColor: styles.textColor }}
                            />
                            <div
                              className="absolute bottom-2 right-2 w-4 h-4 rounded-full opacity-80 shadow-sm"
                              style={{ backgroundColor: styles.accentColor }}
                            />
                          </div>

                          <div className="flex justify-between items-start gap-1">
                            <span
                              className="text-[10px] font-bold leading-tight line-clamp-2"
                              style={{ color: "var(--studio-text)" }}
                            >
                              {t.name}
                            </span>
                            {isActive && (
                              <div className="w-3 h-3 text-[var(--studio-accent)] shrink-0">
                                <Icons.Check />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar footer */}
          <div
            className="px-5 py-3 border-t-2"
            style={{
              borderColor: "rgba(26,26,27,0.1)",
              backgroundColor: "rgba(26,26,27,0.02)",
            }}
          >
            <p className="text-[10px] font-medium opacity-50">
              Choose a visual style for your design
            </p>
          </div>
        </aside>

        {/* Unified Sidebar Toggle Button */}
        {/* Unified Sidebar Toggle Button */}
        {!isFocusMode && (
          <button
            onClick={() =>
              isMobile
                ? setShowMobileThemes(!showMobileThemes)
                : setIsSidebarCollapsed(!isSidebarCollapsed)
            }
            className={`sidebar-toggle ${isSidebarCollapsed || isMobile ? "collapsed" : ""
              }`}
            title={
              isMobile
                ? "Toggle themes"
                : isSidebarCollapsed
                  ? "Show sidebar"
                  : "Hide sidebar"
            }
          >
            {isMobile ? (
              <Icons.Palette />
            ) : (
              <div
                style={{
                  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
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

        {/* Center Pane: Editor with dynamic width */}
        <section
          className={`flex-col relative lg:flex ${isMobile
            ? `mobile-pane ${mobileTab === "editor" ? "active flex" : "inactive"}`
            : "flex"
            }`}
          style={{
            flex: isFocusMode
              ? "1"
              : isMobile
                ? "1 1 auto"
                : `0 0 ${editorWidth}%`,
            width: isMobile ? "100%" : undefined,
            backgroundColor: "var(--studio-bg)",
            // Only apply flex transition on desktop; mobile uses CSS .mobile-pane transitions
            transition: isMobile ? undefined : "flex 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="pane-header">
            <div className="pane-header-label">
              <div className="flex gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--studio-accent)" }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--studio-secondary)" }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--studio-tertiary)" }}
                />
              </div>
              <span>Source</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFocusMode(!isFocusMode)}
                title={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
                className={`p-1.5 rounded-md transition-colors ${isFocusMode ? "bg-[var(--studio-accent)] text-white" : "text-gray-400 hover:text-[var(--studio-text)] hover:bg-black/5"}`}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {isFocusMode ? (
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  ) : (
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  )}
                </svg>
              </button>
              <span className="pane-meta">
                {markdown.split("\n").length} lines
              </span>
            </div>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            className="editor-textarea flex-1 px-3 py-6 md:p-8 lg:p-12 text-base leading-relaxed"
            placeholder="Your story begins here..."
          />
        </section>

        {/* Draggable Divider */}
        <div
          ref={dividerRef}
          className={`resizable-divider hidden lg:block ${isDragging ? "dragging" : ""
            } ${isFocusMode ? "hidden" : ""}`}
          onMouseDown={handleMouseDown}
          title="Drag to resize panes"
        />

        {/* Right Pane: Live Canvas with clean background */}
        <section
          className={`flex-col overflow-hidden relative canvas-background ${isFocusMode && !isMobile ? "hidden" : ""
            } lg:flex ${isMobile
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
                  backgroundColor: "rgba(26,26,27,0.05)",
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

              <button
                onClick={() => setIsManualZoom(false)}
                title="Fit to screen"
                style={{
                  padding: "6px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderRadius: "6px",
                  border: !isManualZoom
                    ? "none"
                    : "1px solid var(--studio-border)",
                  backgroundColor: !isManualZoom
                    ? "var(--studio-accent)"
                    : "transparent",
                  color: !isManualZoom ? "white" : "var(--studio-text)",
                  cursor: "pointer",
                  boxShadow: !isManualZoom
                    ? "0 2px 8px rgba(235,59,90,0.25)"
                    : "none",
                }}
              >
                Fit
              </button>

              <div
                style={{
                  width: "1px",
                  height: "18px",
                  backgroundColor: "rgba(26,26,27,0.15)",
                }}
              />

              <span
                style={{
                  padding: "6px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  backgroundColor: "rgba(26,26,27,0.05)",
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
                  backgroundColor: "rgba(26,26,27,0.15)",
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

          {/* Preview container with centered canvas and space for navigation */}
          <div
            ref={previewContainerRef}
            className="flex-1 overflow-auto scroll-smooth flex items-start justify-center"
            style={{
              backgroundColor: "var(--studio-bg)",
              padding: isMobile
                ? "32px 16px 120px 16px"
                : "32px 80px 120px 80px", // Extra bottom padding for pagination controls
              minHeight: "100%",
            }}
          >
            {/* Outer wrapper for positioning pagination controls outside scaled area */}
            <div style={{ position: "relative" }}>
              {/* Scaling wrapper - maintains space for the scaled canvas */}
              <div
                style={{
                  width: `${getDimensions(exportSize).width * canvasScale}px`,
                  height: `${getDimensions(exportSize).height * canvasScale}px`,
                  flexShrink: 0,
                  transition: "width 0.5s cubic-bezier(0.19, 1, 0.22, 1), height 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
                }}
              >
                {/* The Actual Designer Canvas - rendered at full pagination size, then scaled */}
                <div
                  ref={previewRef}
                  id="designer-canvas"
                  className="canvas-shadow transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] markdown-body"
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
                    position: "relative",
                    transformOrigin: "top left",
                    transform: `scale(${canvasScale})`,
                    transition: "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
                    overflow: "hidden",
                  }}
                >
                  {/* Internal styling scoped to theme variables - with proper code block contrast */}
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                    #preview-content h1, #preview-content h2, #preview-content h3, #preview-content h4, #preview-content h5, #preview-content h6 {
                      font-family: var(--theme-heading-font);
                      border-color: var(--theme-accent);
                      opacity: 1;
                      color: var(--theme-accent);
                    }
                    #preview-content pre {
                      background: var(--theme-code-bg);
                      color: var(--theme-code-text);
                      padding: 1.25em;
                      border-radius: 4px;
                      border: 1px solid var(--theme-code-border);
                      overflow-x: auto;
                    }
                    #preview-content pre code {
                      background: transparent;
                      color: inherit;
                      padding: 0;
                      border: none;
                    }
                    #preview-content code {
                      background: var(--theme-code-bg);
                      color: var(--theme-code-text);
                      padding: 0.15em 0.4em;
                      border-radius: 3px;
                      font-size: 0.9em;
                      border: 1px solid var(--theme-code-border);
                    }
                    #preview-content a { color: var(--theme-accent); border-bottom: 1px solid var(--theme-accent); text-decoration: none; }
                    #preview-content strong { color: var(--theme-accent); font-weight: 700; }
                    #preview-content hr { border-color: var(--theme-hr-color); border-style: var(--theme-hr-style); opacity: 0.5; }
                    #preview-content ul li::marker, #preview-content ol li::marker { color: var(--theme-accent); }
                    #preview-content ol { list-style-type: decimal; padding-left: 1.5em; }
                    #preview-content ul { list-style-type: disc; padding-left: 1.5em; }
                    #preview-content blockquote {
                      padding-left: 1rem;
                      border-left: 4px solid var(--theme-blockquote-border);
                      background: var(--theme-blockquote-bg);
                      color: var(--theme-blockquote-text);
                    }
                    #preview-content table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    #preview-content th {
                      background: var(--theme-table-header-bg);
                      color: var(--theme-table-header-text);
                      border: 1px solid var(--theme-table-border);
                      padding: 0.5rem;
                      font-weight: 600;
                    }
                    #preview-content td {
                      background: var(--theme-table-row-bg);
                      border: 1px solid var(--theme-table-border);
                      padding: 0.5rem;
                    } 
                 `,
                    }}
                  />

                  {/* Render either single or multi-page viewer (content only, no controls) */}
                  {exportMode === "PAGES" ? (
                    <MultiPageViewer
                      htmlContent={renderedHtml}
                      theme={activeTheme}
                      exportSize={exportSize}
                      padding={exportPadding}
                      onPageChange={handlePageChange}
                    />
                  ) : (
                    <SinglePageViewer
                      htmlContent={renderedHtml}
                      theme={activeTheme}
                      exportSize={exportSize}
                    />
                  )}
                </div>
              </div>

              {/* Pagination Controls - Outside scaled area */}
              {exportMode === "PAGES" && totalPages > 1 && (
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
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    zIndex: 10,
                  }}
                >
                  {/* Previous button */}
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

                  {/* Page number display */}
                  <div
                    data-testid="page-indicator"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      backgroundColor: "rgba(26,26,27,0.04)",
                      borderRadius: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--studio-accent)",
                      }}
                    >
                      {currentPage + 1}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "var(--studio-text)",
                        opacity: 0.4,
                      }}
                    >
                      /
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--studio-text)",
                      }}
                    >
                      {totalPages}
                    </span>
                  </div>

                  {/* Next button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: "6px",
                      cursor:
                        currentPage === totalPages - 1
                          ? "not-allowed"
                          : "pointer",
                      opacity: currentPage === totalPages - 1 ? 0.3 : 1,
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
        <MobileNavBar
          activeTab={mobileTab}
          setActiveTab={setMobileTab}
          showPagination={exportMode === "PAGES"}
          currentPage={currentPage}
          totalPages={totalPages}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </main>
    </div>
  );
};

export default App;
