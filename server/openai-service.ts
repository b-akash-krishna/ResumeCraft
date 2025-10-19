import OpenAI from "openai";
import type { ResumeContent } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ATSAnalysisResult {
  score: number;
  keywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface OptimizedContent {
  section: string;
  original: string;
  optimized: string;
  improvement: string;
}

export interface InterviewEvaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
}

export class OpenAIService {
  async analyzeResumeATS(content: ResumeContent, jobDescription?: string): Promise<ATSAnalysisResult> {
    const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility${jobDescription ? ` for this job: ${jobDescription}` : ''}. 

Resume:
Name: ${content.basics.name}
Email: ${content.basics.email}
Summary: ${content.basics.summary}

Experience:
${content.experience.map(exp => `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'}): ${exp.description}`).join('\n')}

Skills: ${content.skills.join(', ')}

${content.education ? `Education:\n${content.education.map(edu => `- ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n')}` : ''}

Provide a comprehensive ATS analysis with:
1. Overall ATS compatibility score (0-100)
2. Key keywords found and missing
3. Specific suggestions for improvement
4. Resume strengths
5. Resume weaknesses

Respond in JSON format with this structure:
{
  "score": number,
  "keywords": string[],
  "suggestions": string[],
  "strengths": string[],
  "weaknesses": string[]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS (Applicant Tracking System) analyzer and career coach. Provide detailed, actionable feedback to help candidates optimize their resumes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(aiResponse);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid AI response format");
    }

    return {
      score: parsed.score || 0,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    };
  }

  async optimizeResumeContent(content: ResumeContent, targetRole?: string): Promise<OptimizedContent[]> {
    const prompt = `Optimize this resume ${targetRole ? `for a ${targetRole} role` : 'for better ATS compatibility and impact'}:

Summary: ${content.basics.summary}

Experience:
${content.experience.map(exp => `${exp.position} at ${exp.company}: ${exp.description}`).join('\n\n')}

Provide specific optimizations for the summary and each experience description. Make them:
- More action-oriented with strong verbs
- Quantifiable with metrics where possible
- ATS-friendly with relevant keywords
- Impactful and concise

Respond in JSON format with an array of optimizations:
[
  {
    "section": "summary" or "experience-0", "experience-1", etc,
    "original": "original text",
    "optimized": "optimized text",
    "improvement": "explanation of what was improved"
  }
]`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer who specializes in creating ATS-optimized, impact-driven resume content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(aiResponse);
    return Array.isArray(result.optimizations) ? result.optimizations : [];
  }

  async generateInterviewQuestions(jobRole: string, questionType: string, resumeContent?: ResumeContent): Promise<string[]> {
    const prompt = `Generate 5 ${questionType} interview questions for a ${jobRole} position${resumeContent ? ` based on this candidate's background:\n\nExperience:\n${resumeContent.experience.map(exp => `- ${exp.position} at ${exp.company}`).join('\n')}\n\nSkills: ${resumeContent.skills.join(', ')}` : ''}.

Question types:
- behavioral: Questions about past experiences and situations (e.g., "Tell me about a time when...")
- technical: Role-specific technical questions and problem-solving scenarios
- situational: Hypothetical scenarios to assess decision-making

Generate challenging but fair questions that assess key competencies for the role.

Respond in JSON format:
{
  "questions": ["question 1", "question 2", ...]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an experienced technical recruiter and interviewer who creates insightful interview questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(aiResponse);
    return Array.isArray(result.questions) ? result.questions : [];
  }

  async evaluateInterviewAnswer(question: string, answer: string, jobRole: string): Promise<InterviewEvaluation> {
    const prompt = `Evaluate this interview answer for a ${jobRole} position:

Question: ${question}

Answer: ${answer}

Provide:
1. Score (0-100) based on relevance, clarity, depth, and structure
2. Key strengths demonstrated in the answer
3. Areas for improvement
4. Constructive feedback summary

Respond in JSON format:
{
  "score": number,
  "strengths": string[],
  "improvements": string[],
  "feedback": "detailed feedback summary"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach who provides constructive, actionable feedback to help candidates improve their interview performance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(aiResponse);
    return {
      score: parsed.score || 0,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      feedback: parsed.feedback || "",
    };
  }

  async generateInterviewReport(
    jobRole: string,
    questions: Array<{ question: string; answer: string; score: number }>
  ): Promise<{ confidenceScore: number; grammarScore: number; relevanceScore: number; overallScore: number; feedback: { strengths: string[]; improvements: string[]; summary: string } }> {
    const prompt = `Generate a comprehensive interview performance report for a ${jobRole} interview:

Questions and Answers:
${questions.map((q, i) => `
Q${i + 1}: ${q.question}
A${i + 1}: ${q.answer}
Score: ${q.score}/100
`).join('\n')}

Provide an overall assessment with:
1. Confidence Score (0-100): Based on clarity, decisiveness, and communication style
2. Grammar Score (0-100): Language quality, articulation, and professionalism
3. Relevance Score (0-100): How well answers addressed the questions
4. Overall Score (0-100): Weighted average of all factors
5. Key strengths demonstrated
6. Areas for improvement
7. Detailed summary with actionable recommendations

Respond in JSON format:
{
  "confidenceScore": number,
  "grammarScore": number,
  "relevanceScore": number,
  "overallScore": number,
  "feedback": {
    "strengths": string[],
    "improvements": string[],
    "summary": "detailed summary with recommendations"
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach and evaluator who provides comprehensive, actionable feedback to help candidates improve."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(aiResponse);
    return {
      confidenceScore: parsed.confidenceScore || 0,
      grammarScore: parsed.grammarScore || 0,
      relevanceScore: parsed.relevanceScore || 0,
      overallScore: parsed.overallScore || 0,
      feedback: {
        strengths: Array.isArray(parsed.feedback?.strengths) ? parsed.feedback.strengths : [],
        improvements: Array.isArray(parsed.feedback?.improvements) ? parsed.feedback.improvements : [],
        summary: parsed.feedback?.summary || "",
      },
    };
  }
}

export const openaiService = new OpenAIService();
