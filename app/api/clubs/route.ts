import { NextRequest } from "next/server";
import { db, dbSchema } from "@/lib/server/db";
import { requireUser, AuthError } from "@/lib/server/auth";
import { ok, created, badRequest, serverError, unauthorized } from "@/lib/server/respond";
import { z } from "zod";

export const runtime = "nodejs";

/**
 * Zod schema for creating a new Club.
 * We do NOT use insertClubSchema because drizzle-zod makes all fields optional.
 * Here we explicitly require the fields that the DB mandates.
 */
const createClubBodySchema = z.object({
  name: z.string().min(1, "클럽 이름은 필수입니다."),
  region: z.string().min(1, "지역은 필수입니다."),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  description: z.string().optional(),
  primaryColor: z.string().optional(),
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

    // Construct DB insert object
    const insertData = {
      name: parsed.data.name,
      region: parsed.data.region,
      logoUrl: parsed.data.logoUrl ?? null,
      bannerUrl: parsed.data.bannerUrl ?? null,
      description: parsed.data.description ?? null,
      primaryColor: parsed.data.primaryColor ?? "#22c55e",
    };

    const [inserted] = await db
      .insert(dbSchema.clubs)
      .values(insertData)
      .returning();

    return created(inserted);
  } catch (err) {
    if (err instanceof AuthError) {
      return unauthorized(err.message);
    }
    return serverError("클럽 생성 실패", err);
  }
}
