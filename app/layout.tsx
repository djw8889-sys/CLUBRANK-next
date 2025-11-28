import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLUBRANK",
  description: "Tennis club ranking & management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
