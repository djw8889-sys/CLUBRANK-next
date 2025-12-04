import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";

/* -------------------------------------------------------------------------- */
/*                                  LEAGUES                                   */
/* -------------------------------------------------------------------------- */

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  season: varchar("season", { length: 10 }).notNull(),
  teamCount: integer("team_count").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeagueSchema = createInsertSchema(leagues).omit({
  id: true,
  createdAt: true,
});

/* -------------------------------------------------------------------------- */
/*                               LEAGUE TEAMS                                 */
/* -------------------------------------------------------------------------- */

export const leagueTeams = pgTable("league_teams", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  clubId: integer("club_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeagueTeamSchema = createInsertSchema(leagueTeams).omit({
  id: true,
  createdAt: true,
});
