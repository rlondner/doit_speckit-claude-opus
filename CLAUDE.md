# doit_speckit-claude Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-26

## Active Technologies
- PostgreSQL via Next.js API routes (source of truth), localStorage (client-side cache) (001-initial-page-setup)
- TypeScript ^5, Node.js (Next.js runtime) + Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui (@base-ui/react), date-fns, pg driver (002-ui-enhancement)
- TypeScript ^5, Node.js (Next.js runtime) + Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui (Dialog), date-fns, pg driver, Material Symbols icons (003-edit-goal-uncheck)
- PostgreSQL (existing `goals` table — no schema changes needed) (003-edit-goal-uncheck)

- TypeScript ^5, Node.js (Next.js runtime) + Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui, date-fns, postgres (pg driver), swagger-ui-react (001-initial-page-setup)

## Project Structure

```text
app/
├── api/
├── swagger/
components/
├── ui/
lib/
```

## Commands

pnpm dev; pnpm lint; pnpm build

## Code Style

TypeScript ^5, Node.js (Next.js runtime): Follow standard conventions. No tests per constitution.

## Recent Changes
- 003-edit-goal-uncheck: Added TypeScript ^5, Node.js (Next.js runtime) + Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui (Dialog), date-fns, pg driver, Material Symbols icons
- 002-ui-enhancement: Added TypeScript ^5, Node.js (Next.js runtime) + Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui (@base-ui/react), date-fns, pg driver
- 001-initial-page-setup: Added TypeScript ^5, Node.js (Next.js runtime) + Next.js ^16.2.0, React ^19.2.4, Tailwind CSS ^4, shadcn/ui, date-fns, postgres (pg driver), swagger-ui-react


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
