import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  atsScore: integer("ats_score").notNull().default(0),
  template: text("template").notNull().default("modern"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const resumeContentSchema = z.object({
  basics: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    summary: z.string(),
  }),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
  })),
  skills: z.array(z.string()),
  projects: z.array(z.object({
    name: z.string(),
    technologies: z.string(),
    description: z.string(),
  })).optional(),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    year: z.string(),
  })).optional(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  content: resumeContentSchema,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
export type ResumeContent = z.infer<typeof resumeContentSchema>;

export const interviewSessions = pgTable("interview_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  jobRole: text("job_role").notNull(),
  questionType: text("question_type").notNull(),
  status: text("status").notNull().default("setup"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInterviewSessionSchema = createInsertSchema(interviewSessions).omit({
  id: true,
  createdAt: true,
  startedAt: true,
  completedAt: true,
});

export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;
export type InterviewSession = typeof interviewSessions.$inferSelect;

export const interviewQuestions = pgTable("interview_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  questionText: text("question_text").notNull(),
  answer: text("answer"),
  score: integer("score"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInterviewQuestionSchema = createInsertSchema(interviewQuestions).omit({
  id: true,
  createdAt: true,
});

export type InsertInterviewQuestion = z.infer<typeof insertInterviewQuestionSchema>;
export type InterviewQuestion = typeof interviewQuestions.$inferSelect;

export const interviewReports = pgTable("interview_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().unique(),
  confidenceScore: integer("confidence_score").notNull(),
  grammarScore: integer("grammar_score").notNull(),
  relevanceScore: integer("relevance_score").notNull(),
  overallScore: integer("overall_score").notNull(),
  feedback: jsonb("feedback").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reportFeedbackSchema = z.object({
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  summary: z.string(),
});

export const insertInterviewReportSchema = createInsertSchema(interviewReports).omit({
  id: true,
  createdAt: true,
}).extend({
  feedback: reportFeedbackSchema,
});

export type InsertInterviewReport = z.infer<typeof insertInterviewReportSchema>;
export type InterviewReport = typeof interviewReports.$inferSelect;
export type ReportFeedback = z.infer<typeof reportFeedbackSchema>;
