import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#0A0A0F", // Deep Slate
  foreground: "#FAFAFA",
  primary: "#F59E0B", // Amber
  secondary: "#1A1A24",
  accent: "#F59E0B",
  muted: "#1A1A24",
  border: "rgba(255, 255, 255, 0.08)",

  // Typography
  fontFamily: {
    body: '"Inter", system-ui, sans-serif',
    heading: '"Space Grotesk", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    "4xl": "2.5rem",
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
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "6rem", // Generous spacing
    element: "1.5rem",
  },

  // Shape
  borderRadius: {
    none: "0",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.3)",
    xl: "0 0 20px rgba(245, 158, 11, 0.15)", // Ambient glow
  },
  motion: {
    duration: {
      fast: "200ms",
      normal: "300ms",
      slow: "500ms",
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
      background: "rgba(26, 26, 36, 0.6)", // Semi-transparent
      text: "#FAFAFA",
      border: "rgba(255, 255, 255, 0.08)",
    },
    blockquote: {
      background: "transparent",
      text: "#FAFAFA",
      border: "#F59E0B",
    },
    table: {
      headerBackground: "rgba(26, 26, 36, 0.6)",
      headerText: "#FAFAFA",
      rowBackground: "transparent",
      border: "rgba(255, 255, 255, 0.08)",
    },
    hr: {
      color: "rgba(255, 255, 255, 0.08)",
      style: "solid",
    },
  },
};

export const minimalDark = createTheme({
  id: "minimal-dark",
  name: "Minimalist Dark",
  category: "minimal",
  description: "Atmospheric depth with warm amber accents.",
  isDark: true,
  tokens,
});
