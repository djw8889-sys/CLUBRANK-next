export default function ProfilePage() {
  // TODO: 나중에 /api/auth/me 연동해서 실제 사용자 정보 표시
  const mockUser = {
    name: "GDLY 매니저",
    email: "manager@example.com",
    teams: 2,
    leagues: 1,
  };

  return (
    <div className="space-y-4">
      <section className="gdly-card flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-2xl">
          👤
        </div>
        <div>
          <div className="font-semibold text-textPrimary">
            {mockUser.name}
          </div>
          <div className="gdly-muted text-xs">{mockUser.email}</div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="gdly-card">
          <div className="text-xs text-muted mb-1">나의 팀</div>
          <div className="text-2xl font-bold text-primary">
            {mockUser.teams}
          </div>
        </div>
        <div className="gdly-card">
          <div className="text-xs text-muted mb-1">참여 리그</div>
          <div className="text-2xl font-bold text-primary">
            {mockUser.leagues}
          </div>
        </div>
      </section>

      <section className="gdly-card space-y-2">
        <div className="gdly-section-title">설정</div>
        <button className="w-full rounded-xl bg-surface px-3 py-2 text-left text-sm hover:bg-surface/70">
          🔐 Google 계정으로 로그인 (추후 연동)
        </button>
        <button className="w-full rounded-xl bg-surface px-3 py-2 text-left text-sm hover:bg-surface/70">
          🚪 로그아웃 (추후 연동)
        </button>
      </section>
    </div>
  );
}
