# Research: UI Enhancement with Orange Design System

**Feature**: 002-ui-enhancement | **Date**: 2026-03-25

## R-001: Two Different Tailwind Color Configs (Dashboard vs Modal)

**Context**: The dashboard `code.html` uses a cool-toned orange palette (primary: `#ff7f70`, surface: `#f8fafc`, on-surface: `#1e293b`) while the modal `code.html` uses a warm-toned orange palette (primary: `#f07a50`, surface: `#fffaf5`, on-surface: `#3d352e`).

**Decision**: Use the **dashboard color config** as the application-wide token set, since it covers the full UI. Use the **modal color config** only within the modal component scope via CSS custom properties or Tailwind arbitrary values. The modal's warmer tones create visual distinction for the overlay context.

**Rationale**: The dashboard is the primary screen and establishes the base design language. The modal is a transient overlay with its own gradient header that naturally uses warmer tones. Applying the modal's warm tokens globally would conflict with the dashboard mockup.

**Alternatives considered**:
- Merging both palettes into one unified set -- rejected because the overlapping token names (e.g., `primary`) have different hex values, causing conflicts
- Using only the modal palette globally -- rejected because it doesn't match the dashboard mockup

**Implementation approach**:
- Define dashboard tokens in `globals.css` as CSS custom properties and Tailwind theme extensions
- For the modal, use inline/scoped CSS custom properties to override the primary gradient colors (`#f07a50` to `#ffb48f`)
- The `.bg-radiant-primary` gradient class will use the dashboard gradient (`#ff7f70` to `#ff9e94`) globally, with the modal overriding to its own gradient

## R-002: Font Loading Strategy in Next.js 16

**Context**: The design requires Plus Jakarta Sans (headlines), Inter (body/labels), and Material Symbols Outlined (icons). Currently the app uses Geist and Geist Mono via `next/font/google`.

**Decision**: Use `next/font/google` for Plus Jakarta Sans and Inter (self-hosted, no layout shift). Use a `<link>` tag for Material Symbols Outlined (icon font not available in next/font).

**Rationale**: `next/font/google` provides automatic self-hosting, font-display: swap, and eliminates external network requests for text fonts. Material Symbols is a variable icon font that requires the Google Fonts CDN `<link>` approach since it uses font-variation-settings not supported by next/font.

**Alternatives considered**:
- Loading all fonts via `<link>` tags -- rejected because it loses next/font's CLS optimization and self-hosting benefits
- Replacing Material Symbols with Lucide React (already installed) -- considered viable for icons, but the design mockups explicitly use Material Symbols class names and glyph names. Using Lucide would require mapping every icon and may not have exact matches. Material Symbols is justified as a CDN font dependency, not an npm package.

**Implementation approach**:
- In `layout.tsx`: Import `Plus_Jakarta_Sans` and `Inter` from `next/font/google`
- Set CSS variables `--font-headline` and `--font-body` on the `<html>` element
- In `globals.css`: Define `--font-headline` and `--font-body` in Tailwind theme
- Add Material Symbols Outlined `<link>` in the `<head>` via Next.js metadata or a `<link>` in layout

## R-003: Focus Area Schema Addition

**Context**: The Add New Goal modal includes "Focus Area" chip selectors (Professional, Personal, etc.). The spec requires persisting the selected value. Current schema has no `focus_area` column.

**Decision**: Add an optional `focus_area` VARCHAR column to the `goals` table. Use a simple string field, not a separate lookup table.

**Rationale**: Focus areas are a small, display-only set of predefined labels. No querying, filtering, or reporting by focus area is required in the spec. A simple nullable string column minimizes schema complexity while satisfying the persistence requirement.

**Alternatives considered**:
- Enum type in PostgreSQL -- rejected because adding new focus areas would require a migration/ALTER TYPE
- Separate `focus_areas` lookup table with FK -- rejected as over-engineering for a simple label field with no relational needs
- JSON array to support multiple focus areas -- rejected because the mockup shows single-select chips

**Implementation approach**:
- Add `focus_area VARCHAR(50)` column to `goals` table (nullable, no constraint beyond length)
- Update `Goal` interface to include `focusArea: string | null`
- Update `createGoal` function to accept optional `focusArea` parameter
- Update `listGoals` query to select `focus_area AS "focusArea"`
- Update POST `/api/goals` to accept `focusArea` in body
- Predefined chip values: "Professional", "Personal" (rendered in UI, not enforced at DB level)

## R-004: Glassmorphism and Backdrop Blur in Tailwind CSS 4

**Context**: The modal design requires a glassmorphism effect (blurred, semi-transparent overlay) and the modal container has a tinted ambient shadow.

**Decision**: Use Tailwind's built-in `backdrop-blur-sm` and `bg-{color}/{opacity}` utilities. No custom CSS needed.

**Rationale**: Tailwind CSS 4 natively supports `backdrop-blur-*` and opacity modifiers on background colors. The design's `bg-inverse-surface/10 backdrop-blur-sm` pattern maps directly to Tailwind utilities.

**Alternatives considered**:
- Custom CSS with `backdrop-filter` -- rejected because Tailwind already provides this
- Using a solid overlay without blur -- rejected because the spec explicitly requires glassmorphism

**Implementation approach**:
- Modal backdrop: `fixed inset-0 bg-[#0f172a]/10 backdrop-blur-sm` (matches dashboard code.html)
- Modal container shadow: `shadow-[0_24px_48px_-12px_rgba(240,122,80,0.15)]` (tinted with primary color, per DESIGN.md Section 4)
- Both are standard Tailwind arbitrary value syntax, no configuration needed

## R-005: Migrating from shadcn/ui Components to Custom Styled Components

**Context**: Current app uses shadcn/ui primitives (Card, Dialog, Button, Checkbox, Input, Label, AlertDialog) built on @base-ui/react. The new design requires custom styling that differs significantly from shadcn defaults.

**Decision**: Keep @base-ui/react for behavioral primitives (Dialog open/close, AlertDialog confirm/cancel, Checkbox state management) but replace all visual styling with orange design system classes. Do not add new shadcn components.

**Rationale**: @base-ui/react provides unstyled, accessible primitives. The behavior (focus trapping, keyboard navigation, ARIA attributes) is valuable and hard to reimplement correctly. Only the CSS classes need to change, not the component structure.

**Alternatives considered**:
- Removing shadcn/base-ui entirely and building from scratch -- rejected because it would require reimplementing accessibility features (focus trap, keyboard handling)
- Keeping shadcn styling and layering orange tokens on top -- rejected because the design system is fundamentally different (pill shapes, no borders, surface hierarchy) and would fight shadcn's defaults

**Implementation approach**:
- Override shadcn component classes with orange design system Tailwind classes
- For Dialog: replace DialogContent styling with orange design system modal styling
- For Checkbox: replace with round checkbox styled per dashboard mockup
- For Button: replace with pill-shaped buttons using `.bg-radiant-primary` and rounded-full
- Keep the behavioral wrappers (Dialog, AlertDialog) for accessibility

## R-006: Surface Hierarchy -- The "No-Line Rule"

**Context**: DESIGN.md strictly prohibits standard 1px borders. Sections must be defined through background color shifts. However, the dashboard `code.html` actually uses some borders (`border border-grey-blue`, `border-2 border-red-100`).

**Decision**: Follow the `code.html` implementation as the authoritative source, which uses minimal borders only for urgency emphasis (overdue cards) and subtle container edges. The "No-Line Rule" from DESIGN.md applies as a general principle but the code.html shows pragmatic exceptions.

**Rationale**: The spec states "The `code.html` files are the primary implementation blueprints." Where DESIGN.md principles and code.html markup differ, code.html takes precedence as the concrete implementation reference.

**Alternatives considered**:
- Strictly following DESIGN.md and removing all borders from code.html markup -- rejected because spec prioritizes code.html as implementation blueprint
- Adding borders everywhere -- rejected because it violates the design system's core principle

**Implementation approach**:
- Default: Use background color shifts (`bg-surface`, `bg-grey-blue-light`, `bg-surface-container-lowest`) to define sections
- Exception: Overdue/urgent goal cards use `border-2 border-red-100` with tinted background for emphasis
- Normal goal cards use subtle `border border-grey-blue` as per code.html
- Sidebar uses `bg-grey-blue-light` with `border border-grey-blue` and `rounded-3xl` per code.html
