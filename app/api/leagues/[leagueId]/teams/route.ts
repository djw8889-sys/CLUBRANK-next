import { NextRequest } from "next/server";
import { db, dbSchema } from "@/lib/server/db";
import { eq } from "drizzle-orm";

/**
 * GET /api/leagues/:leagueId/teams
 * - 특정 리그에 등록된 팀 목록 조회
 * - JOIN 없이 league_teams 단독 조회 (가장 안전)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  try {
    const leagueId = Number(params.leagueId);

    if (Number.isNaN(leagueId)) {
      return Response.json(
        { error: "Invalid leagueId" },
        { status: 400 }
      );
    }

    const teams = await db
      .select()
      .from(dbSchema.leagueTeams)
      .where(eq(dbSchema.leagueTeams.leagueId, leagueId));

    return Response.json({ teams }, { status: 200 });
  } catch (error) {
    console.error("[GET_LEAGUE_TEAMS_ERROR]", error);
    return Response.json(
      { error: "리그 팀 목록 조회 실패" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leagues/:leagueId/teams
 * - 리그에 팀 참가
 * - body: { teamId: number }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  try {
    const leagueId = Number(params.leagueId);
    if (Number.isNaN(leagueId)) {
      return Response.json(
        { error: "Invalid leagueId" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const teamId = Number(body?.teamId);

    if (!teamId || Number.isNaN(teamId)) {
      return Response.json(
        { error: "Invalid teamId" },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(dbSchema.leagueTeams)
      .values({
        leagueId,
        teamId,
      })
      .returning({ id: dbSchema.leagueTeams.id });

    return Response.json(inserted, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_TEAM_ERROR]", error);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
