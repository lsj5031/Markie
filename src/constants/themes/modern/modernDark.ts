import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#050506",
  foreground: "#EDEDEF",
  primary: "#5E6AD2", // Indigo Accent
  secondary: "#6872D9",
  accent: "#5E6AD2",
  muted: "#8A8F98",
  border: "rgba(255,255,255,0.06)",

  // Typography
  fontFamily: {
    body: '"Inter", "Geist Sans", system-ui, sans-serif',
    heading: '"Inter", "Geist Sans", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem", // 16px
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
    relaxed: 1.625,
  },
  letterSpacing: {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "6rem",
    element: "1.5rem",
  },

  // Shape
  borderRadius: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "0 1px 3px rgba(0,0,0,0.2)",
    md: "0 4px 6px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.4), 0 0 80px rgba(94,106,210,0.1)",
    xl: "0 20px 25px rgba(0,0,0,0.5), 0 0 100px rgba(94,106,210,0.2)",
  },
  motion: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.16, 1, 0.3, 1)", // Expo out
      in: "ease-in",
      out: "ease-out",
      inOut: "ease-in-out",
    },
  },

  // Components
  components: {
    code: {
      background: "rgba(255,255,255,0.05)",
      text: "#EDEDEF",
      border: "rgba(255,255,255,0.06)",
    },
    blockquote: {
      background: "rgba(94,106,210,0.05)",
      text: "#EDEDEF",
      border: "#5E6AD2",
    },
    table: {
      headerBackground: "rgba(255,255,255,0.03)",
      headerText: "#EDEDEF",
      rowBackground: "transparent",
      border: "rgba(255,255,255,0.06)",
    },
    hr: {
      color: "rgba(255,255,255,0.06)",
      style: "solid",
    },
  },
};

export const modernDark = createTheme({
  id: "modern-linear-dark",
  name: "Modern Dark",
  category: "modern",
  description:
    "Cinematic, technical minimalism with ambient lighting and precision details.",
  isDark: true,
  tokens,
});
