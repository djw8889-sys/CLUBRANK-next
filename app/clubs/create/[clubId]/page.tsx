import { db, dbSchema } from "@/lib/server/db";
import { eq } from "drizzle-orm";

export default async function ClubDetailPage({
  params,
}: {
  params: { clubId: string };
}) {
  const clubId = Number(params.clubId);

  if (!db) {
    return (
      <div className="text-center text-red-400 mt-10">
        DB 연결 오류가 발생했습니다.
      </div>
    );
  }

  // DB에서 클럽 정보 조회
  const club = await db
    .select()
    .from(dbSchema.clubs)
    .where(eq(dbSchema.clubs.id, clubId))
    .then((rows) => rows[0])
    .catch(() => null);

  if (!club) {
    return (
      <div className="text-center text-gray-300 mt-10">
        클럽 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A2342] text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold">{club.name}</h1>

      {/* 기본 정보 */}
      <section className="bg-[#1A1F25] rounded-xl p-4 border border-[#2A2F36] space-y-2">
        <p className="text-gray-400 text-sm">지역</p>
        <p className="text-lg font-semibold">{club.region || "-"}</p>
      </section>

      <section className="bg-[#1A1F25] rounded-xl p-4 border border-[#2A2F36] space-y-2">
        <p className="text-gray-400 text-sm">설명</p>
        <p className="text-lg whitespace-pre-line">
          {club.description || "-"}
        </p>
      </section>

      {/* 이미지 영역 */}
      <section className="space-y-4">
        {club.logoUrl && (
          <div>
            <p className="text-gray-400 text-sm mb-1">로고 이미지</p>
            <img
              src={club.logoUrl}
              alt="logo"
              className="w-24 h-24 rounded-md border border-[#2A2F36]"
            />
          </div>
        )}

        {club.bannerUrl && (
          <div>
            <p className="text-gray-400 text-sm mb-1">배너 이미지</p>
            <img
              src={club.bannerUrl}
              alt="banner"
              className="w-full rounded-xl border border-[#2A2F36]"
            />
          </div>
        )}
      </section>

      {/* 색상 정보 */}
      <section className="bg-[#1A1F25] rounded-xl p-4 border border-[#2A2F36] space-y-2">
        <p className="text-gray-400 text-sm">기본 색상</p>
        <div className="flex items-center space-x-3">
          <div
            className="w-6 h-6 rounded-full border border-white"
            style={{ backgroundColor: club.primaryColor || "#666" }}
          ></div>
          <span className="text-lg">{club.primaryColor || "-"}</span>
        </div>
      </section>
    </div>
  );
}
