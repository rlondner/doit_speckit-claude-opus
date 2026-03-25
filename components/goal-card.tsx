"use client";

import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import type { GoalWithUrgency } from "@/lib/types";

interface GoalCardProps {
  goal: GoalWithUrgency;
  onToggle: (id: string, newStatus: "active" | "completed") => void;
  onDelete: (id: string) => void;
  variant: "active" | "completed";
}

export function GoalCard({ goal, onToggle, onDelete, variant }: GoalCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isCompleted = goal.status === "completed";
  const isUrgent = goal.urgency === "urgent" && !isCompleted;
  const isOverdue = goal.urgency === "overdue" && !isCompleted;

  function urgencyLabel(days: number): string {
    if (days < 0) return `${Math.abs(days)} Day${Math.abs(days) !== 1 ? "s" : ""} Overdue`;
    if (days === 0) return "Due Today";
    return `${days} Day${days !== 1 ? "s" : ""} Left`;
  }

  function urgencyIcon(urgency: string): string {
    if (urgency === "overdue") return "report";
    if (urgency === "urgent") return "schedule";
    return "event";
  }

  // Completed card variant (sidebar)
  if (variant === "completed") {
    return (
      <>
        <div className="flex items-start gap-4">
          <div className="mt-1 cursor-pointer" onClick={() => onToggle(goal.id, "active")}>
            <span className="material-symbols-outlined text-coral-accent" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
              check_circle
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-headline text-on-surface-variant line-through font-semibold leading-tight truncate">
              {goal.title}
            </h4>
            {goal.completedAt && (
              <p className="text-xs text-on-surface-variant mt-1">
                Completed {formatCompletedTime(goal.completedAt)}
              </p>
            )}
          </div>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="p-1 text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100 shrink-0"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => {
            setDeleteDialogOpen(false);
            onDelete(goal.id);
          }}
          goalTitle={goal.title}
        />
      </>
    );
  }

  // Active card variant
  return (
    <>
      <div
        className={`
          p-6 rounded-xl flex items-center gap-4 group transition-all duration-300
          ${isOverdue || isUrgent
            ? "bg-[#fff5f5] border-2 border-red-100"
            : "bg-surface-container-lowest border border-grey-blue hover:translate-x-1 shadow-sm"
          }
        `}
      >
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggle(goal.id, isCompleted ? "active" : "completed")}
            className="w-6 h-6 rounded-full border-outline text-coral-accent focus:ring-coral-accent/30 cursor-pointer"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-headline text-lg font-bold mb-1 truncate">
            {goal.title}
          </h3>
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className={`
                flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                ${isOverdue || isUrgent
                  ? "text-red-600 bg-red-100"
                  : "text-grey-blue-dark bg-grey-blue-light"
                }
              `}
            >
              <span className="material-symbols-outlined text-sm">
                {urgencyIcon(goal.urgency)}
              </span>
              {urgencyLabel(goal.daysRemaining)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="p-2 text-on-surface-variant hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          setDeleteDialogOpen(false);
          onDelete(goal.id);
        }}
        goalTitle={goal.title}
      />
    </>
  );
}

function formatCompletedTime(completedAt: string): string {
  const completed = new Date(completedAt);
  const now = new Date();
  const diffMs = now.getTime() - completed.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}
