# Quickstart: Demo/Showcase Mode

**Branch**: `005-demo-mode` | **Date**: 2026-03-27

## What This Feature Does

Adds a demo mode that lets the app run entirely in the browser without a database. When enabled via an environment variable, all data operations use localStorage instead of Postgres. Visitors see pre-populated seed goals and can create, edit, complete, and delete goals — all persisted in the browser.

## How to Enable

1. Set the environment variable:
   ```
   NEXT_PUBLIC_DEMO_MODE=true
   ```

2. Run the app normally:
   ```
   pnpm dev
   ```

3. Open in browser — seed data appears automatically. No database required.

## How to Disable

Remove the environment variable or set it to `false`:
```
NEXT_PUBLIC_DEMO_MODE=false
```

The app reverts to normal Postgres-backed mode. No code changes needed.

## Files Changed

| File | Change |
|------|--------|
| `lib/demo-store.ts` | NEW — localStorage CRUD operations |
| `lib/demo-seed.ts` | NEW — seed data with relative dates |
| `components/demo-banner.tsx` | NEW — "Demo Mode" banner with reset button |
| `app/page.tsx` | MODIFIED — branches on demo mode for data operations |

## Key Behaviors

- **Seed data**: 6 active + 2 completed goals with varied urgency levels, computed relative to today
- **Persistence**: Changes survive page refresh within the same browser session
- **Reset**: "Reset Demo Data" button in the banner restores original seed data (with confirmation)
- **Version check**: Stale seed data is automatically re-seeded when the app updates
- **No network calls**: Zero API requests in demo mode
