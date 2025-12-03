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
    <div className="min-h-screen bg-[#0A2342] text-white p-6">
      <h1 className="text-2xl font-bold">리그 상세</h1>

      {/* Tab Bar */}
      <TabBar leagueId={leagueId} />

      <div className="mt-6">{children}</div>
    </div>
  );
}
