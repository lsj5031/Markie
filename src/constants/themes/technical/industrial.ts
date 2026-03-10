import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#E0E5EC", // Chassis Grey
  foreground: "#2D3436", // Charcoal Ink
  primary: "#FF4757", // Safety Orange
  secondary: "#2D3436", // Steel
  accent: "#FF4757",
  muted: "#D1D9E6", // Recessed Grey
  border: "#BABECC", // Shadow Color

  // Typography
  fontFamily: {
    body: '"Inter", sans-serif',
    heading: '"Inter", sans-serif',
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
    bold: 700, // ExtraBold for headings
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.6,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.05em",
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
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px",
  },
  borderWidth: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "4px 4px 8px #babecc, -4px -4px 8px #ffffff", // Neumorphic shallow
    md: "8px 8px 16px #babecc, -8px -8px 16px #ffffff", // Standard
    lg: "12px 12px 24px #babecc, -12px -12px 24px #ffffff", // Floating
    xl: "inset 6px 6px 12px #babecc, inset -6px -6px 12px #ffffff", // Pressed
  },
  motion: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Bouncier
      in: "ease-in",
      out: "ease-out",
      inOut: "ease-in-out",
    },
  },

  // Components
  components: {
    code: {
      background: "#E0E5EC",
      text: "#2D3436",
      border: "transparent", // relying on shadow
    },
    blockquote: {
      background: "#E0E5EC",
      text: "#2D3436",
      border: "#FF4757",
    },
    table: {
      headerBackground: "#D1D9E6",
      headerText: "#2D3436",
      rowBackground: "transparent",
      border: "#BABECC",
    },
    hr: {
      color: "#BABECC",
      style: "solid",
    },
  },
};

export const industrial = createTheme({
  id: "technical-industrial",
  name: "Industrial",
  category: "technical",
  description:
    "Tactile precision with neumorphic depth and mechanical details.",
  isDark: false,
  tokens,
});
