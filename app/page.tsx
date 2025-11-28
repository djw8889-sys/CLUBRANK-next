export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">CLUBRANK Next.js 서버 준비 완료</h1>
      <p className="text-slate-300">
        이제 Vercel에 연결하고, Firebase/DB 환경변수만 세팅하면 됩니다.
      </p>
      <p className="text-sm text-slate-400">
        /api/health, /api/clubs 엔드포인트로 서버·DB·인증을 순서대로 점검할 수 있습니다.
      </p>
    </main>
  );
}
