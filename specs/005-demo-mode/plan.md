# Implementation Plan: Demo/Showcase Mode

**Branch**: `005-demo-mode` | **Date**: 2026-03-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-demo-mode/spec.md`

## Summary

Add a client-side demo mode that replaces all API fetch calls with a localStorage-backed data layer, controlled by `NEXT_PUBLIC_DEMO_MODE=true`. The mock layer provides the same `GoalWithUrgency[]` response shapes so all existing UI components work unchanged. A "Demo Mode" banner with a "Reset Demo Data" button is added to the page.

## Technical Context

**Language/Version**: TypeScript ^5, Node.js (Next.js runtime)
**Primary Dependencies**: Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui, date-fns (all existing — no new dependencies)
**Storage**: localStorage (demo mode), PostgreSQL via pg driver (normal mode)
**Testing**: None — constitution prohibits tests
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Demo loads in <2s, reset completes in <1s
**Constraints**: Zero new npm dependencies, zero changes to existing UI components (GoalCard, GoalList, modals), single env var toggle
**Scale/Scope**: Single-page app, single entity (Goal), ~7 seed goals

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | PASS | New files have single responsibilities; naming is descriptive |
| II. Simple UX | PASS | Banner is minimal; reset has confirmation; no new complexity for visitors |
| III. Responsive Design | PASS | Banner must be responsive across 320px/768px/1280px viewports |
| IV. Minimal Dependencies | PASS | Zero new npm packages — uses only existing deps (date-fns, crypto.randomUUID) |
| V. No Testing | PASS | No test files, test frameworks, or test tasks will be created |
| Technology Stack | PASS | Uses mandated stack only (Next.js, React, Tailwind, TypeScript) |
| Development Workflow | PASS | Lint + type-check gates apply; manual viewport verification required |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/005-demo-mode/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── page.tsx                    # MODIFY: add demo mode branch for data operations
└── api/
    └── goals/
        ├── route.ts            # UNCHANGED
        └── [id]/route.ts       # UNCHANGED

components/
├── demo-banner.tsx             # NEW: "Demo Mode" banner with reset button
├── add-goal-modal.tsx          # UNCHANGED
├── delete-confirm-dialog.tsx   # UNCHANGED
├── edit-goal-modal.tsx         # UNCHANGED
├── goal-card.tsx               # UNCHANGED
├── goal-list.tsx               # UNCHANGED
└── ui/                         # UNCHANGED

lib/
├── demo-store.ts               # NEW: localStorage CRUD matching GoalWithUrgency shapes
├── demo-seed.ts                # NEW: seed data with relative dates
├── cache.ts                    # UNCHANGED
├── dates.ts                    # UNCHANGED (reused by demo-store)
├── db.ts                       # UNCHANGED
├── goals.ts                    # UNCHANGED
├── types.ts                    # UNCHANGED (reused by demo-store)
└── utils.ts                    # UNCHANGED
```

**Structure Decision**: Follows existing Next.js App Router layout. Two new lib files (`demo-store.ts`, `demo-seed.ts`) encapsulate all demo logic. One new component (`demo-banner.tsx`). Only `page.tsx` is modified among existing files. API routes and all existing components remain untouched.

## Design Decisions

### Interception Layer: Client-Side (page.tsx)

The mock layer intercepts at the page orchestration level in `page.tsx`, not at the API route level. Rationale:

1. **FR-009 requires no network requests** — API routes run server-side where localStorage doesn't exist
2. **localStorage is a browser-only API** — interception must happen client-side
3. **page.tsx already orchestrates all data operations** — it's the natural branching point
4. **FR-012 preserved** — GoalCard, GoalList, AddGoalModal, EditGoalModal, DeleteConfirmDialog require zero changes since they receive data via props/callbacks from page.tsx

### Data Flow in Demo Mode

```
page.tsx
  ├── isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  ├── if demo: import from lib/demo-store.ts (reads/writes localStorage)
  │   └── demo-store.ts uses lib/dates.ts for urgency computation
  │       └── demo-store.ts uses lib/demo-seed.ts for initial data
  └── if normal: fetch("/api/goals/...") as today
          └── API routes → lib/goals.ts → PostgreSQL
```

### Seed Data Strategy

- Seed dates are computed **relative to today** at seed time (per clarification)
- Seed includes goals spanning overdue (-2 days), urgent (1, 3 days), and normal (7, 14, 30 days) end dates
- Completed goals have `completedAt` set to recent past dates
- A `SEED_VERSION` constant triggers automatic re-seed when bumped
- Focus areas cover both "Professional" and "Personal" plus null

### Banner Placement

- Fixed-position banner at the top of the page, above all content
- Contains "Demo Mode" label and "Reset Demo Data" button
- Styled with Tailwind — yellow/amber background for visibility
- Responsive: stacks vertically on mobile, horizontal on desktop
