"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

export default function SignupPage() {
  const router = useRouter();

  // 서버 빌드 시 auth=null → 안전 렌더
  if (!auth) {
    return <div className="text-white p-10 text-center">Firebase 초기화 중...</div>;
  }

  /* 기존 코드 동일 */
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
