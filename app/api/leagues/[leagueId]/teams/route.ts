import { NextRequest } from "next/server";
import { db, dbSchema } from "@/lib/server/db";
import { eq } from "drizzle-orm";

/**
 * GET /api/leagues/:leagueId/teams
 * - 리그 참가 팀 목록 조회
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const leagueId = Number(params.leagueId);

  if (Number.isNaN(leagueId)) {
    return Response.json({ error: "Invalid leagueId" }, { status: 400 });
  }

  const teams = await db
    .select({
      id: dbSchema.leagueTeams.id,
      teamId: dbSchema.leagueTeams.teamId,
      name: dbSchema.teams.name,
      points: dbSchema.leagueTeams.points,
      played: dbSchema.leagueTeams.played,
      wins: dbSchema.leagueTeams.wins,
      draws: dbSchema.leagueTeams.draws,
      losses: dbSchema.leagueTeams.losses,
    })
    .from(dbSchema.leagueTeams)
    .leftJoin(
      dbSchema.teams,
      eq(dbSchema.leagueTeams.teamId, dbSchema.teams.id)
    )
    .where(eq(dbSchema.leagueTeams.leagueId, leagueId));

  return Response.json({ teams });
}

/**
 * POST /api/leagues/:leagueId/teams
 * - 리그에 팀 참가
 * - 참가 팀 수가 totalTeams에 도달하면 리그 자동 활성화
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  const leagueId = Number(params.leagueId);
  if (Number.isNaN(leagueId)) {
    return Response.json({ error: "Invalid leagueId" }, { status: 400 });
  }

  const { teamId } = await req.json();
  if (!teamId) {
    return Response.json({ error: "Invalid teamId" }, { status: 400 });
  }

  /* ======================
     1. 팀 참가 등록
  ====================== */
  await db.insert(dbSchema.leagueTeams).values({
    leagueId,
    teamId,
  });

  /* ======================
     2. 현재 참가 팀 수 조회
  ====================== */
  const [{ count }] = await db
    .select({ count: dbSchema.leagueTeams.id.count() })
    .from(dbSchema.leagueTeams)
    .where(eq(dbSchema.leagueTeams.leagueId, leagueId));

  /* ======================
     3. 리그 정보 조회
  ====================== */
  const league = await db
    .select()
    .from(dbSchema.leagues)
    .where(eq(dbSchema.leagues.id, leagueId))
    .then((rows) => rows[0]);

  if (!league) {
    return Response.json({ error: "League not found" }, { status: 404 });
  }

  /* ======================
     4. 팀 수 충족 시 자동 활성화
  ====================== */
  if (count === league.totalTeams && league.status === "draft") {
    await db
      .update(dbSchema.leagues)
      .set({ status: "active" })
      .where(eq(dbSchema.leagues.id, leagueId));
  }

  return Response.json({ ok: true });
}
