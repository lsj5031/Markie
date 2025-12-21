# Lumina Markdown Designer - Known Issues

## Current Status

All identified issues have been fixed in the latest update.

## Recently Fixed Issues (Latest Update)

### 1. Extra Page in Multi-Page PNG Export

- **Status**: Fixed
- **Problem**: Multi-page PNG export always generated an unnecessary extra page
- **Root Cause**: Width mismatch between pagination measurement (800px) and export rendering (1240px), causing content to reflow differently. Also, threshold logic bug using `Math.min()` instead of `Math.max()`
- **Solution**:
  - Changed pagination width from 800px to 1240px in `pagination.ts` and `usePagination.ts`
  - Fixed threshold logic: `Math.min(usablePageHeight * 0.15, 50)` -> `Math.max(usablePageHeight * 0.15, 50)`

### 2. Continuous Export PNG Styled Differently

- **Status**: Fixed
- **Problem**: Continuous PNG export had different styling compared to preview (especially code blocks)
- **Root Cause**: Preview used hardcoded dark theme styles in `index.css` for `.markdown-body` elements, but export used dynamic theme values that didn't match
- **Solution**:
  - Added `applyMarkdownBodyStyles()` function that injects the same CSS rules used in preview
  - Applied `markdown-body` class to cloned content for consistent styling
  - Styles now match between preview and all export modes

### 3. SVG Export Cropped

- **Status**: Fixed
- **Problem**: SVG export cropped content that extended beyond a single page
- **Root Cause**: SVG export used fixed dimensions (`width` and `height`) from `prepareCloneForSinglePageExport()`, clipping overflow content
- **Solution**:
  - Rewrote SVG export to use auto-height container (like continuous PNG mode)
  - SVG now captures full content without cropping
  - Increased `pixelRatio` from 1 to 2 for higher quality output
  - Applied consistent markdown-body styles

## Previously Resolved Issues

### 4. Pagination Engine Extra Pages

- **Status**: Fixed
- **Description**: Resolved pagination logic that created unnecessary extra pages at the end of documents.
- **Solution**: Enhanced height calculation with better content-based thresholds and multi-level validation.

### 5. Style Inconsistency Between Views

- **Status**: Fixed
- **Description**: Resolved styling differences between single-page and multi-page views.
- **Solution**: Unified rendering pipeline so both viewers use same approach and theme application.

### 6. Exported PNG has no padding

- **Status**: Fixed
- **Description**: Fixed by implementing configurable padding settings (10px to 100px) that are applied consistently across all export formats.

### 7. No multiple page preview available

- **Status**: Fixed
- **Description**: Implemented a multi-page preview mode with pagination controls and page navigation.

### 8. No multiple page PNG export working

- **Status**: Fixed
- **Description**: Implemented comprehensive multi-page PNG export with three distinct modes (Pages, Continuous, Square).

## Technical Implementation Summary

**Pagination Consistency**:

- Pagination measurement now uses 1240px width (matching export dimensions)
- Eliminated width mismatch that caused extra empty pages
- Improved threshold logic for detecting artifact pages

**Export Styling Consistency**:

- New `applyMarkdownBodyStyles()` function in `exportService.ts`
- Mirrors CSS rules from `index.css` for `.markdown-body` elements
- Applied to both continuous PNG and SVG exports
- Ensures code blocks, tables, and other elements look identical to preview

**SVG Full Content Capture**:

- SVG export now uses `height: auto` container
- Captures full document content without cropping
- Matches continuous PNG export behavior
- Higher quality output with `pixelRatio: 2`

## Files Modified

- `src/utils/pagination.ts` - Width: 800 -> 1240, threshold: min -> max
- `src/hooks/usePagination.ts` - Width constant: 800 -> 1240
- `src/services/exportService.ts` - Added `applyMarkdownBodyStyles()`, rewrote SVG export

## Testing

Run the existing test suite to verify fixes:

```bash
npm run test
```

## Priority

**COMPLETE**: All known issues have been resolved.
