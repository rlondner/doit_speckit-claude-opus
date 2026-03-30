import { generateSeedGoals, SEED_VERSION } from "@/lib/demo-seed";
import { daysRemaining, computeUrgency } from "@/lib/dates";
import type { Goal, GoalWithUrgency, CreateGoalInput } from "@/lib/types";

const STORAGE_KEY = "doit_demo_goals";

// T004
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

// T005 — localStorage availability check (T016 integrated here)
function isLocalStorageAvailable(): boolean {
  try {
    const test = "__ls_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function loadGoals(): Goal[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { version: number; goals: Goal[] };
    return parsed.goals ?? [];
  } catch {
    return [];
  }
}

export function saveGoals(goals: Goal[]): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SEED_VERSION, goals }));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

// T006
export function initDemoStore(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { version?: number };
      if (parsed.version === SEED_VERSION) return;
    }
  } catch {
    // Fall through to re-seed
  }
  saveGoals(generateSeedGoals());
}

// T013
export function resetDemoData(): void {
  saveGoals(generateSeedGoals());
}

// T007
function toGoalWithUrgency(goal: Goal): GoalWithUrgency {
  const days = daysRemaining(goal.endDate);
  return { ...goal, daysRemaining: days, urgency: computeUrgency(days) };
}

export function getDemoGoals(): GoalWithUrgency[] {
  const goals = loadGoals();
  const active = goals
    .filter((g) => g.status === "active")
    .map(toGoalWithUrgency)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  const completed = goals
    .filter((g) => g.status === "completed")
    .map(toGoalWithUrgency)
    .sort((a, b) => {
      const ta = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const tb = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return tb - ta;
    });
  return [...active, ...completed];
}

// T009
export function createDemoGoal(input: CreateGoalInput): GoalWithUrgency {
  const title = input.title.trim();
  if (!title || title.length > 255) throw new Error("Invalid title");
  const endDate = input.endDate;
  if (!endDate) throw new Error("End date is required");
  const focusArea = input.focusArea ? input.focusArea.trim().slice(0, 50) : null;

  const goal: Goal = {
    id: crypto.randomUUID(),
    title,
    endDate,
    status: "active",
    focusArea: focusArea || null,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  const goals = loadGoals();
  saveGoals([...goals, goal]);
  return toGoalWithUrgency(goal);
}

// T010
export function updateDemoGoal(
  id: string,
  updates: Partial<Pick<Goal, "status" | "title" | "endDate" | "focusArea">>
): GoalWithUrgency | null {
  const goals = loadGoals();
  const idx = goals.findIndex((g) => g.id === id);
  if (idx === -1) return null;

  const existing = goals[idx];
  const updated: Goal = { ...existing, ...updates };

  if (updates.status === "completed" && existing.status !== "completed") {
    updated.completedAt = new Date().toISOString();
  } else if (updates.status === "active" && existing.status !== "active") {
    updated.completedAt = null;
  }

  if (updates.title !== undefined) updated.title = updates.title.trim().slice(0, 255);
  if (updates.focusArea !== undefined) {
    updated.focusArea = updates.focusArea ? updates.focusArea.trim().slice(0, 50) : null;
  }

  goals[idx] = updated;
  saveGoals(goals);
  return toGoalWithUrgency(updated);
}

// T011
export function deleteDemoGoal(id: string): boolean {
  const goals = loadGoals();
  const filtered = goals.filter((g) => g.id !== id);
  if (filtered.length === goals.length) return false;
  saveGoals(filtered);
  return true;
}

export function isDemoStorageAvailable(): boolean {
  return isLocalStorageAvailable();
}
