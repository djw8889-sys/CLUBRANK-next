require("dotenv").config({ path: ".env.local" });

/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: "./drizzle/schema.js",     // JS schema 사용 (확실)
  out: "./drizzle/out",
  
  // ⭐ drizzle-kit 0.20.x 는 dialect 대신 driver 사용
  driver: "pg",

  dbCredentials: {
    connectionString: process.env.DATABASE_URL,   // 이 형식을 사용해야 함
  },

  verbose: true,
  strict: true,
};
