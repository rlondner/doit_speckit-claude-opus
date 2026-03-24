# Data Model: Goal Tracker

**Feature**: 001-initial-page-setup
**Storage**: PostgreSQL
**Date**: 2026-03-24

## Entities

### Goal

Represents a user's objective that can be tracked from active to completed status.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique goal identifier |
| `title` | `VARCHAR(255)` | NOT NULL, min length 1 | Goal title entered by user |
| `end_date` | `DATE` | NOT NULL | Target completion date |
| `status` | `VARCHAR(20)` | NOT NULL, DEFAULT `'active'`, CHECK IN (`'active'`, `'completed'`) | Current goal state |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` | When the goal was created |
| `completed_at` | `TIMESTAMPTZ` | NULL | When the goal was marked complete |

### SQL Schema

```sql
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL CHECK (char_length(title) >= 1),
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_goals_status ON goals (status);
CREATE INDEX idx_goals_end_date ON goals (end_date) WHERE status = 'active';
```

## Validation Rules

| Rule | Source | Enforcement |
|------|--------|-------------|
| Title must not be empty | FR-006 | DB CHECK + client-side form validation |
| End date must not be in the past (on creation) | FR-007 | API route validation (not DB — allows existing goals to age) |
| Status transitions: `active` → `completed` only | FR-008 | API route logic |
| Title max 255 characters | Edge case (long titles) | DB VARCHAR + client-side |

## State Transitions

```
                 ┌──────────┐
   POST /goals   │          │  PATCH /goals/:id
   ──────────► │  active  │ ────────────────►  completed
                 │          │  {status: 'completed'}
                 └────┬─────┘       └─────┬──────┘
                      │                    │
                      │  DELETE /goals/:id │  DELETE /goals/:id
                      ▼                    ▼
                   (deleted)            (deleted)
```

- Goals are created as `active`
- Active goals can be moved to `completed` via checkbox
- Goals in either state can be permanently deleted (hard delete from DB)
- No transition from `completed` back to `active` (not in spec)

## Computed Fields (Application Layer)

| Field | Derivation | Used For |
|-------|-----------|----------|
| `daysRemaining` | `differenceInCalendarDays(end_date, today)` | Display "X days left" |
| `urgency` | `daysRemaining <= 3 && daysRemaining >= 0` → `'urgent'`; `daysRemaining < 0` → `'overdue'`; else `'normal'` | Visual highlighting (FR-003, FR-004) |

## TypeScript Interface

```typescript
interface Goal {
  id: string;
  title: string;
  endDate: string;       // ISO date string (YYYY-MM-DD)
  status: 'active' | 'completed';
  createdAt: string;     // ISO timestamp
  completedAt: string | null;
}

interface GoalWithUrgency extends Goal {
  daysRemaining: number;
  urgency: 'normal' | 'urgent' | 'overdue';
}

interface CreateGoalInput {
  title: string;
  endDate: string;       // YYYY-MM-DD, must not be in the past
}
```
