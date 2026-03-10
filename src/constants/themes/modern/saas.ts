import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#FAFAFA",
  foreground: "#0F172A",
  primary: "#0052FF", // Electric Blue
  secondary: "#4D7CFF",
  accent: "#0052FF",
  muted: "#64748B",
  border: "#E2E8F0",

  // Typography
  fontFamily: {
    body: '"Inter", system-ui, sans-serif',
    heading: '"Calistoga", Georgia, serif',
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
    tight: 1.15,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.02em",
  },

  // Spacing
  spacing: {
    container: "2.5rem",
    section: "7rem",
    element: "1.25rem",
  },

  // Shape
  borderRadius: {
    none: "0",
    sm: "0.375rem",
    md: "0.75rem", // rounded-xl (12px)
    lg: "1rem", // rounded-2xl (16px)
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "0 1px 3px rgba(0,0,0,0.06)",
    md: "0 4px 6px rgba(0,0,0,0.07)",
    lg: "0 10px 15px rgba(0,0,0,0.08)",
    xl: "0 20px 25px rgba(0,0,0,0.1)",
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
      background: "#F1F5F9",
      text: "#0F172A",
      border: "#E2E8F0",
    },
    blockquote: {
      background: "rgba(0, 82, 255, 0.03)",
      text: "#0F172A",
      border: "#0052FF",
    },
    table: {
      headerBackground: "#F8FAFC",
      headerText: "#0F172A",
      rowBackground: "transparent",
      border: "#E2E8F0",
    },
    hr: {
      color: "#E2E8F0",
      style: "solid",
    },
  },
};

export const saas = createTheme({
  id: "modern-saas",
  name: "SaaS Minimal",
  category: "modern",
  description:
    "Confident, professional design with electric blue accents and sophisticated typography.",
  isDark: false,
  tokens,
});
