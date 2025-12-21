import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { matches, teams } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { leagueId: string } }
) {
  try {
    const leagueId = Number(params.leagueId);
    if (Number.isNaN(leagueId)) {
      return NextResponse.json(
        { error: "Invalid leagueId" },
        { status: 400 }
      );
    }

    const rows = await db
      .select({
        id: matches.id,
        round: matches.round,
        homeScore: matches.homeScore,
        awayScore: matches.awayScore,
        status: matches.status,
        matchDate: matches.matchDate,

        homeTeamId: matches.homeTeamId,
        homeTeamName: teams.name,

        awayTeamId: matches.awayTeamId,
        awayTeamName: teams.name,
      })
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id))
      .where(eq(matches.leagueId, leagueId))
      .orderBy(desc(matches.id));

    const formatted = rows.map((row) => ({
      id: row.id,
      round: row.round,
      homeTeam: {
        id: row.homeTeamId,
        name: row.homeTeamName,
      },
      awayTeam: {
        id: row.awayTeamId,
        name: row.awayTeamName,
      },
      homeScore: row.homeScore,
      awayScore: row.awayScore,
      status: row.status,
      matchDate: row.matchDate,
    }));

    return NextResponse.json({ matches: formatted });
  } catch (error) {
    console.error("[GET_MATCHES_ERROR]", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
