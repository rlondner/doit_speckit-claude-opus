import { NextRequest, NextResponse } from "next/server";
import { updateGoal, editGoal, deleteGoal } from "@/lib/goals";
import { daysRemaining as calcDaysRemaining, computeUrgency } from "@/lib/dates";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, title, endDate, focusArea } = body;

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json(
          { error: "Title must be a non-empty string" },
          { status: 400 }
        );
      }
      if (title.length > 255) {
        return NextResponse.json(
          { error: "Title must not exceed 255 characters" },
          { status: 400 }
        );
      }
    }

    // Validate endDate if provided
    if (endDate !== undefined) {
      if (typeof endDate !== "string" || isNaN(Date.parse(endDate))) {
        return NextResponse.json(
          { error: "End date must be a valid date" },
          { status: 400 }
        );
      }
    }

    // Validate focusArea if provided
    if (focusArea !== undefined) {
      if (typeof focusArea !== "string" || focusArea.length > 50) {
        return NextResponse.json(
          { error: "Focus area must be a string of at most 50 characters" },
          { status: 400 }
        );
      }
    }

    // Handle status toggle (existing behavior)
    if (status) {
      if (!["active", "completed"].includes(status)) {
        return NextResponse.json(
          { error: "Status must be 'active' or 'completed'" },
          { status: 400 }
        );
      }
      const goal = await updateGoal(id, status);
      if (!goal) {
        return NextResponse.json({ error: "Goal not found" }, { status: 404 });
      }
      const days = calcDaysRemaining(goal.endDate);
      return NextResponse.json({ ...goal, daysRemaining: days, urgency: computeUrgency(days) });
    }

    // Handle field edits
    const hasEdits = title !== undefined || endDate !== undefined || focusArea !== undefined;
    if (!hasEdits) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const goal = await editGoal(id, {
      title: title?.trim(),
      endDate,
      focusArea,
    });
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const days = calcDaysRemaining(goal.endDate);
    return NextResponse.json({ ...goal, daysRemaining: days, urgency: computeUrgency(days) });
  } catch (error) {
    console.error("Failed to update goal:", error);
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteGoal(id);
    if (!deleted) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete goal:", error);
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
