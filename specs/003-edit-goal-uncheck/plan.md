# Implementation Plan: Edit Goal and Uncheck Completed

**Branch**: `003-edit-goal-uncheck` | **Date**: 2026-03-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-edit-goal-uncheck/spec.md`

## Summary

Add an edit modal for active goals (pre-populated form matching the design reference) with save/delete capabilities, and make completed goal checkboxes clickable to revert goals to active status. Extends the existing PATCH API to accept field updates beyond status toggling and adds inline error handling for all mutation operations.

## Technical Context

**Language/Version**: TypeScript ^5, Node.js (Next.js runtime)
**Primary Dependencies**: Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui (Dialog), date-fns, pg driver, Material Symbols icons
**Storage**: PostgreSQL (existing `goals` table — no schema changes needed)
**Testing**: None — constitution prohibits tests
**Target Platform**: Web (desktop + mobile responsive)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Edit save and uncheck operations complete within 2 seconds (SC-001, SC-002)
**Constraints**: No new npm dependencies permitted without justification; Tailwind-only styling
**Scale/Scope**: Single-user goal tracker, low volume

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | PASS | New component (EditGoalModal) has single responsibility; existing files extended minimally |
| II. Simple UX | PASS | Modal is single-purpose with one primary action (Save); loading/error/empty states handled per spec |
| III. Responsive Design | PASS | Design uses responsive grid (grid-cols-1 md:grid-cols-2); modal max-w-lg with padding |
| IV. Minimal Dependencies | PASS | No new dependencies — reuses existing shadcn Dialog, Material Symbols, date-fns |
| V. No Testing | PASS | No test files, test frameworks, or test tasks included |

No violations. Gate passed.

## Project Structure

### Documentation (this feature)

```text
specs/003-edit-goal-uncheck/
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
├── api/
│   └── goals/
│       ├── route.ts              # GET/POST (unchanged)
│       └── [id]/
│           └── route.ts          # PATCH extended, DELETE unchanged
├── page.tsx                      # Dashboard — add edit handler, wire modal + uncheck
└── layout.tsx                    # Unchanged

components/
├── add-goal-modal.tsx            # Existing — reference for patterns
├── edit-goal-modal.tsx           # NEW — edit modal component
├── goal-card.tsx                 # Modified — add edit button (active), enable uncheck (completed)
├── goal-list.tsx                 # Minor — pass edit handler through
├── delete-confirm-dialog.tsx     # Existing — unchanged
└── ui/
    └── dialog.tsx                # Existing shadcn Dialog — reused

lib/
├── goals.ts                     # Extended — add editGoal() function
├── types.ts                     # Extended — add EditGoalInput interface
├── dates.ts                     # Unchanged
├── cache.ts                     # Unchanged
├── db.ts                        # Unchanged
└── schema.sql                   # Unchanged (no schema changes needed)
```

**Structure Decision**: Follows existing Next.js App Router structure. New edit modal is a standalone component mirroring the add-goal-modal pattern. API extension is in-place on the existing PATCH route.
