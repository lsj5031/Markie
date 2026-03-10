import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#F0F0F0",
  foreground: "#121212",
  primary: "#D02020", // Bauhaus Red
  secondary: "#1040C0", // Bauhaus Blue
  accent: "#D02020",
  muted: "#E0E0E0",
  border: "#121212",

  // Typography
  fontFamily: {
    body: '"Outfit", sans-serif',
    heading: '"Outfit", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: "0.875rem",
    sm: "1rem",
    base: "1.125rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "2.5rem",
    "4xl": "3rem",
  },
  fontWeight: {
    normal: 500,
    medium: 700,
    semibold: 700,
    bold: 900,
  },
  lineHeight: {
    tight: 0.9,
    normal: 1.4,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: "-0.05em",
    normal: "0em",
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
    none: "0px",
    sm: "0px",
    md: "0px",
    lg: "0px",
    full: "9999px",
  },
  borderWidth: {
    thin: "2px",
    medium: "4px",
    thick: "8px",
  },

  // Effects
  shadow: {
    sm: "3px 3px 0px 0px #121212",
    md: "6px 6px 0px 0px #121212",
    lg: "8px 8px 0px 0px #121212",
    xl: "12px 12px 0px 0px #121212",
  },
  motion: {
    duration: {
      fast: "100ms",
      normal: "200ms",
      slow: "300ms",
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
      background: "#FFFFFF",
      text: "#121212",
      border: "#121212",
    },
    blockquote: {
      background: "#F0C020",
      text: "#121212",
      border: "#121212",
    },
    table: {
      headerBackground: "#1040C0",
      headerText: "#FFFFFF",
      rowBackground: "white",
      border: "#121212",
    },
    hr: {
      color: "#121212",
      style: "solid",
    },
  },
};

export const bauhaus = createTheme({
  id: "artistic-bauhaus",
  name: "Bauhaus",
  category: "artistic",
  description:
    "Constructivist modernism with pure geometry and primary colors.",
  isDark: false,
  tokens,
});
