import { addDays, formatISO } from "date-fns";
import type { Goal } from "@/lib/types";

export const SEED_VERSION = 1;

export function generateSeedGoals(): Goal[] {
  const now = new Date();
  const today = formatISO(now);

  return [
    {
      id: "demo-001",
      title: "Finish Q1 performance review",
      endDate: formatISO(addDays(now, -2), { representation: "date" }),
      status: "active",
      focusArea: "Professional",
      createdAt: formatISO(addDays(now, -14)),
      completedAt: null,
    },
    {
      id: "demo-002",
      title: "Submit project proposal to stakeholders",
      endDate: formatISO(addDays(now, 1), { representation: "date" }),
      status: "active",
      focusArea: "Professional",
      createdAt: formatISO(addDays(now, -7)),
      completedAt: null,
    },
    {
      id: "demo-003",
      title: "Schedule dentist appointment",
      endDate: formatISO(addDays(now, 3), { representation: "date" }),
      status: "active",
      focusArea: "Personal",
      createdAt: formatISO(addDays(now, -3)),
      completedAt: null,
    },
    {
      id: "demo-004",
      title: "Read two chapters of current book",
      endDate: formatISO(addDays(now, 7), { representation: "date" }),
      status: "active",
      focusArea: "Personal",
      createdAt: formatISO(addDays(now, -1)),
      completedAt: null,
    },
    {
      id: "demo-005",
      title: "Complete online TypeScript course",
      endDate: formatISO(addDays(now, 14), { representation: "date" }),
      status: "active",
      focusArea: "Professional",
      createdAt: formatISO(addDays(now, -5)),
      completedAt: null,
    },
    {
      id: "demo-006",
      title: "Plan summer hiking trip",
      endDate: formatISO(addDays(now, 30), { representation: "date" }),
      status: "active",
      focusArea: null,
      createdAt: today,
      completedAt: null,
    },
    {
      id: "demo-007",
      title: "Set up home office ergonomics",
      endDate: formatISO(addDays(now, -15), { representation: "date" }),
      status: "completed",
      focusArea: "Personal",
      createdAt: formatISO(addDays(now, -30)),
      completedAt: formatISO(addDays(now, -10)),
    },
    {
      id: "demo-008",
      title: "Renew car insurance",
      endDate: formatISO(addDays(now, -10), { representation: "date" }),
      status: "completed",
      focusArea: null,
      createdAt: formatISO(addDays(now, -20)),
      completedAt: formatISO(addDays(now, -5)),
    },
  ];
}
