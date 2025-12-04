"use server";

export async function createLeague(data: {
  name: string;
  season: string;
  teamCount: number;
}) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leagues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error(json);
      return { ok: false };
    }

    return { ok: true, id: json.id };
  } catch (err) {
    console.error("createLeague error:", err);
    return { ok: false };
  }
}
