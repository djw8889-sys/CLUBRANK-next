"use client";

import { useState } from "react";
import { createLeague } from "./actions";
import Button from "@/components/ui/Button";

export default function CreateLeaguePage() {
  const [leagueName, setLeagueName] = useState("");
  const [season, setSeason] = useState("2025");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!leagueName) {
      alert("리그 이름을 입력해주세요.");
      return;
    }

    setLoading(true);
    const res = await createLeague({
      name: leagueName,
      season,
    });
    setLoading(false);

    if (res.ok) {
      window.location.href = `/leagues/${res.id}`;
    } else {
      alert("리그 생성 실패");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A2342] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">새 리그 만들기</h1>

      <label className="block mb-2 text-gray-300">리그 이름</label>
      <input
        value={leagueName}
        onChange={(e) => setLeagueName(e.target.value)}
        className="w-full p-3 rounded-md bg-[#1A1F25] border border-gray-700 text-white mb-6"
        placeholder="예: GDLY Champions League"
      />

      <label className="block mb-2 text-gray-300">시즌</label>
      <select
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        className="w-full p-3 rounded-md bg-[#1A1F25] border border-gray-700 text-white mb-6"
      >
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
      </select>

      <Button onClick={handleCreate} disabled={loading} full>
        {loading ? "생성 중..." : "리그 생성"}
      </Button>
    </div>
  );
}
