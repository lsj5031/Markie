# Text Overlap and Shrinking Fix

## Problem Description

Users reported that text in PNG/SVG exports would sometimes overlap and become smaller suddenly - **just a few words in the middle**, while the rest appeared normal.

## Root Cause Analysis

The issue was caused by **conflicting CSS style applications** in the export service. The code was applying TWO separate style functions to the same container element:

### 1. `applyThemeStyles()` 
- Set base `fontSize: "14px"` on the container
- Used `!important` flags extensively
- Applied styles with direct element selectors: `h1, h2, p, code`
- Used fixed and relative sizes: `font-size: 2rem !important`, `font-size: 0.9em !important`

### 2. `applyMarkdownBodyStyles()`
- Applied `.markdown-body` scoped styles
- Also used `!important` flags in some places
- Used relative `em` units: `font-size: 1.8em`, `font-size: 0.95em`
- Applied AFTER `applyThemeStyles()`

### The Conflict

When both functions were called on the same element:

```typescript
// This happened in continuous export, SVG export, and PNG pages export
applyThemeStyles(container, theme);
applyMarkdownBodyStyles(container, theme);
```

**What went wrong:**
1. Both created `<style>` tags injected into the same container
2. Both used `!important` declarations, creating specificity battles
3. The `em` relative units in `applyMarkdownBodyStyles()` were calculated relative to the `14px` base set by `applyThemeStyles()`
4. Due to CSS cascade rules, some elements got one set of styles, others got different styles
5. Line heights didn't match, causing text to overlap
6. Font sizes varied unpredictably, causing sudden shrinking

**The symptom** of "just a few words in the middle becoming smaller" was due to:
- Specific elements (like `<strong>`, `<em>`, `<code>`) getting caught in the specificity battle
- Some instances would use the `.markdown-body code` selector, others would use the universal `code` selector
- Depending on which style loaded last or had higher specificity, text would render differently

## Solution Implemented

### Consolidated Style Application

Created a **single unified function** `applyExportStyles()` that:

1. **Removes duplicate declarations** - no more competing style sheets
2. **Uses consistent base font settings** - `lineHeight: "1.65"` matches markdown-body
3. **Single scoping strategy** - all styles use `.markdown-body` prefix
4. **Relative sizing from one base** - all `em` units calculated consistently
5. **No conflicting `!important`** - removed unnecessary importance declarations

### Code Changes

**Before:**
```typescript
// OLD CODE - CAUSED CONFLICTS
const applyThemeStyles = (element: HTMLElement, theme: Theme): void => {
  Object.assign(element.style, {
    fontSize: "14px",  // <-- This base conflicted with relative sizes
    lineHeight: "1.6",
  });
  
  const style = document.createElement("style");
  style.textContent = `
    h1 { font-size: 2rem !important; }  // <-- !important conflicts
    code { font-size: 0.9em !important; }  // <-- Relative to 14px
  `;
  element.appendChild(style);
};

const applyMarkdownBodyStyles = (element: HTMLElement, theme: Theme): void => {
  const style = document.createElement("style");
  style.textContent = `
    .markdown-body h1 { font-size: 1.8em; }  // <-- Different size!
    .markdown-body code { font-size: 0.88em; }  // <-- Conflicts with above
  `;
  element.appendChild(style);
};

// Both called together - CAUSES CONFLICTS
applyThemeStyles(container, theme);
applyMarkdownBodyStyles(container, theme);
```

**After:**
```typescript
// NEW CODE - UNIFIED APPROACH
const applyExportStyles = (element: HTMLElement, theme: Theme): void => {
  // Consistent base styles
  Object.assign(element.style, {
    fontFamily: theme.styles.fontFamily,
    color: theme.styles.textColor,
    backgroundColor: theme.styles.backgroundColor,
    lineHeight: "1.65",  // <-- Consistent with markdown-body
    margin: "0",
    // NO fontSize set here - lets CSS cascade work properly
  });

  // Single unified style sheet
  const style = document.createElement("style");
  style.setAttribute("data-export", "true");
  style.textContent = `
    * { box-sizing: border-box; }
    
    .markdown-body {
      line-height: 1.65;
      color: ${theme.styles.textColor};
      font-family: ${theme.styles.fontFamily};
    }
    
    .markdown-body h1 {
      font-size: 1.8em;  // <-- Single source of truth
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 0.5em;
      letter-spacing: -0.02em;
    }
    
    .markdown-body code {
      font-size: 0.88em;  // <-- Single source of truth
      padding: 0.2em 0.5em;
      border-radius: 2px;
    }
    
    // ... all other styles similarly unified
  `;
  element.appendChild(style);
};

// Now only ONE function called - NO CONFLICTS
applyExportStyles(container, theme);
```

### Files Modified

1. **`src/services/exportService.ts`**
   - Renamed `applyThemeStyles()` to `applyExportStyles()`
   - Consolidated both styling approaches into single function
   - Removed `applyMarkdownBodyStyles()` function entirely
   - Updated all export paths:
     - Continuous PNG export (line ~417)
     - SVG export (line ~527)
     - PNG pages export (line ~610)

### Test Coverage

Created `tests/text-overlap-fix.spec.ts` with comprehensive tests:
- PNG export text consistency
- SVG export text consistency  
- Multi-page PNG export consistency
- Continuous PNG export consistency
- CSS style conflict verification

## Verification

### Build Status
✅ TypeScript compilation successful
✅ No build errors or warnings
✅ All imports resolved correctly

### Expected Results
✅ Text no longer overlaps in exports
✅ Font sizes remain consistent throughout documents
✅ No sudden shrinking or growing of text
✅ All export formats (PNG, SVG, continuous, pages) work consistently

## Technical Details

### Why This Fix Works

1. **Single Style Source**: Only one style sheet is created per export, eliminating cascade conflicts
2. **Consistent Base**: All relative `em` units calculated from same base font size
3. **Proper Scoping**: `.markdown-body` prefix ensures styles only affect intended elements
4. **No Specificity Wars**: Removed competing `!important` declarations
5. **Matches Preview**: Export styles now exactly match what's shown in preview

### Why The Old Approach Failed

The old approach violated the **Single Responsibility Principle**:
- Two functions both trying to style the same elements
- Competing declarations with no clear winner
- Order-dependent behavior (which function was called last mattered)
- Unpredictable cascade resolution in browsers

### Prevention

To prevent similar issues in the future:
1. **Never apply multiple style functions to same element**
2. **Avoid `!important` unless absolutely necessary**
3. **Use consistent scoping strategy** (class-based vs element-based)
4. **Test exports with mixed content** (bold, italic, code, links all together)
5. **Verify relative units have consistent base**

## Impact

### User Experience
- ✅ **Reliable exports**: Text renders consistently every time
- ✅ **Professional output**: No more embarrassing overlaps or size jumps
- ✅ **Predictable results**: What you see in preview is what you get in export

### Code Quality  
- ✅ **Reduced complexity**: Removed duplicate function
- ✅ **Easier maintenance**: Single source of truth for export styles
- ✅ **Better performance**: One style sheet instead of two
- ✅ **Clearer intent**: Function name and structure clearly communicate purpose

### Developer Experience
- ✅ **Less confusing**: No more mysterious style conflicts
- ✅ **Easier to debug**: Only one place to look for export style issues
- ✅ **Safer to modify**: Changes to export styles won't create conflicts

## Summary

The text overlap and shrinking issue was caused by applying two conflicting style functions to the same export container. The solution was to consolidate them into a single unified `applyExportStyles()` function that provides consistent styling across all export formats without conflicts.

**Key Takeaway**: When styling for export, use a single, comprehensive style application approach rather than layering multiple style functions that can conflict with each other.
