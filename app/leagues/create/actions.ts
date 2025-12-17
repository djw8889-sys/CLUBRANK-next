export async function createLeague(data: {
  name: string;
  season: string;
  teamCount: number;
}) {
  try {
    const res = await fetch("/api/leagues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return { ok: false };
    }

    return { ok: true, id: json.id };
  } catch (e) {
    console.error(e);
    return { ok: false };
  }
}
