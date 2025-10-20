import { useState, useEffect } from "react";
// FIX: Replace useNavigate with useLocation for reliable programmatic navigation
import { useLocation } from "wouter"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; 
import { Target, Play, Pause, SkipForward, Square, AlertCircle, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface InterviewQuestion {
    id: string;
    questionText: string;
    answer: string | null;
    score: number | null;
    order: number;
}

interface InterviewSession {
    id: string;
    jobRole: string;
    questionType: string;
    status: string;
    createdAt: string;
}

interface EvaluationResult {
    score: number;
    strengths: string[];
    improvements: string[];
    feedback: string;
}

export default function MockInterview() {
  // Use useLocation to get the navigate function
  const [, navigate] = useLocation(); 
  const { toast } = useToast();
  
  const [step, setStep] = useState<"setup" | "interview">("setup");
  const [isPaused, setIsPaused] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(""); 
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null); 

  // --- 1. Session Creation Mutation ---
  const createSessionMutation = useMutation({
    mutationFn: (data: { jobRole: string; questionType: string }) => {
        return apiRequest("POST", "/api/interviews", {
            jobRole: data.jobRole,
            questionType: data.questionType,
        });
    },
    onSuccess: async (res) => {
        const session = await res.json() as InterviewSession;
        setSessionId(session.id);
        setStep("interview");
        
        generateQuestionsMutation.mutate(session.id);
    },
    onError: (error: any) => {
        console.error("Failed to create session:", error);
        toast({
            title: "Setup Failed",
            description: error.message.replace(/400: /, "").trim() || "Could not start interview session.",
            variant: "destructive",
        });
    }
  });

  // --- 2. Question Generation Mutation ---
  const generateQuestionsMutation = useMutation({
    mutationFn: (id: string) => {
        const mockResumeContent = {
          basics: { name: "John Doe", email: "j@d.com", phone: "555", summary: "Expert" },
          experience: [{ company: "TechCorp", position: "Engineer", startDate: "2020", description: "Led project." }],
          skills: ["React", "Node.js"],
        };
        return apiRequest("POST", `/api/interviews/${id}/generate-questions`, {
            resumeContent: mockResumeContent,
        });
    },
    onSuccess: (res) => {
        toast({
            title: "Questions Ready",
            description: "AI questions successfully generated.",
        });
        startSessionMutation.mutate(sessionId!);
    },
    onError: (error: any) => {
        console.error("Failed to generate questions:", error);
        toast({
            title: "AI Failed",
            description: error.message.replace(/500: /, "").trim() || "AI question generation failed. Check API Key.",
            variant: "destructive",
        });
    }
  });

  // --- 3. Start Session Mutation ---
  const startSessionMutation = useMutation({
    mutationFn: (id: string) => {
        return apiRequest("POST", `/api/interviews/${id}/start`);
    },
    onSuccess: () => {
        toast({
            title: "Interview Started",
            description: "The interview has officially begun.",
        });
        questionsQuery.refetch();
    },
    onError: (error: any) => {
        console.error("Failed to start session:", error);
        toast({
            title: "Interview Error",
            description: "Could not mark session as started.",
            variant: "destructive",
        });
    }
  });


  // --- 4. Fetch Questions Query ---
  const questionsQuery = useQuery<InterviewQuestion[]>({
    queryKey: ["/api/interviews", sessionId, "questions"],
    queryFn: async ({ queryKey }) => {
        const [, id] = queryKey;
        const res = await apiRequest("GET", `/api/interviews/${id}/questions`);
        return res.json() as Promise<InterviewQuestion[]>;
    },
    enabled: !!sessionId,
    refetchInterval: false,
  });

  // --- 5. Answer Submission Mutation ---
  const answerMutation = useMutation({
    mutationFn: (data: { questionId: string; answer: string; jobRole: string }) => {
        return apiRequest("POST", `/api/interviews/questions/${data.questionId}/answer`, {
            answer: data.answer,
            jobRole: data.jobRole,
        });
    },
    onSuccess: async (res) => {
        const result = await res.json() as { question: InterviewQuestion; evaluation: EvaluationResult };
        setEvaluation(result.evaluation);
        questionsQuery.refetch(); 
        
        toast({
            title: "Answer Submitted",
            description: `Score: ${result.evaluation.score}%. Review feedback below.`,
        });
    },
    onError: (error: any) => {
        console.error("Failed to submit answer:", error);
        toast({
            title: "Submission Failed",
            description: error.message.replace(/500: /, "").trim() || "AI evaluation failed.",
            variant: "destructive",
        });
        setEvaluation(null);
    }
  });


  // --- 6. End Session Mutation ---
  const endSessionMutation = useMutation({
    mutationFn: (id: string) => {
        return apiRequest("POST", `/api/interviews/${id}/complete`);
    },
    onSuccess: (res) => {
        toast({
            title: "Session Complete",
            description: "Generating final report...",
        });
        navigate(`/interview-report?sessionId=${sessionId}`);
    },
    onError: (error: any) => {
        console.error("Failed to complete session:", error);
        toast({
            title: "Completion Failed",
            description: "Could not finalize session. Proceeding to report manually.",
            variant: "destructive",
        });
        navigate(`/interview-report?sessionId=${sessionId}`); 
    }
  });

  const handleStartInterview = () => {
    if (jobRole && questionType && !createSessionMutation.isPending) {
        createSessionMutation.mutate({ jobRole, questionType });
    }
  };

  const handleNextQuestion = () => {
    setEvaluation(null);
    setUserAnswer("");

    const totalQuestions = questionsQuery.data?.length || 0;
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmitAnswer = () => {
    if (currentQuestionData && userAnswer.trim() && !answerMutation.isPending) {
        answerMutation.mutate({
            questionId: currentQuestionData.id,
            answer: userAnswer,
            jobRole: jobRole,
        });
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleEndSession = () => {
    if (sessionId) {
        endSessionMutation.mutate(sessionId);
    }
  };
  
  const currentQuestionData = questionsQuery.data?.[currentQuestionIndex];
  const totalQuestions = questionsQuery.data?.length || 0;
  
  const isSubmissionReady = !!currentQuestionData && userAnswer.trim().length > 0 && !answerMutation.isPending;
  const hasSubmitted = evaluation !== null;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;
  
  const isLoadingInterview = createSessionMutation.isPending || generateQuestionsMutation.isPending || startSessionMutation.isPending;
  const isProcessing = answerMutation.isPending || endSessionMutation.isPending;


  if (step === "interview") {
    // --- INTERVIEW IN-PROGRESS UI ---
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex flex-col">
          <div className="border-b bg-card/50 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Question {currentQuestionIndex + 1}</span>
                    <span>/</span>
                    <span>{totalQuestions}</span>
                  </div>
                  <div className="h-4 w-px bg-border"></div>
                  <div className="text-sm text-muted-foreground">
                    {/* Mock Timer */}
                    <span className="font-mono font-semibold text-foreground">15:30</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePause}
                    className="gap-2"
                    disabled={isLoadingInterview || questionsQuery.isLoading || isProcessing}
                    data-testid="button-pause"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEndSession}
                    className="gap-2"
                    disabled={isProcessing}
                    data-testid="button-end-session"
                  >
                    {endSessionMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                    {endSessionMutation.isPending ? "Finalizing..." : "End Session"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* AI Interviewer Card */}
                <Card className="p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Interviewer</h3>
                      <p className="text-sm text-muted-foreground">Virtual Assistant</p>
                    </div>
                  </div>
                  {/* AI Avatar / Video Placeholder */}
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 to-chart-2/5 rounded-lg border-2 border-dashed border-primary/20 min-h-[300px]">
                    <div className="text-center space-y-2">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                        <Target className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground">AI Avatar</p>
                    </div>
                  </div>
                </Card>

                {/* User Response/Evaluation Card */}
                <Card className="p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-semibold">You</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Your Response</h3>
                      <p className="text-sm text-muted-foreground">Type your answer here</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-h-[300px] flex flex-col">
                    <Textarea
                        placeholder="Start typing your response to the question here..."
                        rows={10}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={questionsQuery.isLoading || isLoadingInterview || isProcessing || hasSubmitted}
                        className="flex-1 resize-none"
                        data-testid="input-answer"
                    />
                    
                    {/* Display Submission Result / Feedback */}
                    {evaluation && (
                        <Card className="p-4 mt-3 bg-card/70 border-chart-3/50">
                            <h4 className="font-semibold text-lg text-chart-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5"/> Score: {evaluation.score}%
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                Feedback: {evaluation.feedback}
                            </p>
                        </Card>
                    )}
                  </div>
                </Card>
              </div>

              {/* Question and Control Card */}
              <Card className="mt-6 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Current Question</h3>
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                  </div>
                  {questionsQuery.isLoading || isLoadingInterview ? (
                      <p className="text-lg leading-relaxed text-muted-foreground flex items-center gap-2" data-testid="text-question-loading">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {generateQuestionsMutation.isPending ? "Generating AI questions..." : "Loading interview..."}
                      </p>
                  ) : (
                    <p className="text-lg leading-relaxed" data-testid="text-current-question">
                      {currentQuestionData?.questionText || "Failed to load question."}
                    </p>
                  )}
                  
                  {questionsQuery.isError && (
                      <p className="text-sm text-destructive flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Error loading questions.
                      </p>
                  )}

                  <div className="pt-4 border-t flex justify-center">
                    {!hasSubmitted ? (
                        // Submit button if answer hasn't been evaluated
                        <Button
                            size="lg"
                            onClick={handleSubmitAnswer}
                            disabled={!isSubmissionReady || isProcessing}
                            className="gap-2 min-w-[200px]"
                            data-testid="button-submit-answer"
                        >
                            {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                            {isProcessing ? "Submitting..." : "Submit Answer"}
                        </Button>
                    ) : (
                        // Next/End button if answer HAS been evaluated
                        <Button
                            size="lg"
                            onClick={isLastQuestion ? handleEndSession : handleNextQuestion}
                            disabled={isProcessing}
                            className="gap-2 min-w-[200px]"
                            data-testid="button-next-question"
                        >
                            <SkipForward className="w-5 h-5" />
                            {isLastQuestion ? "View Report" : "Next Question"}
                        </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- INTERVIEW SETUP UI (Default view remains the same) ---
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold">Mock Interview Setup</h1>
            <p className="text-lg text-muted-foreground">
              Configure your interview session and start practicing
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="job-role">Job Role</Label>
                <Select value={jobRole} onValueChange={setJobRole} disabled={createSessionMutation.isPending}>
                  <SelectTrigger id="job-role" data-testid="select-job-role">
                    <SelectValue placeholder="Select a job role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                    <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-type">Question Type</Label>
                <Select value={questionType} onValueChange={setQuestionType} disabled={createSessionMutation.isPending}>
                  <SelectTrigger id="question-type" data-testid="select-question-type">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">HR / Behavioral</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {createSessionMutation.isError && (
                  <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/10 border border-destructive/30 rounded-md" data-testid="alert-setup-error">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{createSessionMutation.error.message.replace(/400: /, "").trim() || "Failed to start interview session."}</span>
                  </div>
              )}

              <div className="pt-6 border-t">
                <Button
                  onClick={handleStartInterview}
                  disabled={!jobRole || !questionType || createSessionMutation.isPending}
                  className="w-full gap-2 min-h-12"
                  size="lg"
                  data-testid="button-start-interview"
                >
                  {createSessionMutation.isPending ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                      <Play className="w-5 h-5" />
                  )}
                  {createSessionMutation.isPending ? "Creating Session..." : "Start Interview"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}