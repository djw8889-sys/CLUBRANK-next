// Database schema for Club Rank - Tennis club management platform
// Supporting both PostgreSQL (Drizzle ORM)

import { pgTable, serial, varchar, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// =============================================================================
// DRIZZLE ORM TABLE DEFINITIONS (PostgreSQL)
// =============================================================================

// Clubs table - Core club information
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
  updatedAt: timestamp("updated_at").defaultNow()
});

// Club Members
export const clubMembers = pgTable("club_members", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  clubId: integer("club_id").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Club Matches
export const clubMatches = pgTable("club_matches", {
  id: serial("id").primaryKey(),
  requestingClubId: integer("requesting_club_id").notNull(),
  receivingClubId: integer("receiving_club_id").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  matchDate: timestamp("match_date"),
  matchLocation: varchar("match_location", { length: 200 }),
  matchType: varchar("match_type", { length: 50 }).default("friendly"),
  gameFormat: varchar("game_format", { length: 30 }).default("mens_doubles"),
  result: varchar("result", { length: 20 }),
  requestingScore: integer("requesting_score").default(0),
  receivingScore: integer("receiving_score").default(0),
  cpChange: integer("cp_change").default(0),
  requestingTeamPlayer1: varchar("requesting_team_player1", { length: 255 }),
  requestingTeamPlayer2: varchar("requesting_team_player2", { length: 255 }),
  receivingTeamPlayer1: varchar("receiving_team_player1", { length: 255 }),
  receivingTeamPlayer2: varchar("receiving_team_player2", { length: 255 }),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// User Ranking Points
export const userRankingPoints = pgTable("user_ranking_points", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  clubId: integer("club_id").notNull(),
  gameFormat: varchar("game_format", { length: 30 }).notNull(),
  rankingPoints: integer("ranking_points").default(1200),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  draws: integer("draws").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Match Participants
export const matchParticipants = pgTable("match_participants", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  team: varchar("team", { length: 20 }).notNull(),
  partnerId: varchar("partner_id", { length: 255 }),
  rpBefore: integer("rp_before").notNull(),
  rpAfter: integer("rp_after").notNull(),
  rpChange: integer("rp_change").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Club Dues
export const clubDues = pgTable("club_dues", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  amount: integer("amount").notNull(),
  dueMonth: varchar("due_month", { length: 7 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
