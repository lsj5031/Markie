export type ExportFormat = "PNG" | "SVG";
export type ExportSize = "SQUARE" | "A4" | "CUSTOM";
export type ExportMode = "PAGES" | "CONTINUOUS";

export interface AppState {
  markdown: string;
  themeId: string;
  exportSize: ExportSize;
  customWidth?: number;
  customHeight?: number;
  exportPadding?: number;
  exportMode?: ExportMode;
}

export interface ExportOptions {
  format: ExportFormat;
  size: ExportSize;
  padding: number;
  mode: ExportMode;
}

// New Theme System
import { Theme as NewTheme, ThemeTokens } from './constants/themes/schema';
export type { NewTheme, ThemeTokens };

export type Theme = NewTheme;
