import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#FFFDF5", // Warm Cream
  foreground: "#1E293B", // Slate 800
  primary: "#8B5CF6", // Vivid Violet
  secondary: "#F472B6", // Hot Pink
  accent: "#8B5CF6",
  muted: "#F1F5F9",
  border: "#E2E8F0",

  // Typography
  fontFamily: {
    body: '"Plus Jakarta Sans", system-ui, sans-serif',
    heading: '"Outfit", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: "0.875rem",
    sm: "1rem",
    base: "1.25rem", // Major third scale
    lg: "1.563rem",
    xl: "1.953rem",
    "2xl": "2.441rem",
    "3xl": "3.052rem",
    "4xl": "3.815rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 700,
    bold: 800, // ExtraBold for headings
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.02em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "6rem",
    element: "2rem",
  },

  // Shape
  borderRadius: {
    none: "0px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    full: "9999px",
  },
  borderWidth: {
    thin: "2px", // Chunky borders
    medium: "3px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "4px 4px 0px 0px #1E293B", // Hard shadow
    md: "6px 6px 0px 0px #1E293B",
    lg: "8px 8px 0px 0px #E2E8F0", // Soft hard shadow
    xl: "12px 12px 0px 0px #1E293B",
  },
  motion: {
    duration: {
      fast: "200ms",
      normal: "300ms",
      slow: "400ms",
    },
    easing: {
      default: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Bouncy
      in: "ease-in",
      out: "ease-out",
      inOut: "ease-in-out",
    },
  },

  // Components
  components: {
    code: {
      background: "#FFFFFF",
      text: "#1E293B",
      border: "#1E293B", // Hard border
    },
    blockquote: {
      background: "#FBBF24", // Amber background
      text: "#1E293B",
      border: "#1E293B",
    },
    table: {
      headerBackground: "#8B5CF6", // Violet header
      headerText: "#FFFFFF",
      rowBackground: "#FFFFFF",
      border: "#1E293B",
    },
    hr: {
      color: "#1E293B",
      style: "dashed", // Playful dashed line
    },
  },
};

export const playfulGeometric = createTheme({
  id: "artistic-playful",
  name: "Playful Geometric",
  category: "artistic",
  description: "Stable grid, wild decoration. Optimistic, tactile, and pop.",
  isDark: false,
  tokens,
});
