import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { THEMES } from "./constants/themes";
import { ExportFormat, ExportSize, ExportMode, Theme } from "./types";
import { exportPreview } from "./services/exportService";
import { getDimensions } from "./utils/pagination";
import { MultiPageViewer } from "./components/MultiPageViewer";
import { SinglePageViewer } from "./components/SinglePageViewer";

const Icons = {
  Export: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg
      className="w-4 h-4"
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
      className="w-4 h-4"
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

const LONG_INITIAL_MARKDOWN = `# This is a long document to test pagination

## Chapter 1: The Beginning

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.

Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit.

Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed molestie augue sit amet leo consequat posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin vel ante a orci tempus eleifend ut et magna.

## Chapter 2: The Middle

Donec regista sapien eget diam rhoncus et scelerisque quam salute. Ut consequat, sem vitae tempus suscipit, enim lacus tincidunt duius, et vulputate lectus justo quis mi. Maecenas sem elit, semper eu pulvinar vel, customizely ut dui. Integer consectetur, massa id tincidunt proofread, sapien eros Mollis lacus, nec suscipit nulla mi sed justo.

### A subsection

Fusce lacinia, nunc sit amet tincidunt venenatis, enim sapien varius metus, eget ultricies sapien quam vitae est. Fusce sed dolor et Tormentum placerat. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio.

- One
- Two
- Three
- Four
- Five

## Chapter 3: The End

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.

\`\`\`javascript
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

A table:

| Header 1 | Header 2 | Header 3 |
| :--- | :--- | :--- |
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |

This should be plenty of content to cause pagination.

![A placeholder image](https://via.placeholder.com/600x400)

More text to push it over the edge. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.

And a final paragraph to make sure we have enough content to spill over to at least a second, and possibly a third page, depending on the font size and other theme settings. This is crucial for testing the pagination logic and ensuring that the page breaks are happening correctly.
`;

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(
    () => localStorage.getItem("lumina_md") || LONG_INITIAL_MARKDOWN,
  );
  const [themeId, setThemeId] = useState<string>(
    () => localStorage.getItem("lumina_theme") || THEMES[0].id,
  );
  const [projectName, setProjectName] = useState<string>(
    () => localStorage.getItem("lumina_project") || "Untitled Design",
  );
  const [exportSize, setExportSize] = useState<ExportSize>("A4");
  const [exportMode, setExportMode] = useState<ExportMode>("PAGES"); // Default to pages mode
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [showMultiPagePreview, setShowMultiPagePreview] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  const activeTheme: Theme = useMemo(
    () => THEMES.find((t) => t.id === themeId) || THEMES[0],
    [themeId],
  );

  useEffect(() => {
    localStorage.setItem("lumina_md", markdown);
    localStorage.setItem("lumina_theme", themeId);
    localStorage.setItem("lumina_project", projectName);
    localStorage.setItem("lumina_export_size", exportSize);
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
      if (!previewContainerRef.current) return;

      const containerRect = previewContainerRef.current.getBoundingClientRect();
      const padding = 160; // Account for side padding (80px each side)
      const availableWidth = containerRect.width - padding;

      const { width: canvasWidth } = getDimensions(exportSize);

      // Calculate scale to fit canvas in available width, max 0.65 to look good
      const scale = Math.min(availableWidth / canvasWidth, 0.65);
      setCanvasScale(Math.max(scale, 0.3)); // Min 0.3 to prevent too small
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [exportSize]);

  const handleExport = async (format: ExportFormat) => {
    if (previewRef.current) {
      await exportPreview(
        previewRef.current,
        format,
        exportSize,
        projectName.toLowerCase().replace(/\s+/g, "-"),
        activeTheme,
        renderedHtml, // Pass the raw rendered HTML content
        exportMode,
      );
    }
  };

  const renderedHtml = useMemo(
    () => DOMPurify.sanitize(marked.parse(markdown) as string),
    [markdown],
  );

  // Generate CSS variables for the theme
  const themeVars = {
    "--theme-bg": activeTheme.styles.backgroundColor,
    "--theme-text": activeTheme.styles.textColor,
    "--theme-accent": activeTheme.styles.accentColor,
    "--theme-font": activeTheme.styles.fontFamily,
    "--theme-heading-font": activeTheme.styles.headingFont,
    "--theme-code-bg": activeTheme.styles.codeBackground,
    "--theme-padding": activeTheme.styles.containerPadding,
    "--theme-radius": activeTheme.styles.borderRadius,
    "--theme-border": activeTheme.styles.border || "none",
    "--theme-shadow": activeTheme.styles.shadow || "none",
  } as React.CSSProperties;

  return (
    <div
      className="relative flex flex-col h-screen overflow-hidden text-sm selection:bg-[#eb3b5a]/20"
      style={{
        backgroundColor: "var(--studio-bg)",
        color: "var(--studio-text)",
      }}
    >
      {/* Top Header - Enhanced with better grouping and visual hierarchy */}
      <header
        className="h-16 flex items-center justify-between px-5 z-50 shrink-0 relative"
        style={{
          background:
            "linear-gradient(180deg, var(--studio-surface) 0%, rgba(254, 248, 236, 0.95) 100%)",
          borderBottom: "3px solid #1a1a1b",
          boxShadow: "0 4px 20px rgba(26, 26, 27, 0.04)",
        }}
      >
        {/* Decorative accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, var(--studio-accent) 0%, var(--studio-secondary) 50%, var(--studio-tertiary) 100%)",
          }}
        />

        {/* Left: Logo + Branding + Divider + Project Info + Format (Grouped) */}
        <div className="flex items-center gap-5 flex-1 min-w-0">
          {/* Brand section with enhanced logo */}
          <div className="flex items-center gap-3 shrink-0 group cursor-pointer">
            <div
              className="w-11 h-11 flex items-center justify-center text-white font-black text-lg tracking-tight transition-transform group-hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, var(--studio-accent) 0%, #c62a47 50%, #a01d3a 100%)",
                boxShadow:
                  "3px 3px 0px rgba(26, 26, 27, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              L
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span
                className="font-extrabold tracking-tight text-lg"
                style={{ color: "var(--studio-text)" }}
              >
                Lumina
              </span>
              <span
                className="text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ color: "var(--studio-accent)" }}
              >
                Studio
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-[2px] h-8 hidden md:block"
            style={{
              background:
                "linear-gradient(180deg, transparent, #1a1a1b30, transparent)",
            }}
          />

          {/* Project name input - subtle and refined */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0 max-w-[200px] px-3 py-2 transition-all duration-200 group border-b-2 border-transparent hover:border-[#1a1a1b20]"
            style={{ backgroundColor: "transparent" }}
          >
            <svg
              width="14"
              height="14"
              className="w-3.5 h-3.5 shrink-0 opacity-30 group-hover:opacity-50 transition-opacity"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none outline-none font-semibold text-sm tracking-tight"
              style={{ color: "var(--studio-text)" }}
              placeholder="Untitled Project"
            />
          </div>

          {/* Format Segmented Control - now with proper pill styling */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-40">
              Format
            </span>
            <div className="segmented-control">
              {["A4", "Square"].map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setExportSize(size.toUpperCase() as ExportSize)
                  }
                  className={`segmented-option ${exportSize === size.toUpperCase() ? "active" : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Export Mode Control */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-40">
              Mode
            </span>
            <div className="segmented-control">
              {[
                { value: "PAGES", label: "Pages" },
                { value: "CONTINUOUS", label: "Long" },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setExportMode(mode.value as ExportMode)}
                  className={`segmented-option ${exportMode === mode.value ? "active" : ""}`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions (Multi-page toggle + SVG Export + Export dropdown) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Multi-page Preview Toggle */}
          <button
            onClick={() => setShowMultiPagePreview(!showMultiPagePreview)}
            title="Toggle multi-page preview"
            className={`action-btn ${showMultiPagePreview ? "primary" : "secondary"}`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <span className="hidden xl:inline">
              {showMultiPagePreview ? "Single Page" : "Multi Page"}
            </span>
          </button>

          {/* SVG Export button (replaces Enhance button) */}
          <button
            onClick={() => handleExport("SVG")}
            title="Export vector SVG"
            className="action-btn secondary"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="hidden xl:inline">Export SVG</span>
          </button>

          {/* Export button - now exports PNG directly */}
          <button
            onClick={() => handleExport("PNG")}
            title="Export PNG"
            className="action-btn primary"
          >
            <Icons.Export />
            <span className="hidden xl:inline">Export</span>
          </button>
        </div>
      </header>

      <main ref={mainRef} className="flex-1 flex overflow-hidden relative">
        {/* Collapsible Sidebar: Enhanced Theme Browser */}
        <aside
          className={`sidebar hidden xl:flex flex-col gap-0 ${isSidebarCollapsed ? "collapsed" : ""}`}
          style={{
            backgroundColor: "var(--studio-surface)",
            borderRight: isSidebarCollapsed ? "none" : "3px solid #1a1a1b",
            boxShadow: "inset -8px 0 20px rgba(26, 26, 27, 0.02)",
          }}
        >
          {/* Sidebar Toggle Button - now inside sidebar, anchored to right edge */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="sidebar-toggle hidden xl:flex"
            title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            <Icons.ChevronLeft />
          </button>

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
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {THEMES.map((t) => {
              const isActive = themeId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  data-active={isActive}
                  className={`theme-card w-full text-left ${isActive ? "active" : ""}`}
                >
                  {/* Horizontal color swatch strip */}
                  <div className="theme-swatch-strip">
                    <div
                      className="swatch"
                      style={{ backgroundColor: t.styles.backgroundColor }}
                    />
                    <div
                      className="swatch"
                      style={{ backgroundColor: t.styles.textColor }}
                    />
                    <div
                      className="swatch"
                      style={{ backgroundColor: t.styles.accentColor }}
                    />
                  </div>

                  {/* Theme info with improved typography */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="theme-name block">{t.name}</span>
                      <p className="theme-description">{t.description}</p>
                    </div>
                    {isActive && (
                      <div className="theme-active-badge">
                        <Icons.Check />
                      </div>
                    )}
                  </div>
                </button>
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

        {/* Collapsed sidebar toggle - positioned at left edge when collapsed */}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="sidebar-toggle collapsed hidden xl:flex"
            title="Show sidebar"
          >
            <Icons.ChevronRight />
          </button>
        )}

        {/* Center Pane: Editor with dynamic width */}
        <section
          className="flex flex-col relative"
          style={{
            flex: `0 0 ${editorWidth}%`,
            backgroundColor: "var(--studio-bg)",
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
            <span className="pane-meta">
              {markdown.split("\n").length} lines
            </span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            className="editor-textarea flex-1 p-12 text-base leading-relaxed"
            placeholder="Your story begins here..."
          />
        </section>

        {/* Draggable Divider */}
        <div
          ref={dividerRef}
          className={`resizable-divider ${isDragging ? "dragging" : ""}`}
          onMouseDown={handleMouseDown}
          title="Drag to resize panes"
        />

        {/* Right Pane: Live Canvas with clean background */}
        <section
          className="flex flex-col overflow-hidden relative canvas-background"
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
            <div className="flex gap-3 items-center">
              <span
                className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1"
                style={{
                  backgroundColor: "rgba(26,26,27,0.05)",
                  color: "var(--studio-text)",
                }}
              >
                {exportSize}
              </span>
              <div
                className="w-[1px] h-4"
                style={{ backgroundColor: "rgba(26,26,27,0.15)" }}
              />
              <span className="pane-meta">{markdown.length} chars</span>
            </div>
          </div>

          {/* Preview container with centered canvas and space for navigation */}
          <div
            ref={previewContainerRef}
            className="flex-1 overflow-auto scroll-smooth flex items-start justify-center"
            style={{
              backgroundColor: "var(--studio-bg)",
              padding: "32px 80px 60px 80px", // Extra horizontal padding for side nav, bottom for page indicator
              minHeight: "100%",
            }}
          >
            {/* Scaling wrapper - maintains space for the scaled canvas */}
            <div
              style={{
                width: `${getDimensions(exportSize).width * canvasScale}px`,
                height: `${getDimensions(exportSize).height * canvasScale}px`,
                flexShrink: 0,
              }}
            >
              {/* The Actual Designer Canvas - rendered at full pagination size, then scaled */}
              <div
                ref={previewRef}
                id="designer-canvas"
                className="canvas-shadow transition-all duration-300 ease-in-out overflow-hidden markdown-body"
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
                }}
              >
                {/* Internal styling scoped to theme variables - with proper code block contrast */}
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                  #preview-content h1, #preview-content h2, #preview-content h3 {
                    font-family: var(--theme-heading-font);
                    border-color: var(--theme-accent);
                    opacity: 1;
                    color: inherit;
                  }
                  #preview-content pre {
                    background: #1e1e2e;
                    color: #cdd6f4;
                    padding: 1.25em;
                    border-radius: 4px;
                    border: 1px solid #313244;
                    overflow-x: auto;
                  }
                  #preview-content pre code {
                    background: transparent;
                    color: inherit;
                    padding: 0;
                    border: none;
                  }
                  #preview-content code {
                    background: rgba(0,0,0,0.08);
                    color: var(--theme-accent);
                    padding: 0.15em 0.4em;
                    border-radius: 3px;
                    font-size: 0.9em;
                  }
                  #preview-content a { color: var(--theme-accent); border-bottom: 1px solid var(--theme-accent); text-decoration: none; }
                  #preview-content strong { color: var(--theme-accent); font-weight: 700; }
                  #preview-content hr { border-color: var(--theme-text); opacity: 0.15; }
                  #preview-content ul li::marker, #preview-content ol li::marker { color: var(--theme-accent); }
                  #preview-content ol { list-style-type: decimal; padding-left: 1.5em; }
                  #preview-content ul { list-style-type: disc; padding-left: 1.5em; }
               `,
                  }}
                />

                {/* Render either single or multi-page viewer */}
                {showMultiPagePreview ? (
                  <MultiPageViewer
                    htmlContent={renderedHtml}
                    theme={activeTheme}
                    exportSize={exportSize}
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
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
