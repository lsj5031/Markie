import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#FAFAF8", // Ivory
  foreground: "#1A1A1A", // Rich Black
  primary: "#B8860B", // Burnished Gold
  secondary: "#6B6B6B", // Warm Gray
  accent: "#B8860B",
  muted: "#F5F3F0",
  border: "#E8E4DF",

  // Typography
  fontFamily: {
    body: '"Source Sans 3", system-ui, sans-serif',
    heading: '"Playfair Display", Georgia, serif',
    mono: '"IBM Plex Mono", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2.25rem",
    "4xl": "3rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.75, // Relaxed
    relaxed: 1.9,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0.01em",
    wide: "0.15em", // For small caps
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "8rem", // py-32 to py-44
    element: "2rem",
  },

  // Shape
  borderRadius: {
    none: "0",
    sm: "2px",
    md: "4px",
    lg: "8px",
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "0 1px 2px rgba(26,26,26,0.04)",
    md: "0 4px 12px rgba(26,26,26,0.06)",
    lg: "0 8px 24px rgba(26,26,26,0.08)",
    xl: "0 12px 32px rgba(26,26,26,0.12)",
  },
  motion: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
    },
    easing: {
      default: "ease-out",
      in: "ease-in",
      out: "ease-out",
      inOut: "ease-in-out",
    },
  },

  // Components
  components: {
    code: {
      background: "#F5F3F0",
      text: "#1A1A1A",
      border: "#E8E4DF",
    },
    blockquote: {
      background: "transparent",
      text: "#1A1A1A",
      border: "#B8860B",
    },
    table: {
      headerBackground: "#F5F3F0",
      headerText: "#1A1A1A",
      rowBackground: "transparent",
      border: "#E8E4DF",
    },
    hr: {
      color: "#E8E4DF",
      style: "solid",
    },
  },
};

export const classicSerif = createTheme({
  id: "editorial-serif",
  name: "Classic Serif",
  category: "editorial",
  description: "Typographic elegance through classical restraint and warm ivory tones.",
  isDark: false,
  tokens,
});
