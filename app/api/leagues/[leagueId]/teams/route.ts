import { NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { leagueTeams } from "@/db/schema";
import { z } from "zod";

// POST /api/leagues/:leagueId/teams
export async function POST(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  try {
    if (!db) {
      return new Response(
        JSON.stringify({ error: "DB not initialized" }),
        { status: 500 }
      );
    }

    const leagueId = Number(params.leagueId);
    if (Number.isNaN(leagueId)) {
      return new Response(
        JSON.stringify({ error: "Invalid leagueId" }),
        { status: 400 }
      );
    }

    const body = await req.json();

    const schema = z.object({
      teamId: z.number(),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400 }
      );
    }

    const { teamId } = parsed.data;

    const [inserted] = await db
      .insert(leagueTeams)
      .values({
        leagueId,
        teamId,
      })
      .returning({ id: leagueTeams.id });

    return new Response(JSON.stringify(inserted), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
