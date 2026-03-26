import type { GoalWithUrgency } from "@/lib/types";
import { GoalCard } from "./goal-card";

interface GoalListProps {
  title: string;
  goals: GoalWithUrgency[];
  emptyMessage: string;
  onToggle: (id: string, newStatus: "active" | "completed") => void;
  onDelete: (id: string) => void;
  onEdit?: (goal: GoalWithUrgency) => void;
  variant: "active" | "completed";
}

export function GoalList({
  title,
  goals,
  emptyMessage,
  onToggle,
  onDelete,
  onEdit,
  variant,
}: GoalListProps) {
  // Completed goals sidebar variant
  if (variant === "completed") {
    return (
      <div className="bg-grey-blue-light border border-grey-blue rounded-3xl p-8 sticky top-28">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline text-xl font-bold">{title}</h2>
          <span
            className="material-symbols-outlined text-coral-accent"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
          >
            verified
          </span>
        </div>
        <div className="space-y-6">
          {goals.length === 0 ? (
            <p className="text-on-surface-variant text-sm">{emptyMessage}</p>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggle={onToggle}
                onDelete={onDelete}
                variant="completed"
              />
            ))
          )}
        </div>

        {/* Pro Tip card */}
        <div className="mt-12 p-6 bg-surface-container-lowest border border-grey-blue rounded-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-bold text-coral-accent mb-2">PRO TIP</p>
            <p className="text-sm leading-relaxed text-on-surface">
              Break down big goals into smaller tasks to stay motivated.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-all duration-500">
            <span
              className="material-symbols-outlined text-8xl text-coral-accent"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
            >
              lightbulb
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Active goals list variant
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-2xl font-bold">{title}</h2>
        <span className="text-sm font-medium text-on-surface-variant bg-grey-blue-light px-3 py-1 rounded-full">
          In Progress
        </span>
      </div>
      <div className="space-y-6">
        {goals.length === 0 ? (
          <p className="text-on-surface-variant text-sm">{emptyMessage}</p>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              variant="active"
            />
          ))
        )}
      </div>
    </div>
  );
}
