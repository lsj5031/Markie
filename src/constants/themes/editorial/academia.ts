import { Theme } from '../schema';
import { createTheme } from '../validation';

const tokens = {
  // Colors (Library at Night)
  background: '#1C1714', // Deep Mahogany
  foreground: '#E8DFD4', // Antique Parchment
  primary: '#C9A962', // Polished Brass
  secondary: '#8B2635', // Library Crimson
  accent: '#C9A962',
  muted: '#3D332B', // Worn Leather
  border: '#4A3F35', // Wood Grain

  fontFamily: {
    body: '"Crimson Pro", serif',
    heading: '"Cormorant Garamond", serif',
    mono: '"Courier Prime", "Courier New", monospace', // Fitting fallback
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
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
    tight: 1.1,
    normal: 1.625,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
  },
  spacing: {
    container: '1200px',
    section: '5rem',
    element: '1.25rem',
  },
  borderRadius: {
    none: '0px',
    sm: '2px',
    md: '4px', // Slight softening
    lg: '8px',
    full: '9999px',
  },
  borderWidth: {
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px -1px rgba(0,0,0,0.4)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.5)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.5)',
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
      background: '#251E19', // Aged Oak
      text: '#E8DFD4',
      border: '#4A3F35',
    },
    blockquote: {
      background: '#251E19',
      border: '#C9A962', // Brass
      text: '#E8DFD4',
    },
    table: {
      headerBackground: '#3D332B',
      headerText: '#E8DFD4',
      rowBackground: '#1C1714',
      border: '#4A3F35',
    },
    hr: {
      style: 'solid',
      color: '#4A3F35',
    },
  },
};

export const academia: Theme = createTheme({
  id: 'academia',
  name: 'Academia',
  description: 'Scholarly gravitas. Mahogany, parchment, and brass.',
  category: 'editorial',
  isDark: true, // It is a dark theme
  tokens,
});
