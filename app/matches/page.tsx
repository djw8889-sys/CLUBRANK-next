import Link from "next/link";

export default function MatchesPage() {
  // TODO: 나중에 /api/leagues/:id/matches 연동
  const mockMatches = [
    {
      id: "1",
      leagueName: "GDLY 테스트 리그",
      round: 1,
      home: "1반 FC",
      away: "2반 유나이티드",
      score: "2 : 1",
    },
  ];

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-textPrimary">경기</h1>
        <p className="gdly-muted text-xs mt-1">
          오늘 진행된 경기와 스코어를 한눈에 확인해보세요.
        </p>
      </header>

      <section className="space-y-3">
        {mockMatches.map((m) => (
          <Link
            key={m.id}
            href={`/matches/${m.id}`}
            className="gdly-card space-y-1"
          >
            <div className="text-xs text-primary font-semibold">
              {m.leagueName} · {m.round}R
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>{m.home}</span>
              <span className="text-lg font-semibold text-textPrimary">
                {m.score}
              </span>
              <span>{m.away}</span>
            </div>
          </Link>
        ))}

        {mockMatches.length === 0 && (
          <div className="gdly-card">
            <div className="gdly-section-title mb-1">
              아직 등록된 경기가 없어요
            </div>
            <p className="gdly-muted text-sm">
              리그를 생성하고 라운드로빈 일정을 만들어보면 경기가 여기 표시됩니다.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
