require("dotenv").config({ path: ".env.local" });

/** @type {import('drizzle-kit').Config} */
module.exports = {
  // ⚠️ 스키마 경로를 실제 사용 중인 TypeScript 스키마 파일로 변경합니다.
  schema: "./src/db/schema.ts",
  // 마이그레이션 파일들이 저장될 경로
  out: "./drizzle/out",
  // PG 드라이버 사용
  driver: "pg",
  // PostgreSQL 연결 정보
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  // 로깅 옵션
  verbose: true,
  strict: true,
};
