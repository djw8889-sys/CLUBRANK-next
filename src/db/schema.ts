import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/* ========================================================================== */
/*                               Clubs (기존)                                  */
/* ========================================================================== */

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  description: text("description"),
  primaryColor: varchar("primary_color", { length: 7 }).default("#22c55e"),
  rankingPoints: integer("ranking_points").default(1000),
  region: varchar("region", { length: 50 }).notNull(),
  establishedAt: timestamp("established_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  establishedAt: true,
  createdAt: true,
  updatedAt: true,
});

/* ========================================================================== */
/*                               Teams (GDLY)                                  */
/* ========================================================================== */

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  shortName: varchar("short_name", { length: 30 }),
  logoUrl: text("logo_url"),
  primaryColor: varchar("primary_color", { length: 7 }),
  secondaryColor: varchar("secondary_color", { length: 7 }),
  homeStadium: varchar("home_stadium", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/* ========================================================================== */
/*                               Leagues (GDLY)                                */
/* ========================================================================== */

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  season: varchar("season", { length: 10 }).notNull(),
  teamCount: integer("team_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeagueSchema = createInsertSchema(leagues).omit({
  id: true,
  createdAt: true,
});

/* ========================================================================== */
/*                           League Teams (핵심)                               */
/* ========================================================================== */

export const leagueTeams = pgTable("league_teams", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  teamId: integer("team_id").notNull(),

  groupName: varchar("group_name", { length: 20 }),

  played: integer("played").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  draws: integer("draws").notNull().default(0),
  losses: integer("losses").notNull().default(0),

  goalsFor: integer("goals_for").notNull().default(0),
  goalsAgainst: integer("goals_against").notNull().default(0),
  goalDiff: integer("goal_diff").notNull().default(0),
  points: integer("points").notNull().default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeagueTeamSchema = createInsertSchema(leagueTeams).omit({
  id: true,
  played: true,
  wins: true,
  draws: true,
  losses: true,
  goalsFor: true,
  goalsAgainst: true,
  goalDiff: true,
  points: true,
  createdAt: true,
  updatedAt: true,
});

/* ========================================================================== */
/*                                Matches                                      */
/* ========================================================================== */

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  homeTeamId: integer("home_team_id").notNull(),
  awayTeamId: integer("away_team_id").notNull(),
  round: integer("round").notNull(),
  matchDate: timestamp("match_date"),
  status: varchar("status", { length: 20 }).default("scheduled"),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  status: true,
  homeScore: true,
  awayScore: true,
  createdAt: true,
  updatedAt: true,
});

/* ========================================================================== */
/*                               Export Types                                  */
/* ========================================================================== */

export type Team = typeof teams.$inferSelect;
export type League = typeof leagues.$inferSelect;
export type LeagueTeam = typeof leagueTeams.$inferSelect;
export type Match = typeof matches.$inferSelect;
