export interface Goal {
  id: string;
  title: string;
  endDate: string;
  status: "active" | "completed";
  focusArea: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface GoalWithUrgency extends Goal {
  daysRemaining: number;
  urgency: "normal" | "urgent" | "overdue";
}

export interface CreateGoalInput {
  title: string;
  endDate: string;
  focusArea?: string;
}
