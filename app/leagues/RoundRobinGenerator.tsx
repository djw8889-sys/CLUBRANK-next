"use client";

import { useState } from "react";

interface Match {
  home: string;
  away: string;
}

interface Round {
  round: number;
  matches: Match[];
}

export default function RoundRobinGenerator() {
  const [teamCount, setTeamCount] = useState<number>(4);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Round[]>([]);

  const handleTeamCountChange = (value: number) => {
    setTeamCount(value);
    setTeamNames(Array(value).fill(""));
  };

  const handleTeamNameChange = (index: number, value: string) => {
    const updated = [...teamNames];
    updated[index] = value;
    setTeamNames(updated);
  };

  // ------------------------
  // Round Robin Generator
  // ------------------------
  const generateSchedule = () => {
    if (teamNames.some((name) => name.trim() === "")) {
      alert("팀 이름을 모두 입력해주세요.");
      return;
    }

    let teams = [...teamNames];

    // 팀 수 홀수면 BYE 추가
    if (teams.length % 2 === 1) {
      teams.push("BYE");
    }

    const n = teams.length;
    const rounds: Round[] = [];
    const half = n / 2;

    let order = [...teams];

    for (let roundNum = 1; roundNum < n; roundNum++) {
      const roundMatches: Match[] = [];

      for (let i = 0; i < half; i++) {
        const home = order[i];
        const away = order[n - 1 - i];

        if (home !== "BYE" && away !== "BYE") {
          roundMatches.push({ home, away });
        }
      }

      rounds.push({ round: roundNum, matches: roundMatches });

      // 로테이션 알고리즘
      const fixed = order[0];
      const rotated = [fixed, ...order.slice(2), order[1]];
      order = rotated;
    }

    setSchedule(rounds);
  };

  return (
    <div className="bg-[#1A1F25] p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-white">Round-robin 자동 생성기</h3>

      {/* 팀 수 선택 */}
      <label className="block text-gray-300 mb-2">팀 수 선택</label>
      <select
        className="p-2 bg-[#0A2342] border border-gray-600 rounded-lg text-white mb-4"
        value={teamCount}
        onChange={(e) => handleTeamCountChange(Number(e.target.value))}
      >
        {[4, 6, 8, 10, 12].map((v) => (
          <option key={v} value={v}>
            {v} 팀
          </option>
        ))}
      </select>

      {/* 팀 이름 입력 */}
      <div className="space-y-2 mb-4">
        {teamNames.map((name, idx) => (
          <input
            key={idx}
            className="w-full p-2 bg-[#0A2342] text-white border border-gray-700 rounded-lg"
            placeholder={`${idx + 1}번 팀 이름`}
            value={name}
            onChange={(e) => handleTeamNameChange(idx, e.target.value)}
          />
        ))}
      </div>

      {/* 버튼 */}
      <button
        onClick={generateSchedule}
        className="w-full bg-[#9FE870] text-[#0A2342] py-2 rounded-lg font-bold hover:bg-[#b3f38b]"
      >
        자동 생성하기
      </button>

      {/* 생성된 일정 출력 */}
      {schedule.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-3 text-white">📅 자동 생성된 일정</h4>

          {schedule.map((round) => (
            <div
              key={round.round}
              className="bg-[#0A2342] p-4 rounded-xl border border-gray-800 mb-4"
            >
              <p className="font-bold text-[#9FE870] mb-2">
                {round.round}라운드
              </p>

              {round.matches.map((m, i) => (
                <p key={i} className="text-gray-300 text-sm">
                  {m.home} vs {m.away}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
