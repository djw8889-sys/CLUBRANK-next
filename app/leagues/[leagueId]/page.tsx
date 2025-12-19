import { db, dbSchema } from "@/lib/server/db";
import { eq } from "drizzle-orm";

interface PageProps {
  params: {
    leagueId: string;
  };
}

export default async function LeagueOverviewPage({ params }: PageProps) {
  const leagueId = Number(params.leagueId);

  if (Number.isNaN(leagueId)) {
    return (
      <div className="text-red-400 text-center mt-10">
        잘못된 리그 ID입니다.
      </div>
    );
  }

  /* ======================
     1. 리그 정보 조회
  ====================== */
  const league = await db
    .select()
    .from(dbSchema.leagues)
    .where(eq(dbSchema.leagues.id, leagueId))
    .then((rows) => rows[0]);

  if (!league) {
    return (
      <div className="text-gray-400 text-center mt-10">
        리그를 찾을 수 없습니다.
      </div>
    );
  }

  /* ======================
     2. 리그 참가 팀 조회
     (league_teams + teams JOIN)
  ====================== */
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

  /* ======================
     3. 렌더링
  ====================== */
  return (
    <div className="space-y-6 text-white">
      <header>
        <h1 className="text-2xl font-bold">{league.name}</h1>
        <p className="text-sm text-gray-400">시즌 {league.season}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">참가 팀</h2>

        {teams.length === 0 ? (
          <p className="text-gray-400">아직 참가한 팀이 없습니다.</p>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="flex justify-between items-center border border-slate-700 rounded-xl p-3"
            >
              <div>
                <div className="font-medium">
                  {team.name ?? `팀 ID ${team.teamId}`}
                </div>
                <div className="text-xs text-gray-400">
                  {team.played}경기 {team.wins}승 {team.draws}무 {team.losses}패
                </div>
              </div>

              <div className="font-bold">
                {team.points} pts
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
