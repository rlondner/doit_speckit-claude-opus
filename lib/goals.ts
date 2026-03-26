import { getPool } from "./db";
import type { Goal, EditGoalInput } from "./types";

export async function listGoals(status?: "active" | "completed"): Promise<Goal[]> {
  const pool = getPool();
  let query = `
    SELECT id, title, end_date AS "endDate", status,
           focus_area AS "focusArea",
           created_at AS "createdAt", completed_at AS "completedAt"
    FROM goals
  `;
  const params: string[] = [];

  if (status) {
    query += ` WHERE status = $1`;
    params.push(status);
  }

  query += `
    ORDER BY
      CASE WHEN status = 'active' THEN end_date END ASC,
      CASE WHEN status = 'completed' THEN completed_at END DESC
  `;

  const result = await pool.query(query, params);
  return result.rows;
}

export async function createGoal(title: string, endDate: string, focusArea?: string): Promise<Goal> {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO goals (title, end_date, focus_area)
     VALUES ($1, $2, $3)
     RETURNING id, title, end_date AS "endDate", status,
               focus_area AS "focusArea",
               created_at AS "createdAt", completed_at AS "completedAt"`,
    [title, endDate, focusArea ?? null]
  );
  return result.rows[0];
}

export async function updateGoal(
  id: string,
  status: "active" | "completed"
): Promise<Goal | null> {
  const pool = getPool();
  const completedAt = status === "completed" ? "NOW()" : "NULL";
  const result = await pool.query(
    `UPDATE goals
     SET status = $1, completed_at = ${completedAt}
     WHERE id = $2
     RETURNING id, title, end_date AS "endDate", status,
               focus_area AS "focusArea",
               created_at AS "createdAt", completed_at AS "completedAt"`,
    [status, id]
  );
  return result.rows[0] ?? null;
}

export async function editGoal(id: string, input: EditGoalInput): Promise<Goal | null> {
  const pool = getPool();
  const setClauses: string[] = [];
  const params: (string | null)[] = [];
  let paramIndex = 1;

  if (input.title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    params.push(input.title);
  }
  if (input.endDate !== undefined) {
    setClauses.push(`end_date = $${paramIndex++}`);
    params.push(input.endDate);
  }
  if (input.focusArea !== undefined) {
    setClauses.push(`focus_area = $${paramIndex++}`);
    params.push(input.focusArea);
  }

  if (setClauses.length === 0) {
    return null;
  }

  params.push(id);
  const result = await pool.query(
    `UPDATE goals
     SET ${setClauses.join(", ")}
     WHERE id = $${paramIndex}
     RETURNING id, title, end_date AS "endDate", status,
               focus_area AS "focusArea",
               created_at AS "createdAt", completed_at AS "completedAt"`,
    params
  );
  return result.rows[0] ?? null;
}

export async function deleteGoal(id: string): Promise<boolean> {
  const pool = getPool();
  const result = await pool.query("DELETE FROM goals WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
