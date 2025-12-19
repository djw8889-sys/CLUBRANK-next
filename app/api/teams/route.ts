import { NextRequest } from "next/server";
import { db, dbSchema } from "@/lib/server/db";
import { z } from "zod";

// GET /api/teams – 모든 팀 조회
export async function GET() {
  try {
    if (!db) {
      return new Response(
        JSON.stringify({ error: "DB not initialized" }),
        { status: 500 }
      );
    }

    const teams = await db.select().from(dbSchema.teams);
    return new Response(JSON.stringify({ teams }), { status: 200 });
  } catch (err) {
    console.error("[GET_TEAMS_ERROR]", err);
    return new Response(
      JSON.stringify({ error: "팀 목록 조회 실패" }),
      { status: 500 }
    );
  }
}

// POST /api/teams – 새 팀 생성
export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return new Response(
        JSON.stringify({ error: "DB not initialized" }),
        { status: 500 }
      );
    }

    const body = await req.json();
    const schema = z.object({
      name: z.string().min(1, "팀 이름은 필수입니다."),
    });
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(dbSchema.teams)
      .values({ name: parsed.data.name })
      .returning({ id: dbSchema.teams.id, name: dbSchema.teams.name });

    return new Response(
      JSON.stringify(inserted),
      { status: 201 }
    );
  } catch (err) {
    console.error("[CREATE_TEAM_ERROR]", err);
    return new Response(
      JSON.stringify({ error: "팀 생성 실패" }),
      { status: 500 }
    );
  }
}
