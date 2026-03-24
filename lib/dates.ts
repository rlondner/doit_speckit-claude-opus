import { differenceInCalendarDays, parseISO } from "date-fns";

export function daysRemaining(endDate: string): number {
  return differenceInCalendarDays(parseISO(endDate), new Date());
}

export function computeUrgency(daysLeft: number): "normal" | "urgent" | "overdue" {
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 3) return "urgent";
  return "normal";
}
