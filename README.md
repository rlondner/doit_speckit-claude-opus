# do it — Goal Tracker

A simple two-column goal tracking app. Add goals with deadlines, see how many days you have left, check them off when done, and delete the ones you no longer need. Built with Next.js, PostgreSQL, and a pastel color palette.

## Prerequisites

- **Node.js** 18 or later
- **pnpm** (install with `npm install -g pnpm` if needed)
- **PostgreSQL** 14 or later (local install, Docker, or a hosted service)

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd doit_speckit-claude
pnpm install
```

### 2. Create the database

Connect to your PostgreSQL server and create a database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE doit;
\q
```

### 3. Run the schema migration

This creates the `goals` table and its indexes. The script is idempotent — safe to run multiple times.

```bash
psql -U postgres -d doit -f lib/schema.sql
```

If you prefer, you can run the SQL manually:

```sql
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL CHECK (char_length(title) >= 1),
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_goals_status ON goals (status);
CREATE INDEX IF NOT EXISTS idx_goals_end_date ON goals (end_date) WHERE status = 'active';
```

### 4. Configure the environment

Copy the example file and fill in your database credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/doit
```

The connection string format is `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`.

### 5. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Usage

### Adding a goal

Click the **Add Goal** button in the top-right corner. Enter a title and a target date (must be today or later), then submit. The goal appears in the **Active Goals** column on the left.

### Tracking urgency

Active goals show how many days remain until their deadline:

- **More than 3 days left** — normal display
- **0-3 days left** — highlighted in pink as urgent
- **Past the deadline** — highlighted in peach as overdue

Goals are sorted by end date (soonest first), so the most pressing ones are always at the top.

### Completing a goal

Click the checkbox next to any active goal to mark it complete. It moves to the **Completed Goals** column on the right. Changed your mind? Uncheck it to move it back to active.

### Deleting a goal

Click the **x** button on any goal (active or completed). A confirmation dialog appears — confirm to permanently remove it.

### API docs

Visit [http://localhost:3000/swagger](http://localhost:3000/swagger) for interactive API documentation powered by Swagger UI. The raw OpenAPI spec is available at `/api/openapi.json`.

## Production Deployment

### Build

```bash
pnpm build
pnpm start
```

The app runs on port 3000 by default. Override with the `PORT` environment variable.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |

### Database

Use a managed PostgreSQL service (Neon, Supabase, AWS RDS, etc.) for production. Run `lib/schema.sql` against it once before first deployment. The schema uses `IF NOT EXISTS` guards so it is safe to re-run.

Make sure your `DATABASE_URL` points to the production database and includes SSL if required:

```env
DATABASE_URL=postgresql://user:pass@host:5432/doit?sslmode=require
```

### Deploying to Vercel

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `DATABASE_URL` as an environment variable in the Vercel project settings
4. Deploy — Vercel auto-detects Next.js and builds it

### Deploying with Docker

Create a `Dockerfile`:

```dockerfile
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

> Note: To use standalone output, add `output: "standalone"` to your `next.config.ts`.

Build and run:

```bash
docker build -t doit .
docker run -p 3000:3000 -e DATABASE_URL=postgresql://... doit
```

## Project Structure

```
app/
  page.tsx                    Main two-column goal tracker
  layout.tsx                  Root layout with "do it" branding
  globals.css                 Tailwind theme with pastel colors
  api/goals/route.ts          GET (list) and POST (create)
  api/goals/[id]/route.ts     PATCH (toggle status) and DELETE
  api/openapi.json/route.ts   Serves the OpenAPI spec
  swagger/page.tsx             Swagger UI
components/
  goal-card.tsx               Goal display with checkbox and delete
  goal-list.tsx               Scrollable column of goal cards
  add-goal-modal.tsx          Modal form for new goals
  delete-confirm-dialog.tsx   Delete confirmation dialog
  ui/                         shadcn/ui primitives
lib/
  db.ts                       PostgreSQL connection pool
  goals.ts                    Goal CRUD operations
  types.ts                    TypeScript interfaces
  dates.ts                    Date helpers (days remaining, urgency)
  cache.ts                    localStorage cache helpers
  schema.sql                  Database schema
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Tech Stack

- **Next.js 16** (App Router) with **React 19**
- **TypeScript 5**
- **Tailwind CSS 4** with custom pastel theme
- **shadcn/ui** (base-ui primitives)
- **PostgreSQL** via `pg` driver
- **date-fns** for date calculations
- **swagger-ui-react** for API docs
