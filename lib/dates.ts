import { differenceInCalendarDays } from "date-fns";

export function daysRemaining(endDate: string | Date): number {
  const date = typeof endDate === "string" ? new Date(endDate) : endDate;
  return differenceInCalendarDays(date, new Date());
}

export function computeUrgency(daysLeft: number): "normal" | "urgent" | "overdue" {
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 3) return "urgent";
  return "normal";
}
