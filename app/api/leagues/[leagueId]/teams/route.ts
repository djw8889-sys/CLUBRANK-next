import { NextRequest } from "next/server";
import { db, dbSchema } from "@/lib/server/db";
import { z } from "zod";

export async function POST(
  req: NextRequest,
  context: { params: { leagueId: string } }
) {
  try {
    const { leagueId } = context.params;

    const schema = z.object({
      teamId: z.number(),
    });

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "잘못된 요청 데이터입니다." }), {
        status: 400,
      });
    }

    const { teamId } = parsed.data;

    const [inserted] = await db
      .insert(dbSchema.leagueTeams)
      .values({
        leagueId: Number(leagueId),
        teamId,
      })
      .returning({ id: dbSchema.leagueTeams.id });

    return new Response(JSON.stringify(inserted), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "서버 오류" }), {
      status: 500,
    });
  }
}
