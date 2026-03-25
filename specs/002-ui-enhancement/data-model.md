# Data Model: UI Enhancement with Orange Design System

**Feature**: 002-ui-enhancement | **Date**: 2026-03-25

## Entity Changes

### Goal (modified)

The only data model change is adding the `focus_area` field to the existing `goals` table.

**Current schema:**

```sql
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL CHECK (char_length(title) >= 1),
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

**Updated schema:**

```sql
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL CHECK (char_length(title) >= 1),
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  focus_area VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

**Migration:**

```sql
ALTER TABLE goals ADD COLUMN IF NOT EXISTS focus_area VARCHAR(50);
```

### Field Details

| Field | Type | Nullable | Default | Notes |
|-------|------|----------|---------|-------|
| focus_area | VARCHAR(50) | Yes | NULL | Predefined values: "Professional", "Personal". Not enforced at DB level -- UI controls which values are offered. |

### TypeScript Interface (updated)

```typescript
export interface Goal {
  id: string;
  title: string;
  endDate: string;
  status: "active" | "completed";
  focusArea: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface GoalWithUrgency extends Goal {
  daysRemaining: number;
  urgency: "normal" | "urgent" | "overdue";
}

export interface CreateGoalInput {
  title: string;
  endDate: string;
  focusArea?: string;
}
```

## Design Token System (new -- CSS only, no database)

The design token system is defined entirely in CSS/Tailwind and has no database representation. Documented here for completeness.

### Color Tokens (from dashboard code.html)

| Token | Hex | Usage |
|-------|-----|-------|
| primary / coral-accent | #ff7f70 | Brand color, CTA buttons, active indicators |
| primary-dim | #f47164 | Hover/pressed states |
| primary-container | #ff7f70 | Button backgrounds |
| on-primary | #ffffff | Text on primary surfaces |
| surface | #f8fafc | Page background |
| surface-container-lowest | #ffffff | Card backgrounds |
| surface-container-low / grey-blue-light | #f1f5f9 | Sidebar, input backgrounds |
| surface-container-high | #e2e8f0 | Divider-level surfaces |
| on-surface | #1e293b | Primary text (never pure black) |
| on-surface-variant | #64748b | Secondary/muted text |
| outline | #94a3b8 | Subtle borders |
| outline-variant / grey-blue | #cbd5e1 | Container edges |
| error | #ef4444 | Error states |
| error-container | #fee2e2 | Error backgrounds |

### Gradient Classes

| Class | Definition | Usage |
|-------|-----------|-------|
| .bg-radiant-primary | linear-gradient(135deg, #ff7f70 0%, #ff9e94 100%) | Primary CTA buttons, modal header (modal variant: #f07a50 to #ffb48f) |

### Typography

| Role | Font Family | Weight | Size | Tracking |
|------|------------|--------|------|----------|
| Display | Plus Jakarta Sans | 800 (extrabold) | 3.5rem | -0.04em |
| Headline | Plus Jakarta Sans | 700 (bold) | 1.75rem | tight |
| Body | Inter | 400-500 | 0.875rem | normal, line-height 1.6 |
| Label | Inter | 600-700 (bold) | 0.75-0.875rem | wide, uppercase |

## Relationships

```
Goal (1) --has--> (0..1) focus_area (string value)
```

No new relationships or foreign keys. The focus_area is a simple string attribute on the existing Goal entity.

## State Transitions

No changes to existing state transitions. Goals still transition between `active` and `completed` status values.
