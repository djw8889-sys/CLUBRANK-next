import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "components/layout/BottomNav";

export const metadata: Metadata = {
  title: "GDLY – 아마추어 축구·풋살 리그 플랫폼",
  description: "GDLY: 누구나 쉽게 리그를 만들고, 경기와 기록을 관리하는 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-background text-textSecondary">
        <div className="gdly-shell">
          <main className="gdly-page">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
