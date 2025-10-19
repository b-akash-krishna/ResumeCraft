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
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumes: Map<string, Resume>;
  private interviewSessions: Map<string, InterviewSession>;
  private interviewQuestions: Map<string, InterviewQuestion>;
  private interviewReports: Map<string, InterviewReport>;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.interviewSessions = new Map();
    this.interviewQuestions = new Map();
    this.interviewReports = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const now = new Date();
    const resume: Resume = {
      id,
      userId: insertResume.userId,
      title: insertResume.title,
      content: insertResume.content as any,
      atsScore: insertResume.atsScore ?? 0,
      template: insertResume.template ?? "modern",
      createdAt: now,
      updatedAt: now,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values())
      .filter((resume) => resume.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume> {
    const resume = this.resumes.get(id);
    if (!resume) {
      throw new Error("Resume not found");
    }
    const updated: Resume = {
      ...resume,
      ...updates,
      content: updates.content ? (updates.content as any) : resume.content,
      updatedAt: new Date(),
    };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: string): Promise<void> {
    this.resumes.delete(id);
  }

  async createInterviewSession(insertSession: InsertInterviewSession): Promise<InterviewSession> {
    const id = randomUUID();
    const session: InterviewSession = {
      id,
      userId: insertSession.userId,
      jobRole: insertSession.jobRole,
      questionType: insertSession.questionType,
      status: insertSession.status ?? "setup",
      startedAt: null,
      completedAt: null,
      createdAt: new Date(),
    };
    this.interviewSessions.set(id, session);
    return session;
  }

  async getInterviewSession(id: string): Promise<InterviewSession | undefined> {
    return this.interviewSessions.get(id);
  }

  async getInterviewSessionsByUserId(userId: string): Promise<InterviewSession[]> {
    return Array.from(this.interviewSessions.values())
      .filter((session) => session.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateInterviewSession(id: string, updates: Partial<InsertInterviewSession>): Promise<InterviewSession> {
    const session = this.interviewSessions.get(id);
    if (!session) {
      throw new Error("Interview session not found");
    }
    const updated: InterviewSession = {
      ...session,
      ...updates,
    };
    this.interviewSessions.set(id, updated);
    return updated;
  }

  async startInterviewSession(id: string): Promise<InterviewSession> {
    const session = this.interviewSessions.get(id);
    if (!session) {
      throw new Error("Interview session not found");
    }
    const updated: InterviewSession = {
      ...session,
      status: "in_progress",
      startedAt: new Date(),
    };
    this.interviewSessions.set(id, updated);
    return updated;
  }

  async completeInterviewSession(id: string): Promise<InterviewSession> {
    const session = this.interviewSessions.get(id);
    if (!session) {
      throw new Error("Interview session not found");
    }
    const updated: InterviewSession = {
      ...session,
      status: "completed",
      completedAt: new Date(),
    };
    this.interviewSessions.set(id, updated);
    return updated;
  }

  async createInterviewQuestion(insertQuestion: InsertInterviewQuestion): Promise<InterviewQuestion> {
    const id = randomUUID();
    const question: InterviewQuestion = {
      id,
      sessionId: insertQuestion.sessionId,
      questionText: insertQuestion.questionText,
      answer: insertQuestion.answer ?? null,
      score: insertQuestion.score ?? null,
      order: insertQuestion.order,
      createdAt: new Date(),
    };
    this.interviewQuestions.set(id, question);
    return question;
  }

  async getInterviewQuestion(id: string): Promise<InterviewQuestion | undefined> {
    return this.interviewQuestions.get(id);
  }

  async getInterviewQuestionsBySessionId(sessionId: string): Promise<InterviewQuestion[]> {
    return Array.from(this.interviewQuestions.values())
      .filter((question) => question.sessionId === sessionId)
      .sort((a, b) => a.order - b.order);
  }

  async updateInterviewQuestion(id: string, updates: Partial<InsertInterviewQuestion>): Promise<InterviewQuestion> {
    const question = this.interviewQuestions.get(id);
    if (!question) {
      throw new Error("Interview question not found");
    }
    const updated: InterviewQuestion = {
      ...question,
      ...updates,
    };
    this.interviewQuestions.set(id, updated);
    return updated;
  }

  async createInterviewReport(insertReport: InsertInterviewReport): Promise<InterviewReport> {
    const id = randomUUID();
    const report: InterviewReport = {
      id,
      ...insertReport,
      feedback: insertReport.feedback as any,
      createdAt: new Date(),
    };
    this.interviewReports.set(id, report);
    return report;
  }

  async getInterviewReport(id: string): Promise<InterviewReport | undefined> {
    return this.interviewReports.get(id);
  }

  async getInterviewReportBySessionId(sessionId: string): Promise<InterviewReport | undefined> {
    return Array.from(this.interviewReports.values()).find(
      (report) => report.sessionId === sessionId,
    );
  }
}

export const storage = new MemStorage();
