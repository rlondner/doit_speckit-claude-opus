"use client";

import { useEffect, useState, useCallback } from "react";
import { GoalList } from "@/components/goal-list";
import { AddGoalModal } from "@/components/add-goal-modal";
import { EditGoalModal } from "@/components/edit-goal-modal";
import type { GoalWithUrgency, EditGoalInput } from "@/lib/types";
import { getCachedGoals, setCachedGoals, invalidateGoalCache } from "@/lib/cache";

export default function Home() {
  const [goals, setGoals] = useState<GoalWithUrgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<GoalWithUrgency | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error("Failed to fetch goals");
      const data = await res.json();
      setGoals(data.goals);
      setCachedGoals(data.goals);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = getCachedGoals<GoalWithUrgency[]>();
    if (cached) {
      setGoals(cached);
      setLoading(false);
    }
    fetchGoals();
  }, [fetchGoals]);

  const handleToggle = async (id: string, newStatus: "active" | "completed") => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: newStatus, completedAt: newStatus === "completed" ? new Date().toISOString() : null }
          : g
      )
    );
    invalidateGoalCache();

    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update goal");
      await fetchGoals();
    } catch {
      await fetchGoals();
    }
  };

  const handleDelete = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    invalidateGoalCache();

    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete goal");
      await fetchGoals();
    } catch {
      await fetchGoals();
    }
  };

  const handleAdd = async (title: string, endDate: string, focusArea?: string) => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, endDate, focusArea }),
    });
    if (!res.ok) throw new Error("Failed to create goal");
    invalidateGoalCache();
    await fetchGoals();
  };

  const handleSaveEdit = async (id: string, input: EditGoalInput) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, ...input }
          : g
      )
    );
    invalidateGoalCache();

    const res = await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      await fetchGoals();
      throw new Error("Failed to save changes");
    }
    setEditingGoal(null);
    await fetchGoals();
  };

  const handleDeleteFromModal = async (id: string) => {
    setEditingGoal(null);
    await handleDelete(id);
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-on-surface-variant font-body">Loading goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-error font-body">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Greeting section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-2">
            Good morning
          </h1>
          <p className="text-on-surface-variant text-lg">
            You have{" "}
            <span className="text-coral-accent font-semibold">
              {activeGoals.length} active goal{activeGoals.length !== 1 ? "s" : ""}
            </span>{" "}
            to focus on today.
          </p>
        </div>
        <AddGoalModal onAdd={handleAdd} />
      </div>

      {/* Main grid: active goals + recently completed sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-8">
          <GoalList
            title="Active Goals"
            goals={activeGoals}
            emptyMessage="No active goals. Add one to get started!"
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={setEditingGoal}
            variant="active"
          />
        </section>
        <aside className="lg:col-span-4">
          <GoalList
            title="Recently Completed"
            goals={completedGoals}
            emptyMessage="No completed goals yet."
            onToggle={handleToggle}
            onDelete={handleDelete}
            variant="completed"
          />
        </aside>
      </div>

      <EditGoalModal
        goal={editingGoal}
        onClose={() => setEditingGoal(null)}
        onSave={handleSaveEdit}
        onDelete={handleDeleteFromModal}
      />
    </div>
  );
}
