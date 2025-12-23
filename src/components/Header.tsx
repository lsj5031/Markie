import React, { useState, useRef, useEffect } from "react";
import { ExportFormat, ExportSize, ExportMode } from "../types";
import * as Icons from "./Icons";

interface HeaderProps {
  projectName: string;
  setProjectName: (name: string) => void;
  exportSize: ExportSize;
  setExportSize: (size: ExportSize) => void;
  exportMode: ExportMode;
  setExportMode: (mode: ExportMode) => void;
  padding: number;
  setPadding: (padding: number) => void;
  onExport: (format: ExportFormat) => void;
  onToggleThemes?: () => void;
  isThemesOpen?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  setProjectName,
  exportSize,
  setExportSize,
  exportMode,
  setExportMode,
  onExport,
  onToggleThemes,
  isThemesOpen,
  className = "",
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportRef.current &&
        !exportRef.current.contains(event.target as Node)
      ) {
        setIsExportOpen(false);
      }
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExportSelect = (format: ExportFormat) => {
    onExport(format);
    setIsExportOpen(false);
  };

  return (
    <header
      className={`flex items-center justify-between px-4 lg:px-6 py-4 border-b z-20 shrink-0 ${className}`}
      style={{
        backgroundColor: "var(--studio-surface)",
        borderColor: "var(--studio-border)",
      }}
    >
      {/* Left: Branding & Title */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        {/* Logo Area */}
        <div className="flex items-center gap-3 select-none">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden group shadow-sm"
            style={{ backgroundColor: "var(--studio-accent)" }}
          >
            <div className="absolute inset-0 bg-white opacity-20 group-hover:opacity-30 transition-opacity" />
            <span className="font-bold text-lg text-white">M</span>
          </div>
          <span
            className="text-sm font-bold tracking-tight"
            style={{ color: "var(--studio-header-text)" }}
          >
            Markie
          </span>
        </div>

        {/* Divider */}
        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700 hidden sm:block opacity-30" />

        {/* Project Title Input */}
        <div className="flex-1 max-w-md hidden sm:block">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-medium text-sm hover:opacity-80 transition-opacity"
            style={{ color: "var(--studio-text)" }}
            placeholder="Project Name"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Page Setup Dropdown */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`action-btn secondary ${isSettingsOpen ? "bg-[rgba(235,59,90,0.08)]" : ""}`}
          >
            <Icons.Layout />
            <span className="hidden md:block">Page Setup</span>
            <Icons.ChevronDown />
          </button>

          {isSettingsOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                width: "260px",
                backgroundColor: "var(--studio-surface)",
                border: "1px solid var(--studio-border)",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                zIndex: 50,
                overflow: "hidden",
              }}
            >
              {/* Dropdown Header */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--studio-border)",
                  backgroundColor: "rgba(26,26,27,0.02)",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--studio-text)",
                    opacity: 0.6,
                  }}
                >
                  Page Setup
                </span>
              </div>

              <div style={{ padding: "16px" }}>
                {/* Paper Size */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "var(--studio-text)",
                      opacity: 0.5,
                      marginBottom: "8px",
                    }}
                  >
                    Paper Size
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                      padding: "4px",
                      backgroundColor: "rgba(26,26,27,0.04)",
                      borderRadius: "8px",
                    }}
                  >
                    {(["A4", "Square"] as ExportSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setExportSize(size)}
                        style={{
                          padding: "8px 12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          backgroundColor:
                            exportSize === size ? "#fff" : "transparent",
                          color: exportSize === size ? "#000" : "#666",
                          boxShadow:
                            exportSize === size
                              ? "0 2px 6px rgba(0,0,0,0.08)"
                              : "none",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout Mode */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "var(--studio-text)",
                      opacity: 0.5,
                      marginBottom: "8px",
                    }}
                  >
                    Layout Mode
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                      padding: "4px",
                      backgroundColor: "rgba(26,26,27,0.04)",
                      borderRadius: "8px",
                    }}
                  >
                    {[
                      { value: "PAGES", label: "Paged" },
                      { value: "CONTINUOUS", label: "Continuous" },
                    ].map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setExportMode(mode.value as ExportMode)}
                        style={{
                          padding: "8px 12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          backgroundColor:
                            exportMode === mode.value ? "#fff" : "transparent",
                          color: exportMode === mode.value ? "#000" : "#666",
                          boxShadow:
                            exportMode === mode.value
                              ? "0 2px 6px rgba(0,0,0,0.08)"
                              : "none",
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="action-btn primary"
          >
            <Icons.Export />
            <span>Export</span>
            <Icons.ChevronDown />
          </button>

          {isExportOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                width: "220px",
                backgroundColor: "var(--studio-surface)",
                border: "1px solid var(--studio-border)",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                zIndex: 50,
                overflow: "hidden",
              }}
            >
              {/* Dropdown Header */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--studio-border)",
                  backgroundColor: "rgba(26,26,27,0.02)",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--studio-text)",
                    opacity: 0.6,
                  }}
                >
                  Export As
                </span>
              </div>

              <div style={{ padding: "8px" }}>
                {/* PNG Export */}
                <button
                  onClick={() => handleExportSelect("PNG")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(235,59,90,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        color: "var(--studio-accent)",
                      }}
                    >
                      <Icons.Image />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--studio-text)",
                      }}
                    >
                      PNG Image
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--studio-text)",
                        opacity: 0.5,
                      }}
                    >
                      High quality raster
                    </span>
                  </div>
                </button>

                {/* SVG Export */}
                <button
                  onClick={() => handleExportSelect("SVG")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(0,61,130,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        color: "var(--studio-tertiary)",
                      }}
                    >
                      <Icons.FileText />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--studio-text)",
                      }}
                    >
                      SVG Vector
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--studio-text)",
                        opacity: 0.5,
                      }}
                    >
                      Scalable graphics
                    </span>
                  </div>
                </button>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "rgba(26,26,27,0.08)",
                    margin: "6px 8px",
                  }}
                />

                {/* PDF Export (Coming Soon) */}
                <button
                  disabled
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "not-allowed",
                    textAlign: "left",
                    opacity: 0.4,
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      border: "1px dashed rgba(26,26,27,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: "var(--studio-text)",
                      }}
                    >
                      PDF
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--studio-text)",
                      }}
                    >
                      PDF Document
                    </span>
                    <span
                      style={{ fontSize: "10px", color: "var(--studio-text)" }}
                    >
                      Coming soon
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
