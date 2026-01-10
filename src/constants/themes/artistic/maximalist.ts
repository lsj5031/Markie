import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors (Dark Mode Foundation)
  background: "#0D0D1A", // Deep Cosmic Purple-Black
  foreground: "#FFFFFF",
  primary: "#FF3AF2", // Hot Magenta
  secondary: "#00F5D4", // Electric Cyan
  accent: "#FFE600", // Screaming Yellow
  muted: "#2D1B4E", // Dark Purple
  border: "#FF3AF2", // Magenta

  // Typography
  fontFamily: {
    body: '"DM Sans", sans-serif',
    heading: '"Outfit", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: "0.875rem",
    sm: "1rem",
    base: "1.25rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "5rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 700,
    bold: 900,
  },
  lineHeight: {
    tight: 0.9,
    normal: 1.625,
    relaxed: 1.8,
  },
  letterSpacing: {
    tight: "-0.05em", // Tight for headlines
    normal: "0em",
    wide: "0.1em", // Wide for labels
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
    sm: "16px",
    md: "24px",
    lg: "32px",
    full: "9999px",
  },
  borderWidth: {
    thin: "2px",
    medium: "4px",
    thick: "8px",
  },

  // Effects
  shadow: {
    sm: "2px 2px 0px #7B2FFF, 4px 4px 0px #FF3AF2", // Hard Stack
    md: "8px 8px 0px #FFE600, 16px 16px 0px #FF3AF2", // Double Stack
    lg: "12px 12px 0px #00F5D4, 24px 24px 0px #FF3AF2, 36px 36px 0px #FFE600", // Triple Stack
    xl: "0 0 40px rgba(255, 58, 242, 0.6), 0 0 80px rgba(255, 230, 0, 0.4)", // Mega Glow
  },
  motion: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // Bouncy
      in: "ease-in",
      out: "ease-out",
      inOut: "ease-in-out",
    },
  },

  // Components
  components: {
    code: {
      background: "#2D1B4E",
      text: "#FFFFFF",
      border: "#00F5D4",
    },
    blockquote: {
      background: "#2D1B4E",
      text: "#FFFFFF",
      border: "#FFE600",
    },
    table: {
      headerBackground: "#2D1B4E",
      headerText: "#FFFFFF",
      rowBackground: "transparent",
      border: "#FF3AF2",
    },
    hr: {
      color: "#FF3AF2",
      style: "dashed",
    },
  },
};

export const maximalist = createTheme({
  id: "artistic-maximalist",
  name: "Dopamine",
  category: "artistic",
  description: "Unapologetic excess with clashing colors, patterns, and sensory overload.",
  isDark: true,
  tokens,
});
