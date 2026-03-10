import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors (Dark Mode Only)
  background: "#090014", // The Void
  foreground: "#E0E0E0", // Chrome Text
  primary: "#FF00FF", // Hot Magenta
  secondary: "#00FFFF", // Electric Cyan
  accent: "#FF9900", // Sunset Orange
  muted: "#2D1B4E",
  border: "#2D1B4E",

  // Typography
  fontFamily: {
    body: '"Share Tech Mono", monospace',
    heading: '"Orbitron", sans-serif',
    mono: '"Share Tech Mono", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1.125rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.875rem",
    "3xl": "3rem",
    "4xl": "4.5rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 700,
    bold: 900, // Black weight for headings
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.6,
    relaxed: 1.8,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0.05em",
    wide: "0.1em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "8rem",
    element: "2rem",
  },

  // Shape
  borderRadius: {
    none: "0px", // Aggressively geometric
    sm: "0px",
    md: "0px",
    lg: "0px",
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "0 0 10px #FF00FF", // Magenta Glow
    md: "0 0 20px rgba(0, 255, 255, 0.4)", // Cyan Glow
    lg: "0 0 30px rgba(255, 0, 255, 0.6)",
    xl: "0 0 50px rgba(0, 255, 255, 0.2)",
  },
  motion: {
    duration: {
      fast: "100ms", // Instants
      normal: "200ms", // Snappy
      slow: "300ms",
    },
    easing: {
      default: "linear", // Robotic
      in: "linear",
      out: "linear",
      inOut: "linear",
    },
  },

  // Components
  components: {
    code: {
      background: "rgba(26, 16, 60, 0.8)",
      text: "#00FFFF",
      border: "#FF00FF",
    },
    blockquote: {
      background: "rgba(255, 0, 255, 0.1)",
      text: "#E0E0E0",
      border: "#00FFFF",
    },
    table: {
      headerBackground: "rgba(26, 16, 60, 0.8)",
      headerText: "#FF00FF",
      rowBackground: "transparent",
      border: "#2D1B4E",
    },
    hr: {
      color: "#FF00FF",
      style: "solid",
    },
  },
};

export const vaporwave = createTheme({
  id: "artistic-vaporwave",
  name: "Vaporwave",
  category: "artistic",
  description:
    "Retro-futuristic synthetic reality with neon glows and digital grids.",
  isDark: true,
  tokens,
});
