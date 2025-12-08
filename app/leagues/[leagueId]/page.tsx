import { db, dbSchema } from "@/lib/server/db";
import { eq, and } from "drizzle-orm";
import Link from "next/link";

export default async function LeagueOverviewPage({
  params,
}: {
  params: { leagueId: string };
}) {
  const leagueId = Number(params.leagueId);

  if (!db) {
    return (
      <div className="text-center text-red-400 mt-10">
        DB 연결 오류가 발생했습니다.
      </div>
    );
  }

  // 🔥 1) 리그 기본 정보 조회
  const league = await db
    .select()
    .from(dbSchema.leagues)
    .where(eq(dbSchema.leagues.id, leagueId))
    .then((rows) => rows[0])
    .catch(() => null);

  if (!league) {
    return (
      <div className="text-center text-gray-300 mt-10">
        리그 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // 🔥 2) 리그에 등록된 팀 목록 조회 (league_teams + clubs 조인)
  const teams = await db
    .select({
      id: dbSchema.leagueTeams.id,
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
    .where(eq(dbSchema.leagueTeams.leagueId, leagueId))
    .catch(() => []);

  return (
    <div className="min-h-screen text-white space-y-6 p-4">
      {/* 리그 이름 */}
      <h2 className="text-2xl font-bold">{league.name}</h2>

      {/* 기본 정보 */}
      <section className="bg-[#1A1F25] p-4 rounded-xl border border-[#2A2F36] space-y-2">
        <p className="text-gray-300">시즌</p>
        <p className="text-lg font-semibold">{league.season}</p>
      </section>

      <section className="bg-[#1A1F25] p-4 rounded-xl border border-[#2A2F36] space-y-2">
        <p className="text-gray-300">팀 수</p>
        <p className="text-lg font-semibold">{league.teamCount}팀</p>
      </section>

      {/* 🔥 팀 목록 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">참가 팀 목록</h3>
          <Link
            href={`/leagues/${leagueId}/teams`}
            className="bg-primary px-3 py-2 rounded-lg text-background text-sm font-semibold"
          >
            팀 추가하기
          </Link>
        </div>

        {teams.length === 0 && (
          <div className="bg-[#1A1F25] p-4 rounded-xl border border-[#2A2F36]">
            <p className="text-gray-400 text-sm">등록된 팀이 없습니다.</p>
          </div>
        )}

        {/* 팀 리스트 */}
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center gap-4 bg-[#1A1F25] p-4 rounded-xl border border-[#2A2F36]"
          >
            {/* 로고 */}
            <div className="w-12 h-12 rounded-full bg-[#2A2F36] flex items-center justify-center overflow-hidden">
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Logo</span>
              )}
            </div>

            {/* 팀 정보 */}
            <div>
              <p className="text-lg font-semibold">{team.name}</p>
              <p className="text-gray-400 text-sm">{team.region || "-"}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
