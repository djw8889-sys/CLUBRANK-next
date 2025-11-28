import { NextRequest } from "next/server";
import { ok, serverError } from "@/lib/server/respond";
import { db } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  try {
    if (db) {
      await db.execute("SELECT 1");
    }
    return ok({ status: "ok", db: !!db });
  } catch (err) {
    return serverError("헬스 체크 실패", err);
  }
}
