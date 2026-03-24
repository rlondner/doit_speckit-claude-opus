# Tasks: Goal Tracker Initial Page Setup

**Input**: Design documents from `/specs/001-initial-page-setup/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: None — constitution prohibits tests

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency installation, and base configuration

- [ ] T001 Initialize Next.js project with TypeScript and install core dependencies (next, react, tailwind css, date-fns, pg, swagger-ui-react) per quickstart.md
- [ ] T002 Initialize shadcn/ui and add required components (button, dialog, checkbox, input, card, label) into components/ui/
- [ ] T003 [P] Configure Tailwind CSS v4 pastel theme with @theme directive in app/globals.css (pastel-pink, pastel-lavender, pastel-mint, pastel-peach, pastel-sky, pastel-cream tokens)
- [ ] T004 [P] Create root layout with "do it" branding in app/layout.tsx
- [ ] T005 [P] Create .env.local.example with DATABASE_URL template for PostgreSQL connection
- [ ] T005a [P] Configure ESLint with Next.js recommended rules and verify `eslint --max-warnings 0` passes on empty project
- [ ] T005b [P] Configure Tailwind responsive breakpoints (md:768px, lg:1280px) and verify base layout scales correctly in app/globals.css and app/layout.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create TypeScript type definitions (Goal, GoalWithUrgency, CreateGoalInput interfaces) in lib/types.ts per data-model.md
- [ ] T007 Create PostgreSQL connection pool with singleton pattern (globalThis caching for dev HMR) in lib/db.ts per research.md
- [ ] T008 Create SQL schema file with goals table, indexes, and IF NOT EXISTS guards in lib/schema.sql per data-model.md
- [ ] T009 [P] Create date helper utilities (daysRemaining, urgency computation) using date-fns in lib/dates.ts
- [ ] T010 [P] Create localStorage cache helpers (get/set/invalidate goal cache) in lib/cache.ts
- [ ] T011 Create Goal CRUD operations (listGoals, createGoal, updateGoal, deleteGoal) with parameterized queries and camelCase aliasing in lib/goals.ts

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — View Current and Completed Goals (Priority: P1) 🎯 MVP

**Goal**: Display a two-column layout with active goals (left, sorted by end date ascending) showing days remaining/urgency highlighting, and completed goals (right, sorted by completion date descending). Empty states for both columns.

**Independent Test**: Load the page with pre-existing goal data in PostgreSQL and verify active goals appear on the left with days remaining, urgency highlighting for ≤3 days and overdue goals, and completed goals appear on the right.

### Implementation for User Story 1

- [ ] T012 [US1] Implement GET /api/goals route with optional status filter, urgency computation, and sorting (active by end_date ASC, completed by completed_at DESC) in app/api/goals/route.ts
- [ ] T013 [P] [US1] Create GoalCard component displaying title, days remaining, urgency highlighting (pastel-pink for urgent, pastel-peach for overdue), and completed state in components/goal-card.tsx
- [ ] T014 [P] [US1] Create GoalList column component with header, empty state messaging, and independent scrolling in components/goal-list.tsx
- [ ] T015 [US1] Create main page with two-column layout (active left, completed right), data fetching from API, localStorage caching, loading and error states in app/page.tsx

**Checkpoint**: User Story 1 complete — users can view active and completed goals with urgency highlighting

---

## Phase 4: User Story 2 — Add a New Goal (Priority: P2)

**Goal**: Allow users to click an "Add Goal" button to open a modal form with title and end date fields, validate inputs (non-empty title, future date), and submit to create a new active goal.

**Independent Test**: Click "Add Goal" button, fill in title and end date, submit, and verify the new goal appears in the active goals column.

### Implementation for User Story 2

- [ ] T016 [US2] Implement POST /api/goals route with title/endDate validation (non-empty, not in past) and 201 response in app/api/goals/route.ts
- [ ] T017 [US2] Create AddGoalModal component with shadcn Dialog, title Input, end date Input (type=date), client-side validation, and form submission in components/add-goal-modal.tsx
- [ ] T018 [US2] Integrate AddGoalModal into main page with "Add Goal" button, optimistic UI update, and cache invalidation in app/page.tsx

**Checkpoint**: User Stories 1 & 2 complete — users can view goals and add new ones

---

## Phase 5: User Story 3 — Complete a Goal (Priority: P3)

**Goal**: Allow users to check a goal's checkbox to move it from active to completed, and uncheck a completed goal to move it back to active.

**Independent Test**: Check an active goal's checkbox and verify it moves to the completed column. Uncheck a completed goal and verify it moves back to active.

### Implementation for User Story 3

- [ ] T019 [US3] Implement PATCH /api/goals/:id route with status toggle (active↔completed), completed_at timestamp management in app/api/goals/[id]/route.ts
- [ ] T020 [US3] Add checkbox interaction to GoalCard with onToggle handler, optimistic status update, and cache invalidation in components/goal-card.tsx
- [ ] T021 [US3] Wire checkbox toggle through GoalList to main page state management with optimistic UI in app/page.tsx

**Checkpoint**: User Stories 1–3 complete — users can view, add, and complete/uncomplete goals

---

## Phase 6: User Story 4 — Delete a Goal (Priority: P4)

**Goal**: Allow users to permanently delete a goal from either column with a confirmation dialog.

**Independent Test**: Click delete on a goal, confirm in the dialog, and verify the goal is removed from the display and database.

### Implementation for User Story 4

- [ ] T022 [US4] Implement DELETE /api/goals/:id route with 204 response and 404 handling in app/api/goals/[id]/route.ts
- [ ] T023 [US4] Create DeleteConfirmDialog component with shadcn AlertDialog, confirmation message, and cancel/confirm actions in components/delete-confirm-dialog.tsx
- [ ] T024 [US4] Add delete button to GoalCard and integrate DeleteConfirmDialog with optimistic removal and cache invalidation in components/goal-card.tsx and app/page.tsx

**Checkpoint**: All user stories complete — full CRUD goal tracking operational

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: OpenAPI/Swagger, final integration, edge cases

- [ ] T025 [P] Place OpenAPI spec JSON file at public/openapi.json from contracts/openapi.yaml (converted to JSON)
- [ ] T026 [P] Create API docs route serving OpenAPI JSON in app/api/openapi.json/route.ts
- [ ] T027 [P] Create Swagger UI page (client component) loading spec from /api/openapi.json in app/swagger/page.tsx
- [ ] T028 Handle edge cases: long title truncation/wrapping in GoalCard, independent column scrolling in GoalList, "0 days left" display for today's date in components/goal-card.tsx and components/goal-list.tsx
- [ ] T029 Run quickstart.md validation — verify full setup flow works end-to-end
- [ ] T030 Manual viewport verification — check all pages at 768px and 1280px widths per constitution Development Workflow §3 (320px excluded per spec scope assumption)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Phase 2 completion
  - US1 (Phase 3): No dependencies on other stories
  - US2 (Phase 4): Builds on page.tsx from US1
  - US3 (Phase 5): Builds on GoalCard and page.tsx from US1
  - US4 (Phase 6): Builds on GoalCard and page.tsx from US1
- **Polish (Phase 7)**: Can start after Phase 2; T028–T029 after all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Start after Phase 2 — creates the page shell all other stories extend
- **User Story 2 (P2)**: Depends on US1 (needs page.tsx and POST route file)
- **User Story 3 (P3)**: Depends on US1 (needs GoalCard and page.tsx)
- **User Story 4 (P4)**: Depends on US1 (needs GoalCard and page.tsx); can run parallel with US2/US3

### Within Each User Story

- API route before UI components that call it
- Components before page integration
- Core implementation before optimistic UI

### Parallel Opportunities

- T003, T004, T005 can run in parallel (Phase 1)
- T009, T010 can run in parallel (Phase 2)
- T013, T014 can run in parallel (Phase 3 — different component files)
- T025, T026, T027 can run in parallel (Phase 7 — independent files)
- US2, US3, US4 can potentially run in parallel after US1 if handled carefully

---

## Parallel Example: User Story 1

```bash
# Launch parallel component creation:
Task: "Create GoalCard component in components/goal-card.tsx" (T013)
Task: "Create GoalList component in components/goal-list.tsx" (T014)

# Then sequentially:
Task: "Create main page with two-column layout in app/page.tsx" (T015)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Load page with seed data, verify two-column layout, urgency highlighting, sorting
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Validate view → Deploy/Demo (MVP!)
3. Add User Story 2 → Validate add goal → Deploy/Demo
4. Add User Story 3 → Validate complete/uncomplete → Deploy/Demo
5. Add User Story 4 → Validate delete → Deploy/Demo
6. Polish → OpenAPI/Swagger, edge cases → Final Deploy

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- No test tasks — constitution prohibits tests (Principle V)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
