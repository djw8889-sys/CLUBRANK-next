import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("[DB] DATABASE_URL 환경변수가 설정되지 않았습니다. Drizzle 연결이 비활성화됩니다.");
}

const pool = connectionString
  ? new Pool({ connectionString })
  : undefined;

type DrizzleDb = ReturnType<typeof drizzle>;

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb: DrizzleDb | undefined;
}

let dbInstance: DrizzleDb;

if (pool) {
  if (!global.__drizzleDb) {
    global.__drizzleDb = drizzle(pool, { schema });
  }
  dbInstance = global.__drizzleDb;
} else {
  // @ts-expect-error - 런타임에서 사용시 반드시 DATABASE_URL을 세팅해야 합니다.
  dbInstance = undefined;
}

export const db = dbInstance;
export * as dbSchema from "@db/schema";
