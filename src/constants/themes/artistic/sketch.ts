import { ThemeTokens } from "../schema";
import { createTheme } from "../validation";

const tokens: ThemeTokens = {
  // Core Colors
  background: "#FDFBF7", // Warm Paper
  foreground: "#2D2D2D", // Pencil Black
  primary: "#FF4D4D", // Correction Marker Red
  secondary: "#2D5DA1", // Ballpoint Blue
  accent: "#FFF9C4", // Post-it Yellow
  muted: "#E5E0D8", // Old Paper
  border: "#2D2D2D",

  // Typography
  fontFamily: {
    body: '"Patrick Hand", cursive',
    heading: '"Kalam", cursive',
    mono: '"Patrick Hand", cursive', // Mono doesn't precise logic here
  },
  fontSize: {
    xs: "0.875rem",
    sm: "1rem",
    base: "1.25rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
    "4xl": "4rem",
  },
  fontWeight: {
    normal: 400,
    medium: 400, // Hand fonts usually have limited weights
    semibold: 700,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: "-0.01em",
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
    none: "0",
    sm: "255px 15px 225px 15px / 15px 225px 15px 255px", // Wobbly
    md: "255px 15px 225px 15px / 15px 225px 15px 255px",
    lg: "255px 15px 225px 15px / 15px 225px 15px 255px",
    full: "50%",
  },
  borderWidth: {
    thin: "2px",
    medium: "3px",
    thick: "4px",
  },

  // Effects
  shadow: {
    sm: "2px 2px 0px 0px #2D2D2D",
    md: "4px 4px 0px 0px #2D2D2D",
    lg: "6px 6px 0px 0px #2D2D2D",
    xl: "8px 8px 0px 0px #2D2D2D",
  },
  motion: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
    },
    easing: {
      default: "steps(2)", // Stop motion feel
      in: "steps(2)",
      out: "steps(2)",
      inOut: "steps(2)",
    },
  },

  // Components
  components: {
    code: {
      background: "#FDFBF7",
      text: "#2D5DA1",
      border: "#2D2D2D",
    },
    blockquote: {
      background: "#FFF9C4", // Post-it
      text: "#2D2D2D",
      border: "transparent",
    },
    table: {
      headerBackground: "#E5E0D8",
      headerText: "#2D2D2D",
      rowBackground: "transparent",
      border: "#2D2D2D",
    },
    hr: {
      color: "#2D2D2D",
      style: "dashed",
    },
  },
};

export const sketch = createTheme({
  id: "artistic-sketch",
  name: "Hand Drawn",
  category: "artistic",
  description: "Authentic imperfection with wobbly lines and pencil textures.",
  isDark: false,
  tokens,
});
