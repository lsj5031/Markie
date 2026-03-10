import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#0a0a0f",
  foreground: "#e0e0e0",
  primary: "#00ff88", // Neon Green
  secondary: "#ff00ff", // Neon Magenta
  accent: "#00ff88",
  muted: "#1c1c2e",
  border: "#2a2a3a",

  // Typography
  fontFamily: {
    body: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    heading: '"Orbitron", "Share Tech Mono", monospace',
    mono: '"Share Tech Mono", monospace',
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
    normal: 1.6,
    relaxed: 1.8,
  },
  letterSpacing: {
    tight: "0em",
    normal: "0.05em",
    wide: "0.1em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "6rem",
    element: "1.5rem",
  },

  // Shape
  borderRadius: {
    none: "0px", // Chamfered usually prefer 0
    sm: "2px",
    md: "4px",
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
    sm: "0 0 5px #00ff88",
    md: "0 0 10px #00ff88, 0 0 20px rgba(0, 255, 136, 0.4)",
    lg: "0 0 15px #00ff88, 0 0 30px rgba(0, 255, 136, 0.6)",
    xl: "0 0 20px #00ff88, 0 0 60px rgba(0, 255, 136, 0.8)",
  },
  motion: {
    duration: {
      fast: "100ms",
      normal: "150ms",
      slow: "300ms",
    },
    easing: {
      default: "steps(4)",
      in: "steps(4)",
      out: "steps(4)",
      inOut: "steps(4)",
    },
  },

  // Components
  components: {
    code: {
      background: "rgba(0, 255, 136, 0.05)",
      text: "#00ff88",
      border: "#2a2a3a",
    },
    blockquote: {
      background: "rgba(255, 0, 255, 0.05)",
      text: "#e0e0e0",
      border: "#ff00ff",
    },
    table: {
      headerBackground: "#1c1c2e",
      headerText: "#00ff88",
      rowBackground: "transparent",
      border: "#2a2a3a",
    },
    hr: {
      color: "#2a2a3a",
      style: "dashed",
    },
  },
};

export const cyberpunk = createTheme({
  id: "technical-cyberpunk",
  name: "Cyberpunk Glitch",
  category: "technical",
  description:
    "High-tech low-life aesthetic with neon glows and glitch effects.",
  isDark: true,
  tokens,
});
