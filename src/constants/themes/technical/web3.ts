import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#030304",
  foreground: "#FFFFFF",
  primary: "#F7931A", // Bitcoin Orange
  secondary: "#EA580C", // Burnt Orange
  accent: "#F7931A",
  muted: "#94A3B8",
  border: "#1E293B",

  // Typography
  fontFamily: {
    body: '"Inter", sans-serif',
    heading: '"Space Grotesk", sans-serif',
    mono: '"JetBrains Mono", monospace',
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
    tight: 1.15,
    normal: 1.6,
    relaxed: 1.8,
  },
  letterSpacing: {
    tight: "-0.01em",
    normal: "0em",
    wide: "0.05em", // Wide tracking for mono
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "6rem",
    element: "2rem",
  },

  // Shape
  borderRadius: {
    none: "0",
    sm: "8px",
    md: "12px", // rounded-xl
    lg: "16px", // rounded-2xl
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "0 0 20px -5px rgba(234,88,12,0.5)", // Orange glow
    md: "0 0 30px -5px rgba(247,147,26,0.6)",
    lg: "0 0 50px -10px rgba(247,147,26,0.1)", // Card elevation
    xl: "0 0 60px -10px rgba(247,147,26,0.2)",
  },
  motion: {
    duration: {
      fast: "200ms",
      normal: "300ms",
      slow: "500ms",
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
      background: "rgba(247, 147, 26, 0.05)",
      text: "#F7931A",
      border: "rgba(247, 147, 26, 0.2)",
    },
    blockquote: {
      background: "rgba(255, 255, 255, 0.03)",
      text: "#FFFFFF",
      border: "#F7931A",
    },
    table: {
      headerBackground: "rgba(255, 255, 255, 0.05)",
      headerText: "#FFFFFF",
      rowBackground: "transparent",
      border: "#1E293B",
    },
    hr: {
      color: "#1E293B",
      style: "solid",
    },
  },
};

export const web3 = createTheme({
  id: "technical-web3",
  name: "Web3 DeFi",
  category: "technical",
  description: "Cryptographic trust, mathematical precision, and digital gold.",
  isDark: true,
  tokens,
});
