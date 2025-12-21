import { NextRequest } from "next/server";
import { db, dbSchema } from "@/lib/server/db";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = Number(params.matchId);
    if (Number.isNaN(matchId)) {
      return new Response(JSON.stringify({ error: "Invalid matchId" }), {
        status: 400,
      });
    }

    const { homeScore, awayScore } = await req.json();

    if (
      typeof homeScore !== "number" ||
      typeof awayScore !== "number"
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid score values" }),
        { status: 400 }
      );
    }

    // 1️⃣ 경기 조회
    const [match] = await db
      .select()
      .from(dbSchema.matches)
      .where(eq(dbSchema.matches.id, matchId));

    if (!match) {
      return new Response(
        JSON.stringify({ error: "Match not found" }),
        { status: 404 }
      );
    }

    if (match.status === "PLAYED") {
      return new Response(
        JSON.stringify({ error: "Match already played" }),
        { status: 400 }
      );
    }

    const { leagueId, homeTeamId, awayTeamId } = match;

    // 2️⃣ 리그팀 조회
    const leagueTeams = await db
      .select()
      .from(dbSchema.leagueTeams)
      .where(eq(dbSchema.leagueTeams.leagueId, leagueId));

    const home = leagueTeams.find(t => t.teamId === homeTeamId);
    const away = leagueTeams.find(t => t.teamId === awayTeamId);

    if (!home || !away) {
      return new Response(
        JSON.stringify({ error: "League team mapping not found" }),
        { status: 400 }
      );
    }

    const homeWin = homeScore > awayScore;
    const draw = homeScore === awayScore;

    // 3️⃣ 트랜잭션
    await db.transaction(async (tx) => {
      // 경기 업데이트
      await tx
        .update(dbSchema.matches)
        .set({
          homeScore,
          awayScore,
          status: "PLAYED",
        })
        .where(eq(dbSchema.matches.id, matchId));

      // 홈팀
      await tx
        .update(dbSchema.leagueTeams)
        .set({
          played: home.played + 1,
          wins: home.wins + (homeWin ? 1 : 0),
          draws: home.draws + (draw ? 1 : 0),
          losses: home.losses + (!homeWin && !draw ? 1 : 0),
          goalsFor: home.goalsFor + homeScore,
          goalsAgainst: home.goalsAgainst + awayScore,
          goalDiff: home.goalDiff + (homeScore - awayScore),
          points: home.points + (homeWin ? 3 : draw ? 1 : 0),
        })
        .where(eq(dbSchema.leagueTeams.id, home.id));

      // 원정팀
      await tx
        .update(dbSchema.leagueTeams)
        .set({
          played: away.played + 1,
          wins: away.wins + (!homeWin && !draw ? 1 : 0),
          draws: away.draws + (draw ? 1 : 0),
          losses: away.losses + (homeWin ? 1 : 0),
          goalsFor: away.goalsFor + awayScore,
          goalsAgainst: away.goalsAgainst + homeScore,
          goalDiff: away.goalDiff + (awayScore - homeScore),
          points: away.points + (!homeWin && !draw ? 3 : draw ? 1 : 0),
        })
        .where(eq(dbSchema.leagueTeams.id, away.id));
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("[MATCH_RESULT_ERROR]", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
