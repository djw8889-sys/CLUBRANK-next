import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { sql } from "drizzle-orm";
import { ok, serverError } from "@/lib/server/respond";

export const runtime = "nodejs";

export async function GET() {
  try {
    // DB 연결 테스트
    if (db) {
      await db.execute(sql`SELECT 1`);
    }

    return ok({
      status: "ok",
      db: !!db,
    });
  } catch (err) {
    console.error("Health check failed:", err);
    return serverError("Database connection failed");
  }
}
