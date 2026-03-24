"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import type { GoalWithUrgency } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: GoalWithUrgency;
  onToggle: (id: string, newStatus: "active" | "completed") => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onToggle, onDelete }: GoalCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isCompleted = goal.status === "completed";

  function urgencyLabel(days: number): string {
    if (days < 0) return `${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} overdue`;
    if (days === 0) return "Due today";
    return `${days} day${days !== 1 ? "s" : ""} left`;
  }

  return (
    <>
      <Card
        className={cn(
          "transition-colors",
          goal.urgency === "urgent" && !isCompleted && "border-pastel-pink bg-pastel-pink/20",
          goal.urgency === "overdue" && !isCompleted && "border-pastel-peach bg-pastel-peach/20"
        )}
      >
        <CardContent className="flex items-start gap-3 p-4">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() =>
              onToggle(goal.id, isCompleted ? "active" : "completed")
            }
            className="mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "font-medium break-words",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {goal.title}
            </p>
            {!isCompleted && (
              <p
                className={cn(
                  "text-sm mt-1",
                  goal.urgency === "urgent" && "text-pastel-pink font-medium",
                  goal.urgency === "overdue" && "text-pastel-peach font-medium",
                  goal.urgency === "normal" && "text-muted-foreground"
                )}
              >
                {urgencyLabel(goal.daysRemaining)}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-muted-foreground hover:text-destructive shrink-0"
          >
            ✕
          </Button>
        </CardContent>
      </Card>
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
