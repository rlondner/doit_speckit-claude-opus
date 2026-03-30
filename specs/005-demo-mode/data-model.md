# Data Model: Demo/Showcase Mode

**Branch**: `005-demo-mode` | **Date**: 2026-03-27

## Entities

### Goal (existing — no changes)

The Goal entity is unchanged. The demo-store reads and writes the same shape.

| Field       | Type                           | Constraints                        |
|-------------|--------------------------------|------------------------------------|
| id          | string (UUID v4)               | Required, unique, auto-generated   |
| title       | string                         | Required, 1–255 characters         |
| endDate     | string (YYYY-MM-DD)            | Required, valid date               |
| status      | "active" \| "completed"        | Required, default "active"         |
| focusArea   | string \| null                 | Optional, max 50 characters        |
| createdAt   | string (ISO-8601)              | Required, auto-generated           |
| completedAt | string (ISO-8601) \| null      | Set on completion, null if active  |

### GoalWithUrgency (existing computed extension — no changes)

Extends Goal with computed fields. Demo-store computes these identically to API routes.

| Field          | Type                                   | Computation                                    |
|----------------|----------------------------------------|------------------------------------------------|
| daysRemaining  | number                                 | `differenceInCalendarDays(endDate, today)`     |
| urgency        | "normal" \| "urgent" \| "overdue"      | <0 = overdue, 0–3 = urgent, >3 = normal       |

### DemoStore (new — localStorage structure)

Single localStorage key `doit_demo_goals` containing:

| Field   | Type     | Purpose                                                  |
|---------|----------|----------------------------------------------------------|
| version | number   | Seed data version; triggers re-seed on mismatch          |
| goals   | Goal[]   | Array of Goal objects (without computed urgency fields)   |

**State Transitions**:

```
[No localStorage data] → seed() → [Seeded state]
[Seeded state] → create/update/delete → [Modified state]
[Modified state] → reset() → [Seeded state]
[Stale version] → automatic re-seed → [Seeded state]
```

## Seed Data

7 goals computed relative to today at seed time:

| # | Title                                  | End Date Offset | Status    | Focus Area   | Urgency  |
|---|----------------------------------------|-----------------|-----------|--------------|----------|
| 1 | Complete quarterly performance review  | -2 days         | active    | Professional | overdue  |
| 2 | Submit project proposal                | +1 day          | active    | Professional | urgent   |
| 3 | Schedule dentist appointment           | +3 days         | active    | Personal     | urgent   |
| 4 | Read "Atomic Habits"                   | +7 days         | active    | Personal     | normal   |
| 5 | Prepare team presentation              | +14 days        | active    | Professional | normal   |
| 6 | Learn TypeScript generics              | +30 days        | active    | null         | normal   |
| 7 | Update resume                          | -10 days        | completed | Professional | —        |
| 8 | Organize desk workspace                | -5 days         | completed | Personal     | —        |

Completed goals have `completedAt` set to 1–2 days before today.

## Validation Rules (mirrored from API)

These rules are enforced by demo-store on create/update operations:

- **Title**: Non-empty, max 255 characters. Trim whitespace.
- **End Date**: Valid ISO date string (YYYY-MM-DD). Must not be in the past on create.
- **Focus Area**: Max 50 characters if provided. Null/undefined allowed.
- **Status**: Must be "active" or "completed".
- **On status → completed**: Set `completedAt` to `new Date().toISOString()`.
- **On status → active**: Set `completedAt` to `null`.
