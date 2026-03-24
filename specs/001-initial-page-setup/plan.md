# Implementation Plan: Goal Tracker Initial Page Setup

**Branch**: `001-initial-page-setup` | **Date**: 2026-03-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-initial-page-setup/spec.md`

## Summary

Build a two-column goal tracking web app called "do it" using Next.js 16 App Router with PostgreSQL persistence via API routes, shadcn/ui components, Tailwind CSS @theme for pastel theming, and date-fns for date formatting. Expose all API endpoints through an OpenAPI spec with a Swagger UI page.

## Technical Context

**Language/Version**: TypeScript ^5, Node.js (Next.js runtime)
**Primary Dependencies**: Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui, date-fns, postgres (pg driver), swagger-ui-react
**Storage**: PostgreSQL via Next.js API routes (source of truth), localStorage (client-side cache)
**Testing**: None — constitution prohibits tests
**Target Platform**: Web (modern browsers, min 768px width for initial release)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Sub-second page load, instant optimistic UI updates
**Constraints**: Single user per browser, no authentication, no mobile-first layout (min 768px)
**Scale/Scope**: Single page app, ~50 goals max expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | PASS | Single-responsibility components, descriptive naming, ESLint enforced |
| II. Simple UX | PASS | Two-column layout with single primary action (Add Goal), empty/loading/error states planned |
| III. Responsive Design | VIOLATION — JUSTIFIED | Spec explicitly scopes to min 768px; responsive breakpoints will be added but mobile-first is limited by spec assumption |
| IV. Minimal Dependencies | PASS WITH JUSTIFICATION | shadcn/ui (composable, tree-shakeable, not a runtime dep — copies components into project), date-fns (modular date formatting, native Date API insufficient for "X days left" formatting), postgres/pg (required for PostgreSQL persistence), swagger-ui-react (required for OpenAPI UI exposure) |
| V. No Testing | PASS | No test files, frameworks, or dependencies |

### Post-Phase 1 Re-check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | PASS | Components follow single responsibility; lib/ separates concerns cleanly |
| II. Simple UX | PASS | Empty states, loading states designed; single primary action per view |
| III. Responsive Design | VIOLATION — JUSTIFIED | Same as above; 768px+ breakpoints included |
| IV. Minimal Dependencies | PASS | All dependencies justified in research.md; no extras added |
| V. No Testing | PASS | No test artifacts in any design document |

## Project Structure

### Documentation (this feature)

```text
specs/001-initial-page-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI spec)
└── tasks.md             # Phase 2 output (not created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── page.tsx                    # Main two-column goal tracker page
├── layout.tsx                  # Root layout with "do it" branding
├── globals.css                 # Tailwind @theme with pastel color tokens
├── api/
│   ├── goals/
│   │   └── route.ts            # GET (list), POST (create)
│   ├── goals/[id]/
│   │   └── route.ts            # PATCH (update), DELETE
│   └── openapi.json/
│       └── route.ts            # Serves OpenAPI spec
├── swagger/
│   └── page.tsx                # Swagger UI page (client component)
components/
├── ui/                         # shadcn/ui components (Button, Dialog, Checkbox, Card, etc.)
├── goal-card.tsx               # Individual goal display with checkbox and delete
├── goal-list.tsx               # Column of goal cards (active or completed)
├── add-goal-modal.tsx          # Modal form for adding new goals
└── delete-confirm-dialog.tsx   # Confirmation dialog for goal deletion
lib/
├── db.ts                       # PostgreSQL connection pool
├── goals.ts                    # Goal CRUD operations (DB queries)
├── cache.ts                    # localStorage cache helpers
└── types.ts                    # Goal type definitions
public/
└── openapi.json                # OpenAPI 3.0 specification file
```

**Structure Decision**: Next.js App Router convention with `app/` for routes, `components/` for UI, and `lib/` for shared logic. No separate backend — Next.js API routes serve as the API layer.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Responsive Design (min 768px) | Spec explicitly scopes to desktop-first with min 768px assumption | Full mobile-first approach conflicts with stated scope; breakpoints for 768px+ and 1280px will still be included |
