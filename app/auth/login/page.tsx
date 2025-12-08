"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReady(!!auth);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Firebase 초기화 중...
      </div>
    );
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth!, email, password);
      router.push("/leagues");
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.code === "auth/user-not-found"
          ? "존재하지 않는 계정입니다."
          : err?.code === "auth/wrong-password"
          ? "비밀번호가 일치하지 않습니다."
          : "로그인에 실패했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    try {
      setLoading(true);
      await signInWithPopup(auth!, googleProvider!);
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
      <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

        {error && <div className="text-red-500 text-center mb-3">{error}</div>}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            className="w-full px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="w-full px-4 py-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-lg mt-3"
        >
          구글로 로그인
        </button>

        <div className="text-center mt-4">
          <Link href="/auth/signup" className="text-blue-600">
            계정이 없으신가요? 회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
