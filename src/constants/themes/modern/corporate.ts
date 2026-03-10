import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#F8FAFC", // Slate 50
  foreground: "#0F172A", // Slate 900
  primary: "#4F46E5", // Indigo 600
  secondary: "#7C3AED", // Violet 600
  accent: "#10B981", // Emerald 500
  muted: "#F1F5F9", // Slate 100
  border: "#E2E8F0", // Slate 200

  // Typography
  fontFamily: {
    body: '"Plus Jakarta Sans", sans-serif',
    heading: '"Plus Jakarta Sans", sans-serif',
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
    // Headings use ExtraBold (800)
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
    section: "6rem",
    element: "1.5rem",
  },

  // Shape
  borderRadius: {
    none: "0",
    sm: "4px",
    md: "8px", // rounded-lg
    lg: "12px", // rounded-xl
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  motion: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
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
      background: "#F1F5F9",
      text: "#0F172A",
      border: "#E2E8F0",
    },
    blockquote: {
      background: "#F8FAFC",
      text: "#0F172A",
      border: "#4F46E5",
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

export const corporate = createTheme({
  id: "modern-corporate",
  name: "Corporate Trust",
  category: "modern",
  description:
    "Professional SaaS aesthetic with trust-building blues and clean geometry.",
  isDark: false,
  tokens,
});
