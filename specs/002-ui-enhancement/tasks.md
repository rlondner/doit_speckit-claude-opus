# Tasks: UI Enhancement with Orange Design System

**Input**: Design documents from `/specs/002-ui-enhancement/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api-goals.md, quickstart.md

**Tests**: None -- constitution prohibits tests (Constitution V)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: No new project initialization needed -- this is a restyling of an existing application. Phase is intentionally empty.

**Checkpoint**: Existing project structure confirmed -- proceed to foundational changes.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design token system, font loading, and schema migration that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T001 Replace shadcn color tokens with orange design system CSS custom properties and Tailwind theme extensions in `app/globals.css` — extract all color tokens, gradient classes (`.bg-radiant-primary`), and surface hierarchy variables from `design/orange/do_it_dashboard/code.html`
- [ ] T002 [P] Swap Geist/Geist Mono fonts for Plus Jakarta Sans (headlines) and Inter (body) via `next/font/google` in `app/layout.tsx` — set CSS variables `--font-headline` and `--font-body` on the `<html>` element, add Material Symbols Outlined `<link>` tag per R-002
- [ ] T003 [P] Update Goal TypeScript interface to add `focusArea: string | null` field, update `CreateGoalInput` to add optional `focusArea`, and update `GoalWithUrgency` in `lib/types.ts` per data-model.md
- [ ] T004 [P] Add `focus_area VARCHAR(50)` column to the goals table DDL in `lib/schema.sql` per data-model.md migration
- [ ] T005 Update `createGoal` and `listGoals` functions to handle `focus_area` column (INSERT with focusArea param, SELECT with `focus_area AS "focusArea"`) in `lib/goals.ts` — depends on T003, T004
- [ ] T006 Update POST handler to accept optional `focusArea` in request body and pass to `createGoal`; update GET handler to return `focusArea` in goal responses in `app/api/goals/route.ts` — depends on T005, per contracts/api-goals.md

**Checkpoint**: Design tokens active, fonts loaded, schema updated -- user story implementation can begin

---

## Phase 3: User Story 1 - Refreshed Dashboard Experience (Priority: P1) 🎯 MVP

**Goal**: Apply the "Radiant Catalyst" orange design system to the main dashboard — header, greeting, goal cards, recently completed sidebar, Pro Tip card, and Add New Goal button

**Independent Test**: Open the dashboard and verify layout, colors, typography, and component styling match `design/orange/do_it_dashboard/code.html` and `screen.png`

### Implementation for User Story 1

- [ ] T007 [US1] Restyle the header in `app/layout.tsx` — sticky header with "Do It" brand in coral-accent color, navigation links with active indicator styling, notification/settings/profile icon placeholders using Material Symbols, per dashboard `code.html` header markup (FR-009)
- [ ] T008 [US1] Rebuild the dashboard layout in `app/page.tsx` — greeting section with Plus Jakarta Sans headline and warm orange background, active goals in 8-column grid, recently completed sidebar in 4-column grid, and pill-shaped "Add New Goal" button with `.bg-radiant-primary` gradient per dashboard `code.html` (FR-001, FR-003, FR-010)
- [ ] T009 [US1] Restyle goal cards in `components/goal-card.tsx` — rounded corners (`rounded-2xl`), orange design color tokens, hover translate-x interaction, urgency badges with color coding (normal/urgent/overdue per R-006 border rules), placeholder progress bars, per dashboard `code.html` goal card markup (FR-006)
- [ ] T010 [US1] Restyle the goal list and split into active goals section + recently completed sidebar in `components/goal-list.tsx` — completed goals show coral-orange check icons, strikethrough text, light grey-blue background container (`bg-grey-blue-light`), rounded container (`rounded-3xl`), plus a static "Pro Tip" card with decorative icon, per dashboard `code.html` aside markup (FR-007)

**Checkpoint**: Dashboard fully restyled with orange design system — independently verifiable against mockup

---

## Phase 4: User Story 2 - Redesigned Add New Goal Modal (Priority: P2)

**Goal**: Transform the Add New Goal modal with orange gradient header, glassmorphism backdrop, refined inputs, focus area chip selectors, and pill-shaped action buttons

**Independent Test**: Click "Add New Goal" and verify the modal matches `design/orange/add_new_goal_modal_orange/code.html` and `screen.png` — gradient header, styled inputs, focus area chips, and pill CTA button

### Implementation for User Story 2

- [ ] T011 [US2] Restyle the Add New Goal modal in `components/add-goal-modal.tsx` — implement orange gradient header ("Ignite a New Path" title with warm gradient `#f07a50` to `#ffb48f`), glassmorphism backdrop (`bg-[#0f172a]/10 backdrop-blur-sm`), borderless input fields with warm surface background and focus ring, two-column layout for End Date and Focus Area, pill-shaped "Create Goal" button with orange gradient and tinted shadow, ghost-style "Cancel" button, per modal `code.html` (FR-004, R-001, R-004)
- [ ] T012 [US2] Add focus area chip selector component within `components/add-goal-modal.tsx` — pill-shaped selectable chips for "Professional" and "Personal" values, single-select behavior, selected state with primary color fill, unselected with surface background, wire chip selection to the `focusArea` field in the create goal form submission (FR-004)

**Checkpoint**: Modal fully restyled with focus area persistence — independently verifiable against mockup

---

## Phase 5: User Story 3 - Consistent Typography and Color Token System (Priority: P3)

**Goal**: Ensure all remaining UI elements follow the orange design system consistently — delete dialog, empty/loading/error states, and any components not yet updated

**Independent Test**: Navigate through all pages and states; verify typography, color tokens, and spacing follow `design/orange/do_it_pastel/DESIGN.md` guidelines and are consistent with token definitions in both `code.html` files

### Implementation for User Story 3

- [ ] T013 [US3] Restyle the delete confirmation dialog in `components/delete-confirm-dialog.tsx` — apply orange design system tokens, pill-shaped buttons, surface hierarchy backgrounds, tinted shadows, Plus Jakarta Sans headings and Inter body text per DESIGN.md (FR-005, FR-008)
- [ ] T014 [US3] Audit and update empty state, loading state, and error state UI across `app/page.tsx` and `components/goal-list.tsx` — ensure all states use new design tokens (warm dark text `#1e293b`, no pure black, surface backgrounds, pill buttons), consistent typography (Plus Jakarta Sans headlines, Inter body), and follow the No-Line Rule (FR-001, FR-002, FR-005)
- [ ] T015 [P] [US3] Audit all components for pure black text (`#000000` or `text-black`), standard visible borders (replace with surface hierarchy where appropriate per R-006 exceptions), and non-pill buttons — fix any violations of DESIGN.md rules across all files in `app/` and `components/` (SC-004, SC-005)

**Checkpoint**: All UI elements consistent with orange design system — no pure black text, no standard borders (except R-006 exceptions), all buttons pill-shaped

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive validation and final quality checks

- [ ] T016 Validate responsive layout at 320px, 768px, 1280px, and 1920px viewports — verify dashboard grid collapses to single column on mobile, modal adapts to small screens, and all components remain usable per FR-010 and SC-006
- [ ] T017 Validate long goal titles truncate with ellipsis rather than breaking card layout across `components/goal-card.tsx` and `components/goal-list.tsx`
- [ ] T018 Run `pnpm lint` and `pnpm build` to verify no TypeScript errors, lint violations, or build failures from all changes
- [ ] T019 Run quickstart.md validation — walk through the implementation order checklist in `specs/002-ui-enhancement/quickstart.md` and confirm all items are addressed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Empty — existing project
- **Foundational (Phase 2)**: BLOCKS all user stories — design tokens, fonts, and schema must be in place first
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion (specifically T005/T006 for focusArea API)
- **User Story 3 (Phase 5)**: Depends on Phases 3 and 4 (audits components styled in those phases)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2 — independent of US1 (different components)
- **User Story 3 (P3)**: Should start after US1 and US2 — it audits and polishes components modified in those stories

### Within Phase 2 (Foundational)

```
T001 (globals.css tokens) ──┐
T002 (fonts) ───────────────┤── All can start in parallel
T003 (types.ts) ────────────┤
T004 (schema.sql) ──────────┘
         │
         ▼
T005 (goals.ts) ── depends on T003, T004
         │
         ▼
T006 (api route) ── depends on T005
```

### Within US1 (Phase 3)

```
T007 (header) ──────────┐
T008 (dashboard layout) ┤── Sequential: T008 defines layout that T009/T010 populate
T009 (goal cards) ───────┤── Can follow T008
T010 (goal list/sidebar) ┘── Can follow T008
```

### Within US2 (Phase 4)

```
T011 (modal restyle) ── then ── T012 (focus area chips)
```

### Parallel Opportunities

- **Phase 2**: T001, T002, T003, T004 can all run in parallel (different files)
- **Phase 3 + Phase 4**: US1 (T007-T010) and US2 (T011-T012) can run in parallel after Phase 2 since they modify different component files
- **Phase 5**: T015 can run in parallel with T013/T014 (audits different files)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all independent foundational tasks together:
Task: "Replace color tokens in app/globals.css"
Task: "Swap fonts in app/layout.tsx"
Task: "Update Goal interface in lib/types.ts"
Task: "Add focus_area column in lib/schema.sql"

# Then sequential:
Task: "Update queries in lib/goals.ts" (after types + schema)
Task: "Update API route in app/api/goals/route.ts" (after queries)
```

## Parallel Example: US1 + US2 (after Phase 2)

```bash
# These user stories modify different files and can run in parallel:
# Stream 1 (US1): T007 → T008 → T009, T010
# Stream 2 (US2): T011 → T012
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (design tokens, fonts, schema)
2. Complete Phase 3: User Story 1 (dashboard restyle)
3. **STOP and VALIDATE**: Compare dashboard side-by-side with `screen.png`
4. Deploy/demo — dashboard delivers the most visible impact

### Incremental Delivery

1. Complete Phase 2 → Foundation ready (tokens, fonts, schema)
2. Add User Story 1 → Dashboard restyled → Validate against mockup (MVP!)
3. Add User Story 2 → Modal restyled → Validate against mockup
4. Add User Story 3 → Full consistency audit → Validate SC-004, SC-005
5. Polish → Responsive, edge cases, build verification
6. Each story adds visual polish without breaking previous stories
