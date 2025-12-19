"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LeagueTeamRegisterPage({
  params,
}: {
  params: { leagueId: string };
}) {
  const leagueId = Number(params.leagueId);
  const router = useRouter();

  const [teams, setTeams] = useState<any[]>([]);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 🔥 리그에 등록된 팀 목록 + 전체 팀 목록 조회
  useEffect(() => {
    async function loadData() {
      try {
        const [registeredRes, allTeamsRes] = await Promise.all([
          // GET 리그 참가 팀
          fetch(`/api/leagues/${leagueId}/teams`),
          // GET 전체 팀
          fetch(`/api/teams`),
        ]);

        const registeredData = await registeredRes.json();
        const allTeamsData = await allTeamsRes.json();

        if (!Array.isArray(registeredData.teams)) {
          throw new Error("리그 팀 데이터 오류");
        }
        if (!Array.isArray(allTeamsData.teams)) {
          throw new Error("팀 목록 데이터 오류");
        }

        setRegisteredTeams(registeredData.teams);
        setTeams(allTeamsData.teams);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [leagueId]);

  async function registerTeam(teamId: number) {
    try {
      setSubmitting(true);

      const res = await fetch(`/api/leagues/${leagueId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "팀 등록 실패");
      }

      // 등록 성공 시 리그 상세로 이동
      router.push(`/leagues/${leagueId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center text-gray-300 mt-10">불러오는 중...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 mt-10">
        오류 발생: {error}
      </div>
    );
  }

  // 이미 등록된 팀 제외
  const registeredTeamIds = new Set(registeredTeams.map((t) => t.teamId));
  const availableTeams = teams.filter((team) => !registeredTeamIds.has(team.id));

  return (
    <div className="min-h-screen bg-[#0A2342] text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold">팀 등록하기</h1>

      {/* 이미 등록된 팀 디스플레이 */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">이미 등록된 팀</h2>

        {registeredTeams.length === 0 ? (
          <p className="text-gray-400 text-sm">등록된 팀이 없습니다.</p>
        ) : (
          registeredTeams.map((team) => (
            <div
              key={team.id}
              className="p-3 rounded bg-[#1A1F25] border border-[#2A2F36]"
            >
              <p className="font-semibold">{team.name}</p>
            </div>
          ))
        )}
      </section>

      {/* 등록 가능한 팀 목록 */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">등록 가능한 팀</h2>

        {availableTeams.length === 0 ? (
          <p className="text-gray-400 text-sm">
            등록 가능한 팀이 없습니다.
          </p>
        ) : (
          availableTeams.map((team) => (
            <div
              key={team.id}
              className="flex justify-between items-center p-3 rounded bg-[#1A1F25] border border-[#2A2F36]"
            >
              <div>
                <p className="font-semibold">{team.name}</p>
              </div>

              <button
                disabled={submitting}
                onClick={() => registerTeam(team.id)}
                className="bg-primary px-3 py-2 text-background rounded text-sm font-semibold disabled:bg-primary/50"
              >
                등록
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
