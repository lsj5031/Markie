<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lumina Markdown Designer

Transform your markdown into production-ready editorial layouts with real-time visual feedback and high-quality exports.

## 🎨 Features

- **6 Curated Themes**: From classic editorial to modern studio styles
- **Real-time Preview**: See your markdown rendered with theme styles instantly
- **Multiple Export Modes**: Pages (paginated) and Continuous (long image) exports
- **Export Sizes**: A4 and Square formats
- **High-Quality Exports**: PNG and SVG with configurable padding
- **Multi-page Preview**: Navigate through paginated content
- **Responsive Design**: Collapsible sidebar and flexible layout

## ✅ Current Status

Fully functional with comprehensive export capabilities. All known issues resolved.

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

### Export Sizes

**A4 Format:**

- Uses the standard A4 aspect ratio (1:1.414)
- Ideal for print-ready documents
- Works with both Pages and Continuous export modes

**Square Format:**

- Uses a 1:1 aspect ratio for square images
- Ideal for social media posts or thumbnails
- Works with both Pages and Continuous export modes

## 🎨 Themes

Choose from 6 professionally designed themes:

- **Classic Editorial**: Timeless serif design
- **Studio Minimal**: Clean sans-serif with white space
- **Vogue Night**: High-fashion dark theme
- **Swiss Typographic**: Bold headers on functional grid
- **Tech Blueprint**: High-contrast monospace layout
- **Bauhaus Redux**: Primary colors with geometric sans
- **Brutalist Print**: Raw aesthetics with extreme shadows

## 📸 Export Options

- **Formats**: PNG (high-resolution) and SVG (vector)
- **Sizes**: A4 and Square formats
- **Padding**: Configurable (10px-100px)
- **Modes**: Pages and Continuous export
- **Quality**: High pixel ratio (2x) with automatic file naming

## 🛠️ Tech Stack

- **Framework**: React + TypeScript + Vite
- **Markdown**: marked.js + DOMPurify
- **Exports**: html-to-image with custom pagination
- **Styling**: Tailwind CSS + CSS-in-JS
- **Quality**: Oxlint + pre-commit hooks
- **Testing**: Playwright e2e tests

## 🧪 Development

### Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npx playwright test

# Lint code
npx oxlint
```

### Quality Assurance

- **0 lint errors** with Oxlint integration
- **Automated pre-commit hooks** for code quality
- **Comprehensive test coverage** with Playwright
- **TypeScript strict mode** for type safety

## 📄 View in AI Studio

[Open in AI Studio](https://ai.studio/apps/drive/195K5cTOxnuKv86bjuaTHnkEumq6bqWHa)
