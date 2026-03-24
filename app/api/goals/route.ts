import { NextRequest, NextResponse } from "next/server";
import { listGoals, createGoal } from "@/lib/goals";
import { daysRemaining, computeUrgency } from "@/lib/dates";
import { isPast, parseISO, isToday } from "date-fns";
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
    const { title, endDate } = body;

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

    const parsedDate = parseISO(endDate);
    if (isPast(parsedDate) && !isToday(parsedDate)) {
      return NextResponse.json(
        { error: "End date must not be in the past" },
        { status: 400 }
      );
    }

    const goal = await createGoal(title.trim(), endDate);
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Failed to create goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
