# Research: Demo/Showcase Mode

**Branch**: `005-demo-mode` | **Date**: 2026-03-27

## Research Tasks & Findings

### 1. Interception Layer for Demo Mode

**Decision**: Intercept at the client-side page orchestration level (`page.tsx`), not at API routes.

**Rationale**: localStorage is a browser-only API. API routes in Next.js App Router execute server-side where localStorage does not exist. Since FR-009 requires zero network requests in demo mode, the interception must bypass fetch calls entirely and operate client-side. `page.tsx` already centralizes all data operations (fetchGoals, handleAdd, handleToggle, handleSaveEdit, handleDelete) making it the natural branching point.

**Alternatives considered**:
- **API route interception** (check env var in route handlers, use localStorage): Rejected — API routes run on the server where `window.localStorage` is undefined.
- **Service worker interception** (intercept fetch requests): Rejected — adds unnecessary complexity and a new dependency pattern; violates Principle IV (Minimal Dependencies).
- **Custom fetch wrapper** (replace global fetch): Rejected — fragile, doesn't prevent network calls cleanly, hard to maintain.

### 2. localStorage Key Structure

**Decision**: Use a single localStorage key `doit_demo_goals` storing a JSON object with `version` and `goals` array.

**Rationale**: The app has a single entity type (Goal). A single key keeps reads/writes atomic and avoids key-management complexity. The version field enables automatic re-seeding when seed data changes.

**Alternatives considered**:
- **Per-goal keys** (e.g., `demo_goal_{id}`): Rejected — listing all goals requires scanning all keys, which is slower and more complex.
- **IndexedDB**: Rejected — overkill for ~10 items; adds API complexity without benefit.

**Structure**:
```json
{
  "version": 1,
  "goals": [
    {
      "id": "uuid",
      "title": "string",
      "endDate": "YYYY-MM-DD",
      "status": "active",
      "focusArea": "string | null",
      "createdAt": "ISO-8601",
      "completedAt": "ISO-8601 | null"
    }
  ]
}
```

### 3. Seed Data Date Computation

**Decision**: Compute seed dates relative to today using date-fns `addDays()` at seed time.

**Rationale**: Per clarification, relative dates ensure varied urgency levels (normal, urgent, overdue) regardless of when the demo is viewed. Dates are computed once at seed time and stored as fixed ISO strings — they don't recompute on each load.

**Alternatives considered**:
- **Fixed calendar dates**: Rejected — all goals eventually become overdue, degrading the demo.
- **Recompute on every load**: Rejected — goals would never become overdue, which misrepresents the app's urgency feature.

### 4. Existing Cache Interaction

**Decision**: The existing `doit_goals_cache` (lib/cache.ts) will still be used in demo mode.

**Rationale**: In demo mode, page.tsx will call demo-store functions that return `GoalWithUrgency[]`. After fetching from demo-store, page.tsx can optionally cache results using the same `setCachedGoals()` / `getCachedGoals()` flow. However, since localStorage reads are synchronous and fast (<1ms), the cache provides minimal value in demo mode. The simplest approach is to bypass the cache in demo mode and always read directly from demo-store.

### 5. UUID Generation

**Decision**: Use `crypto.randomUUID()` for new goal IDs in demo mode.

**Rationale**: Available in all modern browsers (Chrome 92+, Firefox 95+, Safari 15.4+). Matches the UUID v4 format used by PostgreSQL's `gen_random_uuid()`. No external dependency needed.

### 6. No New Dependencies Needed

**Decision**: All demo mode functionality can be implemented with existing dependencies.

**Rationale**:
- `date-fns` (already installed) for `addDays()`, `differenceInCalendarDays()`
- `crypto.randomUUID()` (browser built-in) for ID generation
- `localStorage` (browser built-in) for persistence
- Tailwind CSS (already installed) for banner styling
- No new npm packages required — constitution Principle IV satisfied
