"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Team {
  id: number;
  name: string;
}

interface LeagueTeam {
  teamId: number;
}

export default function LeagueTeamsPage() {
  const params = useParams();
  const leagueId = Number(params.leagueId);

  const [teams, setTeams] = useState<Team[]>([]);
  const [leagueTeams, setLeagueTeams] = useState<LeagueTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  /* ======================
     데이터 로딩
  ====================== */
  useEffect(() => {
    if (!leagueId) return;

    const fetchData = async () => {
      setLoading(true);

      const [allTeamsRes, leagueTeamsRes] = await Promise.all([
        fetch("/api/teams"),
        fetch(`/api/leagues/${leagueId}/teams`),
      ]);

      const allTeamsData = await allTeamsRes.json();
      const leagueTeamsData = await leagueTeamsRes.json();

      setTeams(allTeamsData.teams ?? []);
      setLeagueTeams(leagueTeamsData.teams ?? []);
      setLoading(false);
    };

    fetchData();
  }, [leagueId]);

  /* ======================
     참가 여부 체크
  ====================== */
  const isJoined = (teamId: number) =>
    leagueTeams.some((lt) => lt.teamId === teamId);

  /* ======================
     리그 참가
  ====================== */
  const joinLeague = async (teamId: number) => {
    setSubmittingId(teamId);

    await fetch(`/api/leagues/${leagueId}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId }),
    });

    // 참가 후 다시 로딩
    const res = await fetch(`/api/leagues/${leagueId}/teams`);
    const data = await res.json();
    setLeagueTeams(data.teams ?? []);

    setSubmittingId(null);
  };

  /* ======================
     렌더링
  ====================== */
  if (loading) {
    return <div className="text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="space-y-6 text-white">
      <header>
        <h1 className="text-xl font-bold">리그 팀 참가</h1>
        <p className="text-sm text-gray-400">
          리그에 참가할 팀을 선택하세요
        </p>
      </header>

      <section className="space-y-3">
        {teams.map((team) => {
          const joined = isJoined(team.id);

          return (
            <div
              key={team.id}
              className="flex items-center justify-between border border-slate-700 rounded-xl p-3"
            >
              <span>{team.name}</span>

              {joined ? (
                <span className="text-green-400 text-sm font-medium">
                  참가됨
                </span>
              ) : (
                <button
                  onClick={() => joinLeague(team.id)}
                  disabled={submittingId === team.id}
                  className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {submittingId === team.id
                    ? "처리 중..."
                    : "리그 참가"}
                </button>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
