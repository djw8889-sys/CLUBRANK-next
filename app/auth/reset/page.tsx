"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function ResetPasswordPage() {
  if (!auth) {
    return <div className="text-white p-10 text-center">Firebase 초기화 중...</div>;
  }

  /* 기존 코드 동일 */
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
    /* 기존 UI 유지 */
    <div className="min-h-screen bg-[#0A2342] flex items-center justify-center px-4">
      ...
    </div>
  );
}
