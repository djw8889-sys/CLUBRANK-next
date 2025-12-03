import { NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { leagues, insertLeagueSchema } from "@db/schema.leagues";
import { created, badRequest, serverError } from "@/lib/server/respond";

export async function POST(req: NextRequest) {
  try {
    if (!db) return serverError("데이터베이스가 설정되지 않았습니다.");

    const body = await req.json();

    const parsed = insertLeagueSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("잘못된 요청 데이터", parsed.error.flatten());
    }

    // DB Insert
    const [inserted] = await db
      .insert(leagues)
      .values(parsed.data)
      .returning();

    return created({ id: inserted.id });
  } catch (err) {
    return serverError("리그 생성 실패", err);
  }
}
