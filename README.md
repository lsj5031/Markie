<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lumina Markdown Designer

Transform your markdown into production-ready editorial layouts with real-time visual feedback and high-quality exports.

## 🎨 Features

- **6 Curated Themes**: From classic editorial to modern studio styles
- **Real-time Preview**: See your markdown rendered with theme styles instantly
- **Multiple Export Modes**: Pages, Continuous, and Square exports
- **Export Sizes**: A4 and Square formats
- **High-Quality Exports**: PNG and SVG with configurable padding
- **Multi-page Preview**: Navigate through paginated content
- **Responsive Design**: Collapsible sidebar and flexible layout

## Known Issues
There are currently two known issues that are being worked on:
1.  The multi-page view sometimes creates an extra, empty page at the end of the document.
2.  There are minor style inconsistencies between the single-page (continuous) and multi-page views.

For more technical details on these issues, please see the [REMAINING_ISSUES.md](REMAINING_ISSUES.md) file.

## 🚀 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 📋 Export Modes Explained

### Single Page Mode vs Multiple Page Mode

**Single Page Mode:**
- Displays all content in one continuous view
- Best for shorter content that fits within one page
- Shows the complete document layout at once
- Uses the selected theme styles and export size

**Multiple Page Mode:**
- Splits content across multiple pages based on the selected size
- Includes pagination controls (previous/next buttons)
- Shows page numbers (e.g., "Page 1 of 3")
- Respects the aspect ratio (A4 or Square) for accurate pagination
- Ideal for longer content that needs to be broken into pages

### Export Modes

**Pages Mode (Default):**
- Exports each page as a separate PNG file
- Respects the selected aspect ratio (A4 or Square)
- Maintains theme styles and formatting
- Perfect for print-ready layouts

**Continuous Mode:**
- Exports the entire content as one tall image
- Maintains theme styles and formatting
- Best for social media or when you need the full content in one image

**Square Mode:**
- Exports content in a square format regardless of content length
- Maintains theme styles and formatting
- Ideal for social media posts or thumbnails

## 🎨 Themes

Choose from 6 professionally designed themes:

- **Classic Editorial**: Baskervville serif for timeless news-journal aesthetic
- **Studio Minimal**: Clean sans-serif with generous white space
- **Vogue Night**: High-fashion editorial style with dark theme
- **Swiss Typographic**: Heavy Archivo Black headings on functional grey grid
- **Tech Blueprint**: High-contrast monospaced layout for technical documentation
- **Bauhaus Redux**: Strict primary color palette with geometric sans
- **Brutalist Print**: Raw, unpolished aesthetics with extreme shadows

## 📸 Export Options

- **Formats**: PNG (high-resolution) and SVG (vector)
- **Sizes**: A4 (1:1.414 ratio) and Square (1:1 ratio)
- **Padding**: Configurable padding (10px to 100px)
- **Quality**: High pixel ratio (2x) for sharp images
- **Naming**: Automatic file naming with page numbers when applicable

## 🛠️ Technical Details

- Built with React + TypeScript
- Uses marked.js for markdown parsing
- DOMPurify for security
- html-to-image for PNG/SVG exports
- Custom pagination engine for accurate page breaks
- CSS-in-JS for theme application
- Responsive design with Tailwind CSS

## 📄 View in AI Studio

[Open in AI Studio](https://ai.studio/apps/drive/195K5cTOxnuKv86bjuaTHnkEumq6bqWHa)
