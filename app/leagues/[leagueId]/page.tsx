import { db, dbSchema } from "@/lib/server/db";
import { eq } from "drizzle-orm";

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

  // DB에서 리그 정보 조회 (Drizzle 표준 문법 적용)
  const league = await db
    .select()
    .from(dbSchema.leagues)
    .where(eq(dbSchema.leagues.id, leagueId))
    .then((rows) => rows[0])
    .catch(() => null);

  if (!league) {
    return (
      <div className="text-center text-gray-300 mt-10">
        리그 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="text-white space-y-4">
      <h2 className="text-2xl font-bold">{league.name}</h2>

      <div className="bg-[#1A1F25] p-4 rounded-xl border border-[#2A2F36]">
        <p className="text-gray-300">시즌</p>
        <p className="text-lg font-semibold">{league.season}</p>
      </div>

      <div className="bg-[#1A1F25] p-4 rounded-xl border border-[#2A2F36]">
        <p className="text-gray-300">팀 수</p>
        <p className="text-lg font-semibold">{league.teamCount}팀</p>
      </div>

      <div className="bg-[#1A1F25] p-4 rounded-xl border border-[#2A2F36]">
        <p className="text-gray-300">진행 상태</p>
        <p className="text-lg font-semibold capitalize">{league.status}</p>
      </div>
    </div>
  );
}
