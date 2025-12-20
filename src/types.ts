
export type ExportFormat = 'PNG' | 'SVG' | 'PDF';
export type ExportSize = 'SQUARE' | 'A4' | 'CUSTOM';

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
}
