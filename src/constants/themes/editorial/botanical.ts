import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors (Earthy & Muted)
  background: "#F9F8F4", // Warm Alabaster
  foreground: "#2D3A31", // Deep Forest Green
  primary: "#8C9A84", // Sage Green
  secondary: "#DCCFC2", // Soft Clay
  accent: "#C27B66", // Terracotta
  muted: "#DCCFC2",
  border: "#E6E2DA", // Stone

  // Typography
  fontFamily: {
    body: '"Source Sans 3", sans-serif',
    heading: '"Playfair Display", serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: "0.875rem",
    sm: "1rem",
    base: "1.125rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.875rem",
    "3xl": "2.5rem",
    "4xl": "4rem", // Large headlines
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.6,
    relaxed: 1.8,
  },
  letterSpacing: {
    tight: "-0.01em",
    normal: "0em",
    wide: "0.05em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "8rem",
    element: "2rem",
  },

  // Shape
  borderRadius: {
    none: "0",
    sm: "12px",
    md: "24px", // rounded-3xl
    lg: "40px", // Rounded arch feel
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "0 4px 6px -1px rgba(45, 58, 49, 0.05)",
    md: "0 10px 15px -3px rgba(45, 58, 49, 0.05)",
    lg: "0 20px 40px -10px rgba(45, 58, 49, 0.05)",
    xl: "0 25px 50px -12px rgba(45, 58, 49, 0.15)",
  },
  motion: {
    duration: {
      fast: "300ms",
      normal: "500ms",
      slow: "700ms",
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
      background: "#F2F0EB",
      text: "#2D3A31",
      border: "#E6E2DA",
    },
    blockquote: {
      background: "transparent",
      text: "#2D3A31",
      border: "#8C9A84",
    },
    table: {
      headerBackground: "#F2F0EB",
      headerText: "#2D3A31",
      rowBackground: "transparent",
      border: "#E6E2DA",
    },
    hr: {
      color: "#E6E2DA",
      style: "solid",
    },
  },
};

export const botanical = createTheme({
  id: "editorial-botanical",
  name: "Botanical",
  category: "editorial",
  description:
    "Organic softness with earthy tones and elegant serif typography.",
  isDark: false,
  tokens,
});
