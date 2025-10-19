import {
  type User,
  type InsertUser,
  type Resume,
  type InsertResume,
  type InterviewSession,
  type InsertInterviewSession,
  type InterviewQuestion,
  type InsertInterviewQuestion,
  type InterviewReport,
  type InsertInterviewReport,
  users,
  resumes,
  interviewSessions,
  interviewQuestions,
  interviewReports,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume>;
  deleteResume(id: string): Promise<void>;

  createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession>;
  getInterviewSession(id: string): Promise<InterviewSession | undefined>;
  getInterviewSessionsByUserId(userId: string): Promise<InterviewSession[]>;
  updateInterviewSession(id: string, updates: Partial<InsertInterviewSession>): Promise<InterviewSession>;
  startInterviewSession(id: string): Promise<InterviewSession>;
  completeInterviewSession(id: string): Promise<InterviewSession>;

  createInterviewQuestion(question: InsertInterviewQuestion): Promise<InterviewQuestion>;
  getInterviewQuestion(id: string): Promise<InterviewQuestion | undefined>;
  getInterviewQuestionsBySessionId(sessionId: string): Promise<InterviewQuestion[]>;
  updateInterviewQuestion(id: string, updates: Partial<InsertInterviewQuestion>): Promise<InterviewQuestion>;

  createInterviewReport(report: InsertInterviewReport): Promise<InterviewReport>;
  getInterviewReport(id: string): Promise<InterviewReport | undefined>;
  getInterviewReportBySessionId(sessionId: string): Promise<InterviewReport | undefined>;
}

export class DbStorage implements IStorage {
  private db;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const result = await this.db.insert(resumes).values(insertResume).returning();
    return result[0];
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const result = await this.db.select().from(resumes).where(eq(resumes.id, id));
    return result[0];
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return await this.db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));
  }

  async updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume> {
    const result = await this.db
      .update(resumes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error("Resume not found");
    }
    return result[0];
  }

  async deleteResume(id: string): Promise<void> {
    await this.db.delete(resumes).where(eq(resumes.id, id));
  }

  async createInterviewSession(insertSession: InsertInterviewSession): Promise<InterviewSession> {
    const result = await this.db.insert(interviewSessions).values(insertSession).returning();
    return result[0];
  }

  async getInterviewSession(id: string): Promise<InterviewSession | undefined> {
    const result = await this.db.select().from(interviewSessions).where(eq(interviewSessions.id, id));
    return result[0];
  }

  async getInterviewSessionsByUserId(userId: string): Promise<InterviewSession[]> {
    return await this.db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, userId))
      .orderBy(desc(interviewSessions.createdAt));
  }

  async updateInterviewSession(id: string, updates: Partial<InsertInterviewSession>): Promise<InterviewSession> {
    const result = await this.db
      .update(interviewSessions)
      .set(updates)
      .where(eq(interviewSessions.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error("Interview session not found");
    }
    return result[0];
  }

  async startInterviewSession(id: string): Promise<InterviewSession> {
    const result = await this.db
      .update(interviewSessions)
      .set({ status: "in_progress", startedAt: new Date() })
      .where(eq(interviewSessions.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error("Interview session not found");
    }
    return result[0];
  }

  async completeInterviewSession(id: string): Promise<InterviewSession> {
    const result = await this.db
      .update(interviewSessions)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(interviewSessions.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error("Interview session not found");
    }
    return result[0];
  }

  async createInterviewQuestion(insertQuestion: InsertInterviewQuestion): Promise<InterviewQuestion> {
    const result = await this.db.insert(interviewQuestions).values(insertQuestion).returning();
    return result[0];
  }

  async getInterviewQuestion(id: string): Promise<InterviewQuestion | undefined> {
    const result = await this.db.select().from(interviewQuestions).where(eq(interviewQuestions.id, id));
    return result[0];
  }

  async getInterviewQuestionsBySessionId(sessionId: string): Promise<InterviewQuestion[]> {
    return await this.db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, sessionId))
      .orderBy(interviewQuestions.order);
  }

  async updateInterviewQuestion(id: string, updates: Partial<InsertInterviewQuestion>): Promise<InterviewQuestion> {
    const result = await this.db
      .update(interviewQuestions)
      .set(updates)
      .where(eq(interviewQuestions.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error("Interview question not found");
    }
    return result[0];
  }

  async createInterviewReport(insertReport: InsertInterviewReport): Promise<InterviewReport> {
    const result = await this.db.insert(interviewReports).values(insertReport).returning();
    return result[0];
  }

  async getInterviewReport(id: string): Promise<InterviewReport | undefined> {
    const result = await this.db.select().from(interviewReports).where(eq(interviewReports.id, id));
    return result[0];
  }

  async getInterviewReportBySessionId(sessionId: string): Promise<InterviewReport | undefined> {
    const result = await this.db.select().from(interviewReports).where(eq(interviewReports.sessionId, sessionId));
    return result[0];
  }
}

export const storage = new DbStorage();
