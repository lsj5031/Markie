export interface ThemeTokens {
  // Core Colors
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;

  // Typography
  fontFamily: {
    body: string;
    heading: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };

  // Spacing
  spacing: {
    container: string;
    section: string;
    element: string;
  };

  // Shape
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  borderWidth: {
    thin: string;
    medium: string;
    thick: string;
  };

  // Effects
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Motion
  motion: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      default: string;
      in: string;
      out: string;
      inOut: string;
    };
  };

  // Component-specific
  components: {
    code: {
      background: string;
      text: string;
      border: string;
    };
    blockquote: {
      background: string;
      border: string;
      text: string;
    };
    table: {
      headerBackground: string;
      headerText: string;
      rowBackground: string;
      border: string;
    };
    hr: {
      style: string;
      color: string;
    };
  };
}

export type ThemeCategory =
  | "editorial"
  | "artistic"
  | "technical"
  | "professional"
  | "minimal"
  | "modern"
  | "organic"
  | "premium"
  | "motion";

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  isDark: boolean;
  tokens: ThemeTokens;
}
