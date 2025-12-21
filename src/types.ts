export type ExportFormat = "PNG" | "SVG";
export type ExportSize = "SQUARE" | "A4" | "CUSTOM";
export type ExportMode = "PAGES" | "CONTINUOUS" | "SQUARE";

export interface Theme {
  id: string;
  name: string;
  description: string;
  styles: {
    fontFamily: string;
    headingFont: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    codeBackground: string;
    borderRadius: string;
    containerPadding: string;
    border?: string;
    shadow?: string;
  };
}

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
