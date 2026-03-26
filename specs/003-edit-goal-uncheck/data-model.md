# Data Model: Edit Goal and Uncheck Completed

**Feature**: 003-edit-goal-uncheck | **Date**: 2026-03-26

## Entities

### Goal (existing — no schema changes)

The existing `goals` table already contains all fields required for editing. No migration needed.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Immutable |
| title | VARCHAR(255) | NOT NULL | Editable via modal |
| end_date | DATE | NOT NULL | Editable via modal |
| status | VARCHAR(20) | CHECK ('active', 'completed'), DEFAULT 'active' | Toggled by uncheck |
| focus_area | VARCHAR(50) | Nullable | Editable via modal ('Professional' or 'Personal') |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Immutable |
| completed_at | TIMESTAMPTZ | Nullable | Set to NULL on uncheck |

### State Transitions

```
active ──[check checkbox]──► completed (completedAt = NOW())
completed ──[uncheck checkbox]──► active (completedAt = NULL, urgency recalculated)
active ──[delete from modal]──► deleted (row removed)
```

### New TypeScript Interface

```typescript
// Added to lib/types.ts
interface EditGoalInput {
  title?: string;
  endDate?: string;
  focusArea?: string;
}
```

### Edit Modal State (client-side only)

| Field | Type | Description |
|-------|------|-------------|
| editingGoal | GoalWithUrgency \| null | The goal currently being edited (null = modal closed) |
| title | string | Form field — initialized from editingGoal.title |
| endDate | string | Form field — initialized from editingGoal.endDate |
| focusArea | string | Form field — initialized from editingGoal.focusArea |
| error | string \| null | Inline error message for API failures |
| isSubmitting | boolean | Loading state during save/delete |

### Validation Rules

| Field | Rule | Where Enforced |
|-------|------|----------------|
| title | Non-empty, max 255 chars | Client (modal) + Server (API) |
| endDate | Valid date format (past dates allowed for edit) | Client (modal) + Server (API) |
| focusArea | Must be 'Professional' or 'Personal' | Client (modal chip selection) |
