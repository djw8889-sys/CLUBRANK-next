"use server";

import { revalidatePath } from "next/cache";

type CreateLeagueInput = {
  name: string;
  season: string;
};

export async function createLeague(input: CreateLeagueInput) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leagues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      return { ok: false };
    }

    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (e) {
    console.error(e);
    return { ok: false };
  } finally {
    revalidatePath("/leagues");
  }
}
