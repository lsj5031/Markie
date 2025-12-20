
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { THEMES, INITIAL_MARKDOWN } from './constants/themes';
import { ExportFormat, ExportSize, Theme } from './types';
import { exportPreview } from './services/exportService';
import { GoogleGenAI } from '@google/genai';

const Icons = {
  Export: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  Magic: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>,
  Check: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  ChevronDown: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Settings: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" /></svg>
};

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(() => localStorage.getItem('lumina_md') || INITIAL_MARKDOWN);
  const [themeId, setThemeId] = useState<string>(() => localStorage.getItem('lumina_theme') || THEMES[0].id);
  const [projectName, setProjectName] = useState<string>(() => localStorage.getItem('lumina_project') || 'Untitled Design');
  const [exportSize, setExportSize] = useState<ExportSize>('A4');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const activeTheme = useMemo(() => THEMES.find(t => t.id === themeId) || THEMES[0], [themeId]);

  useEffect(() => {
    localStorage.setItem('lumina_md', markdown);
    localStorage.setItem('lumina_theme', themeId);
    localStorage.setItem('lumina_project', projectName);
  }, [markdown, themeId, projectName]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    };
    if (isExportOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExportOpen]);

  const handleExport = async (format: ExportFormat) => {
    if (previewRef.current) {
      await exportPreview(previewRef.current, format, exportSize, projectName.toLowerCase().replace(/\s+/g, '-'));
      setIsExportOpen(false);
    }
  };

  const improveWithAi = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Improve the clarity and impact of the following markdown content for an editorial design layout. Make the language sophisticated and engaging. Use standard markdown. Only return the markdown code:\n\n${markdown}`,
        config: { temperature: 0.8 }
      });
      if (response.text) setMarkdown(response.text.trim());
    } catch (err) {
      console.error('AI error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderedHtml = useMemo(() => DOMPurify.sanitize(marked.parse(markdown) as string), [markdown]);

  // Generate CSS variables for the theme
  const themeVars = {
    '--theme-bg': activeTheme.styles.backgroundColor,
    '--theme-text': activeTheme.styles.textColor,
    '--theme-accent': activeTheme.styles.accentColor,
    '--theme-font': activeTheme.styles.fontFamily,
    '--theme-heading-font': activeTheme.styles.headingFont,
    '--theme-code-bg': activeTheme.styles.codeBackground,
    '--theme-padding': activeTheme.styles.containerPadding,
    '--theme-radius': activeTheme.styles.borderRadius,
    '--theme-border': activeTheme.styles.border || 'none',
    '--theme-shadow': activeTheme.styles.shadow || 'none',
  } as React.CSSProperties;

  return (
    <div className="relative flex flex-col h-screen overflow-hidden text-sm selection:bg-[#eb3b5a]/20" style={{ backgroundColor: 'var(--studio-bg)', color: 'var(--studio-text)' }}>
      {/* Top Header - Enhanced with gradient and better visual hierarchy */}
      <header
        className="h-16 flex items-center justify-between px-5 z-50 shrink-0 relative"
        style={{
          background: 'linear-gradient(180deg, var(--studio-surface) 0%, rgba(254, 248, 236, 0.95) 100%)',
          borderBottom: '3px solid #1a1a1b',
          boxShadow: '0 4px 20px rgba(26, 26, 27, 0.04)'
        }}
      >
        {/* Decorative accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, var(--studio-accent) 0%, var(--studio-secondary) 50%, var(--studio-tertiary) 100%)' }} />

        {/* Left: Logo + Branding + Divider + Project name */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Brand section with enhanced logo */}
          <div className="flex items-center gap-3 shrink-0 group cursor-pointer">
            <div
              className="w-10 h-10 flex items-center justify-center text-white font-black text-base tracking-tight transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--studio-accent) 0%, #c62a47 50%, #a01d3a 100%)',
                boxShadow: '3px 3px 0px rgba(26, 26, 27, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              L
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-extrabold tracking-tight text-base" style={{ color: 'var(--studio-text)' }}>Lumina</span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--studio-accent)' }}>Studio</span>
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="w-[2px] h-8 hidden sm:block" style={{ background: 'linear-gradient(180deg, transparent, #1a1a1b20, transparent)' }} />

          {/* Project name with enhanced styled container */}
          <div
            className="flex items-center gap-2.5 flex-1 min-w-0 max-w-xs px-4 py-2.5 transition-all duration-200 group"
            style={{
              backgroundColor: 'rgba(26, 26, 27, 0.04)',
              border: '2px solid transparent',
              borderRadius: '0px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(26, 26, 27, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <svg width="16" height="16" className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-60 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none outline-none font-semibold text-sm tracking-tight"
              style={{ color: 'var(--studio-text)' }}
              placeholder="Untitled Project"
            />
          </div>
        </div>

        {/* Right: Controls with enhanced grouping and styling */}
        <div className="flex items-center gap-5 shrink-0">
          {/* Format toggle with improved visual design - balanced width */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-40">Format</span>
            <div
              className="flex items-center overflow-hidden"
              style={{
                border: '2px solid var(--studio-border)',
                boxShadow: '2px 2px 0px rgba(26, 26, 27, 0.1)'
              }}
            >
              {['A4', 'SQUARE'].map((size) => (
                <button
                  key={size}
                  onClick={() => setExportSize(size as ExportSize)}
                  title={`${size} format`}
                  className={`w-20 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all text-center ${exportSize === size ? 'text-white' : 'hover:bg-[#1a1a1b]/8'}`}
                  style={exportSize === size
                    ? { backgroundColor: 'var(--studio-accent)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }
                    : { color: 'var(--studio-text)', backgroundColor: 'transparent' }
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="w-[2px] h-8 hidden md:block" style={{ background: 'linear-gradient(180deg, transparent, #1a1a1b20, transparent)' }} />

          {/* Action buttons with enhanced styling */}
          <div className="flex items-center gap-3">
            {/* Enhance button with improved hover effect */}
            <button
              onClick={improveWithAi}
              disabled={isAiLoading}
              title={isAiLoading ? 'Processing...' : 'Enhance copy with AI'}
              className={`group flex items-center gap-2 px-4 py-2.5 transition-all duration-200 ${isAiLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              style={{
                border: '2px solid var(--studio-accent)',
                color: 'var(--studio-accent)',
                backgroundColor: isAiLoading ? 'transparent' : 'rgba(235, 59, 90, 0.03)',
                boxShadow: isAiLoading ? 'none' : '2px 2px 0px rgba(235, 59, 90, 0.15)'
              }}
            >
              <Icons.Magic />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Enhance</span>
            </button>

            {/* Export button with enhanced styling */}
            <div className="relative z-50" ref={exportMenuRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                title="Export design"
                className="flex items-center gap-2 px-4 py-2.5 text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, var(--studio-accent) 0%, #c62a47 100%)',
                  border: '2px solid var(--studio-accent)',
                  boxShadow: '3px 3px 0px rgba(26, 26, 27, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
                }}
                aria-expanded={isExportOpen}
                aria-haspopup="menu"
              >
                <Icons.Export />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Export</span>
              </button>

              {/* Enhanced dropdown menu with better visual hierarchy */}
              {isExportOpen && (
                <div
                  className="absolute right-0 top-full mt-4 w-80 p-0 z-[100] animate-fade-in"
                  style={{
                    backgroundColor: 'var(--studio-surface)',
                    border: '3px solid var(--studio-border)',
                    boxShadow: '6px 6px 0px rgba(26, 26, 27, 0.15)'
                  }}
                  role="menu"
                >
                  {/* Header with accent line */}
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: 'var(--studio-accent)' }} />
                    <p className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em]" style={{ borderBottom: '2px solid var(--studio-border)', color: 'var(--studio-text)' }}>Export Options</p>
                  </div>
                  {[
                    { format: 'PNG' as const, label: 'High-Res PNG', badge: '300DPI', desc: 'Perfect for social media' },
                    { format: 'SVG' as const, label: 'Vector SVG', badge: 'Scalable', desc: 'Ideal for web use' },
                    { format: 'PDF' as const, label: 'Press PDF', badge: 'CMYK', desc: 'Print-ready output' }
                  ].map(({ format, label, badge, desc }) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format)}
                      className="w-full text-left px-6 py-4 transition-all flex items-center justify-between group hover:bg-[#1a1a1b]/5 focus:outline-none focus:bg-[#1a1a1b]/5"
                      style={{ color: 'var(--studio-text)', borderBottom: '1px solid rgba(26,26,27,0.08)' }}
                      role="menuitem"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-sm group-hover:text-[var(--studio-accent)] transition-colors">{label}</span>
                        <span className="text-[10px] opacity-50">{desc}</span>
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1"
                        style={{ backgroundColor: 'rgba(235, 59, 90, 0.1)', color: 'var(--studio-accent)' }}
                      >
                        {badge}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Enhanced Theme Browser with color swatches */}
        <aside
          className="w-80 overflow-y-auto hidden xl:flex flex-col gap-0"
          style={{
            backgroundColor: 'var(--studio-surface)',
            borderRight: '3px solid #1a1a1b',
            boxShadow: 'inset -8px 0 20px rgba(26, 26, 27, 0.02)'
          }}
        >
          {/* Sidebar header */}
          <div className="px-6 py-5 border-b-2" style={{ borderColor: 'rgba(26,26,27,0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2" style={{ backgroundColor: 'var(--studio-accent)' }} />
              <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--studio-text)' }}>Design Systems</p>
            </div>
            <p className="text-[10px] mt-1 opacity-50">Choose a visual style</p>
          </div>

          {/* Theme list with enhanced cards */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {THEMES.map(t => {
              const isActive = themeId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  className={`w-full group text-left p-4 transition-all duration-200 ${isActive ? '' : 'hover:-translate-x-1'}`}
                  style={{
                    backgroundColor: isActive ? 'var(--studio-accent)' : 'rgba(26,26,27,0.02)',
                    border: isActive ? '2px solid var(--studio-accent)' : '2px solid transparent',
                    boxShadow: isActive ? '4px 4px 0px rgba(26, 26, 27, 0.2)' : 'none'
                  }}
                >
                  {/* Theme color swatch preview */}
                  <div className="flex gap-1 mb-3">
                    <div
                      className="w-6 h-6 border-2"
                      style={{
                        backgroundColor: t.styles.backgroundColor,
                        borderColor: isActive ? 'rgba(255,255,255,0.3)' : '#1a1a1b'
                      }}
                    />
                    <div
                      className="w-6 h-6 border-2"
                      style={{
                        backgroundColor: t.styles.textColor,
                        borderColor: isActive ? 'rgba(255,255,255,0.3)' : '#1a1a1b'
                      }}
                    />
                    <div
                      className="w-6 h-6 border-2"
                      style={{
                        backgroundColor: t.styles.accentColor,
                        borderColor: isActive ? 'rgba(255,255,255,0.3)' : '#1a1a1b'
                      }}
                    />
                    <div className="flex-1" />
                    {isActive && <div className="flex items-center" style={{ color: '#ffffff' }}><Icons.Check /></div>}
                  </div>

                  {/* Theme info */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span
                        className="font-bold text-sm block mb-1"
                        style={{ color: isActive ? '#ffffff' : 'var(--studio-text)' }}
                      >
                        {t.name}
                      </span>
                      <p
                        className="text-[10px] leading-relaxed line-clamp-2"
                        style={{ color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(26,26,27,0.6)' }}
                      >
                        {t.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar footer */}
          <div className="px-6 py-4 border-t-2" style={{ borderColor: 'rgba(26,26,27,0.1)', backgroundColor: 'rgba(26,26,27,0.02)' }}>
            <p className="text-[9px] font-medium uppercase tracking-wider opacity-40">{THEMES.length} themes available</p>
          </div>
        </aside>

        {/* Center Pane: Editor with enhanced styling */}
        <section
          className="flex-1 flex flex-col relative"
          style={{
            backgroundColor: 'var(--studio-bg)',
            borderRight: '3px solid #1a1a1b'
          }}
        >
          <div
            className="h-12 flex items-center justify-between px-6 shrink-0"
            style={{
              backgroundColor: 'var(--studio-surface)',
              borderBottom: '2px solid #1a1a1b'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--studio-accent)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--studio-secondary)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--studio-tertiary)' }} />
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--studio-accent)' }}>Source / Markdown</span>
            </div>
            <span className="text-[9px] font-mono opacity-40">{markdown.split('\n').length} lines</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            className="editor-textarea flex-1 px-10 py-10 text-base leading-relaxed"
            placeholder="Your story begins here..."
          />
        </section>

        {/* Right Pane: Live Canvas with enhanced styling */}
        <section className="flex-[1.2] flex flex-col overflow-hidden relative" style={{ backgroundColor: 'var(--studio-bg)' }}>
          <div
            className="h-12 flex items-center justify-between px-6 shrink-0"
            style={{
              backgroundColor: 'var(--studio-surface)',
              borderBottom: '2px solid #1a1a1b'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2" style={{ backgroundColor: 'var(--studio-tertiary)' }} />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--studio-accent)' }}>Canvas / Preview</span>
            </div>
            <div className="flex gap-3 items-center">
              <span
                className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1"
                style={{ backgroundColor: 'rgba(26,26,27,0.05)', color: 'var(--studio-text)' }}
              >
                {exportSize}
              </span>
              <div className="w-[1px] h-4" style={{ backgroundColor: 'rgba(26,26,27,0.15)' }} />
              <span className="text-[9px] font-mono opacity-50">{markdown.length} chars</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-12 lg:p-20 flex justify-center items-start scroll-smooth pattern-grid" style={{ backgroundColor: 'var(--studio-bg)' }}>
            {/* The Actual Designer Canvas */}
            <div
              ref={previewRef}
              id="designer-canvas"
              className={`canvas-shadow transition-all duration-500 ease-in-out overflow-hidden`}
              style={{
                ...themeVars,
                width: '100%',
                maxWidth: '650px',
                aspectRatio: exportSize === 'A4' ? '1 / 1.414' : '1 / 1',
                backgroundColor: 'var(--theme-bg)',
                color: 'var(--theme-text)',
                fontFamily: 'var(--theme-font)',
                padding: 'var(--theme-padding)',
                borderRadius: 'var(--theme-radius)',
                border: 'var(--theme-border)',
                boxShadow: 'var(--theme-shadow)',
                position: 'relative',
              }}
            >
              {/* Internal styling scoped to theme variables */}
              <style dangerouslySetInnerHTML={{
                __html: `
                  #preview-content h1, #preview-content h2, #preview-content h3 { 
                    font-family: var(--theme-heading-font); 
                    border-color: var(--theme-accent); 
                    opacity: 1;
                    color: inherit;
                  }
                  #preview-content pre { background: var(--theme-code-bg); color: inherit; opacity: 0.95; }
                  #preview-content code { background: var(--theme-code-bg); color: var(--theme-accent); }
                  #preview-content a { color: var(--theme-accent); border-bottom: 1px solid var(--theme-accent); text-decoration: none; }
                  #preview-content strong { color: var(--theme-accent); font-weight: 800; }
                  #preview-content hr { border-color: var(--theme-text); opacity: 0.15; }
                  .markdown-body ul li::marker { color: var(--theme-accent); }
               ` }} />

              <div
                id="preview-content"
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Theme selection is now integrated into the header for small screens and sidebar for large screens */}

      <style>{`
        .pattern-grid {
          background-image: radial-gradient(var(--studio-border) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default App;
