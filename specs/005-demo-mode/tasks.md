# Tasks: Demo/Showcase Mode

**Input**: Design documents from `/specs/005-demo-mode/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Environment configuration for demo mode toggle

- [X] T001 Add `NEXT_PUBLIC_DEMO_MODE=true` to `.env.local.example` (or create if not exists) documenting the demo mode environment variable
- [X] T002 Add `NEXT_PUBLIC_DEMO_MODE` to `.env.local` set to `true` for local development of this feature

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core demo data layer that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create seed data module with 8 demo goals (6 active, 2 completed) using relative date offsets and `SEED_VERSION` constant in `lib/demo-seed.ts` — include `generateSeedGoals()` function that computes dates relative to today using `addDays` from date-fns, covering overdue (-2d), urgent (+1d, +3d), normal (+7d, +14d, +30d), and completed (-10d, -5d) goals with varied focus areas (Professional, Personal, null)
- [X] T004 Create `isDemoMode()` utility function in `lib/demo-store.ts` that returns `true` when `process.env.NEXT_PUBLIC_DEMO_MODE === "true"` — this is the single check used throughout the app
- [X] T005 Implement localStorage read/write helpers in `lib/demo-store.ts` — `loadGoals(): Goal[]` reads and parses `doit_demo_goals` from localStorage, `saveGoals(goals: Goal[]): void` writes versioned JSON `{ version: SEED_VERSION, goals }` to localStorage, with error handling for unavailable/full storage (FR-011)
- [X] T006 Implement `initDemoStore()` in `lib/demo-store.ts` — on call, check if `doit_demo_goals` exists in localStorage and has matching `version`; if missing or version mismatch, call `generateSeedGoals()` from `lib/demo-seed.ts` and save via `saveGoals()` (FR-002, FR-010)

**Checkpoint**: Demo data infrastructure is ready — seed generation, localStorage persistence, and initialization all work. User story implementation can begin.

---

## Phase 3: User Story 1 — View Demo Without Setup (Priority: P1)

**Goal**: Visitor opens the app in demo mode and immediately sees pre-populated goals with correct sorting and urgency levels, with zero network requests.

**Independent Test**: Set `NEXT_PUBLIC_DEMO_MODE=true`, clear localStorage, open the app — verify 6 active goals (sorted by end date ascending) and 2 completed goals (sorted by completion date descending) appear with varied urgency badges (normal, urgent, overdue).

### Implementation for User Story 1

- [X] T007 [US1] Implement `getDemoGoals(): GoalWithUrgency[]` in `lib/demo-store.ts` — reads goals via `loadGoals()`, computes `daysRemaining` and `urgency` for each using `daysRemaining()` and `computeUrgency()` from `lib/dates.ts`, sorts active goals by `endDate` ascending and completed goals by `completedAt` descending, returns combined array (FR-004, FR-005)
- [X] T008 [US1] Modify `app/page.tsx` to branch on demo mode for initial data loading — check `isDemoMode()` at component mount; if demo, call `initDemoStore()` then `getDemoGoals()` instead of fetching from `/api/goals`; set the same `goals` state so all downstream components (GoalList, GoalCard) receive identical `GoalWithUrgency[]` data shapes (FR-001, FR-009, FR-012)

**Checkpoint**: Demo mode displays seed data correctly. Visitor sees realistic goals immediately. Normal mode is unaffected.

---

## Phase 4: User Story 2 — Interact With Demo Data (Priority: P2)

**Goal**: Visitor can create, edit, complete/uncomplete, and delete goals in demo mode, with all changes persisted to localStorage across page refreshes.

**Independent Test**: In demo mode, create a new goal, edit its title, mark it completed, then refresh the page — all changes should persist. Delete a goal and refresh — it should stay deleted.

### Implementation for User Story 2

- [X] T009 [P] [US2] Implement `createDemoGoal(input: CreateGoalInput): GoalWithUrgency` in `lib/demo-store.ts` — validate title (1-255 chars, trimmed), endDate (valid date, not in past), focusArea (max 50 chars); generate UUID via `crypto.randomUUID()`, set `createdAt` to now, `status` to "active", `completedAt` to null; save to localStorage and return with computed urgency fields (FR-003, FR-006)
- [X] T010 [P] [US2] Implement `updateDemoGoal(id, updates): GoalWithUrgency | null` in `lib/demo-store.ts` — find goal by id, apply partial updates (status, title, endDate, focusArea) with same validation as create; on status→"completed" set `completedAt` to now, on status→"active" set `completedAt` to null; save and return updated goal with urgency fields, or null if not found (FR-003, FR-006)
- [X] T011 [P] [US2] Implement `deleteDemoGoal(id: string): boolean` in `lib/demo-store.ts` — find and remove goal by id from localStorage array, save updated array, return true if found/deleted or false if not found (FR-003, FR-006)
- [X] T012 [US2] Modify `app/page.tsx` to branch on demo mode for all mutation handlers — in `handleAdd`, call `createDemoGoal()` instead of `POST /api/goals`; in `handleToggle`, call `updateDemoGoal()` with status instead of `PATCH`; in `handleSaveEdit`, call `updateDemoGoal()` with field updates instead of `PATCH`; in `handleDelete`, call `deleteDemoGoal()` instead of `DELETE`; after each operation, refresh state via `getDemoGoals()` (FR-001, FR-009)

**Checkpoint**: Full CRUD works in demo mode. All operations persist across refresh. Normal mode unaffected.

---

## Phase 5: User Stories 3 & 4 — Demo Banner + Reset (Priority: P3)

**Goal**: Visitor sees a "Demo Mode" banner with a "Reset Demo Data" button. Clicking reset restores original seed data after confirmation.

**Independent Test**: Open app in demo mode — banner is visible at top. Modify some goals, click "Reset Demo Data", confirm — original seed data is restored. Open in normal mode — no banner visible.

### Implementation for User Stories 3 & 4

- [X] T013 [US3] Implement `resetDemoData(): void` in `lib/demo-store.ts` — call `generateSeedGoals()` from `lib/demo-seed.ts`, save via `saveGoals()`, overwriting all existing demo data (FR-007)
- [X] T014 [US4] Create `components/demo-banner.tsx` — a client component with "Demo Mode" text label and a "Reset Demo Data" button; styled with Tailwind using amber/yellow background for visibility; responsive layout (stacks vertically on mobile via `flex-col`, horizontal on desktop via `sm:flex-row`); accepts `onReset` callback prop; button triggers a `window.confirm()` dialog before calling `onReset` (FR-007, FR-008)
- [X] T015 [US3] [US4] Integrate DemoBanner into `app/page.tsx` — conditionally render `<DemoBanner>` at the top of the page when `isDemoMode()` is true; wire `onReset` to call `resetDemoData()` then refresh goals state via `getDemoGoals()`; ensure banner is hidden when `isDemoMode()` is false (FR-001, FR-008)

**Checkpoint**: Banner visible in demo mode, hidden in normal mode. Reset restores seed data after confirmation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, error handling, and final verification

- [X] T016 Add localStorage availability check in `lib/demo-store.ts` `initDemoStore()` — wrap localStorage access in try/catch; if unavailable (e.g., private browsing), set an error state that `page.tsx` can display as a user-friendly message explaining demo mode requires localStorage (FR-011)
- [X] T017 Verify responsive design of demo banner at 320px, 768px, and 1280px viewports — ensure banner text and reset button are legible and accessible (touch targets >= 44x44px on mobile) per constitution Principle III
- [X] T018 Run `pnpm lint` and `pnpm build` to verify zero ESLint errors and successful TypeScript compilation per constitution Development Workflow gates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (env var must exist) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 (needs `initDemoStore`, `getDemoGoals`)
- **US2 (Phase 4)**: Depends on Phase 3 (needs page.tsx demo mode branching established)
- **US3+US4 (Phase 5)**: Depends on Phase 2 (needs `resetDemoData`); can run in parallel with US2 if desired
- **Polish (Phase 6)**: Depends on all user story phases being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational phase — can start first
- **US2 (P2)**: Depends on US1 (page.tsx demo branching must exist before adding mutation handlers)
- **US3+US4 (P3)**: Depends on Foundational phase — the banner and reset are independent of US2 but best implemented after US1 establishes the page.tsx pattern
- **Recommended order**: US1 → US2 → US3+US4 (sequential)

### Within Each User Story

- Data layer functions before page.tsx integration
- Core implementation before edge case handling

### Parallel Opportunities

- T009, T010, T011 can all run in parallel (separate functions in same file, no interdependencies)
- T013 and T014 can run in parallel (different files)
- Phase 1 tasks T001 and T002 are trivially parallel

---

## Parallel Example: User Story 2

```bash
# Launch all CRUD functions in parallel (different functions, same file, no dependencies):
Task: "T009 - Implement createDemoGoal in lib/demo-store.ts"
Task: "T010 - Implement updateDemoGoal in lib/demo-store.ts"
Task: "T011 - Implement deleteDemoGoal in lib/demo-store.ts"

# Then sequentially:
Task: "T012 - Integrate mutation handlers in app/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (env var)
2. Complete Phase 2: Foundational (seed data + localStorage helpers)
3. Complete Phase 3: User Story 1 (read-only demo view)
4. **STOP and VALIDATE**: Open app with `NEXT_PUBLIC_DEMO_MODE=true` — seed goals should display correctly
5. Deploy/demo if read-only showcase is sufficient

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. Add US1 → Read-only demo view works → Deploy (MVP!)
3. Add US2 → Full CRUD in demo mode → Deploy
4. Add US3+US4 → Banner + reset → Deploy (complete feature)
5. Polish → Edge cases, responsive verification, lint/build check

---

## Notes

- [P] tasks = different files or independent functions, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks — constitution Principle V prohibits automated tests
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All existing components (GoalCard, GoalList, AddGoalModal, EditGoalModal, DeleteConfirmDialog) remain unchanged
