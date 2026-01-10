import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#C0C0C0", // Windows 95 Gray
  foreground: "#000000",
  primary: "#000080", // Windows Navy
  secondary: "#0000FF", // Link Blue
  accent: "#FF0000", // Hot Red
  muted: "#808080", // Shadow Gray
  border: "#000000",

  // Typography
  fontFamily: {
    body: '"MS Sans Serif", "Segoe UI", Tahoma, sans-serif',
    heading: '"Arial Black", Impact, sans-serif',
    mono: '"Courier New", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    "4xl": "4rem",
  },
  fontWeight: {
    normal: 400,
    medium: 700, // Retro fonts are often regular or bold
    semibold: 700,
    bold: 900,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: "-0.05em",
    normal: "0em",
    wide: "0.02em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "4rem",
    element: "1rem", // Dense spacing
  },

  // Shape
  borderRadius: {
    none: "0px",
    sm: "0px",
    md: "0px",
    lg: "0px",
    full: "0px", // No rounding in the 90s
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    // 3D Bevels
    sm: "inset -1px -1px 0 #404040, inset 1px 1px 0 #dfdfdf", // Outset
    md: "inset -2px -2px 0 #808080, inset 2px 2px 0 #ffffff, inset -4px -4px 0 #404040, inset 4px 4px 0 #dfdfdf", // Enhanced
    lg: "10px 10px 0px #000000", // Drop shadow for containers
    xl: "inset 2px 2px 0 #404040, inset -2px -2px 0 #dfdfdf", // Inset/Pressed
  },
  motion: {
    duration: {
      fast: "0ms", // Instant
      normal: "50ms", // Snap
      slow: "3000ms", // Linear cycles
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
      background: "#FFFFFF",
      text: "#000000",
      border: "#808080",
    },
    blockquote: {
      background: "#FFFFCC", // Notepad Yellow
      text: "#000000",
      border: "#000000",
    },
    table: {
      headerBackground: "#c0c0c0",
      headerText: "#000000",
      rowBackground: "#FFFFFF",
      border: "#808080",
    },
    hr: {
      color: "#808080",
      style: "groove", // Authentic HTML groove
    },
  },
};

export const retro = createTheme({
  id: "artistic-retro",
  name: "Retro 90s",
  category: "artistic",
  description: "Authentic 90s nostalgia with beveled edges and system fonts.",
  isDark: false,
  tokens,
});
