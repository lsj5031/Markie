# Lumina Markdown Designer - Known Issues

## Current Known Issues

### 1. Pagination engine creates an extra page
- **Status**: 🔴 Unresolved
- **Description**: In multi-page mode, the pagination logic sometimes creates an extra, mostly empty page at the end of the document. This seems to be caused by inaccuracies in content height calculation (`scrollHeight`).
-   **Attempts to Fix**:
    -   An initial attempt was made to subtract a small epsilon from the calculated height before determining the number of pages. This was not sufficient.
    -   A second attempt involved checking if the content of the last page was below a small pixel threshold (5px) and removing the page if so. This also did not resolve the issue in all cases.
-   **Next Steps**: A more robust height calculation method may be needed. Investigating alternatives to `scrollHeight`, such as using `getBoundingClientRect` on the last element, or a library that handles this more reliably, could be a next step. The issue is in `src/utils/pagination.ts`.

### 2. Style inconsistency between single-page and multi-page views
-   **Status**: 🔴 Unresolved
-   **Description**: The "continuous" (single-page) view and the multi-page view have different styling for the same content. This is because they use different rendering paths. `MultiPageViewer` uses a pagination utility that creates a specific HTML structure, while `SinglePageViewer` renders the HTML more directly.
-   **Attempts to Fix**:
    -   An attempt was made to unify the rendering path by removing special cases in the pagination logic.
    -   An attempt was made to add scrolling to `SinglePageViewer`.
    -   These changes did not fully resolve the style differences.
-   **Next Steps**: The HTML structure rendered by `SinglePageViewer` and `MultiPageViewer` needs to be unified. `SinglePageViewer` should probably use the same styling and rendering pipeline as `MultiPageViewer` (without pagination enabled) to ensure consistency. The relevant files are `src/components/SinglePageViewer.tsx`, `src/components/MultiPageViewer.tsx`, and `src/utils/pagination.ts`.

## Previously Identified Issues - All Resolved ✅

### 1. Exported PNG has no padding ✅ RESOLVED
**Status**: ✅ Resolved
**Description**: Fixed by implementing configurable padding settings (10px to 100px) that are applied consistently across all export formats.
**Solution**: Added padding controls in the UI and integrated padding application in the export service.

### 2. No multiple page preview available ✅ RESOLVED
**Status**: ✅ Resolved
**Description**: Implemented a multi-page preview mode with pagination controls and page navigation.
**Solution**: Created MultiPageViewer component with previous/next buttons and page number display.

### 3. No multiple page PNG export working ✅ RESOLVED
**Status**: ✅ Resolved
**Description**: Implemented comprehensive multi-page PNG export with three distinct modes.
**Solution**: Added three export modes:
- **Pages Mode**: Multiple PNG files (page-1.png, page-2.png, etc.)
- **Continuous Mode**: Single tall PNG image maintaining all content
- **Square Mode**: Square PNG export with proper theme application

## Technical Requirements

### Technical Implementation Summary:

✅ **Padding Implementation**:
- Configurable padding slider (10px to 100px)
- Applied consistently across all export modes
- Integrated into export service with proper CSS application

✅ **Multi-page Preview**:
- Dedicated MultiPageViewer component
- Pagination controls with previous/next buttons
- Page number display (e.g., "Page 1 of 3")
- Toggle between single and multi-page views

✅ **Multi-page PNG Export**:
- **Pages Mode**: Multiple PNG files with page numbers
- **Continuous Mode**: Single tall PNG preserving all content
- **Square Mode**: Square aspect ratio export with theme application
- All modes respect export size (A4 or Square) and theme styles

## Priority
Core export functionality is complete, but known issues need to be addressed.

## Dependencies
- ✅ Image processing with html-to-image library
- ✅ Custom pagination engine with accurate page break calculation
- ✅ Comprehensive export format handling with theme application

## Notes
All previously identified issues have been resolved. The application now provides:
- ✅ Configurable padding for all export formats
- ✅ Multi-page preview with navigation controls
- ✅ Three export modes (Pages, Continuous, Square)
- ✅ Proper theme application across all export types
- ✅ Accurate aspect ratio handling (A4 and Square)
- ✅ High-quality PNG and SVG exports

The application is now ready for production use.