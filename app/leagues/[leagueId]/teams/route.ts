import { NextRequest } from "next/server";
import { db, dbSchema } from "@/lib/server/db";
import { eq } from "drizzle-orm";

// GET /api/leagues/:leagueId
export async function GET(
  req: NextRequest,
  context: { params: { leagueId: string } }
) {
  try {
    const leagueId = Number(context.params.leagueId);

    if (!db) {
      return new Response(JSON.stringify({ error: "DB 연결 오류" }), {
        status: 500,
      });
    }

    // 🔥 1) 리그 기본 정보 가져오기
    const league = await db
      .select()
      .from(dbSchema.leagues)
      .where(eq(dbSchema.leagues.id, leagueId))
      .then((rows) => rows[0])
      .catch(() => null);

    if (!league) {
      return new Response(JSON.stringify({ error: "리그를 찾을 수 없습니다." }), {
        status: 404,
      });
    }

    // 🔥 2) 등록된 팀 목록 가져오기 (league_teams + clubs leftJoin)
    const teams = await db
      .select({
        id: dbSchema.leagueTeams.id,
        leagueId: dbSchema.leagueTeams.leagueId,
        clubId: dbSchema.leagueTeams.clubId,
        name: dbSchema.clubs.name,
        region: dbSchema.clubs.region,
        logoUrl: dbSchema.clubs.logoUrl,
      })
      .from(dbSchema.leagueTeams)
      .leftJoin(
        dbSchema.clubs,
        eq(dbSchema.leagueTeams.clubId, dbSchema.clubs.id)
      )
      .where(eq(dbSchema.leagueTeams.leagueId, leagueId));

    // 🔥 응답 데이터 구조
    return new Response(
      JSON.stringify({
        ...league,
        teams: teams || [],
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("리그 상세 조회 실패:", err);
    return new Response(JSON.stringify({ error: "서버 오류" }), {
      status: 500,
    });
  }
}
