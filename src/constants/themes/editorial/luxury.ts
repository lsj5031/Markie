import { Theme } from '../schema';
import { createTheme } from '../validation';

const tokens = {
  // Colors (Sophisticated Monochrome)
  background: '#F9F8F6', // Warm Alabaster
  foreground: '#1A1A1A', // Rich Charcoal
  primary: '#1A1A1A',
  secondary: '#6C6863', // Warm Grey
  accent: '#D4AF37', // Metallic Gold
  muted: '#EBE5DE', // Pale Taupe
  border: '#1A1A1A',

  fontFamily: {
    body: '"Inter", sans-serif',
    heading: '"Playfair Display", serif',
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
    // Prompt goes up to 9xl
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
    wide: '0.25em', // Uppercase labels
  },
  spacing: {
    container: '1600px', // Massive container
    section: '8rem', // py-32
    element: '2rem',
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
    sm: '0 2px 8px rgba(0,0,0,0.02)',
    md: '0 4px 16px rgba(0,0,0,0.08)',
    lg: '0 8px 32px rgba(0,0,0,0.12)',
    xl: '0 12px 48px rgba(0,0,0,0.15)',
  },
  motion: {
    duration: {
      fast: '300ms',
      normal: '500ms',
      slow: '1500ms', // Cinematic
    },
    easing: {
      default: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      in: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      inOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },
  components: {
    code: {
      background: '#EBE5DE',
      text: '#1A1A1A',
      border: '#1A1A1A',
    },
    blockquote: {
      background: '#F9F8F6',
      border: '#D4AF37', // Gold
      text: '#1A1A1A',
    },
    table: {
      headerBackground: '#EBE5DE',
      headerText: '#1A1A1A',
      rowBackground: '#F9F8F6',
      border: '#1A1A1A',
    },
    hr: {
      style: 'solid',
      color: '#1A1A1A',
    },
  },
};

export const luxury: Theme = createTheme({
  id: 'luxury',
  name: 'Luxury',
  description: 'Elegance through restraint. High-end editorial feel.',
  category: 'editorial', 
  isDark: false,
  tokens,
});
