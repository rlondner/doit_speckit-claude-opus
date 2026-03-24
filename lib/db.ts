import { Pool } from "pg";

declare global {
  var _pgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!globalThis._pgPool) {
    globalThis._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return globalThis._pgPool;
}
