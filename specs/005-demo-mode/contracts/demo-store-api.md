# Contract: Demo Store API

**Branch**: `005-demo-mode` | **Date**: 2026-03-27

## Overview

The demo-store module (`lib/demo-store.ts`) exposes functions that mirror the data operations currently performed via fetch calls in `page.tsx`. Each function returns the same data shapes as the corresponding API endpoint, making the swap transparent.

## Function Contracts

### `initDemoStore(): void`

Initialize demo data if not present or version is stale. Called once on page load.

- **Precondition**: Running in browser (window/localStorage available)
- **Postcondition**: `doit_demo_goals` localStorage key contains valid versioned goal data
- **Side effects**: Seeds localStorage if empty or version mismatch

### `getDemoGoals(): GoalWithUrgency[]`

Retrieve all goals with computed urgency fields.

- **Returns**: `GoalWithUrgency[]` — same shape as `GET /api/goals` response `.goals`
- **Sorting**: Active goals by endDate ascending, then completed goals by completedAt descending
- **Computed fields**: `daysRemaining` and `urgency` calculated fresh on each call

### `createDemoGoal(input: CreateGoalInput): GoalWithUrgency`

Create a new goal in demo localStorage.

- **Input**: `{ title: string, endDate: string, focusArea?: string }`
- **Validation**: Same rules as `POST /api/goals` (title 1-255 chars, valid future date, focusArea max 50 chars)
- **Returns**: Newly created `GoalWithUrgency` with generated UUID and timestamps
- **Side effects**: Persists to localStorage

### `updateDemoGoal(id: string, updates: { status?: string, title?: string, endDate?: string, focusArea?: string | null }): GoalWithUrgency | null`

Update an existing goal's status or fields.

- **Input**: Goal ID + partial update object
- **Validation**: Same rules as `PATCH /api/goals/[id]`
- **Returns**: Updated `GoalWithUrgency` or `null` if goal not found
- **Side effects**: Persists to localStorage; sets `completedAt` on status transitions

### `deleteDemoGoal(id: string): boolean`

Delete a goal from demo localStorage.

- **Input**: Goal ID
- **Returns**: `true` if deleted, `false` if not found
- **Side effects**: Removes goal from localStorage

### `resetDemoData(): void`

Restore original seed data, discarding all modifications.

- **Postcondition**: localStorage contains exact seed data as if freshly initialized
- **Side effects**: Overwrites `doit_demo_goals` key entirely

### `isDemoMode(): boolean`

Check if the app is running in demo mode.

- **Returns**: `true` if `NEXT_PUBLIC_DEMO_MODE === "true"`
- **Pure**: No side effects

## Error Handling

- **localStorage unavailable**: Functions throw a descriptive error; page.tsx displays user-friendly message (FR-011)
- **localStorage full**: `createDemoGoal` and `updateDemoGoal` throw on write failure
- **Goal not found**: `updateDemoGoal` returns `null`, `deleteDemoGoal` returns `false`
- **Validation failure**: Functions throw with descriptive message (same validation as API routes)
