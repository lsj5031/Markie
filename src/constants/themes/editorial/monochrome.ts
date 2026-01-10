import { Theme } from '../schema';
import { createTheme } from '../validation';

const tokens = {
  // Colors (Strictly Monochrome)
  background: '#FFFFFF',
  foreground: '#000000',
  primary: '#000000',
  secondary: '#525252',
  accent: '#000000',
  muted: '#F5F5F5', // Off-white
  border: '#000000',

  fontFamily: {
    body: '"Source Serif 4", Georgia, serif',
    heading: '"Playfair Display", Georgia, serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1,
    normal: 1.625,
    relaxed: 1.625,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.1em',
  },
  spacing: {
    container: '72rem', // max-w-6xl
    section: '6rem', // py-24
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
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
  },
  motion: {
    duration: {
      fast: '0ms',
      normal: '100ms',
      slow: '300ms',
    },
    easing: {
      default: 'linear',
      in: 'linear',
      out: 'linear',
      inOut: 'linear',
    },
  },
  components: {
    code: {
      background: '#F5F5F5',
      text: '#000000',
      border: '#E5E5E5',
    },
    blockquote: {
      background: '#FFFFFF',
      border: '#000000',
      text: '#000000',
    },
    table: {
      headerBackground: '#F5F5F5',
      headerText: '#000000',
      rowBackground: '#FFFFFF',
      border: '#000000',
    },
    hr: {
      style: 'solid',
      color: '#000000',
    },
  },
};

export const monochrome: Theme = createTheme({
  id: 'monochrome',
  name: 'Monochrome',
  description: 'Reduction to Essence. Pure black and white with dramatic typography.',
  category: 'editorial',
  isDark: false,
  tokens,
});
