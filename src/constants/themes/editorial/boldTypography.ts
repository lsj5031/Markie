import { Theme } from '../schema';
import { createTheme } from '../validation';

const tokens = {
  // Colors (Dark Mode)
  background: '#0A0A0A',
  foreground: '#FAFAFA',
  primary: '#FAFAFA',
  secondary: '#737373',
  accent: '#FF3D00',
  muted: '#1A1A1A',
  border: '#262626',

  fontFamily: {
    body: '"Inter", system-ui, sans-serif',
    heading: '"Inter Tight", "Inter", system-ui, sans-serif',
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
    // Prompt goes up to 9xl
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1,
    normal: 1.6,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.04em',
    normal: '-0.01em',
    wide: '0.1em',
  },
  spacing: {
    container: '1200px', // max-w-5xl approx
    section: '7rem', // py-28
    element: '1.5rem',
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
    medium: '2px', // borderThick
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
      fast: '150ms',
      normal: '200ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.25, 0, 0, 1)',
      in: 'cubic-bezier(0.25, 0, 0, 1)',
      out: 'cubic-bezier(0.25, 0, 0, 1)',
      inOut: 'cubic-bezier(0.25, 0, 0, 1)',
    },
  },
  components: {
    code: {
      background: '#1A1A1A',
      text: '#FAFAFA',
      border: '#262626',
    },
    blockquote: {
      background: '#0A0A0A',
      border: '#FF3D00',
      text: '#FAFAFA',
    },
    table: {
      headerBackground: '#1A1A1A',
      headerText: '#FAFAFA',
      rowBackground: '#0A0A0A',
      border: '#262626',
    },
    hr: {
      style: 'solid',
      color: '#262626',
    },
  },
};

export const boldTypography: Theme = createTheme({
  id: 'bold-typography',
  name: 'Bold Typography',
  description: 'Poster design translated to web. Type as hero.',
  category: 'editorial',
  isDark: true,
  tokens,
});
