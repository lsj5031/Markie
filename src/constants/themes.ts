
import { Theme } from '../types';

export const THEMES: Theme[] = [
  {
    id: 'editorial-light',
    name: 'Classic Editorial',
    description: 'Baskervville serif for a timeless news-journal aesthetic.',
    styles: {
      fontFamily: "'Baskervville', serif",
      headingFont: "'Baskervville', serif",
      backgroundColor: '#ffffff',
      textColor: '#121212',
      accentColor: '#000000',
      codeBackground: '#f5f5f5',
      borderRadius: '0px',
      containerPadding: '5rem',
      border: '1px solid #eee'
    }
  },
  {
    id: 'modern-studio',
    name: 'Studio Minimal',
    description: 'Clean sans-serif with generous white space and soft greys.',
    styles: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      headingFont: "'Plus Jakarta Sans', sans-serif",
      backgroundColor: '#fafafa',
      textColor: '#222222',
      accentColor: '#6366f1',
      codeBackground: '#f1f1f1',
      borderRadius: '4px',
      containerPadding: '4rem',
      shadow: '0 20px 50px rgba(0,0,0,0.05)'
    }
  },
  {
    id: 'vogue-dark',
    name: 'Vogue Night',
    description: 'High-fashion editorial style with Instrument Serif.',
    styles: {
      fontFamily: "'Instrument Serif', serif",
      headingFont: "'Instrument Serif', serif",
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      accentColor: '#ffffff',
      codeBackground: '#1a1a1a',
      borderRadius: '0px',
      containerPadding: '4rem',
      border: '1px solid #333'
    }
  },
  {
    id: 'swiss-black',
    name: 'Swiss Typographic',
    description: 'Heavy Archivo Black headings on a functional grey grid.',
    styles: {
      fontFamily: "'Inter', sans-serif",
      headingFont: "'Archivo Black', sans-serif",
      backgroundColor: '#ebebeb',
      textColor: '#000000',
      accentColor: '#e11d48',
      codeBackground: '#dbdbdb',
      borderRadius: '0px',
      containerPadding: '4rem',
      border: '4px solid #000'
    }
  },
  {
    id: 'mono-technical',
    name: 'Tech Blueprint',
    description: 'High-contrast monospaced layout for technical documentation.',
    styles: {
      fontFamily: "'JetBrains Mono', monospace",
      headingFont: "'JetBrains Mono', monospace",
      backgroundColor: '#ffffff',
      textColor: '#0a0a0a',
      accentColor: '#2563eb',
      codeBackground: '#f8fafc',
      borderRadius: '4px',
      containerPadding: '3rem',
      border: '1px solid #e2e8f0'
    }
  },
  {
    id: 'bauhaus-v2',
    name: 'Bauhaus Redux',
    description: 'Strict primary color palette with geometric sans.',
    styles: {
      fontFamily: "'Inter', sans-serif",
      headingFont: "'Inter', sans-serif",
      backgroundColor: '#fffcf2',
      textColor: '#1a1a1b',
      accentColor: '#eb3b5a',
      codeBackground: '#fed33033',
      borderRadius: '0px',
      containerPadding: '3rem',
      border: '8px solid #1a1a1b'
    }
  },
  {
    id: 'brutalist-print',
    name: 'Brutalist Print',
    description: 'Raw, unpolished aesthetics with extreme shadows.',
    styles: {
      fontFamily: "'Inter', sans-serif",
      headingFont: "'Inter', sans-serif",
      backgroundColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#000000',
      codeBackground: '#f0f0f0',
      borderRadius: '0px',
      containerPadding: '4rem',
      border: '3px solid #000',
      shadow: '6px 6px 0px #000'
    }
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'Vibrant neon colors on dark background with futuristic feel.',
    styles: {
      fontFamily: "'JetBrains Mono', monospace",
      headingFont: "'Orbitron', sans-serif",
      backgroundColor: '#0a0a1a',
      textColor: '#e0e0ff',
      accentColor: '#00f7ff',
      codeBackground: '#1a1a3a',
      borderRadius: '8px',
      containerPadding: '3rem',
      border: '1px solid #00f7ff',
      shadow: '0 0 20px rgba(0, 247, 255, 0.3)'
    }
  },
  {
    id: 'scandinavian-light',
    name: 'Scandi Minimal',
    description: 'Light, airy design with soft pastels and clean typography.',
    styles: {
      fontFamily: "'Inter', sans-serif",
      headingFont: "'Playfair Display', serif",
      backgroundColor: '#f8f9fa',
      textColor: '#2c3e50',
      accentColor: '#3498db',
      codeBackground: '#ecf0f1',
      borderRadius: '12px',
      containerPadding: '4rem',
      border: 'none',
      shadow: '0 4px 12px rgba(0,0,0,0.05)'
    }
  },
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    description: 'Rich dark tones with classic serif typography for scholarly feel.',
    styles: {
      fontFamily: "'Lora', serif",
      headingFont: "'Lora', serif",
      backgroundColor: '#1a120b',
      textColor: '#f5f5f5',
      accentColor: '#d4af37',
      codeBackground: '#2a1e18',
      borderRadius: '0px',
      containerPadding: '4rem',
      border: '1px solid #d4af37',
      shadow: '0 8px 24px rgba(212, 175, 55, 0.15)'
    }
  },
  {
    id: 'glassmorphism',
    name: 'Glass UI',
    description: 'Translucent elements with frosted glass effect.',
    styles: {
      fontFamily: "'Inter', sans-serif",
      headingFont: "'Poppins', sans-serif",
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      textColor: '#ffffff',
      accentColor: '#8e44ad',
      codeBackground: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      containerPadding: '3rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    }
  },
  {
    id: 'retro-futurism',
    name: 'Retro Futurism',
    description: 'Bold colors and geometric shapes inspired by 80s sci-fi.',
    styles: {
      fontFamily: "'Rajdhani', sans-serif",
      headingFont: "'Bebas Neue', sans-serif",
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      accentColor: '#ff6b6b',
      codeBackground: '#16213e',
      borderRadius: '0px',
      containerPadding: '3rem',
      border: '2px solid #ff6b6b',
      shadow: '0 0 20px rgba(255, 107, 107, 0.3)'
    }
  },
  {
    id: 'corporate-pro',
    name: 'Corporate Pro',
    description: 'Professional business layout with clean, authoritative design.',
    styles: {
      fontFamily: "'Roboto', sans-serif",
      headingFont: "'Montserrat', sans-serif",
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      accentColor: '#2980b9',
      codeBackground: '#f5f7fa',
      borderRadius: '4px',
      containerPadding: '4rem',
      border: '1px solid #e0e0e0',
      shadow: '0 2px 8px rgba(0,0,0,0.08)'
    }
  }
];


export const INITIAL_MARKDOWN = `# The Art of Editorial Design

Markdown isn't just for documentation; it's a medium for **visual storytelling**. Markie transforms your raw text into production-ready editorial layouts.

---

## Design Principles
1. **Typography First**: We prioritize the word over the frame.
2. **Whitespace is Content**: Balance creates focus.
3. **Intentionality**: Every theme is a curated design system.

### The Technical Canvas
\`\`\`javascript
// Markie's rendering engine
function render(content, theme) {
  return content.map(part => part.style(theme));
}
\`\`\`

> "Good design is obvious. Great design is transparent."
> — *Joe Sparano*

- [x] Curated font pairings
- [x] High-fidelity exports
- [x] Real-time visual feedback

---

#### Crafted in Markie.

Export your designs as high-resolution PNGs or vector SVGs for posters, social media, or print.
`;
