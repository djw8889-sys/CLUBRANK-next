"use server";

import { revalidatePath } from "next/cache";
import { db, dbSchema } from "@/lib/server/db";

/**
 * 리그 생성 시 전달받을 값 정의
 * - name: 리그 이름
 * - season: 시즌
 * - teamCount: (선택) 총 팀 수
 */
type CreateLeagueInput = {
  name: string;
  season: string;
  teamCount?: number;
};

export async function createLeague(
  input: CreateLeagueInput
): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  try {
    if (!db) {
      return { ok: false, error: "DB not initialized" };
    }

    const name = (input.name ?? "").trim();
    const season = (input.season ?? "").trim();
    // teamCount 값이 없거나 NaN이면 0으로 처리합니다.
    const teamCount =
      typeof input.teamCount === "number" && !Number.isNaN(input.teamCount)
        ? input.teamCount
        : 0;

    if (!name) {
      return { ok: false, error: "리그 이름이 비었습니다." };
    }
    if (!season) {
      return { ok: false, error: "시즌이 비었습니다." };
    }

    const [inserted] = await db
      .insert(dbSchema.leagues)
      .values({
        name,
        season,
        teamCount,
      })
      .returning({ id: dbSchema.leagues.id });

    revalidatePath("/leagues");

    return { ok: true, id: inserted.id };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unknown error in createLeague";
    console.error("[CREATE_LEAGUE_ERROR]", message);
    return { ok: false, error: message };
  }
}
