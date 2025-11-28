import { NextResponse } from "next/server";

export function ok(data: unknown, init?: number | ResponseInit) {
  if (typeof init === "number") {
    return NextResponse.json(data, { status: init });
  }
  return NextResponse.json(data, init);
}

export function created(data: unknown) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function unauthorized(message = "인증이 필요합니다.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function notFound(message = "리소스를 찾을 수 없습니다.") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "서버 오류가 발생했습니다.", details?: unknown) {
  console.error("[API] serverError", message, details);
  return NextResponse.json({ error: message }, { status: 500 });
}
