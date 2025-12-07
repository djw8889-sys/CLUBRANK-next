"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();

  // 서버 환경에서 auth가 null이면 렌더만 하고 이벤트 실행 차단
  if (!auth) {
    return (
      <div className="text-center text-white p-10">
        Firebase 초기화 중...
      </div>
    );
  }

  /* 기존 코드 동일 */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
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
      await signInWithPopup(auth, googleProvider!);
      router.push("/leagues");
    } catch (err) {
      console.error(err);
      setError("구글 로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    /* 기존 UI 그대로 */
    <div className="min-h-screen bg-[#0A2342] flex items-center justify-center px-4">
      ...
    </div>
  );
}
