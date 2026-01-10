import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#FDFCF8", // Off-white Rice Paper
  foreground: "#2C2C24", // Deep Loam
  primary: "#5D7052", // Moss Green
  secondary: "#C18C5D", // Terracotta
  accent: "#E6DCCD", // Sand
  muted: "#F0EBE5", // Stone
  border: "#DED8CF", // Raw Timber

  // Typography
  fontFamily: {
    body: '"Nunito", sans-serif',
    heading: '"Fraunces", serif',
    mono: '"Quicksand", sans-serif',
  },
  fontSize: {
    xs: "0.875rem",
    sm: "1rem",
    base: "1.125rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.75rem",
    "3xl": "2.25rem",
    "4xl": "3.5rem",
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
    wide: "0.02em", // Gentle
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "8rem",
    element: "2.5rem",
  },

  // Shape
  borderRadius: {
    none: "0",
    sm: "16px",
    md: "24px",
    lg: "32px",
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "0 4px 20px -2px rgba(93, 112, 82, 0.15)", // Moss tinted
    md: "0 10px 30px -5px rgba(93, 112, 82, 0.15)",
    lg: "0 20px 40px -10px rgba(193, 140, 93, 0.2)", // Clay tinted
    xl: "0 30px 60px -15px rgba(93, 112, 82, 0.25)",
  },
  motion: {
    duration: {
      fast: "300ms",
      normal: "500ms",
      slow: "700ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "ease-in",
      out: "ease-out",
      inOut: "ease-in-out",
    },
  },

  // Components
  components: {
    code: {
      background: "#F0EBE5",
      text: "#5D7052",
      border: "transparent",
    },
    blockquote: {
      background: "transparent",
      text: "#2C2C24",
      border: "#5D7052",
    },
    table: {
      headerBackground: "#F0EBE5",
      headerText: "#2C2C24",
      rowBackground: "transparent",
      border: "#DED8CF",
    },
    hr: {
      color: "#DED8CF",
      style: "solid",
    },
  },
};

export const natural = createTheme({
  id: "artistic-natural",
  name: "Organic Natural",
  category: "artistic",
  description: "Wabi-sabi aesthetic with amorphous soft shapes and earth tones.",
  isDark: false,
  tokens,
});
