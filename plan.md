# Implementation Plan - Curator: Dynamic Item Catalog with Local Image Uploads

A comprehensive, visually stunning item collector and catalog manager called **Curator**. It allows users to dynamically add, edit, and categorize items with pictures (local upload base64 or stock URLs), filter, search, view in multiple formats (grid, list, slider), and see real-time statistics.

## Scope
- **Interactive Forms**: A modern dialog or side-sheet form to add/edit items, including details like Name, Category, Description, Tags, Value, Rating, and Picture.
- **Advanced Image Support**:
  - Local Image Upload: drag & drop or file selector with automatic Canvas-based compression and downscaling (to ~400px width, JPEG format, ~30-50KB) to store multiple user-uploaded images safely in `localStorage` without hitting the 5MB quota.
  - Stock Image Selector: A pre-configured selection of beautiful category-themed stock images generated during development.
  - Image URLs: Support pasting direct URLs.
- **Dynamic List & Grid Views**: Interactive gallery supporting responsive layouts, search, multi-category filters, tag filters, sorting (A-Z, Date Added, Rating, Value), and card vs. detailed list toggles.
- **Statistics Dashboard**: Visual indicators representing overall collection metrics, such as total items, category breakdowns, average ratings, and financial/points value.
- **Mock Data Seed**: Seed the list with 6 high-quality default items with gorgeous photos if `localStorage` is empty.
- **Import/Export**: Allow backup of the collection as a JSON file, or resetting to defaults.

## Non-Goals
- Database or cloud hosting (strictly client-side with `localStorage` persistence).

## Affected Areas
- `src/App.tsx`: Main dashboard, layout, and control hub.
- `src/components/ItemForm.tsx`: Component for adding/editing items (handles local picture file resizing/compression).
- `src/components/ItemCard.tsx`: Individual item display card with badge tags, ratings, and action options.
- `src/components/ItemsGallery.tsx`: Grid/list controller, filtering search, empty states, and collection list.
- `src/components/StatsDashboard.tsx`: Clean stats breakdown of the user's curated items.
- `src/lib/initialData.ts`: Standard premium seed items to populate the application initially.

## Phases

### Phase 1: Storage & Seed Setup
- Create custom interfaces (`Item`, `CollectionCategory`, `Tag`).
- Setup `src/lib/initialData.ts` with gorgeous high-quality initial items.
- Setup `localStorage` hook/utilities.

### Phase 2: Core Form with Image Resizing
- Develop `src/components/ItemForm.tsx` supporting:
  - Base64 local image compression (via an HTML5 `<canvas>` resizing utility to keep storage footprints extremely low).
  - External URL pasting.
  - Presets selection.

### Phase 3: Gallery & Item Cards
- Create `src/components/ItemCard.tsx` with premium hover effects, edit/delete actions, and ratings.
- Create `src/components/ItemsGallery.tsx` and `src/components/StatsDashboard.tsx`.

### Phase 4: Integration
- Tie everything together in `src/App.tsx` with a responsive sidebar or top-navigation dashboard layout, customizable categories, and interactive alerts.

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build the dynamic items application.

**Per-agent instructions:**
### 1. frontend_engineer
- **Scope:** Create a dynamic item-adding application as described above. Focus on beautiful UI, local Canvas-based image compression, search, filters, and local storage.
- **Files:**
    - `src/lib/initialData.ts`
    - `src/components/ItemForm.tsx`
    - `src/components/ItemCard.tsx`
    - `src/components/ItemsGallery.tsx`
    - `src/components/StatsDashboard.tsx`
    - `src/App.tsx`
- **Acceptance criteria:**
    - User can add and edit items with titles, details, categories, and tags.
    - User can upload custom local pictures; they are compressed dynamically to prevent localStorage exhaustion and display beautifully.
    - Full search, filter, and sort capabilities work.
    - Storage state is persistent across browser refreshes.
    - Responsive, beautiful design with Lucide icons.
