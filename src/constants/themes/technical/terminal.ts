import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#0a0a0a",
  foreground: "#33ff00",
  primary: "#33ff00", // Terminal Green
  secondary: "#ffb000", // Amber
  accent: "#33ff00",
  muted: "#1f521f", // Dimmed green
  border: "#1f521f",

  // Typography (Flatted)
  fontFamily: {
    body: '"JetBrains Mono", "Fira Code", monospace',
    heading: '"JetBrains Mono", "Fira Code", monospace',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: "-0.05em",
    normal: "0em",
    wide: "0.05em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "4rem",
    element: "1rem",
  },

  // Shape (Flattened)
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

  // Effects (Flattened / Mapped)
  shadow: {
    sm: "none",
    md: "none",
    lg: "none",
    xl: "none",
  },
  motion: {
    duration: {
      fast: "0ms",
      normal: "0ms",
      slow: "0ms",
    },
    easing: {
      default: "linear",
      in: "linear",
      out: "linear",
      inOut: "linear",
    },
  },

  // Components
  components: {
    code: {
      background: "#000000",
      text: "#33ff00",
      border: "#1f521f",
    },
    blockquote: {
      background: "#000000",
      text: "#33ff00",
      border: "#33ff00",
    },
    table: {
      headerBackground: "#1f521f",
      headerText: "#33ff00",
      rowBackground: "transparent",
      border: "#1f521f",
    },
    hr: {
      color: "#1f521f",
      style: "dashed",
    },
  },
};

export const terminal = createTheme({
  id: "technical-terminal",
  name: "Terminal CLI",
  category: "technical",
  description: "Brutally functional, high-contrast, retro command line interface.",
  isDark: true,
  tokens,
});
