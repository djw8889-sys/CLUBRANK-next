"use server";

export async function createLeague(data: {
  name: string;
  season: string;
  teamCount: number;
}) {
  // 🔥 아직 API가 없는 상태 -> 목업 리턴
  // 나중에 real API와 연결만 바꾸면 됨
  console.log("리그 생성 요청:", data);

  return {
    ok: true,
    id: "mock-league-001",
  };
}
