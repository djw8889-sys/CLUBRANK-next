import { db, dbSchema } from "@/lib/server/db";
import { eq } from "drizzle-orm";

export default async function LeagueOverviewPage({
  params,
}: {
  params: { leagueId: string };
}) {
  const leagueId = Number(params.leagueId);

  if (!db || Number.isNaN(leagueId)) {
    return (
      <div className="text-center text-red-400 mt-10">
        잘못된 요청입니다.
      </div>
    );
  }

  const league = await db
    .select()
    .from(dbSchema.leagues)
    .where(eq(dbSchema.leagues.id, leagueId))
    .then((rows) => rows[0]);

  if (!league) {
    return (
      <div className="text-center text-gray-300 mt-10">
        리그 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const teams = await db
    .select({
      id: dbSchema.leagueTeams.id,
      teamId: dbSchema.leagueTeams.teamId,
      name: dbSchema.teams.name,
      logoUrl: dbSchema.teams.logoUrl,
    })
    .from(dbSchema.leagueTeams)
    .leftJoin(
      dbSchema.teams,
      eq(dbSchema.leagueTeams.teamId, dbSchema.teams.id)
    )
    .where(eq(dbSchema.leagueTeams.leagueId, leagueId));

  return (
    <div className="space-y-6 text-white">
      <header>
        <h1 className="text-2xl font-bold">{league.name}</h1>
        <p className="text-sm text-gray-400">
          시즌 {league.season}
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">참가 팀</h2>

        {teams.length === 0 && (
          <div className="text-gray-400">
            아직 참가한 팀이 없습니다.
          </div>
        )}

        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center gap-3 rounded-xl border border-slate-700 p-3"
          >
            {team.logoUrl ? (
              <img
                src={team.logoUrl}
                alt={team.name}
                className="h-8 w-8 rounded"
              />
            ) : (
              <div className="h-8 w-8 rounded bg-slate-700" />
            )}
            <span className="font-medium">
              {team.name ?? "이름 없음"}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
