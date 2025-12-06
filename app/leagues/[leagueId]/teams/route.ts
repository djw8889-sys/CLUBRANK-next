// app/api/leagues/[leagueId]/teams/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { leagues, leagueTeams, insertLeagueTeamSchema } from "@/db/schema.league";
import { eq, and } from "drizzle-orm";
import { created, badRequest, serverError, notFound } from "@/lib/server/respond";

export const runtime = "nodejs";

// POST /api/leagues/[leagueId]/teams
export async function POST(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  try {
    if (!db) {
      return serverError("데이터베이스가 설정되지 않았습니다.");
    }

    /* ------------------------------- leagueId 검증 ------------------------------ */
    const leagueId = Number(params.leagueId);
    if (Number.isNaN(leagueId)) {
      return badRequest("유효하지 않은 leagueId 입니다.");
    }

    /* ------------------------------- league 존재 여부 ------------------------------ */
    const existingLeague = await db.query.leagues.findFirst({
      where: eq(leagues.id, leagueId),
    });

    if (!existingLeague) {
      return notFound("존재하지 않는 리그입니다.");
    }

    /* ----------------------------- body → clubId 파싱 ----------------------------- */
    const json = await req.json();
    const parsed = insertLeagueTeamSchema
      .pick({ clubId: true })
      .safeParse(json);

    if (!parsed.success) {
      return badRequest("잘못된 요청 데이터입니다.", parsed.error.flatten());
    }

    const clubId = parsed.data.clubId;

    /* ------------------------------- 중복 등록 방지 ------------------------------- */
    const alreadyExists = await db.query.leagueTeams.findFirst({
      where: and(
        eq(leagueTeams.leagueId, leagueId),
        eq(leagueTeams.clubId, clubId)
      ),
    });

    if (alreadyExists) {
      return badRequest("이미 이 리그에 등록된 클럽입니다.");
    }

    /* ------------------------------ 실제 insert 수행 ------------------------------ */
    const [inserted] = await db
      .insert(leagueTeams)
      .values({
        leagueId,
        clubId,
      })
      .returning();

    return created({
      id: inserted.id,
      leagueId,
      clubId,
    });
  } catch (err) {
    return serverError("리그 팀 등록 실패", err);
  }
}
