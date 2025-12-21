import { NextRequest } from "next/server";
import { db, dbSchema } from "@/lib/server/db";
import { eq, desc, asc } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  try {
    const leagueId = Number(params.leagueId);
    if (Number.isNaN(leagueId)) {
      return new Response(JSON.stringify({ error: "Invalid leagueId" }), {
        status: 400,
      });
    }

    const rows = await db
      .select({
        leagueTeamId: dbSchema.leagueTeams.id,
        teamId: dbSchema.teams.id,
        teamName: dbSchema.teams.name,
        played: dbSchema.leagueTeams.played,
        wins: dbSchema.leagueTeams.wins,
        draws: dbSchema.leagueTeams.draws,
        losses: dbSchema.leagueTeams.losses,
        goalsFor: dbSchema.leagueTeams.goalsFor,
        goalsAgainst: dbSchema.leagueTeams.goalsAgainst,
        goalDiff: dbSchema.leagueTeams.goalDiff,
        points: dbSchema.leagueTeams.points,
      })
      .from(dbSchema.leagueTeams)
      .innerJoin(
        dbSchema.teams,
        eq(dbSchema.leagueTeams.teamId, dbSchema.teams.id)
      )
      .where(eq(dbSchema.leagueTeams.leagueId, leagueId))
      .orderBy(
        desc(dbSchema.leagueTeams.points),
        desc(dbSchema.leagueTeams.goalDiff),
        desc(dbSchema.leagueTeams.goalsFor),
        asc(dbSchema.teams.name)
      );

    const standings = rows.map((row, index) => ({
      rank: index + 1,
      teamId: row.teamId,
      teamName: row.teamName,
      played: row.played,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDiff: row.goalDiff,
      points: row.points,
    }));

    return new Response(JSON.stringify({ standings }), {
      status: 200,
    });
  } catch (err) {
    console.error("[LEAGUE_STANDINGS_ERROR]", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
