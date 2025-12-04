// app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password || !passwordCheck) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/leagues");
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.code === "auth/email-already-in-use"
          ? "이미 사용 중인 이메일입니다."
          : "회원가입에 실패했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      router.push("/leagues");
    } catch (err) {
      console.error(err);
      setError("구글 로그인에 실패했습니다.");
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
            회원가입
          </h1>
          <p className="text-sm text-gray-400">
            GDLY 리그에 참여할 계정을 만들어주세요.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-500/60 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4 mb-6">
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

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              className="w-full rounded-xl bg-[#0F172A] border border-[#2A2F36] px-3 py-2 text-sm text-white outline-none focus:border-[#9FE870] focus:ring-1 focus:ring-[#9FE870]"
              placeholder="최소 6자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              className="w-full rounded-xl bg-[#0F172A] border border-[#2A2F36] px-3 py-2 text-sm text-white outline-none focus:border-[#9FE870] focus:ring-1 focus:ring-[#9FE870]"
              placeholder="비밀번호를 다시 입력"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-[#9FE870] text-[#0A2342] font-bold text-sm py-2.5 mt-2 transition active:scale-[0.99] hover:bg-[#b4f28b] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "가입 중..." : "이메일로 회원가입"}
          </button>
        </form>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-[#2A2F36]" />
          <span className="text-xs text-gray-500">또는</span>
          <div className="h-px flex-1 bg-[#2A2F36]" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-xl border border-[#374151] bg-[#050814] text-sm text-gray-100 py-2.5 mb-4 hover:bg-[#0B1120] transition active:scale-[0.99] disabled:opacity-60"
        >
          <span className="mr-2 text-lg">🟢</span>
          구글 계정으로 계속하기
        </button>

        <div className="text-center text-xs text-gray-400">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="text-[#9FE870] hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
