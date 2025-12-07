"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// ⛔ 서버 빌드에서 절대 실행되면 안됨 → 안전 가드 추가
function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

// 🔥 브라우저에서만 안전하게 초기화되도록 보호
let app;
if (typeof window !== "undefined") {
  const config = getFirebaseConfig();
  app = !getApps().length ? initializeApp(config) : getApp();
} else {
  // 서버에서는 dummy 값
  app = null;
}

export const auth = app ? getAuth(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;

// 👇 브라우저에서만 persistence 적용
if (typeof window !== "undefined" && auth) {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}
