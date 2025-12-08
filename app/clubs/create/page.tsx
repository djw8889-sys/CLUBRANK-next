"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateClubPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("클럽 이름은 필수입니다.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          region,
          logoUrl,
          bannerUrl,
          description,
          primaryColor,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "클럽 생성 실패");
      }

      const data = await res.json();

      router.push(`/clubs/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A2342] text-white p-6">
      <h1 className="text-xl font-bold mb-4">새 클럽 만들기</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="클럽 이름 *"
          className="w-full p-3 rounded bg-[#1A1F25] border border-[#2A2F36]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="지역"
          className="w-full p-3 rounded bg-[#1A1F25] border border-[#2A2F36]"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        <input
          type="text"
          placeholder="로고 이미지 URL"
          className="w-full p-3 rounded bg-[#1A1F25] border border-[#2A2F36]"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="배너 이미지 URL"
          className="w-full p-3 rounded bg-[#1A1F25] border border-[#2A2F36]"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
        />

        <textarea
          placeholder="클럽 설명"
          className="w-full p-3 rounded bg-[#1A1F25] border border-[#2A2F36] h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="메인 색상 (primaryColor)"
          className="w-full p-3 rounded bg-[#1A1F25] border border-[#2A2F36]"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />

        {error && <p className="text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 rounded font-semibold disabled:bg-blue-400"
        >
          {loading ? "생성 중..." : "클럽 생성하기"}
        </button>
      </form>
    </div>
  );
}
