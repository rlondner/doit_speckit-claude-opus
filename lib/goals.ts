import { getPool } from "./db";
import type { Goal } from "./types";

export async function listGoals(status?: "active" | "completed"): Promise<Goal[]> {
  const pool = getPool();
  let query = `
    SELECT id, title, end_date AS "endDate", status,
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

export async function createGoal(title: string, endDate: string): Promise<Goal> {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO goals (title, end_date)
     VALUES ($1, $2)
     RETURNING id, title, end_date AS "endDate", status,
               created_at AS "createdAt", completed_at AS "completedAt"`,
    [title, endDate]
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
               created_at AS "createdAt", completed_at AS "completedAt"`,
    [status, id]
  );
  return result.rows[0] ?? null;
}

export async function deleteGoal(id: string): Promise<boolean> {
  const pool = getPool();
  const result = await pool.query("DELETE FROM goals WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
