# Lumina Studio UI/UX Improvement Plan

This document outlines a phased approach to elevating the user experience of Lumina Studio, focusing on visual hierarchy, efficiency, and usability.

## Phase 1: Header Consolidation & Visual Cleanup
**Goal:** Reduce cognitive load by grouping related actions and decluttering the primary interface.

- [ ] **Unified Export Dropdown**:
    - Replace separate "Export SVG", "Export PNG", and format toggles with a single primary "Export" button.
    - Implement a dropdown menu for format selection (PNG, SVG, PDF) and download options.
- [ ] **Document Settings Group**:
    - Move "Format" (A4/Square) and "Mode" (Pages/Continuous) into a cohesive "Page Setup" or "Settings" popover/dropdown to save horizontal space.
- [ ] **Polished Branding**:
    - Ensure the "Lumina Studio" branding and project title input are aligned and spaced consistently.

## Phase 2: Enhanced Theme Discovery (Sidebar)
**Goal:** Make browsing and selecting themes faster and more visual.

- [ ] **Grid Layout**:
    - Switch the sidebar list from a single column of large cards to a **2-column grid** or a **compact list**.
    - This allows users to see 6-8 themes at a glance instead of 3-4.
- [ ] **Rich Tooltips/Hover States**:
    - Show theme details (fonts, colors) on hover rather than always expanding them, preserving screen real estate.
- [ ] **Categorization (Optional)**:
    - If the number of themes grows, group them by style (e.g., "Editorial", "Minimalist", "Tech").

## Phase 3: Preview Pane Empowerment
**Goal:** Give users more control over how they view their work.

- [ ] **Manual Zoom Controls**:
    - Add a control bar to the preview pane with `- / % / +` zoom buttons.
    - Allow users to toggle between "Fit to Screen" and "100% (Actual Size)".
- [ ] **View Options**:
    - Add toggles for "Show Margins/Bleed" or "Dark Mode Preview" (independent of the editor theme).

## Phase 4: Editor Refinements (Quick Wins)
- [x] **Increased Padding**: Added `p-12` to the editor for better readability.
- [ ] **Focus Mode**: Add a toggle to collapse both the sidebar and preview pane, leaving only the editor for distraction-free writing.
