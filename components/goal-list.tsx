import type { GoalWithUrgency } from "@/lib/types";
import { GoalCard } from "./goal-card";

interface GoalListProps {
  title: string;
  goals: GoalWithUrgency[];
  emptyMessage: string;
  onToggle: (id: string, newStatus: "active" | "completed") => void;
  onDelete: (id: string) => void;
}

export function GoalList({
  title,
  goals,
  emptyMessage,
  onToggle,
  onDelete,
}: GoalListProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">
        {title}{" "}
        <span className="text-muted-foreground font-normal text-sm">
          ({goals.length})
        </span>
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {goals.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">{emptyMessage}</p>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
