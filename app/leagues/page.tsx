import Link from "next/link";

export default function LeaguesPage() {
  // TODO: 나중에 /api/leagues 연동해서 실제 데이터로 바꾸기
  const mockLeagues = [
    { id: "1", name: "GDLY 테스트 리그", season: "2024-1", teams: 8 },
  ];

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
        {mockLeagues.map((league) => (
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
                시즌 {league.season} · 팀 {league.teams}개
              </div>
            </div>
            <span className="text-sm text-primary">자세히 보기 →</span>
          </Link>
        ))}

        {mockLeagues.length === 0 && (
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
