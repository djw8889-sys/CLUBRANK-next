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

  const [clubs, setClubs] = useState<any[]>([]);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 🔥 리그에 등록된 팀 목록 + 전체 클럽 목록 조회
  useEffect(() => {
    async function loadData() {
      try {
        const [teamsRes, clubsRes] = await Promise.all([
          fetch(`/api/leagues/${leagueId}`), // 리그 정보를 포함한 팀 목록
          fetch(`/api/clubs`),               // 모든 클럽 목록
        ]);

        const teamData = await teamsRes.json();
        const clubsData = await clubsRes.json();

        if (!Array.isArray(teamData.teams)) {
          throw new Error("리그 팀 데이터 오류");
        }

        setRegisteredTeams(teamData.teams);
        setClubs(clubsData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [leagueId]);

  async function registerTeam(clubId: number) {
    try {
      setSubmitting(true);

      const res = await fetch(`/api/leagues/${leagueId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "팀 등록 실패");
      }

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
  const registeredClubIds = new Set(registeredTeams.map((t) => t.clubId));
  const availableClubs = clubs.filter((club) => !registeredClubIds.has(club.id));

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

      {/* 등록 가능한 클럽 목록 */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">등록 가능한 클럽</h2>

        {availableClubs.length === 0 ? (
          <p className="text-gray-400 text-sm">
            등록 가능한 클럽이 없습니다.
          </p>
        ) : (
          availableClubs.map((club) => (
            <div
              key={club.id}
              className="flex justify-between items-center p-3 rounded bg-[#1A1F25] border border-[#2A2F36]"
            >
              <div>
                <p className="font-semibold">{club.name}</p>
                <p className="text-gray-400 text-sm">{club.region || "-"}</p>
              </div>

              <button
                disabled={submitting}
                onClick={() => registerTeam(club.id)}
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
