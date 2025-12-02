export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="gdly-card">
        <h1 className="text-2xl font-bold text-textPrimary mb-2">
          GDLY 리그 운영 플랫폼
        </h1>
        <p className="gdly-muted">
          아마추어 축구·풋살 리그를 만들고, 경기/득점/MVP까지 한 번에 관리하세요.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <a href="/leagues" className="gdly-card">
          <div className="text-2xl mb-1">📊</div>
          <div className="font-semibold text-textPrimary mb-1">리그 관리</div>
          <div className="gdly-muted text-xs">
            리그 생성, 일정, 순위, MVP까지 모두 한 곳에서
          </div>
        </a>

        <a href="/matches" className="gdly-card">
          <div className="text-2xl mb-1">⚽</div>
          <div className="font-semibold text-textPrimary mb-1">경기 기록</div>
          <div className="gdly-muted text-xs">
            스코어, 득점/도움, 경기 MVP를 빠르게 입력
          </div>
        </a>

        <a href="/profile" className="gdly-card">
          <div className="text-2xl mb-1">👤</div>
          <div className="font-semibold text-textPrimary mb-1">마이 페이지</div>
          <div className="gdly-muted text-xs">
            내 팀, 내가 속한 리그, 내 MVP/득점 기록 확인
          </div>
        </a>

        <a href="/leagues/create" className="gdly-card">
          <div className="text-2xl mb-1">🚀</div>
          <div className="font-semibold text-textPrimary mb-1">새 리그 시작</div>
          <div className="gdly-muted text-xs">
            반대항전, 사내리그 등 새로운 시즌을 바로 만들어보세요.
          </div>
        </a>
      </section>
    </div>
  );
}
