"use client";

import TabBar from "@/components/ui/TabBar";

export default function LeagueLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { leagueId: string };
}) {
  const { leagueId } = params;

  return (
    <div className="min-h-screen bg-[#0A2342] text-white">
      <header className="px-6 py-4 border-b border-[#1A1F25] bg-[#0A2342]">
        <h1 className="text-2xl font-bold">리그 상세</h1>
      </header>

      <TabBar leagueId={leagueId} />

      <main className="px-6 py-6">{children}</main>
    </div>
  );
}
