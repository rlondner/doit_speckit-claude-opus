# Quickstart: Do It — Goal Tracker

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL 14+ (local or remote)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Initialize shadcn/ui

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button dialog checkbox input card label
```

### 3. Install additional packages

```bash
pnpm add pg date-fns swagger-ui-react
pnpm add -D @types/pg @types/swagger-ui-react
```

### 4. Configure PostgreSQL

Create a `.env.local` file at the project root:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/doit
```

### 5. Create the database and table

```bash
psql -d doit -f lib/schema.sql
```

Or run the SQL manually:

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

### 6. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the app and [http://localhost:3000/swagger](http://localhost:3000/swagger) for the API docs.

## Project Structure

```
app/
├── page.tsx                 # Main goal tracker page
├── api/goals/route.ts       # GET + POST goals
├── api/goals/[id]/route.ts  # PATCH + DELETE individual goal
├── api/docs/route.ts        # OpenAPI JSON endpoint
└── swagger/page.tsx         # Swagger UI page
components/
├── ui/                      # shadcn/ui primitives
├── goal-card.tsx            # Goal display component
├── goal-column.tsx          # Active/completed column wrapper
├── add-goal-dialog.tsx      # New goal modal
└── delete-confirm-dialog.tsx # Delete confirmation
lib/
├── db.ts                    # PostgreSQL connection pool
├── goals.ts                 # Goal CRUD operations
├── types.ts                 # TypeScript interfaces
└── dates.ts                 # date-fns helpers
```

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
