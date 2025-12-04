// app/auth/reset/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.code === "auth/user-not-found"
          ? "해당 이메일의 계정을 찾을 수 없습니다."
          : "비밀번호 재설정 메일 전송에 실패했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A2342] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1A1F25] rounded-2xl p-8 shadow-xl border border-[#2A2F36]">
        <div className="text-center mb-8">
          <div className="text-[#9FE870] font-black text-2xl tracking-[0.25em] mb-2">
            GDLY
          </div>
          <h1 className="text-white text-xl font-bold mb-1">
            비밀번호 재설정
          </h1>
          <p className="text-sm text-gray-400">
            가입한 이메일로 재설정 링크를 보내드립니다.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-500/60 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        {sent ? (
          <div className="mb-6 rounded-lg bg-emerald-900/40 border border-emerald-500/60 px-3 py-3 text-sm text-emerald-100">
            입력하신 이메일로 비밀번호 재설정 링크를 보냈습니다.
          </div>
        ) : null}

        <form onSubmit={handleReset} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              이메일
            </label>
            <input
              type="email"
              className="w-full rounded-xl bg-[#0F172A] border border-[#2A2F36] px-3 py-2 text-sm text-white outline-none focus:border-[#9FE870] focus:ring-1 focus:ring-[#9FE870]"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-[#9FE870] text-[#0A2342] font-bold text-sm py-2.5 mt-2 transition active:scale-[0.99] hover:bg-[#b4f28b] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "전송 중..." : "재설정 메일 보내기"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          <Link href="/auth/login" className="text-[#9FE870] hover:underline">
            로그인 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}