import RoundRobinGenerator from "@/components/league/RoundRobinGenerator";

export default function LeagueSchedulePage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">경기 일정 자동 생성</h2>

      <RoundRobinGenerator />
    </div>
  );
}
