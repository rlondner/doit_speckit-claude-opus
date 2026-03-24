# API Routes Contract

**Feature**: 001-initial-page-setup
**Base Path**: `/api`

## Endpoints Summary

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|-------------|----------|
| GET | `/api/goals` | List all goals | — | `{ goals: GoalWithUrgency[] }` |
| GET | `/api/goals?status=active` | List filtered goals | — | `{ goals: GoalWithUrgency[] }` |
| POST | `/api/goals` | Create a new goal | `{ title, endDate }` | `Goal` (201) |
| PATCH | `/api/goals/:id` | Complete a goal | `{ status: "completed" }` | `Goal` (200) |
| DELETE | `/api/goals/:id` | Delete a goal permanently | — | 204 No Content |

## Response Conventions

- Success responses use appropriate HTTP status codes (200, 201, 204)
- Error responses return `{ error: string }` with appropriate status (400, 404)
- All dates use ISO 8601 format
- Goal IDs are UUIDs
- `daysRemaining` and `urgency` are computed server-side on GET requests
- Column mapping: DB `snake_case` → API `camelCase` (e.g., `end_date` → `endDate`)

## Swagger UI

- **Path**: `/swagger`
- **OpenAPI Spec Endpoint**: `/api/docs` (serves the OpenAPI YAML as JSON)
- Interactive UI rendered with `swagger-ui-react`
