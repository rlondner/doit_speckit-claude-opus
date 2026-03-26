# Quickstart: Edit Goal and Uncheck Completed

**Feature**: 003-edit-goal-uncheck | **Date**: 2026-03-26

## Prerequisites

- Node.js with pnpm
- PostgreSQL with existing `goals` table (no migration needed)
- `DATABASE_URL` environment variable set

## Development

```bash
pnpm dev
```

## Files to Create

| File | Purpose |
|------|---------|
| `components/edit-goal-modal.tsx` | Edit modal with form, delete action, inline errors |

## Files to Modify

| File | Change |
|------|--------|
| `lib/types.ts` | Add `EditGoalInput` interface |
| `lib/goals.ts` | Add `editGoal()` function for partial updates |
| `app/api/goals/[id]/route.ts` | Extend PATCH to accept title, endDate, focusArea |
| `components/goal-card.tsx` | Add pencil edit button (active), ensure uncheck works (completed) |
| `components/goal-list.tsx` | Pass `onEdit` handler through to goal cards |
| `app/page.tsx` | Add `handleEdit` handler, wire EditGoalModal, ensure uncheck works |

## Implementation Order

1. **Backend first**: Extend types → extend `lib/goals.ts` → extend PATCH API route
2. **Edit modal**: Create `EditGoalModal` component following design reference
3. **Wire edit**: Add edit button to active goal cards → wire modal in dashboard
4. **Wire uncheck**: Ensure completed goal checkbox triggers status toggle
5. **Error handling**: Add inline error display for all mutation failures

## Verification

1. Open dashboard, click pencil icon on any active goal
2. Edit title/date/focus area, save — verify changes appear immediately
3. Open edit modal, click Delete Goal, confirm — verify goal removed
4. Complete a goal, then click its checkbox in sidebar — verify it returns to active
5. Check responsive layout at 320px, 768px, 1280px
