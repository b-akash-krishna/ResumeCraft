# ATS-Optimized Resume Builder & AI Mock Interview Platform

## Project Overview
A comprehensive web platform for building ATS-optimized resumes and conducting AI-powered mock interviews. Built with React, TailwindCSS, Express, PostgreSQL, and OpenAI integration.

## Current Status
✅ **Backend Fully Implemented** - Complete RESTful API with AI integration
✅ **Database Setup** - PostgreSQL with Drizzle ORM
✅ **AI Integration** - OpenAI GPT-5 for resume optimization and interview evaluation
✅ **Authentication** - User registration and login with bcrypt password hashing

## Architecture

### Backend (Complete)
- **Framework**: Express.js on Node.js 20
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **AI Services**: OpenAI GPT-5 integration
- **Authentication**: bcrypt password hashing
- **Validation**: Zod schemas with drizzle-zod

### Frontend (Needs Implementation)
- **Framework**: React with Vite
- **Routing**: Wouter
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation

## Key Features Implemented

### Resume Management
- ✅ Create, read, update, delete resumes
- ✅ Structured JSON resume content
- ✅ Multiple resume templates (modern, classic)
- ✅ LaTeX export for PDF generation

### AI-Powered Resume Features
- ✅ ATS compatibility scoring with keyword analysis
- ✅ AI-powered resume optimization suggestions
- ✅ Section-by-section content improvement
- ✅ Job description matching

### Mock Interview System
- ✅ Interview session management (create, start, complete)
- ✅ AI-generated interview questions (behavioral, technical, situational)
- ✅ Real-time answer evaluation with AI feedback
- ✅ Comprehensive performance reports with scores and recommendations

### Authentication
- ✅ User registration with password hashing
- ✅ User login with credential validation
- ✅ User profile retrieval

## Database Schema

### Tables
1. **users** - User accounts with hashed passwords
2. **resumes** - Resume data with structured JSON content
3. **interview_sessions** - Interview session tracking
4. **interview_questions** - Generated questions with answers and scores
5. **interview_reports** - Comprehensive performance analytics

## API Endpoints

See `API_DOCUMENTATION.md` for complete API reference.

### Main Endpoint Categories
- `/api/auth/*` - Authentication (register, login, profile)
- `/api/resumes/*` - Resume CRUD operations
- `/api/resumes/:id/analyze` - ATS scoring
- `/api/resumes/:id/optimize` - AI optimization
- `/api/resumes/:id/latex` - LaTeX export
- `/api/interviews/*` - Interview session management
- `/api/interviews/:id/generate-questions` - AI question generation
- `/api/interviews/questions/:id/answer` - Answer submission with AI evaluation
- `/api/interviews/:id/report` - Performance report generation

## Technology Stack

### Backend
- Express.js 4.x
- PostgreSQL (Neon Serverless)
- Drizzle ORM
- OpenAI Node SDK (GPT-5)
- bcrypt for password hashing
- Zod for validation

### Frontend (To Be Implemented)
- React 18
- Vite 5
- TailwindCSS 4
- shadcn/ui components
- TanStack Query v5
- Wouter for routing
- React Hook Form

## Development Commands

```bash
# Start development server (runs Express + Vite)
npm run dev

# Push database schema changes
npm run db:push

# Force push schema (if data loss warning)
npm run db:push --force

# Install new packages
# Use packager_tool instead of npm install directly
```

## Environment Variables

Required secrets (configured in Replit):
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database credentials

## Recent Changes

### October 19, 2025
- ✅ Replaced in-memory storage with PostgreSQL database using Drizzle ORM
- ✅ Created OpenAI service with GPT-5 integration for:
  - Resume ATS analysis and scoring
  - Resume content optimization
  - Interview question generation
  - Answer evaluation and feedback
  - Performance report generation
- ✅ Implemented complete RESTful API with 20+ endpoints
- ✅ Added bcrypt password hashing for authentication
- ✅ Created LaTeX generation service for resume export
- ✅ Comprehensive error handling and validation

## Next Steps (Frontend Development)

1. **Authentication UI**
   - Login/register pages
   - User session management
   - Protected routes

2. **Resume Builder**
   - Resume creation wizard
   - Rich text editing for resume sections
   - Real-time ATS scoring display
   - AI optimization interface
   - Template preview
   - LaTeX/PDF export

3. **Mock Interview Interface**
   - Interview setup page
   - Question display with timer
   - Audio recording/transcription
   - Real-time AI feedback
   - Performance dashboard
   - Historical analytics

4. **User Dashboard**
   - Resume library
   - Interview history
   - Analytics and insights
   - Settings and preferences

## File Structure

```
server/
  ├── index.ts           # Express app initialization
  ├── routes.ts          # API route handlers (COMPLETE)
  ├── storage.ts         # Database storage layer (COMPLETE)
  ├── openai-service.ts  # OpenAI integration (COMPLETE)
  └── latex-service.ts   # LaTeX generation (COMPLETE)

shared/
  └── schema.ts          # Shared data models and Zod schemas

client/src/
  ├── App.tsx            # React app entry point
  ├── pages/             # Route pages (TO BE IMPLEMENTED)
  ├── components/        # React components (TO BE IMPLEMENTED)
  └── lib/               # Utilities and helpers
```

## AI Integration Details

### OpenAI Service Features

1. **Resume ATS Analysis**
   - Analyzes resume for keyword optimization
   - Provides ATS compatibility score (0-100)
   - Identifies strengths and weaknesses
   - Suggests specific improvements

2. **Resume Optimization**
   - Rewrites content for better impact
   - Adds action verbs and quantifiable metrics
   - Optimizes for target job roles
   - Maintains professional tone

3. **Interview Question Generation**
   - Creates role-specific questions
   - Supports behavioral, technical, and situational types
   - Tailored to candidate's experience
   - Challenging but fair difficulty

4. **Answer Evaluation**
   - Scores answers on clarity, relevance, and depth
   - Identifies key strengths in response
   - Provides specific areas for improvement
   - Offers constructive feedback

5. **Performance Reporting**
   - Analyzes overall interview performance
   - Calculates confidence, grammar, and relevance scores
   - Generates actionable recommendations
   - Comprehensive summary with insights

## Notes

- All AI features use OpenAI's GPT-5 model (latest as of August 2025)
- Database uses PostgreSQL with automatic UUID generation
- Password hashing uses bcrypt with salt rounds = 10
- LaTeX templates support modern and classic styles
- All API routes include proper error handling and validation
