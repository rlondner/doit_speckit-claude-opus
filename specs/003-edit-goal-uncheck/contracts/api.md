# API Contract: Edit Goal and Uncheck Completed

**Feature**: 003-edit-goal-uncheck | **Date**: 2026-03-26

## Extended Endpoint

### PATCH /api/goals/[id]

Updates a goal's fields. All body fields are optional — only provided fields are updated.

**Request**:
```json
{
  "status": "active" | "completed",   // optional — existing behavior
  "title": "string",                   // optional — NEW (1-255 chars, non-empty)
  "endDate": "YYYY-MM-DD",            // optional — NEW (valid date, past allowed)
  "focusArea": "string"               // optional — NEW (max 50 chars)
}
```

**Responses**:

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Success | Updated goal object (GoalWithUrgency) |
| 400 | Validation error (empty title, invalid date, etc.) | `{ "error": "description" }` |
| 404 | Goal not found | `{ "error": "Goal not found" }` |
| 500 | Server error | `{ "error": "Failed to update goal" }` |

**Behavior**:
- When `status` changes to `completed`: `completedAt = NOW()`
- When `status` changes to `active`: `completedAt = NULL`
- When `title`, `endDate`, or `focusArea` are provided: update those columns directly
- Multiple fields can be updated in a single request
- Urgency is recalculated on response based on updated `endDate`

### Existing Endpoints (unchanged)

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/goals | List goals (optional ?status filter) |
| POST | /api/goals | Create new goal |
| DELETE | /api/goals/[id] | Delete goal (used by edit modal delete action) |
