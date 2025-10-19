# ATS Resume Builder & Mock Interview Platform - Backend API Documentation

## Overview
Complete backend implementation with PostgreSQL database, OpenAI integration for AI-powered features, and RESTful APIs for resume management, ATS scoring, optimization, and mock interviews.

## Base URL
All API endpoints are prefixed with `/api`

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "string"
}
```

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "string"
}
```

### GET /api/auth/me/:userId
Get user information by ID.

**Response:**
```json
{
  "id": "uuid",
  "username": "string"
}
```

## Resume Management Endpoints

### POST /api/resumes
Create a new resume.

**Request Body:**
```json
{
  "userId": "uuid",
  "title": "string",
  "content": {
    "basics": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "summary": "string"
    },
    "experience": [
      {
        "company": "string",
        "position": "string",
        "startDate": "string",
        "endDate": "string (optional)",
        "description": "string"
      }
    ],
    "skills": ["string"],
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "year": "string"
      }
    ],
    "projects": [
      {
        "name": "string",
        "technologies": "string",
        "description": "string"
      }
    ]
  },
  "atsScore": 0,
  "template": "modern"
}
```

**Response:** Resume object

### GET /api/resumes/user/:userId
Get all resumes for a specific user.

**Response:** Array of resume objects

### GET /api/resumes/:id
Get a specific resume by ID.

**Response:** Resume object

### PATCH /api/resumes/:id
Update a resume.

**Request Body:** Partial resume object

**Response:** Updated resume object

### DELETE /api/resumes/:id
Delete a resume.

**Response:**
```json
{
  "success": true
}
```

## AI-Powered Resume Features

### POST /api/resumes/:id/analyze
Analyze resume for ATS compatibility using OpenAI.

**Request Body:**
```json
{
  "jobDescription": "string (optional)"
}
```

**Response:**
```json
{
  "score": 85,
  "keywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}
```

### POST /api/resumes/:id/optimize
Get AI-powered optimization suggestions for resume content.

**Request Body:**
```json
{
  "targetRole": "string (optional)"
}
```

**Response:**
```json
{
  "optimizations": [
    {
      "section": "summary" | "experience-0" | "experience-1",
      "original": "original text",
      "optimized": "optimized text",
      "improvement": "explanation"
    }
  ]
}
```

### POST /api/resumes/:id/apply-optimization
Apply an optimization to the resume.

**Request Body:**
```json
{
  "section": "summary" | "experience-0",
  "optimizedText": "string"
}
```

**Response:** Updated resume object

### GET /api/resumes/:id/latex
Export resume as LaTeX file.

**Response:** LaTeX file download (.tex)

## Interview Session Management

### POST /api/interviews
Create a new interview session.

**Request Body:**
```json
{
  "userId": "uuid",
  "jobRole": "string",
  "questionType": "behavioral" | "technical" | "situational",
  "status": "setup"
}
```

**Response:** Interview session object

### GET /api/interviews/user/:userId
Get all interview sessions for a user.

**Response:** Array of interview session objects

### GET /api/interviews/:id
Get a specific interview session.

**Response:** Interview session object

### PATCH /api/interviews/:id
Update interview session details.

**Request Body:** Partial interview session object

**Response:** Updated interview session object

## AI-Powered Interview Features

### POST /api/interviews/:id/generate-questions
Generate interview questions using OpenAI based on job role and resume.

**Request Body:**
```json
{
  "resumeContent": {
    // Resume content object (optional)
  }
}
```

**Response:**
```json
{
  "questions": [
    {
      "id": "uuid",
      "sessionId": "uuid",
      "questionText": "string",
      "answer": null,
      "score": null,
      "order": 0
    }
  ]
}
```

### GET /api/interviews/:id/questions
Get all questions for an interview session.

**Response:** Array of interview question objects

### POST /api/interviews/:id/start
Start an interview session (sets status to "in_progress").

**Response:** Updated interview session object

### POST /api/interviews/:id/complete
Complete an interview session (sets status to "completed").

**Response:** Updated interview session object

### POST /api/interviews/questions/:questionId/answer
Submit an answer to an interview question and get AI evaluation.

**Request Body:**
```json
{
  "answer": "string",
  "jobRole": "string"
}
```

**Response:**
```json
{
  "question": {
    // Updated question object with answer and score
  },
  "evaluation": {
    "score": 85,
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"],
    "feedback": "detailed feedback"
  }
}
```

### POST /api/interviews/:id/report
Generate comprehensive interview performance report using AI.

**Response:**
```json
{
  "id": "uuid",
  "sessionId": "uuid",
  "confidenceScore": 85,
  "grammarScore": 90,
  "relevanceScore": 80,
  "overallScore": 85,
  "feedback": {
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"],
    "summary": "detailed summary with recommendations"
  }
}
```

### GET /api/interviews/:id/report
Get existing interview report for a session.

**Response:** Interview report object

## AI Services

The backend integrates with OpenAI's GPT-5 model for:

1. **ATS Resume Analysis**: Analyzes resumes for ATS compatibility, identifies keywords, and provides actionable suggestions
2. **Resume Optimization**: Rewrites resume content to be more impactful, action-oriented, and ATS-friendly
3. **Interview Question Generation**: Creates role-specific interview questions (behavioral, technical, or situational)
4. **Answer Evaluation**: Evaluates interview answers for clarity, relevance, depth, and structure
5. **Performance Reporting**: Generates comprehensive interview performance reports with actionable feedback

## Data Models

### User
- id: UUID (primary key)
- username: string (unique)
- password: string (hashed with bcrypt)

### Resume
- id: UUID (primary key)
- userId: UUID (foreign key)
- title: string
- content: JSON (structured resume data)
- atsScore: integer (0-100)
- template: string (modern, classic)
- createdAt: timestamp
- updatedAt: timestamp

### Interview Session
- id: UUID (primary key)
- userId: UUID (foreign key)
- jobRole: string
- questionType: string (behavioral, technical, situational)
- status: string (setup, in_progress, completed)
- startedAt: timestamp (nullable)
- completedAt: timestamp (nullable)
- createdAt: timestamp

### Interview Question
- id: UUID (primary key)
- sessionId: UUID (foreign key)
- questionText: string
- answer: string (nullable)
- score: integer (nullable, 0-100)
- order: integer
- createdAt: timestamp

### Interview Report
- id: UUID (primary key)
- sessionId: UUID (foreign key, unique)
- confidenceScore: integer (0-100)
- grammarScore: integer (0-100)
- relevanceScore: integer (0-100)
- overallScore: integer (0-100)
- feedback: JSON (strengths, improvements, summary)
- createdAt: timestamp

## Technology Stack

- **Backend Framework**: Express.js
- **Database**: PostgreSQL (via Neon)
- **ORM**: Drizzle ORM
- **AI Integration**: OpenAI GPT-5
- **Authentication**: bcrypt for password hashing
- **Validation**: Zod schemas
- **LaTeX Generation**: Custom service for resume export

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `PORT`: Server port (default: 5000)

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad request (validation errors)
- 401: Unauthorized (invalid credentials)
- 404: Not found
- 500: Internal server error

Error responses follow this format:
```json
{
  "message": "Error description"
}
```
