# Implementation Plan: Goal Tracker Initial Page Setup

**Branch**: `001-initial-page-setup` | **Date**: 2026-03-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-initial-page-setup/spec.md`

## Summary

Build the "do it" goal tracking web app with a two-column layout (active/completed goals), modal-based goal creation, checkbox completion, deletion with confirmation, and urgency highlighting for goals nearing their end date. Uses Next.js 16 App Router with PostgreSQL for persistence, shadcn/ui components, Tailwind `@theme` for pastel color theming, date-fns for date calculations, and an OpenAPI spec exposed via Swagger UI.

## Technical Context

**Language/Version**: TypeScript ^5, Node.js (Next.js runtime)
**Primary Dependencies**: Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui, date-fns, postgres (pg driver), swagger-ui-react
**Storage**: PostgreSQL (single `goals` table)
**Testing**: None — constitution prohibits tests
**Target Platform**: Modern web browsers (desktop-first, responsive to 320px)
**Project Type**: Web application (Next.js App Router, fullstack)
**Performance Goals**: Sub-200ms page load for up to 50 goals; instant UI feedback on interactions
**Constraints**: Single-user (no auth); PostgreSQL must be available locally or via connection string
**Scale/Scope**: Single page application, ~50 goals max, 1 database table

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | PASS | Single-responsibility components, descriptive naming, ESLint enforced |
| II. Simple UX | PASS | Two-column layout with clear primary action (Add Goal button), empty/loading/error states planned |
| III. Responsive Design | PASS | Mobile-first Tailwind classes, columns stack on small screens, 44px touch targets |
| IV. Minimal Dependencies | PASS w/ JUSTIFICATION | shadcn/ui, date-fns, pg, swagger-ui-react added — all explicitly requested by user and serve functions not achievable with core stack |
| V. No Testing | PASS | Zero test files, frameworks, or test dependencies |

**Dependency Justifications (Principle IV)**:

| Dependency | Justification |
|------------|--------------|
| shadcn/ui | User-requested UI component library; provides accessible Dialog, Button, Checkbox, Input primitives — not achievable with plain Tailwind alone without reimplementing accessibility |
| date-fns | User-requested date formatting library; `differenceInCalendarDays` and `format` for days-remaining calculations — native `Date` lacks ergonomic day-difference APIs |
| pg (node-postgres) | User-requested PostgreSQL storage; required to connect to postgres from Next.js API routes |
| swagger-ui-react | User-requested OpenAPI/Swagger UI; renders interactive API documentation — no built-in Next.js equivalent |
| next-swagger-doc | Generates OpenAPI JSON from Next.js route metadata — lightweight bridge for Swagger UI |

## Project Structure

### Documentation (this feature)

```text
specs/001-initial-page-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI spec)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── globals.css              # Tailwind @theme with pastel color tokens
├── layout.tsx               # Root layout with fonts and metadata
├── page.tsx                 # Main page — server component, fetches goals
├── api/
│   ├── goals/
│   │   └── route.ts         # GET (list all), POST (create goal)
│   ├── goals/[id]/
│   │   └── route.ts         # PATCH (complete goal), DELETE (delete goal)
│   └── docs/
│       └── route.ts         # GET — serves OpenAPI JSON
├── swagger/
│   └── page.tsx             # Swagger UI page ("use client")
components/
├── ui/                      # shadcn/ui primitives (Button, Dialog, Checkbox, Input, Card)
├── goal-card.tsx            # Single goal display with checkbox + delete
├── goal-column.tsx          # Column wrapper (active or completed)
├── add-goal-dialog.tsx      # Modal form for new goal creation
└── delete-confirm-dialog.tsx # Confirmation dialog for goal deletion
lib/
├── db.ts                    # PostgreSQL connection pool (pg)
├── goals.ts                 # Goal data access functions (CRUD)
├── types.ts                 # Goal TypeScript interfaces
└── dates.ts                 # date-fns helpers (daysRemaining, urgency status)
public/
└── openapi.yaml             # OpenAPI specification (also served dynamically)
```

**Structure Decision**: Next.js App Router convention — `app/` for routes and API, `components/` for shared UI, `lib/` for utilities and data access. No separate backend/frontend split since Next.js handles both. No `tests/` directory per constitution.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| shadcn/ui dependency | User-mandated; accessible modal, checkbox, and button primitives | Building from scratch would reimplement ARIA patterns poorly |
| date-fns dependency | User-mandated; ergonomic date math | Native Date arithmetic is error-prone for calendar day differences |
| pg dependency | User-mandated postgres storage | localStorage was spec default but user explicitly overrode |
| swagger-ui-react | User-mandated API docs UI | No built-in Next.js OpenAPI viewer |
