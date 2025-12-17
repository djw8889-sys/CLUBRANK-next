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

/* -------------------------------------------------------------------------- */
/*                               Clubs Table                                   */
/*            (기존 테니스/클럽 관리용 – 그대로 유지)                          */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                             Club Members Table                              */
/* -------------------------------------------------------------------------- */

export const clubMembers = pgTable("club_members", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  clubId: integer("club_id").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClubMemberSchema = createInsertSchema(clubMembers)
  .omit({
    id: true,
    joinedAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    role: z.enum(["owner", "admin", "member"]).default("member"),
  });

/* -------------------------------------------------------------------------- */
/*                              Club Matches Table                             */
/* -------------------------------------------------------------------------- */

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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClubMatchSchema = createInsertSchema(clubMatches)
  .omit({
    id: true,
    completedAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    status: z
      .enum(["pending", "accepted", "rejected", "completed", "cancelled"])
      .default("pending"),
    matchType: z.enum(["friendly", "tournament", "league"]).default("friendly"),
    gameFormat: z
      .enum(["mens_singles", "womens_singles", "mens_doubles", "womens_doubles", "mixed_doubles"])
      .default("mens_doubles"),
  });

/* -------------------------------------------------------------------------- */
/*                        User Ranking Points Table                            */
/* -------------------------------------------------------------------------- */

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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserRankingPointsSchema = createInsertSchema(
  userRankingPoints
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/* -------------------------------------------------------------------------- */
/*                       Match Participants Table                              */
/* -------------------------------------------------------------------------- */

export const matchParticipants = pgTable("match_participants", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  team: varchar("team", { length: 20 }).notNull(),
  partnerId: varchar("partner_id", { length: 255 }),
  rpBefore: integer("rp_before").notNull(),
  rpAfter: integer("rp_after").notNull(),
  rpChange: integer("rp_change").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMatchParticipantsSchema = createInsertSchema(
  matchParticipants
).omit({ id: true, createdAt: true });

/* -------------------------------------------------------------------------- */
/*                              Club Dues Table                                */
/* -------------------------------------------------------------------------- */

export const clubDues = pgTable("club_dues", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  amount: integer("amount").notNull(),
  dueMonth: varchar("due_month", { length: 7 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClubDuesSchema = createInsertSchema(clubDues)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    status: z.enum(["pending", "paid", "overdue"]).default("pending"),
  });

/* -------------------------------------------------------------------------- */
/*                         Club Attendance Table                               */
/* -------------------------------------------------------------------------- */

export const clubAttendance = pgTable("club_attendance", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  eventDate: timestamp("event_date").notNull(),
  eventName: varchar("event_name", { length: 200 }).notNull(),
  status: varchar("status", { length: 20 }).default("absent"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClubAttendanceSchema = createInsertSchema(clubAttendance)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    status: z.enum(["present", "absent", "late", "excused"]).default("absent"),
    eventDate: z.coerce.date(),
  });

/* -------------------------------------------------------------------------- */
/*                             Club Meetings Table                             */
/* -------------------------------------------------------------------------- */

export const clubMeetings = pgTable("club_meetings", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  meetingDate: timestamp("meeting_date").notNull(),
  location: varchar("location", { length: 200 }),
  maxParticipants: integer("max_participants"),
  participants: text("participants").array(),
  status: varchar("status", { length: 20 }).default("scheduled"),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClubMeetingsSchema = createInsertSchema(clubMeetings)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
    meetingDate: z.coerce.date(),
  });

/* ========================================================================== */
/*                    GDLY 전용 – Teams / Leagues / Matches                   */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/*                                   Teams                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                   Leagues                                   */
/* -------------------------------------------------------------------------- */

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  season: varchar("season", { length: 10 }).notNull(), // 예: "2025", "2024-25"
  // teamCount 컬럼: 실제 DB 컬럼명은 team_count
  teamCount: integer("team_count"),
  createdAt: timestamp("created_at").defaultNow(),
  // 만약 DB에 updated_at 컬럼이 있다면 주석을 해제하세요.
  // updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeagueSchema = createInsertSchema(leagues).omit({
  id: true,
  createdAt: true,
  // updatedAt: true,
});

/* -------------------------------------------------------------------------- */
/*                                League Teams                                 */
/* -------------------------------------------------------------------------- */

export const leagueTeams = pgTable("league_teams", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  teamId: integer("team_id").notNull(),
  groupName: varchar("group_name", { length: 20 }),
  // 순위 관련 스탯
  played: integer("played").default(0),
  wins: integer("wins").default(0),
  draws: integer("draws").default(0),
  losses: integer("losses").default(0),
  goalsFor: integer("goals_for").default(0),
  goalsAgainst: integer("goals_against").default(0),
  goalDiff: integer("goal_diff").default(0),
  points: integer("points").default(0),
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

/* -------------------------------------------------------------------------- */
/*                                   Matches                                   */
/* -------------------------------------------------------------------------- */

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  homeTeamId: integer("home_team_id").notNull(),
  awayTeamId: integer("away_team_id").notNull(),
  round: integer("round").notNull(),
  matchDate: timestamp("match_date"),
  status: varchar("status", { length: 20 }).notNull().default("scheduled"), // scheduled | played | cancelled
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

/* -------------------------------------------------------------------------- */
/*                                Match Goals                                  */
/* -------------------------------------------------------------------------- */

export const matchGoals = pgTable("match_goals", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  teamId: integer("team_id").notNull(),
  scorerName: varchar("scorer_name", { length: 100 }).notNull(),
  assistName: varchar("assist_name", { length: 100 }),
  minute: integer("minute"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMatchGoalSchema = createInsertSchema(matchGoals).omit({
  id: true,
  createdAt: true,
});

/* -------------------------------------------------------------------------- */
/*                             Match MVP Votes                                 */
/* -------------------------------------------------------------------------- */

export const matchMvpVotes = pgTable("match_mvp_votes", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  voterTeamId: integer("voter_team_id").notNull(),
  playerName: varchar("player_name", { length: 100 }).notNull(),
  votes: integer("votes").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMatchMvpVoteSchema = createInsertSchema(matchMvpVotes).omit({
  id: true,
  votes: true,
  createdAt: true,
});

/* -------------------------------------------------------------------------- */
/*                           League MVP Results                                */
/* -------------------------------------------------------------------------- */

export const leagueMvpResults = pgTable("league_mvp_results", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  playerName: varchar("player_name", { length: 100 }).notNull(),
  teamId: integer("team_id").notNull(),
  totalMvpVotes: integer("total_mvp_votes").default(0),
  totalGoals: integer("total_goals").default(0),
  totalAssists: integer("total_assists").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeagueMvpResultSchema = createInsertSchema(
  leagueMvpResults
).omit({
  id: true,
  totalMvpVotes: true,
  totalGoals: true,
  totalAssists: true,
  createdAt: true,
});

/* -------------------------------------------------------------------------- */
/*                                Export Types                                 */
/* -------------------------------------------------------------------------- */

export type Club = typeof clubs.$inferSelect;
export type ClubMember = typeof clubMembers.$inferSelect;
export type ClubMatch = typeof clubMatches.$inferSelect;
export type UserRankingPoints = typeof userRankingPoints.$inferSelect;
export type MatchParticipants = typeof matchParticipants.$inferSelect;
export type ClubDues = typeof clubDues.$inferSelect;
export type ClubAttendance = typeof clubAttendance.$inferSelect;
export type ClubMeetings = typeof clubMeetings.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type League = typeof leagues.$inferSelect;
export type LeagueTeam = typeof leagueTeams.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type MatchGoal = typeof matchGoals.$inferSelect;
export type MatchMvpVote = typeof matchMvpVotes.$inferSelect;
export type LeagueMvpResult = typeof leagueMvpResults.$inferSelect;
