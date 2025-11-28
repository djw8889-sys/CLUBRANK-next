import { NextRequest } from "next/server";
import { getAdminAuth } from "./firebase-admin";

export interface AuthUser {
  uid: string;
  email?: string;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

export async function requireUser(req: NextRequest): Promise<AuthUser> {
  const token = extractBearerToken(req);
  if (!token) {
    throw new AuthError("인증 토큰이 없습니다.", 401);
  }

  const auth = getAdminAuth();
  try {
    const decoded = await auth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? undefined,
    };
  } catch (err) {
    console.error("[AUTH] verifyIdToken 실패", err);
    throw new AuthError("유효하지 않은 토큰입니다.", 401);
  }
}
