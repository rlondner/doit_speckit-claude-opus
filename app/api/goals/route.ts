import { NextRequest, NextResponse } from "next/server";
import { listGoals, createGoal } from "@/lib/goals";
import { daysRemaining, computeUrgency } from "@/lib/dates";
import type { GoalWithUrgency } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") as
      | "active"
      | "completed"
      | null;

    const goals = await listGoals(status ?? undefined);

    const goalsWithUrgency: GoalWithUrgency[] = goals.map((goal) => {
      const days = daysRemaining(goal.endDate);
      return {
        ...goal,
        daysRemaining: days,
        urgency: computeUrgency(days),
      };
    });

    return NextResponse.json({ goals: goalsWithUrgency });
  } catch (error) {
    console.error("Failed to list goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, endDate, focusArea } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required and must not be empty" },
        { status: 400 }
      );
    }

    if (!endDate || typeof endDate !== "string") {
      return NextResponse.json(
        { error: "End date is required" },
        { status: 400 }
      );
    }

    const { isPast, parseISO, isToday } = await import("date-fns");
    const parsedDate = parseISO(endDate);
    if (isPast(parsedDate) && !isToday(parsedDate)) {
      return NextResponse.json(
        { error: "End date must not be in the past" },
        { status: 400 }
      );
    }

    if (focusArea !== undefined && focusArea !== null) {
      if (typeof focusArea !== "string" || focusArea.length === 0 || focusArea.length > 50) {
        return NextResponse.json(
          { error: "Focus area must be a non-empty string (max 50 characters)" },
          { status: 400 }
        );
      }
    }

    const goal = await createGoal(title.trim(), endDate, focusArea ?? undefined);
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Failed to create goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
