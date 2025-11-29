// src/lib/server/db.ts (전체교체)

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dbSchema from "@db/schema";

const connectionString = process.env.DATABASE_URL;

let dbInstance: ReturnType<typeof drizzle> | undefined;

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb: ReturnType<typeof drizzle> | undefined;
}

if (process.env.NODE_ENV === "production") {
  if (connectionString) {
    const client = new Pool({ connectionString });
    dbInstance = drizzle(client, { schema: dbSchema });
  } else {
    dbInstance = undefined;
  }
} else {
  if (!global.__drizzleDb) {
    if (connectionString) {
      const client = new Pool({ connectionString });
      global.__drizzleDb = drizzle(client, { schema: dbSchema });
    } else {
      global.__drizzleDb = undefined;
    }
  }
  dbInstance = global.__drizzleDb;
}

export const db = dbInstance;
export { dbSchema };
