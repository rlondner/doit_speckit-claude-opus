# Tasks: Edit Goal and Uncheck Completed

**Input**: Design documents from `/specs/003-edit-goal-uncheck/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: None — constitution prohibits tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend shared types and backend to support edit operations before any UI work

- [x] T001 [P] Add `EditGoalInput` interface to `lib/types.ts` with optional `title`, `endDate`, and `focusArea` fields
- [x] T002 [P] Add `editGoal(id: string, input: EditGoalInput)` function to `lib/goals.ts` that calls PATCH with field updates

**Checkpoint**: Shared types and client-side API helper ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the PATCH API route to accept field updates — MUST be complete before any user story UI work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Extend PATCH handler in `app/api/goals/[id]/route.ts` to accept optional `title`, `endDate`, `focusArea` fields alongside existing `status` field, with validation (non-empty title ≤255 chars, valid date format, focusArea ≤50 chars) and appropriate error responses (400/404/500)

**Checkpoint**: Foundation ready — `PATCH /api/goals/[id]` accepts all edit fields and returns updated goal

---

## Phase 3: User Story 1 — Edit an Active Goal (Priority: P1) 🎯 MVP

**Goal**: Users can click an edit button on any active goal card, modify title/end date/focus area in a modal, and save changes that appear immediately on the dashboard.

**Independent Test**: Click the edit (pencil) button on any active goal, change the title or end date, save, and verify the updated data appears on the dashboard.

### Implementation for User Story 1

- [x] T004 [P] [US1] Create `components/edit-goal-modal.tsx` — modal component using shadcn Dialog with gradient header ("Refine Your Ambition"), pre-populated form fields (title input, date input, focus area chip selector), "Save Changes" and "Cancel" buttons, inline error display, loading state during save; follow design reference from `specs/design/orange/edit_existing_goal`
- [x] T005 [P] [US1] Add edit (pencil) icon button to active goal cards in `components/goal-card.tsx` — icon-only button using Material Symbols edit icon, colored `primary-fixed-dim` (#f3683b), visible only on active variant; do NOT show on completed cards
- [x] T006 [US1] Pass `onEdit` handler through `components/goal-list.tsx` to goal cards (depends on T005)
- [x] T007 [US1] Wire edit flow in `app/page.tsx` — add `editingGoal` state (GoalWithUrgency | null), `handleEdit` callback that sets state, `handleSaveEdit` that calls `editGoal()` with optimistic update + refetch, render `EditGoalModal` with props; include inline error handling for save failures (depends on T004, T006)

**Checkpoint**: User Story 1 fully functional — active goals can be edited via modal with immediate dashboard updates

---

## Phase 4: User Story 2 — Uncheck a Completed Goal (Priority: P1)

**Goal**: Users can click the checked checkbox on a completed goal in the sidebar to revert it to active status, removing the completion timestamp and recalculating urgency.

**Independent Test**: Complete a goal, then click its checkbox in the Completed Goals sidebar, and verify it reappears in the Active Goals list with recalculated urgency.

### Implementation for User Story 2

- [x] T008 [US2] Ensure completed goal checkbox in `components/goal-card.tsx` fires `onToggle(goal.id, "active")` on click — verify the completed variant's checkbox `onChange` is correctly wired and not disabled; add inline error display for toggle failures
- [x] T009 [US2] Verify uncheck flow in `app/page.tsx` — ensure `handleToggle` already handles completed→active transition with optimistic update (set `completedAt = null`, recalculate urgency); add error state display for failed uncheck operations near the completed goals section

**Checkpoint**: User Story 2 fully functional — completed goals can be unchecked back to active

---

## Phase 5: User Story 3 — Delete a Goal from the Edit Modal (Priority: P2)

**Goal**: Users can delete a goal directly from the edit modal via a "Delete Goal" button with `window.confirm()` confirmation, matching the existing delete pattern.

**Independent Test**: Open the edit modal, click "Delete Goal", confirm deletion, and verify the goal is removed from the dashboard.

### Implementation for User Story 3

- [x] T010 [US3] Add "Delete Goal" button to edit modal footer in `components/edit-goal-modal.tsx` — styled as destructive action, triggers `window.confirm()` on click, calls `onDelete(goalId)` on confirmation, shows inline error on failure; keep modal open if user cancels confirmation
- [x] T011 [US3] Wire delete-from-modal in `app/page.tsx` — pass `handleDelete` (existing) as `onDelete` prop to `EditGoalModal`, close modal and remove goal from state on success (depends on T010)

**Checkpoint**: All user stories functional — edit, uncheck, and delete-from-modal all working

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout verification, edge cases, and final validation

- [x] T012 [P] Verify responsive layout of edit modal at 320px, 768px, and 1280px viewports — ensure modal uses `max-w-lg` with appropriate padding per design reference
- [x] T013 [P] Verify edit button visibility: 100% of active cards show pencil icon, 0% of completed cards show it (FR-001, FR-002, SC-004)
- [x] T014 Run `quickstart.md` verification steps end-to-end (edit → save, delete from modal, uncheck completed, responsive check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001, T002) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion — can run in parallel with US1
- **User Story 3 (Phase 5)**: Depends on Phase 3 (US3 adds delete to the edit modal created in US1)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no other story dependencies
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) — independent of US1
- **User Story 3 (P2)**: Depends on US1 (edit modal must exist before adding delete button to it)

### Within Each User Story

- Backend/types before frontend
- Component creation before wiring
- Core implementation before error handling refinement

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel (different files)
- **Phase 3**: T004 and T005 can run in parallel (different files: edit-goal-modal.tsx vs goal-card.tsx)
- **Phase 3+4**: US1 and US2 can proceed in parallel after Phase 2
- **Phase 6**: T012 and T013 can run in parallel (independent verification tasks)

---

## Parallel Example: User Story 1

```bash
# After Phase 2 completes, launch these in parallel:
Task: "Create EditGoalModal component in components/edit-goal-modal.tsx"  (T004)
Task: "Add edit button to active goal cards in components/goal-card.tsx"  (T005)

# Then sequentially:
Task: "Pass onEdit handler through components/goal-list.tsx"              (T006, depends on T005)
Task: "Wire edit flow in app/page.tsx"                                    (T007, depends on T004+T006)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003)
3. Complete Phase 3: User Story 1 (T004–T007)
4. **STOP and VALIDATE**: Edit an active goal end-to-end
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Backend ready
2. Add User Story 1 (edit modal) → Test independently → Deploy (MVP!)
3. Add User Story 2 (uncheck) → Test independently → Deploy
4. Add User Story 3 (delete from modal) → Test independently → Deploy
5. Polish phase → Final validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks included (constitution prohibits tests)
- The existing PATCH handler and `onToggle` infrastructure means US2 may require minimal changes — verify before implementing
- Design reference files in `specs/design/orange/edit_existing_goal` are the visual source of truth for the edit modal
- Commit after each task or logical group
