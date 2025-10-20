import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InterviewMetricCard from "@/components/InterviewMetricCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, MessageSquare, Target, Download, Share2, Loader2, AlertCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation, Link } from "wouter"; 
import { useEffect, useState } from "react";

// --- Types matching the Schema ---
interface InterviewReport {
    id: string;
    sessionId: string;
    confidenceScore: number;
    grammarScore: number;
    relevanceScore: number;
    overallScore: number;
    feedback: {
      strengths: string[];
      improvements: string[];
      summary: string;
    };
}

interface InterviewSession {
    id: string;
    jobRole: string;
    questionType: string;
    completedAt: string;
}

interface InterviewQuestion {
    questionText: string;
    score: number;
    order: number;
}
// ------------------------------------

export default function InterviewReport() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const sessionId = urlParams.get('sessionId');

  // --- Query Hooks ---
  const { data: session, isLoading: isLoadingSession, isError: isErrorSession } = useQuery<InterviewSession>({
    queryKey: ["/api/interviews/session", sessionId],
    queryFn: async ({ queryKey }) => {
        const [, id] = queryKey;
        if (!id) throw new Error("Session ID is missing.");
        const res = await apiRequest("GET", `/api/interviews/${id}`);
        return res.json() as Promise<InterviewSession>;
    },
    enabled: !!sessionId,
  });
  
  // Fetch Report
  const { data: report, isLoading: isLoadingReport, isError: isErrorReport, refetch: refetchReport } = useQuery<InterviewReport>({
    queryKey: ["/api/interviews/report", sessionId],
    queryFn: async ({ queryKey }) => {
        const [, id] = queryKey;
        if (!id) throw new Error("Session ID is missing.");
        
        // This GET endpoint returns 404 if the report doesn't exist yet
        const res = await apiRequest("GET", `/api/interviews/${id}/report`);
        return res.json() as Promise<InterviewReport>;
    },
    enabled: !!sessionId,
    retry: false,
  });

  // Fetch Questions for Chart Data
  const { data: questions, isLoading: isLoadingQuestions, isError: isErrorQuestions } = useQuery<InterviewQuestion[]>({
    queryKey: ["/api/interviews/questions", sessionId],
    queryFn: async ({ queryKey }) => {
        const [, id] = queryKey;
        if (!id) throw new Error("Session ID is missing.");
        const res = await apiRequest("GET", `/api/interviews/${id}/questions`);
        return res.json() as Promise<InterviewQuestion[]>;
    },
    enabled: !!sessionId,
  });

  // --- Report Generation Logic ---
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    // If loading is complete, there's no report, but a session exists, try to generate it.
    if (!isLoadingReport && !report && !isErrorReport && !isGenerating && session && sessionId) {
        setIsGenerating(true);
        // Call the POST /report endpoint
        apiRequest("POST", `/api/interviews/${sessionId}/report`)
            .then(() => {
                // Wait briefly and then refetch the newly generated report
                setTimeout(() => refetchReport(), 1000);
            })
            .catch((e) => {
                console.error("Report generation failed:", e);
                setIsGenerating(false);
            })
            .finally(() => {
                 // Refetch completes generation state transition
                 if (isGenerating) setIsGenerating(false);
            });
    }
  }, [isLoadingReport, report, isErrorReport, isGenerating, session, sessionId]);

  // --- UI State Mapping ---
  const isLoading = isLoadingSession || isLoadingReport || isLoadingQuestions || isGenerating;
  const isError = isErrorSession || isErrorReport || isErrorQuestions || !sessionId;
  
  // Map data for BarChart
  const performanceData = (questions || [])
    .filter(q => q.score !== null && q.score !== undefined)
    .map((q, index) => ({ 
        question: `Q${q.order + 1}`, // Assuming order starts at 0
        score: q.score,
    }));
    
  const jobRoleDisplay = session?.jobRole || "Unknown Role";
  const typeDisplay = session?.questionType.charAt(0).toUpperCase() + session?.questionType.slice(1) + " Interview" || "Unknown Type";
  const dateDisplay = session?.completedAt ? new Date(session.completedAt).toLocaleDateString() : "Pending";
  

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };
  
  // --- Loading/Error Screens ---
  if (!sessionId) {
      return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-8 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                    <h1 className="text-3xl font-bold">Invalid Session</h1>
                    <p className="text-lg text-muted-foreground">
                      No interview session ID found. Please start an interview first.
                    </p>
                    <Link href="/mock-interview">
                       <Button>Start Mock Interview</Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
      );
  }

  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-8 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <h1 className="text-3xl font-bold">
                        {isGenerating ? "Generating Comprehensive Report..." : "Loading Interview Report"}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Please wait, AI is finalizing your performance analysis.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  if (isError || !report) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-8 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                    <h1 className="text-3xl font-bold">Report Generation Failed</h1>
                    <p className="text-lg text-muted-foreground">
                      We encountered an error loading or generating the report for session: {sessionId}. Check the backend logs for AI errors.
                    </p>
                    <Link href="/mock-interview">
                       <Button>Try Another Interview</Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
  }
  
  // --- Success Render (Report Data is available) ---
  const { confidenceScore, grammarScore, relevanceScore, overallScore, feedback } = report;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Interview Performance Report</h1>
                <p className="text-muted-foreground mt-1">
                  {jobRoleDisplay} | {typeDisplay} | Completed {dateDisplay}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" data-testid="button-share">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button className="gap-2" data-testid="button-download-report">
                  <Download className="w-4 h-4" />
                  Download Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InterviewMetricCard
                title="Overall Score"
                score={overallScore}
                icon={Target}
                color="blue"
              />
              <InterviewMetricCard
                title="Confidence Score"
                score={confidenceScore}
                icon={Smile}
                color="blue"
              />
              <InterviewMetricCard
                title="Grammar & Clarity"
                score={grammarScore}
                icon={MessageSquare}
                color="green"
              />
              <InterviewMetricCard
                title="Relevance"
                score={relevanceScore}
                icon={Target}
                color="amber"
              />
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Question-by-Question Performance</h2>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="question"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      domain={[0, 100]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Detailed Feedback</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-chart-3">Strengths</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-chart-4">Areas for Improvement</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {feedback.improvements.map((i, idx) => <li key={idx}>{i}</li>)}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-chart-2/5 border-primary/20">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{overallScore >= 80 ? "Excellent Performance!" : "Great Job!"}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {feedback.summary}
                </p>
                <Link href="/mock-interview">
                    <Button size="lg" className="gap-2" data-testid="button-practice-again">
                      Practice Another Interview
                    </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}