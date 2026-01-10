import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#E0E5EC", // Cool Clay
  foreground: "#3D4852", // Dark Blue-Grey
  primary: "#6C63FF", // Soft Violet
  secondary: "#38B2AC", // Teal
  accent: "#6C63FF",
  muted: "#6B7280", // Cool Grey
  // Neumorphism relies on shadows, not borders
  border: "rgba(163, 177, 198, 0.2)",

  // Typography
  fontFamily: {
    body: '"DM Sans", sans-serif',
    heading: '"Plus Jakarta Sans", sans-serif',
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
    "4xl": "4.5rem",
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
    relaxed: 1.7,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.01em",
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
    thin: "0px",
    medium: "0px",
    thick: "0px",
  },

  // Effects
  shadow: {
    sm: "5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)",
    md: "9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)", // Extruded
    lg: "12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6)", // Hover Lift
    xl: "inset 10px 10px 20px rgb(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)", // Deep Inset
  },
  motion: {
    duration: {
      fast: "150ms",
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
      background: "#E0E5EC",
      text: "#3D4852",
      border: "transparent",
    },
    blockquote: {
      background: "#E0E5EC",
      text: "#3D4852",
      border: "#6C63FF",
    },
    table: {
      headerBackground: "#E0E5EC",
      headerText: "#3D4852",
      rowBackground: "transparent",
      border: "#E0E5EC",
    },
    hr: {
      color: "#A3B1C6",
      style: "solid",
    },
  },
};

export const neumorphism = createTheme({
  id: "modern-neu",
  name: "Neumorphism",
  category: "modern",
  description: "Soft UI with realistic dual-shadow plastic aesthetics.",
  isDark: false,
  tokens,
});
