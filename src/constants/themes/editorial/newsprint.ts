import { Theme } from '../schema';
import { createTheme } from '../validation';

const tokens = {
  // Colors (Newsprint Palette)
  background: '#F9F9F7',
  foreground: '#111111',
  primary: '#111111',
  secondary: '#525252',
  accent: '#CC0000',
  muted: '#E5E5E0',
  border: '#111111',

  fontFamily: {
    body: '"Lora", Georgia, serif',
    heading: '"Playfair Display", "Times New Roman", serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 0.9,
    normal: 1.625,
    relaxed: 1.625,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.1em',
  },
  spacing: {
    container: '80rem', // max-w-screen-xl (1280px)
    section: '4rem', // py-16
    element: '1rem',
  },
  borderRadius: {
    none: '0px',
    sm: '0px',
    md: '0px',
    lg: '0px',
    full: '0px',
  },
  borderWidth: {
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
  shadow: {
    sm: '2px 2px 0px 0px #111111',
    md: '4px 4px 0px 0px #111111', // Hard offset shadow
    lg: '6px 6px 0px 0px #111111',
    xl: '8px 8px 0px 0px #111111',
  },
  motion: {
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'ease-out',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
    },
  },
  components: {
    code: {
      background: '#E5E5E0',
      text: '#111111',
      border: '#111111',
    },
    blockquote: {
      background: '#F9F9F7',
      border: '#111111',
      text: '#111111',
    },
    table: {
      headerBackground: '#E5E5E0',
      headerText: '#111111',
      rowBackground: '#F9F9F7',
      border: '#111111',
    },
    hr: {
      style: 'solid',
      color: '#111111',
    },
  },
};

export const newsprint: Theme = createTheme({
  id: 'newsprint',
  name: 'Newsprint',
  description: 'Absolute clarity. High-contrast typography and stark geometry.',
  category: 'editorial',
  isDark: false,
  tokens,
});
