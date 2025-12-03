"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type TabItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const TABS: TabItem[] = [
  { href: "/", label: "홈", icon: "🏟️" },
  { href: "/leagues", label: "리그", icon: "📊" },
  { href: "/matches", label: "경기", icon: "⚽" },
  { href: "/profile", label: "마이", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-[480px] items-stretch justify-between px-2 py-2">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center rounded-xl px-2 py-1 text-xs transition 
              ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-textSecondary hover:bg-surface"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
