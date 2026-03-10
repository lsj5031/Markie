import { useMemo } from "react";
import { Theme } from "../types";
import { getThemeStyles } from "../utils/themeHelpers";

export const useThemeVars = (activeTheme: Theme, exportPadding: number) => {
  const themeVars = useMemo(() => {
    const styles = getThemeStyles(activeTheme);

    const vars: Record<string, string> = {
      "--theme-bg": styles.backgroundColor,
      "--theme-text": styles.textColor,
      "--theme-accent": styles.accentColor,
      "--theme-border": styles.borderColor,

      // Font families
      "--theme-font": styles.fontFamily,
      "--theme-heading-font": styles.headingFont,
      "--theme-mono-font": styles.monoFont,

      // Component baselines
      "--theme-code-bg": styles.codeBackground,

      // Padding
      "--theme-padding": `${exportPadding}px`,
    };

    const t = activeTheme.tokens;

    // Detailed Colors
    vars["--theme-primary"] = t.primary;
    vars["--theme-secondary"] = t.secondary;
    vars["--theme-muted"] = t.muted;

    // Typography weights
    vars["--font-weight-normal"] = t.fontWeight.normal.toString();
    vars["--font-weight-bold"] = t.fontWeight.bold.toString();
    vars["--font-weight-heading"] = t.fontWeight.bold.toString();

    // Radius
    vars["--radius-sm"] = t.borderRadius.sm;
    vars["--radius-md"] = t.borderRadius.md;
    vars["--radius-lg"] = t.borderRadius.lg;
    vars["--radius-full"] = t.borderRadius.full;
    vars["--theme-radius"] = t.borderRadius.md;

    // Spacing
    vars["--spacing-section"] = t.spacing.section;
    vars["--spacing-container"] = t.spacing.container;
    vars["--spacing-element"] = t.spacing.element;

    // Shadows
    vars["--shadow-sm"] = t.shadow.sm;
    vars["--shadow-md"] = t.shadow.md;
    vars["--shadow-lg"] = t.shadow.lg;
    vars["--theme-shadow"] = t.shadow.md;

    // Component Specific
    vars["--theme-code-text"] = t.components.code.text;
    vars["--theme-code-border"] = t.components.code.border;

    vars["--theme-blockquote-bg"] = t.components.blockquote.background;
    vars["--theme-blockquote-border"] = t.components.blockquote.border;
    vars["--theme-blockquote-text"] = t.components.blockquote.text;

    vars["--theme-table-header-bg"] = t.components.table.headerBackground;
    vars["--theme-table-header-text"] = t.components.table.headerText;
    vars["--theme-table-row-bg"] = t.components.table.rowBackground;
    vars["--theme-table-border"] = t.components.table.border;

    vars["--theme-hr-color"] = t.components.hr.color;
    vars["--theme-hr-style"] = t.components.hr.style;

    return vars as React.CSSProperties;
  }, [activeTheme, exportPadding]);

  return themeVars;
};
