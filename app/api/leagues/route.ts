import { NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { leagues } from "@/db/schema";
import { z } from "zod";

const createLeagueSchema = z.object({
  name: z.string().min(1),
  season: z.string().min(1),
  teamCount: z.number().min(2),
});

export async function POST(req: NextRequest) {
  try {
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

    const [inserted] = await db
      .insert(leagues)
      .values({
        name,
        season,
        totalTeams: teamCount, // ✅ 핵심 수정
        status: "draft",
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
