import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/clubrank"
  }
};

export default config;
