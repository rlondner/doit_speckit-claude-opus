"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  goalTitle: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  goalTitle,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface-container-lowest rounded-2xl border border-grey-blue shadow-[0_24px_48px_-12px_rgba(255,127,112,0.1)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-xl font-bold text-on-surface">
            Delete Goal
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-on-surface-variant leading-relaxed">
            Are you sure you want to permanently delete &ldquo;{goalTitle}
            &rdquo;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="px-6 py-3 rounded-full font-headline font-bold bg-surface-container-low text-on-surface border-none hover:bg-surface-container-high transition-colors">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="px-6 py-3 rounded-full font-headline font-bold bg-error text-white hover:bg-error-dim transition-colors shadow-[0_8px_16px_-4px_rgba(239,68,68,0.3)]"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
