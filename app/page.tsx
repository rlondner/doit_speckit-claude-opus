"use client";

import { useEffect, useState, useCallback } from "react";
import { GoalList } from "@/components/goal-list";
import { AddGoalModal } from "@/components/add-goal-modal";
import type { GoalWithUrgency } from "@/lib/types";
import { getCachedGoals, setCachedGoals, invalidateGoalCache } from "@/lib/cache";

export default function Home() {
  const [goals, setGoals] = useState<GoalWithUrgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleAdd = async (title: string, endDate: string) => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, endDate }),
    });
    if (!res.ok) throw new Error("Failed to create goal");
    invalidateGoalCache();
    await fetchGoals();
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddGoalModal onAdd={handleAdd} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
      <GoalList
        title="Active Goals"
        goals={activeGoals}
        emptyMessage="No active goals. Add one to get started!"
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
      <GoalList
        title="Completed Goals"
        goals={completedGoals}
        emptyMessage="No completed goals yet."
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
      </div>
    </div>
  );
}
