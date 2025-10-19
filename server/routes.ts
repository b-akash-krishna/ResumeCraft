import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openaiService } from "./openai-service";
import { latexService } from "./latex-service";
import { authMiddleware, generateToken, type AuthRequest } from "./auth";
import {
  insertUserSchema,
  insertResumeSchema,
  resumeContentSchema,
  insertInterviewSessionSchema,
  insertInterviewQuestionSchema,
  insertInterviewReportSchema,
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        username: data.username,
        password: hashedPassword,
      });

      const token = generateToken(user.id);
      res.json({ id: user.id, username: user.username, token });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(data.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user.id);
      res.json({ id: user.id, username: user.username, token });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      next(error);
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/resumes", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const data = insertResumeSchema.omit({ userId: true }).parse(req.body);
      
      const resume = await storage.createResume({
        ...data,
        userId: req.userId!,
      });
      res.json(resume);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      next(error);
    }
  });

  app.get("/api/resumes", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const resumes = await storage.getResumesByUserId(req.userId!);
      res.json(resumes);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/resumes/:id", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      if (resume.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(resume);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/resumes/:id", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      if (resume.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updates = insertResumeSchema.omit({ userId: true }).partial().parse(req.body);
      const updated = await storage.updateResume(req.params.id, updates);
      res.json(updated);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      next(error);
    }
  });

  app.delete("/api/resumes/:id", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      if (resume.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteResume(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/resumes/:id/analyze", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      if (resume.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const jobDescription = req.body.jobDescription;
      
      try {
        const analysis = await openaiService.analyzeResumeATS(resume.content as any, jobDescription);
        await storage.updateResume(req.params.id, { atsScore: analysis.score });
        res.json(analysis);
      } catch (aiError: any) {
        return res.status(500).json({ message: "AI analysis failed. Please try again." });
      }
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/resumes/:id/optimize", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      if (resume.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const targetRole = req.body.targetRole;
      
      try {
        const optimizations = await openaiService.optimizeResumeContent(resume.content as any, targetRole);
        res.json({ optimizations });
      } catch (aiError: any) {
        return res.status(500).json({ message: "AI optimization failed. Please try again." });
      }
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/resumes/:id/apply-optimization", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      if (resume.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { section, optimizedText } = req.body;
      const content = resume.content as any;

      if (section === "summary") {
        content.basics.summary = optimizedText;
      } else if (section.startsWith("experience-")) {
        const index = parseInt(section.split("-")[1]);
        if (content.experience[index]) {
          content.experience[index].description = optimizedText;
        }
      }

      const updated = await storage.updateResume(req.params.id, { content });
      res.json(updated);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/resumes/:id/latex", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      if (resume.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const latex = latexService.generateLaTeX(resume.content as any, resume.template);
      
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", `attachment; filename="${resume.title}.tex"`);
      res.send(latex);
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/interviews", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const data = insertInterviewSessionSchema.omit({ userId: true }).parse(req.body);
      
      const session = await storage.createInterviewSession({
        ...data,
        userId: req.userId!,
      });
      res.json(session);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      next(error);
    }
  });

  app.get("/api/interviews", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const sessions = await storage.getInterviewSessionsByUserId(req.userId!);
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/interviews/:id", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const session = await storage.getInterviewSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      if (session.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/interviews/:id", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const session = await storage.getInterviewSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      if (session.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updates = insertInterviewSessionSchema.omit({ userId: true }).partial().parse(req.body);
      const updated = await storage.updateInterviewSession(req.params.id, updates);
      res.json(updated);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      next(error);
    }
  });

  app.post("/api/interviews/:id/generate-questions", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const session = await storage.getInterviewSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      if (session.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const resumeContent = req.body.resumeContent;
      
      try {
        const questions = await openaiService.generateInterviewQuestions(
          session.jobRole,
          session.questionType,
          resumeContent
        );

        const createdQuestions = await Promise.all(
          questions.map((questionText, index) =>
            storage.createInterviewQuestion({
              sessionId: session.id,
              questionText,
              order: index,
              answer: null,
              score: null,
            })
          )
        );

        res.json({ questions: createdQuestions });
      } catch (aiError: any) {
        return res.status(500).json({ message: "AI question generation failed. Please try again." });
      }
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/interviews/:id/questions", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const session = await storage.getInterviewSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      if (session.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const questions = await storage.getInterviewQuestionsBySessionId(req.params.id);
      res.json(questions);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/interviews/:id/start", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const session = await storage.getInterviewSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      if (session.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updated = await storage.startInterviewSession(req.params.id);
      res.json(updated);
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/interviews/:id/complete", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const session = await storage.getInterviewSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      if (session.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updated = await storage.completeInterviewSession(req.params.id);
      res.json(updated);
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/interviews/questions/:questionId/answer", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const question = await storage.getInterviewQuestion(req.params.questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      const session = await storage.getInterviewSession(question.sessionId);
      if (!session || session.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { answer, jobRole } = req.body;
      
      try {
        const evaluation = await openaiService.evaluateInterviewAnswer(
          question.questionText,
          answer,
          jobRole
        );

        const updated = await storage.updateInterviewQuestion(req.params.questionId, {
          answer,
          score: evaluation.score,
        });

        res.json({
          question: updated,
          evaluation,
        });
      } catch (aiError: any) {
        return res.status(500).json({ message: "AI evaluation failed. Please try again." });
      }
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/interviews/:id/report", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const session = await storage.getInterviewSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      if (session.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const questions = await storage.getInterviewQuestionsBySessionId(req.params.id);
      
      const answeredQuestions = questions
        .filter(q => q.answer && q.score !== null)
        .map(q => ({
          question: q.questionText,
          answer: q.answer!,
          score: q.score!,
        }));

      if (answeredQuestions.length === 0) {
        return res.status(400).json({ message: "No answered questions found" });
      }

      try {
        const reportData = await openaiService.generateInterviewReport(
          session.jobRole,
          answeredQuestions
        );

        const report = await storage.createInterviewReport({
          sessionId: session.id,
          ...reportData,
        });

        res.json(report);
      } catch (aiError: any) {
        return res.status(500).json({ message: "AI report generation failed. Please try again." });
      }
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/interviews/:id/report", authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const session = await storage.getInterviewSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      if (session.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const report = await storage.getInterviewReportBySessionId(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
