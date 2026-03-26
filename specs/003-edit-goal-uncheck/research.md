# Research: Edit Goal and Uncheck Completed

**Feature**: 003-edit-goal-uncheck | **Date**: 2026-03-26

## Research Items

### 1. Extending PATCH API to accept field updates

**Decision**: Extend the existing `PATCH /api/goals/[id]` route to accept optional `title`, `endDate`, and `focusArea` fields alongside the existing `status` field. All fields are optional — only provided fields are updated.

**Rationale**: The current PATCH handler only accepts `{ status }`. Rather than creating a separate PUT endpoint, extending PATCH is idiomatic REST — partial updates are exactly what PATCH is for. The existing status-toggle behavior is preserved; new fields are additive.

**Alternatives considered**:
- PUT endpoint for full replacement: Rejected — requires sending all fields even when unchanged, more error-prone
- Separate `/api/goals/[id]/edit` route: Rejected — unnecessary route proliferation for a simple field update

### 2. Edit modal pattern (reuse vs. new component)

**Decision**: Create a new `EditGoalModal` component rather than making `AddGoalModal` dual-purpose.

**Rationale**: The edit modal has significant differences from the add modal: pre-populated fields, a "Delete Goal" action in the footer, different header text ("Refine Your Ambition" vs. add), and the close button styling differs (white circle overlay). Making AddGoalModal handle both cases would require complex conditional logic and violate the "single responsibility" principle from the constitution.

**Alternatives considered**:
- Shared GoalFormModal with mode prop: Rejected — divergent footer actions (delete only in edit), different validation rules (edit allows past dates, add doesn't), and different header designs make sharing impractical
- Inline editing on goal cards: Rejected — spec and design explicitly require a modal

### 3. Uncheck completed goal mechanism

**Decision**: The existing `onToggle` handler in `goal-card.tsx` already supports toggling from completed→active. The checkbox in completed cards simply needs to call the same handler. The PATCH endpoint already handles `status: "active"` by setting `completedAt = NULL`.

**Rationale**: The infrastructure for unchecking is already built — the `onChange` handler on the checkbox calls `onToggle(goal.id, isCompleted ? "active" : "completed")`. The completed variant of `goal-card.tsx` already renders a checkbox. The only gap is ensuring the checkbox's onChange is wired correctly in the completed variant.

**Alternatives considered**:
- Separate "Undo" button instead of checkbox click: Rejected — spec explicitly requires clicking the checked checkbox
- New API endpoint for uncomplete: Rejected — existing PATCH with `status: "active"` is sufficient

### 4. Error handling for mutations (inline error display)

**Decision**: Use the same `text-error` pattern established in `AddGoalModal` — a `<p className="text-sm text-error">` element. For the edit modal, show it above the footer buttons. For uncheck failures on the dashboard, use a temporary error state in the page component.

**Rationale**: The codebase already has this pattern in AddGoalModal. Consistency is more important than novelty. No toast library is needed (would violate minimal dependencies principle).

**Alternatives considered**:
- Toast/notification library (react-hot-toast, sonner): Rejected — adds a new dependency; constitution requires justification for any new package
- Browser alert(): Rejected — poor UX, blocks the thread

### 5. Optimistic update strategy for edit operations

**Decision**: Follow the existing pattern in `page.tsx` — apply optimistic state update immediately, then refetch from API. On error, the refetch restores the correct state and an error message is shown.

**Rationale**: The dashboard already uses this pattern for toggle and delete operations. Consistency reduces cognitive load and maintenance burden.

**Alternatives considered**:
- No optimistic updates (wait for API response): Rejected — would feel sluggish, inconsistent with existing UX
- Full optimistic with rollback: Rejected — the existing simpler pattern (optimistic + refetch) works well enough for this scale
