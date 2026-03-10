import React, { useMemo, useEffect } from "react";
import { THEMES } from "../constants/themes";
import * as Icons from "./Icons";
import { getThemeStyles } from "../utils/themeHelpers";

const THEME_CATEGORIES = [
  "editorial",
  "modern",
  "technical",
  "artistic",
  "minimalist",
  "other",
] as const;

interface SidebarProps {
  themeId: string;
  setThemeId: (id: string) => void;
  isMobile: boolean;
  showMobileThemes: boolean;
  setShowMobileThemes: (show: boolean) => void;
  isSidebarCollapsed: boolean;
  isFocusMode: boolean;
  isReaderMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  themeId,
  setThemeId,
  isMobile,
  showMobileThemes,
  setShowMobileThemes: _setShowMobileThemes,
  isSidebarCollapsed,
  isFocusMode,
  isReaderMode,
}) => {
  const groupedThemes = useMemo(() => {
    return THEME_CATEGORIES.reduce(
      (acc, category) => {
        acc[category] = THEMES.filter(
          (t) => ("category" in t ? t.category : "other") === category,
        );
        return acc;
      },
      {} as Record<string, typeof THEMES>,
    );
  }, []);

  // Auto-scroll to active theme
  useEffect(() => {
    const activeCard = document.querySelector(
      '.theme-card[data-active="true"]',
    );
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  return (
    <aside
      className={`sidebar ${
        isMobile
          ? `!absolute left-0 top-0 bottom-0 z-50 w-80 shadow-2xl transform transition-transform duration-300 ease-out ${
              showMobileThemes ? "translate-x-0" : "-translate-x-full"
            }`
          : "relative flex"
      } flex-col gap-0 ${
        !isMobile && isSidebarCollapsed ? "collapsed" : ""
      }`}
      style={{
        display: (isFocusMode || isReaderMode) && !isMobile ? "none" : undefined,
        backgroundColor: "var(--studio-surface)",
        borderRight: isSidebarCollapsed
          ? "none"
          : "3px solid var(--studio-border)",
        boxShadow: "inset -8px 0 20px var(--studio-border-2)",
        transition: "border-right 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
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
          <span className="sidebar-header-badge">{THEMES.length} Themes</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {THEME_CATEGORIES.map((category) => {
          const categoryThemes = groupedThemes[category] || [];
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
                      <div
                        className="w-full aspect-square rounded-lg mb-2 shadow-inner relative overflow-hidden ring-1 ring-black/5"
                        style={{ backgroundColor: styles.backgroundColor }}
                      >
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

      <div
        className="px-5 py-3 border-t-2"
        style={{
          borderColor: "var(--studio-border-10)",
          backgroundColor: "var(--studio-border-2)",
        }}
      >
        <p className="text-[10px] font-medium opacity-50">
          Choose a visual style for your design
        </p>
      </div>
    </aside>
  );
};
