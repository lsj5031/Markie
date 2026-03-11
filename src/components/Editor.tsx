import React from "react";

interface EditorProps {
  markdown: string;
  setMarkdown: (md: string) => void;
  isFocusMode: boolean;
  setIsFocusMode: (f: boolean) => void;
  isReaderMode: boolean;
  setIsReaderMode: (r: boolean) => void;
  isMobile: boolean;
  mobileTab: "editor" | "preview";
  editorWidth: number;
}

export const Editor: React.FC<EditorProps> = ({
  markdown,
  setMarkdown,
  isFocusMode,
  setIsFocusMode,
  isReaderMode,
  setIsReaderMode,
  isMobile,
  mobileTab,
  editorWidth,
}) => {
  return (
    <section
      className={`flex-col relative lg:flex ${
        isMobile
          ? `mobile-pane ${mobileTab === "editor" ? "active flex" : "inactive"}`
          : "flex"
      } ${isFocusMode && !isMobile ? "flex-1" : ""} 
      ${!isMobile && !isFocusMode && editorWidth === 0 ? "hidden" : ""}`}
      style={{
        display: isReaderMode && !isMobile ? "none" : undefined,
        flex: isFocusMode
          ? "1"
          : isMobile
            ? "1 1 auto"
            : `0 0 ${editorWidth}%`,
        width: isMobile ? "100%" : undefined,
        backgroundColor: "var(--studio-bg)",
        transition: isMobile
          ? undefined
          : "flex 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
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
            onClick={() => {
              setIsFocusMode(!isFocusMode);
              setIsReaderMode(false);
            }}
            title={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
            className={`p-1.5 rounded-md transition-colors ${
              isFocusMode
                ? "bg-[var(--studio-accent)] text-white"
                : "text-gray-400 hover:text-[var(--studio-text)] hover:bg-black/5"
            }`}
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
          <span className="pane-meta">{markdown.split("\n").length} lines</span>
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
  );
};
