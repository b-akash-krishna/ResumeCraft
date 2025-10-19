import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResumeCard from "@/components/ResumeCard";
import InterviewHistoryCard from "@/components/InterviewHistoryCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Target, TrendingUp, Plus, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query"; // <--- ADDED IMPORT
import { Skeleton } from "@/components/ui/skeleton"; // <--- ADDED IMPORT

// Define expected data shapes (matching shared/schema.ts and API response)
interface Resume {
  id: string;
  title: string;
  updatedAt: string; 
  atsScore: number;
}

interface InterviewSession {
  id: string;
  jobRole: string;
  createdAt: string; 
  questionType: "technical" | "hr" | "mixed";
  // These fields are missing from the base InterviewSession schema but required for the UI, 
  // so we mock them temporarily until the report data is integrated.
  duration: string;
  overallScore: number;
  score: number;
  date: string;
}

// Helper function to calculate mock average score
const calculateAverageScore = (sessions: InterviewSession[]): number => {
  const sessionsWithScore = sessions.filter(s => s.overallScore !== undefined && s.overallScore !== null);
  if (sessionsWithScore.length === 0) return 0;
  const totalScore = sessionsWithScore.reduce((sum, s) => sum + s.overallScore, 0);
  return Math.round(totalScore / sessionsWithScore.length);
};

// Helper function for UI display
const formatLastEdited = (dateString: string): string => {
    // Uses locale string for simple date display based on the timestamp
    return new Date(dateString).toLocaleDateString();
};


export default function Dashboard() {
  // Fetch Resumes from /api/resumes
  const { 
    data: resumes, 
    isLoading: isLoadingResumes, 
    isError: isErrorResumes 
  } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  // Fetch Interview Sessions from /api/interviews
  const { 
    data: interviews, 
    isLoading: isLoadingInterviews, 
    isError: isErrorInterviews 
  } = useQuery<InterviewSession[]>({
    queryKey: ["/api/interviews"],
  });
  
  const isLoading = isLoadingResumes || isLoadingInterviews;
  const isError = isErrorResumes || isErrorInterviews;
  
  // --- Data Mapping (Including Mocks for Incomplete API Fields) ---

  const mappedResumes: Resume[] = resumes || [];
  
  // Apply mock/placeholder data for InterviewHistoryCard until /reports API is integrated
  const mappedInterviews: InterviewSession[] = (interviews || []).map(session => ({
    ...session,
    date: formatLastEdited(session.createdAt),
    duration: "30 min", // Placeholder: backend API does not return this yet
    // Mocking a score for visualization purposes (will be replaced by report data later)
    overallScore: Math.floor(Math.random() * (95 - 60 + 1)) + 60, 
    score: Math.floor(Math.random() * (95 - 60 + 1)) + 60, 
  })) as InterviewSession[];

  const avgScore = calculateAverageScore(mappedInterviews);

  // --- Loading State UI ---
  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                    </div>
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Skeleton className="aspect-[8.5/11] h-96" />
                        <Skeleton className="aspect-[8.5/11] h-96" />
                        <Skeleton className="aspect-[8.5/11] h-96" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
  }
  
  // --- Error State UI ---
  if (isError) {
      return (
          <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 py-8 text-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                      <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                      <h1 className="text-3xl font-bold">Error Loading Data</h1>
                      <p className="text-lg text-muted-foreground">
                        Could not fetch data. This may mean you are not authenticated or the backend is unavailable.
                      </p>
                       <Link href="/login">
                           <Button data-testid="button-go-login">Go to Login</Button>
                       </Link>
                  </div>
              </main>
              <Footer />
          </div>
      );
  }

  // --- Success/Default UI ---
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Track your progress and manage your resumes and interviews
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Resumes</p>
                    <p className="text-2xl font-bold" data-testid="text-total-resumes">
                      {mappedResumes.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interviews</p>
                    <p className="text-2xl font-bold" data-testid="text-total-interviews">
                      {mappedInterviews.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Interview Score</p>
                    <p className="text-2xl font-bold" data-testid="text-avg-score">
                      {avgScore}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Resumes</h2>
                <Link href="/resume-builder">
                  <Button className="gap-2" data-testid="button-create-resume">
                    <Plus className="w-4 h-4" />
                    Create New
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mappedResumes.length > 0 ? (
                    mappedResumes.map((resume) => (
                        <ResumeCard 
                            key={resume.id} 
                            id={resume.id} 
                            title={resume.title} 
                            lastEdited={formatLastEdited(resume.updatedAt)} 
                            atsScore={resume.atsScore} 
                        />
                    ))
                ) : (
                    <p className="text-muted-foreground col-span-full">No resumes found. Start by building one!</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Interview History</h2>
                <Link href="/mock-interview">
                  <Button className="gap-2" data-testid="button-new-interview">
                    <Plus className="w-4 h-4" />
                    New Interview
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {mappedInterviews.length > 0 ? (
                    mappedInterviews.map((interview) => (
                        <InterviewHistoryCard 
                            key={interview.id} 
                            id={interview.id} 
                            role={interview.jobRole} 
                            date={formatLastEdited(interview.createdAt)} 
                            duration={interview.duration}
                            score={interview.overallScore} 
                            type={interview.questionType}
                        />
                    ))
                ) : (
                     <p className="text-muted-foreground">No interview history found. Start a mock interview now!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}