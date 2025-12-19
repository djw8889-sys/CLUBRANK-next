import { NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { leagues } from "@/db/schema";
import { z } from "zod";

// 리그 생성 요청 스키마 정의
const createLeagueSchema = z.object({
  name: z.string().min(1, "리그 이름은 필수입니다."),
  season: z.string().min(1, "시즌은 필수입니다."),
  teamCount: z.number().optional(),
});

// POST /api/leagues
export async function POST(req: NextRequest) {
  try {
    // DB 초기화 여부 확인
    if (!db) {
      return new Response(
        JSON.stringify({ error: "DB not initialized" }),
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = createLeagueSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400 }
      );
    }

    const { name, season, teamCount } = parsed.data;

    // teamCount가 없거나 NaN일 경우 0으로 대체
    const count =
      typeof teamCount === "number" && !Number.isNaN(teamCount)
        ? teamCount
        : 0;

    const [inserted] = await db
      .insert(leagues)
      .values({
        name,
        season,
        teamCount: count,
      })
      .returning({ id: leagues.id });

    return new Response(
      JSON.stringify({ ok: true, id: inserted.id }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
