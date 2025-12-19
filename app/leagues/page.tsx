import Link from "next/link";
import { db, dbSchema } from "@/lib/server/db";
import { desc } from "drizzle-orm";

export default async function LeaguesPage() {
  // DB 연결 확인
  if (!db) {
    return (
      <div className="text-center text-red-400 mt-10">
        DB 연결 오류가 발생했습니다.
      </div>
    );
  }

  // 리그 데이터 조회
  const leagues = await db
    .select()
    .from(dbSchema.leagues)
    .orderBy(desc(dbSchema.leagues.id))
    .catch(() => []);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-textPrimary">리그</h1>
        <Link
          href="/leagues/create"
          className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-background"
        >
          새 리그 만들기
        </Link>
      </header>

      <section className="space-y-3">
        {leagues.length > 0 &&
          leagues.map((league) => (
            <Link
              key={league.id}
              href={`/leagues/${league.id}`}
              className="gdly-card flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-textPrimary">
                  {league.name}
                </div>
                <div className="gdly-muted text-xs">
                  시즌 {league.season} · 팀 {league.teamCount ?? 0}개
                </div>
              </div>
              <span className="text-sm text-primary">자세히 보기 →</span>
            </Link>
          ))}

        {leagues.length === 0 && (
          <div className="gdly-card">
            <div className="gdly-section-title mb-1">아직 리그가 없어요</div>
            <p className="gdly-muted text-sm">
              첫 번째 리그를 만들어 팀을 초대하고 일정을 생성해보세요.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
