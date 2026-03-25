# Implementation Plan: UI Enhancement with Orange Design System

**Branch**: `002-ui-enhancement` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-ui-enhancement/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Apply the "Radiant Catalyst" orange design system across the entire Do It dashboard and Add New Goal modal. This involves replacing the current pastel/shadcn-based styling with a warm orange/coral color palette, Plus Jakarta Sans + Inter typography, pill-shaped buttons, surface-hierarchy-based layouts (no visible borders), and glassmorphism modal effects. A minor schema addition (`focus_area`) is required for the goal creation modal. The existing component architecture (Next.js App Router, React client components, Tailwind CSS) is preserved; only the visual layer and one data field change.

## Technical Context

**Language/Version**: TypeScript ^5, Node.js (Next.js runtime)
**Primary Dependencies**: Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui (@base-ui/react), date-fns, pg driver
**Storage**: PostgreSQL via Next.js API routes (source of truth), localStorage (client-side cache)
**Testing**: None -- constitution prohibits tests
**Target Platform**: Web (desktop + mobile responsive, 320px-1920px)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: No layout shift or rendering delay from the redesign (SC-002)
**Constraints**: No new npm packages without justification (Constitution IV); Google Fonts (Plus Jakarta Sans, Inter, Material Symbols) are external CDN dependencies justified by the design spec
**Scale/Scope**: Single-page dashboard with modal, ~8 components to restyle

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | PASS | Restyling existing components; no new abstractions needed beyond design tokens |
| II. Simple UX | PASS | Design maintains single primary action per screen; loading/empty/error states preserved |
| III. Responsive Design | PASS | Design spec includes responsive grid (lg:grid-cols-12 -> single column); mobile-first approach with Tailwind breakpoints |
| IV. Minimal Dependencies | REVIEW | Google Fonts (Plus Jakarta Sans, Inter, Material Symbols Outlined) loaded via `next/font/google` and CSS link. No new npm packages required. Justified: design system mandates these specific fonts. |
| V. No Testing | PASS | No test artifacts will be created |

**Gate Result**: PASS (Principle IV reviewed -- font loading is a CSS/font dependency, not an npm package; justified by design mandate)

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-enhancement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-goals.md     # Updated API contract for focus_area
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── globals.css          # MODIFY: Replace shadcn color tokens with orange design system tokens
├── layout.tsx           # MODIFY: Replace header, swap fonts to Plus Jakarta Sans + Inter
├── page.tsx             # MODIFY: New dashboard layout with greeting, active goals, sidebar
├── api/
│   └── goals/
│       └── route.ts     # MODIFY: Accept/return focus_area field
│       └── [id]/
│           └── route.ts # No changes needed (PATCH/DELETE unchanged)
components/
├── add-goal-modal.tsx   # MODIFY: Orange gradient header, focus area chips, glassmorphism
├── delete-confirm-dialog.tsx # MODIFY: Restyle to match design system
├── goal-card.tsx        # MODIFY: Orange urgency states, hover translate, rounded corners
├── goal-list.tsx        # MODIFY: Split into active goals section + completed sidebar
├── ui/                  # EXISTING: shadcn primitives (may still be used for Dialog/AlertDialog behavior)
lib/
├── goals.ts             # MODIFY: Add focus_area to queries
├── schema.sql           # MODIFY: Add focus_area column
├── types.ts             # MODIFY: Add focusArea field to Goal interface
```

**Structure Decision**: Existing Next.js App Router structure preserved. No new directories needed. All changes are modifications to existing files.

## Complexity Tracking

No constitution violations requiring justification.
