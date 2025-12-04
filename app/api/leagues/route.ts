import { NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { leagues } from "@db/schema.leagues";
import { created, badRequest, serverError } from "@/lib/server/respond";
import { z } from "zod";

// ★ insertLeagueSchema 사용 금지 (optional 문제 발생)
//    → 새 스키마로 필수값 강제
const createLeagueSchema = z.object({
  name: z.string().min(1, "리그 이름은 필수입니다."),
  season: z.string().min(1, "시즌은 필수입니다."),
  teamCount: z.number().min(2, "팀 수는 최소 2팀 이상이어야 합니다."),
});

export async function POST(req: NextRequest) {
  try {
    if (!db) return serverError("데이터베이스가 설정되지 않았습니다.");

    const json = await req.json();

    const parsed = createLeagueSchema.safeParse(json);
    if (!parsed.success) {
      return badRequest("잘못된 요청 데이터", parsed.error.flatten());
    }

    const { name, season, teamCount } = parsed.data;

    // Drizzle INSERT (필수값만 전달)
    const [inserted] = await db
      .insert(leagues)
      .values({
        name,
        season,
        teamCount,
      })
      .returning();

    return created({ id: inserted.id });
  } catch (err) {
    return serverError("리그 생성 실패", err);
  }
}
