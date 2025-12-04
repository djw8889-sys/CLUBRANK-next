"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { id: "overview", name: "개요", path: "" },
  { id: "schedule", name: "일정", path: "schedule" },
  { id: "standings", name: "순위표", path: "standings" },
  { id: "mvp", name: "MVP", path: "mvp" },
];

export default function TabBar({ leagueId }: { leagueId: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex bg-[#1A1F25] border-b border-[#2A2F36] px-4">
      {tabs.map((tab) => {
        const isActive = pathname.includes(
          `/leagues/${leagueId}/${tab.path}`
        ) || (tab.path === "" && pathname === `/leagues/${leagueId}`);

        return (
          <Link
            key={tab.id}
            href={`/leagues/${leagueId}${tab.path ? `/${tab.path}` : ""}`}
            className={clsx(
              "flex-1 text-center py-3 text-sm font-semibold transition-colors",
              isActive ? "text-[#9FE870] border-b-2 border-[#9FE870]" : "text-gray-400"
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
