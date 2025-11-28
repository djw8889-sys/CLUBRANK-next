import { NextRequest } from "next/server";
import { db, dbSchema } from "@/lib/server/db";
import { requireUser, AuthError } from "@/lib/server/auth";
import { ok, created, badRequest, serverError, unauthorized } from "@/lib/server/respond";
import { z } from "zod";
import { insertClubSchema } from "@db/schema";

export const runtime = "nodejs";

const createClubBodySchema = insertClubSchema.extend({
  name: z.string().min(1, "클럽 이름은 필수입니다."),
  region: z.string().min(1, "지역은 필수입니다.")
});

export async function GET(_req: NextRequest) {
  try {
    if (!db) {
      return serverError("데이터베이스가 설정되지 않았습니다.");
    }
    const clubs = await db.select().from(dbSchema.clubs);
    return ok({ clubs });
  } catch (err) {
    return serverError("클럽 목록 조회 실패", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return serverError("데이터베이스가 설정되지 않았습니다.");
    }

    await requireUser(req);

    const json = await req.json();
    const parsed = createClubBodySchema.safeParse(json);
    if (!parsed.success) {
      return badRequest("잘못된 요청 데이터", parsed.error.flatten());
    }

    const [inserted] = await db
      .insert(dbSchema.clubs)
      .values(parsed.data)
      .returning();

    return created(inserted);
  } catch (err) {
    if (err instanceof AuthError) {
      return unauthorized(err.message);
    }
    return serverError("클럽 생성 실패", err);
  }
}
