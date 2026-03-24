# Research: Goal Tracker Initial Page Setup

**Feature**: 001-initial-page-setup
**Date**: 2026-03-24

## Resolved Clarifications

### 1. Storage Override: PostgreSQL vs localStorage

- **Decision**: PostgreSQL
- **Rationale**: User explicitly requested postgres storage, overriding the spec's assumption of localStorage (spec line 120). This requires a `pg` dependency and a running PostgreSQL instance.
- **Alternatives considered**: localStorage (spec default) — rejected per user instruction; Prisma/Drizzle ORM — rejected per Principle IV (minimal dependencies), raw `pg` is sufficient for a single-table CRUD app.

### 2. UI Component Library: shadcn/ui

- **Decision**: shadcn/ui with Tailwind CSS v4
- **Rationale**: User explicitly requested shadcn for UI components. shadcn/ui copies component source into the project (not an npm runtime dep), providing accessible primitives (Dialog, Button, Checkbox, Input, Card) built on Radix UI.
- **Alternatives considered**: Building from scratch with Tailwind — rejected because reimplementing ARIA-compliant modals and checkboxes is error-prone; Headless UI — less maintained, fewer components.
- **Integration notes**:
  - `pnpm dlx shadcn@latest init` scaffolds `components/ui/` and updates `tailwind.config`
  - shadcn v2+ supports Tailwind CSS v4 and its `@theme` directive natively
  - Components needed: `button`, `dialog`, `checkbox`, `input`, `card`, `label`

### 3. Date Formatting: date-fns

- **Decision**: date-fns for date calculations and formatting
- **Rationale**: User explicitly requested date-fns. Provides `differenceInCalendarDays`, `format`, `isPast`, `isToday` — ergonomic APIs for the urgency highlighting feature.
- **Alternatives considered**: Native `Date` — lacks clean calendar-day difference API; Temporal API — not yet widely available in Node.js runtimes.
- **Key functions**: `differenceInCalendarDays(endDate, new Date())` for days remaining, `isPast(endDate)` for overdue detection, `format(date, 'MMM d, yyyy')` for display.

### 4. Tailwind @theme for Pastel Colors

- **Decision**: Use Tailwind CSS v4 `@theme` directive in `globals.css` for custom pastel color tokens
- **Rationale**: Tailwind v4 replaces `tailwind.config.ts` theme extensions with CSS-native `@theme` blocks. This aligns with the project's existing Tailwind v4 setup.
- **Color scheme**: Pastel palette for a modern light theme:
  - `--color-pastel-pink`: soft pink for urgency highlights
  - `--color-pastel-lavender`: accent for completed goals
  - `--color-pastel-mint`: success/completion indicators
  - `--color-pastel-peach`: warm accent for overdue goals
  - `--color-pastel-sky`: primary actions (buttons, links)
  - `--color-pastel-cream`: background/surface

### 5. OpenAPI Specification and Swagger UI

- **Decision**: Static OpenAPI YAML file served as JSON via `/api/docs` route, rendered with `swagger-ui-react` at `/swagger`
- **Rationale**: User explicitly requested an OpenAPI file and Swagger-like UI. A static YAML is easiest to maintain and version-control; the API route converts it to JSON for the Swagger UI client.
- **Alternatives considered**: `next-swagger-doc` for auto-generation from route metadata — adds complexity and another dependency; hand-maintained YAML is manageable for 4 endpoints.
- **Integration notes**:
  - `swagger-ui-react` is a client-side component (`"use client"`)
  - The `/swagger` page imports and renders `SwaggerUI` with the `/api/docs` spec URL
  - OpenAPI spec lives at `specs/001-initial-page-setup/contracts/openapi.yaml` (design) and is copied/referenced at build time

### 6. PostgreSQL Connection Management

- **Decision**: Use `pg` Pool with singleton pattern, configured via `DATABASE_URL` env var
- **Rationale**: Next.js API routes run in a serverless-like environment where each request may create a new module context. A singleton pool (cached in `globalThis` during dev) prevents connection exhaustion.
- **Pattern**:
  - `lib/db.ts` exports a `getPool()` function
  - In development: pool stored on `globalThis` to survive HMR
  - Connection string from `process.env.DATABASE_URL`
  - Pool size: default 10 (sufficient for single-user app)

### 7. Schema Migration Strategy

- **Decision**: Single `lib/schema.sql` file run manually via `psql`
- **Rationale**: For a single-table app with no auth, a migration framework (Knex, Flyway) adds unnecessary complexity per Principle IV. The schema SQL is idempotent (`IF NOT EXISTS`).
- **Alternatives considered**: Prisma Migrate — adds ORM dependency; Drizzle Kit — adds another dev dependency. Both overkill for one table.

## Technology Best Practices

### shadcn/ui + Next.js App Router
- Server Components render the page shell; Client Components wrap interactive elements (Dialog, Checkbox click handlers)
- shadcn `Dialog` component handles modal open/close, focus trap, and escape-to-close out of the box
- Use shadcn's `cn()` utility for conditional Tailwind class merging

### PostgreSQL in Next.js API Routes
- Always use parameterized queries (`$1`, `$2`) to prevent SQL injection
- Return `camelCase` from API by aliasing in SELECT: `end_date AS "endDate"`
- Handle pool errors gracefully with try/catch in route handlers

### date-fns Usage
- Import only needed functions (tree-shakeable): `import { differenceInCalendarDays } from 'date-fns'`
- Parse date strings with `parseISO` before passing to date-fns functions
- Urgency computed server-side in GET handler to ensure consistent timezone handling
