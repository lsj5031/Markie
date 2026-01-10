import { ThemeTokens } from './schema';

export const DEFAULT_TOKENS: ThemeTokens = {
  // Core Colors
  background: '#ffffff',
  foreground: '#000000',
  primary: '#000000',
  secondary: '#666666',
  accent: '#0070f3',
  muted: '#f5f5f5',
  border: '#e5e5e5',

  // Typography
  fontFamily: {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
    mono: 'monospace',
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
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
  },

  // Spacing
  spacing: {
    container: '2rem',
    section: '4rem',
    element: '1rem',
  },

  // Shape
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  borderWidth: {
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },

  // Effects
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  // Motion
  motion: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'ease',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
    },
  },

  // Component-specific
  components: {
    code: {
      background: '#f5f5f5',
      text: '#000000',
      border: 'transparent',
    },
    blockquote: {
      background: 'transparent',
      border: '#e5e5e5',
      text: '#666666',
    },
    table: {
      headerBackground: '#f9fafb',
      headerText: '#111827',
      rowBackground: '#ffffff',
      border: '#e5e5e5',
    },
    hr: {
      style: 'solid',
      color: '#e5e5e5',
    },
  },
};
