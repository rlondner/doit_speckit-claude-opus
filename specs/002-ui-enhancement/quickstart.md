# Quickstart: UI Enhancement with Orange Design System

**Feature**: 002-ui-enhancement | **Date**: 2026-03-25

## Prerequisites

- Node.js, pnpm installed
- PostgreSQL running with existing `goals` table
- Run `pnpm dev` to start the dev server

## Key Reference Files

Before implementing any component, **read the corresponding design reference file first**:

| What you're building | Read this first |
|---------------------|-----------------|
| Any component | `design/orange/do_it_pastel/DESIGN.md` (design principles) |
| Dashboard layout, header, goals, sidebar | `design/orange/do_it_dashboard/code.html` |
| Add New Goal modal | `design/orange/add_new_goal_modal_orange/code.html` |
| Visual validation | `design/orange/do_it_dashboard/screen.png` and `add_new_goal_modal_orange/screen.png` |

## Implementation Order

### Phase 1: Foundation (do first)

1. **Design tokens** (`app/globals.css`) -- Replace shadcn color variables with orange design system tokens from dashboard `code.html`. Add `.bg-radiant-primary` gradient class.
2. **Font setup** (`app/layout.tsx`) -- Swap Geist fonts for Plus Jakarta Sans + Inter via `next/font/google`. Add Material Symbols Outlined `<link>`.
3. **Schema migration** (`lib/schema.sql`, `lib/types.ts`, `lib/goals.ts`, `app/api/goals/route.ts`) -- Add `focus_area` column and update types/queries/API.

### Phase 2: Core Components (after foundation)

4. **Header** (`app/layout.tsx`) -- Sticky header with "Do It" brand in coral-accent, nav links, icon buttons.
5. **Dashboard layout** (`app/page.tsx`) -- Greeting section, active goals grid (8-col) + sidebar (4-col), Add New Goal button.
6. **Goal cards** (`components/goal-card.tsx`) -- Orange urgency states, hover translate, rounded corners, progress bars.

### Phase 3: Sidebar & Modal (after core)

7. **Recently Completed sidebar** (`components/goal-list.tsx` or new sidebar section in `app/page.tsx`) -- Restyle completed goals with coral check icons, strikethrough, Pro Tip card.
8. **Add New Goal modal** (`components/add-goal-modal.tsx`) -- Orange gradient header, focus area chips, glassmorphism backdrop, pill buttons.

### Phase 4: Polish (last)

9. **Delete confirm dialog** (`components/delete-confirm-dialog.tsx`) -- Restyle to match design system.
10. **Responsive validation** -- Verify at 320px, 768px, 1280px per constitution.
11. **Empty/loading/error states** -- Ensure all states use new design tokens.

## Color Token Quick Reference

```
Primary (coral):     #ff7f70
Primary dim:         #f47164
Surface (bg):        #f8fafc
Card white:          #ffffff
Sidebar grey-blue:   #f1f5f9
Text primary:        #1e293b (never pure black!)
Text secondary:      #64748b
Border subtle:       #cbd5e1
Error red:           #ef4444
```

## Key Design Rules (from DESIGN.md)

- **No-Line Rule**: Use background color shifts instead of borders to define sections
- **Pill Standard**: All buttons and chips use `rounded-full` (9999px radius)
- **No pure black**: Use `#1e293b` for text, never `#000000`
- **Tinted shadows**: Use primary color tint in shadows, not black (e.g., `rgba(255,127,112,0.25)`)
- **Surface hierarchy**: Stack surfaces by tone difference, not drop shadows

## Commands

```bash
pnpm dev    # Start dev server
pnpm lint   # Run ESLint
pnpm build  # Production build
```
