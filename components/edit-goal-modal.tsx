"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import type { GoalWithUrgency, EditGoalInput } from "@/lib/types";

interface EditGoalModalProps {
  goal: GoalWithUrgency | null;
  onClose: () => void;
  onSave: (id: string, input: EditGoalInput) => Promise<void>;
  onDelete: (id: string) => void;
}

const FOCUS_AREAS = ["Professional", "Personal"] as const;

export function EditGoalModal({ goal, onClose, onSave, onDelete }: EditGoalModalProps) {
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [focusArea, setFocusArea] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setEndDate(goal.endDate ? format(new Date(goal.endDate), "yyyy-MM-dd") : "");
      setFocusArea(goal.focusArea ?? undefined);
      setError(null);
      setSubmitting(false);
    }
  }, [goal]);

  const open = goal !== null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!goal) return;
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (title.length > 255) {
      setError("Title must not exceed 255 characters");
      return;
    }

    if (!endDate) {
      setError("End date is required");
      return;
    }

    setSubmitting(true);
    try {
      await onSave(goal.id, {
        title: title.trim(),
        endDate,
        focusArea,
      });
    } catch {
      setError("Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete() {
    if (!goal) return;
    const confirmed = window.confirm(`Are you sure you want to delete "${goal.title}"? This action cannot be undone.`);
    if (confirmed) {
      onDelete(goal.id);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="p-0 border-0 rounded-xl overflow-hidden shadow-[0_24px_48px_-12px_rgba(240,122,80,0.15)] max-w-lg bg-surface-container-lowest"
      >
        {/* Modal Header (Orange Gradient) */}
        <div className="bg-radiant-primary-modal px-8 pt-10 pb-12 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-white mb-2">
              Refine Your Ambition
            </h2>
            <p className="font-body text-white/90 leading-relaxed">
              Adjust your goal details. Small refinements lead to big results.
            </p>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md cursor-pointer hover:bg-white/40 transition-colors"
        >
          <span className="material-symbols-outlined text-white">close</span>
        </button>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-10 space-y-8">
          {/* Goal Title Input */}
          <div className="space-y-3">
            <label
              htmlFor="edit-goal-title"
              className="font-headline text-sm font-bold tracking-wide text-on-surface-variant uppercase ml-1"
            >
              Goal Title
            </label>
            <input
              id="edit-goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Master Minimalist UI Design"
              maxLength={255}
              className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl font-body text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            />
          </div>

          {/* Two Column Layout: End Date + Focus Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* End Date */}
            <div className="space-y-3">
              <label
                htmlFor="edit-end-date"
                className="font-headline text-sm font-bold tracking-wide text-on-surface-variant uppercase ml-1"
              >
                End Date
              </label>
              <input
                id="edit-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl font-body text-on-surface focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
              />
            </div>

            {/* Focus Area Chips */}
            <div className="space-y-3">
              <label className="font-headline text-sm font-bold tracking-wide text-on-surface-variant uppercase ml-1">
                Focus Area
              </label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setFocusArea(focusArea === area ? undefined : area)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-bold transition-colors
                      ${focusArea === area
                        ? "bg-primary-container text-on-primary-container border-2 border-transparent"
                        : "bg-secondary-container text-on-secondary-container hover:bg-secondary transition-colors"
                      }
                    `}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm font-bold text-error hover:text-error/80 transition-colors"
            >
              Delete Goal
            </button>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 font-headline font-bold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-4 bg-radiant-primary-modal text-white font-headline font-bold rounded-full shadow-[0_12px_24px_-8px_rgba(240,122,80,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
