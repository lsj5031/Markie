# Lumina Markdown Designer - Remaining Issues

## PNG Export Issues

### 1. Exported PNG has no padding
**Status**: ❌ Not resolved
**Description**: When exporting to PNG format, the generated image lacks proper padding around the content, causing text to appear too close to the edges.
**Expected**: PNG exports should include appropriate padding/margins around the content for better visual presentation.

### 2. No multiple page preview available
**Status**: ❌ Not resolved  
**Description**: The application does not provide a preview feature for multi-page documents when preparing for export.
**Expected**: Users should be able to preview how their content will be split across multiple pages before exporting.

### 3. No multiple page PNG export working
**Status**: ❌ Not resolved
**Description**: When content exceeds a single page, the PNG export functionality does not properly handle multi-page documents.
**Expected**: PNG exports should support two modes:
- **Continues A4 size**: Generate a single tall PNG image that maintains the original long image dimensions
- **Square sized image**: Generate a square PNG from the original long image by cropping or resizing appropriately

## Technical Requirements

### For Issue #1 (Padding):
- Add configurable padding settings (e.g., 20px, 40px, 60px)
- Apply padding consistently across all export formats
- Ensure padding doesn't interfere with content layout

### For Issue #2 (Multi-page Preview):
- Implement a preview mode that shows page breaks
- Display page numbers and content distribution
- Allow users to adjust page break points if needed

### For Issue #3 (Multi-page PNG Export):
- **Continues A4 mode**: Export the entire document as one continuous image regardless of length
- **Square mode**: 
  - Option 1: Crop the long image to a square aspect ratio (e.g., 1:1)
  - Option 2: Resize the long image to fit within a square while maintaining aspect ratio
  - Option 3: Generate multiple square images if content exceeds square dimensions

## Priority
**High Priority** - These issues affect core export functionality and user experience

## Dependencies
- Image processing library capable of handling large images
- Page layout calculation algorithms
- Export format handling improvements

## Notes
These issues are blocking complete PNG export functionality and need to be addressed for a production-ready release.