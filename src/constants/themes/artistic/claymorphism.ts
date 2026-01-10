import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#F4F1FA", // Lavender White
  foreground: "#332F3A", // Soft Charcoal
  primary: "#7C3AED", // Vivid Violet
  secondary: "#DB2777", // Hot Pink
  accent: "#7C3AED",
  muted: "#635F69",
  border: "rgba(124, 58, 237, 0.1)",

  // Typography
  fontFamily: {
    body: '"DM Sans", sans-serif',
    heading: '"Nunito", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: "0.875rem",
    sm: "1rem",
    base: "1.125rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.875rem",
    "3xl": "2.25rem",
    "4xl": "3rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 700,
    bold: 800,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.625,
    relaxed: 1.8,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.02em",
  },

  // Spacing
  spacing: {
    container: "2rem",
    section: "6rem",
    element: "2rem",
  },

  // Shape
  borderRadius: {
    none: "0px",
    sm: "16px", // Super rounded
    md: "24px",
    lg: "32px",
    full: "60px",
  },
  borderWidth: {
    thin: "0px", // Clay relies on shadow
    medium: "1px",
    thick: "2px",
  },

  // Effects
  shadow: {
    sm: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff", // Soft clay
    md: "16px 16px 32px rgba(160, 150, 180, 0.2), -10px -10px 24px rgba(255, 255, 255, 0.9)", // Clay Card
    lg: "30px 30px 60px #cdc6d9, -30px -30px 60px #ffffff", // Deep Clay
    xl: "inset 10px 10px 20px #d9d4e3, inset -10px -10px 20px #ffffff", // Pressed
  },
  motion: {
    duration: {
      fast: "200ms",
      normal: "500ms",
      slow: "800ms",
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
      background: "#EFEBF5",
      text: "#332F3A",
      border: "transparent",
    },
    blockquote: {
      background: "rgba(124, 58, 237, 0.05)",
      text: "#332F3A",
      border: "#7C3AED",
    },
    table: {
      headerBackground: "#EFEBF5",
      headerText: "#332F3A",
      rowBackground: "transparent",
      border: "rgba(124, 58, 237, 0.1)",
    },
    hr: {
      color: "rgba(124, 58, 237, 0.1)",
      style: "solid",
    },
  },
};

export const claymorphism = createTheme({
  id: "artistic-clay",
  name: "Claymorphism",
  category: "artistic",
  description: "High-fidelity digital clay with soft lighting and tactile depth.",
  isDark: false,
  tokens,
});
