"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar({ leagueId }: { leagueId: string }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", path: `/leagues/${leagueId}` },
    { name: "Schedule", path: `/leagues/${leagueId}/schedule` },
    { name: "Standings", path: `/leagues/${leagueId}/standings` },
    { name: "MVP", path: `/leagues/${leagueId}/mvp` },
  ];

  return (
    <div className="flex justify-around bg-[#1A1F25] text-gray-300 p-3 rounded-xl mt-4">
      {tabs.map((t) => {
        const isActive = pathname === t.path;
        return (
          <Link
            key={t.name}
            href={t.path}
            className={`px-3 py-2 rounded-lg font-semibold ${
              isActive
                ? "text-[#9FE870] border-b-2 border-[#9FE870]"
                : "hover:text-white"
            }`}
          >
            {t.name}
          </Link>
        );
      })}
    </div>
  );
}
