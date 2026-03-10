import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#FFFFFF",
  foreground: "#000000",
  primary: "#FF3333", // Swiss Red
  secondary: "#000000",
  accent: "#FF3333",
  muted: "#F2F2F2",
  border: "#E5E5E5",

  // Typography
  fontFamily: {
    body: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    heading: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem", // 16px
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    "4xl": "4.5rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.0,
    normal: 1.2,
    relaxed: 1.5,
  },
  letterSpacing: {
    tight: "-0.03em",
    normal: "0em",
    wide: "0.02em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "5rem",
    element: "1.5rem",
  },

  // Shape
  borderRadius: {
    none: "0px",
    sm: "0px",
    md: "0px",
    lg: "0px",
    full: "0px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "none",
    md: "none",
    lg: "none",
    xl: "none",
  },
  motion: {
    duration: {
      fast: "100ms",
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
      background: "#F5F5F5",
      text: "#000000",
      border: "transparent",
    },
    blockquote: {
      background: "transparent",
      text: "#000000",
      border: "#FF3333",
    },
    table: {
      headerBackground: "transparent",
      headerText: "#000000",
      rowBackground: "transparent",
      border: "#E5E5E5",
    },
    hr: {
      color: "#000000",
      style: "solid",
    },
  },
};

export const swiss = createTheme({
  id: "minimalist-swiss",
  name: "Swiss International",
  category: "minimal",
  description:
    "Objective clarity, mathematical precision, and strong grid structures.",
  isDark: false,
  tokens,
});
