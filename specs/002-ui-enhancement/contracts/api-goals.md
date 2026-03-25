# API Contract: Goals Endpoint (Updated)

**Feature**: 002-ui-enhancement | **Date**: 2026-03-25

## Changes Summary

The only API change is adding the optional `focusArea` field to goal creation and goal responses.

---

## POST /api/goals

### Request Body (updated)

```json
{
  "title": "string (required, 1-255 chars)",
  "endDate": "string (required, ISO date, not in past)",
  "focusArea": "string (optional, max 50 chars, e.g. 'Professional' | 'Personal')"
}
```

### Response 201

```json
{
  "id": "uuid",
  "title": "string",
  "endDate": "string (ISO date)",
  "status": "active",
  "focusArea": "string | null",
  "createdAt": "string (ISO timestamp)",
  "completedAt": null
}
```

### Validation Rules

| Field | Rule |
|-------|------|
| focusArea | Optional. If provided, must be a non-empty string, max 50 characters. If omitted or null, stored as NULL. |

---

## GET /api/goals

### Query Parameters (unchanged)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | "active" \| "completed" | (all) | Filter by goal status |

### Response 200 (updated)

```json
{
  "goals": [
    {
      "id": "uuid",
      "title": "string",
      "endDate": "string (ISO date)",
      "status": "active | completed",
      "focusArea": "string | null",
      "createdAt": "string (ISO timestamp)",
      "completedAt": "string (ISO timestamp) | null",
      "daysRemaining": "number",
      "urgency": "normal | urgent | overdue"
    }
  ]
}
```

---

## PATCH /api/goals/:id (unchanged)

No changes. Focus area is set at creation time only (per current spec -- no edit modal).

## DELETE /api/goals/:id (unchanged)

No changes.

---

## Backward Compatibility

- `focusArea` is nullable and optional in creation -- existing clients that don't send it will continue to work
- Existing goal records will have `focusArea: null` in responses
- No breaking changes to existing API consumers
