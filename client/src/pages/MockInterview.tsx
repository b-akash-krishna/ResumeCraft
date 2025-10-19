import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Play, Pause, SkipForward, Square } from "lucide-react";

export default function MockInterview() {
  const [step, setStep] = useState<"setup" | "interview">("setup");
  const [isPaused, setIsPaused] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [jobRole, setJobRole] = useState("");
  const [questionType, setQuestionType] = useState("");

  const currentQuestion = "Can you describe a challenging project you've worked on and how you overcame obstacles?";
  const totalQuestions = 5;

  const handleStartInterview = () => {
    console.log("Starting interview:", { jobRole, questionType });
    setStep("interview");
  };

  const handleNextQuestion = () => {
    if (questionNumber < totalQuestions) {
      setQuestionNumber(questionNumber + 1);
      console.log("Next question:", questionNumber + 1);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    console.log("Pause toggled:", !isPaused);
  };

  const handleEndSession = () => {
    console.log("Ending interview session");
    window.location.href = "/interview-report";
  };

  if (step === "interview") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex flex-col">
          <div className="border-b bg-card/50 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Question {questionNumber}</span>
                    <span>/</span>
                    <span>{totalQuestions}</span>
                  </div>
                  <div className="h-4 w-px bg-border"></div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground">15:30</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePause}
                    className="gap-2"
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
                    data-testid="button-end-session"
                  >
                    <Square className="w-4 h-4" />
                    End Session
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
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
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 to-chart-2/5 rounded-lg border-2 border-dashed border-primary/20 min-h-[300px]">
                    <div className="text-center space-y-2">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                        <Target className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground">AI Avatar</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-semibold">You</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Your Response</h3>
                      <p className="text-sm text-muted-foreground">Camera Preview</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed min-h-[300px]">
                    <div className="text-center space-y-2">
                      <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <span className="text-3xl">👤</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Camera placeholder</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="mt-6 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Current Question</h3>
                    <span className="text-sm text-muted-foreground">
                      Question {questionNumber} of {totalQuestions}
                    </span>
                  </div>
                  <p className="text-lg leading-relaxed" data-testid="text-current-question">
                    {currentQuestion}
                  </p>
                  <div className="pt-4 border-t flex justify-center">
                    <Button
                      size="lg"
                      onClick={handleNextQuestion}
                      disabled={questionNumber >= totalQuestions}
                      className="gap-2 min-w-[200px]"
                      data-testid="button-next-question"
                    >
                      <SkipForward className="w-5 h-5" />
                      Next Question
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <Select value={jobRole} onValueChange={setJobRole}>
                  <SelectTrigger id="job-role" data-testid="select-job-role">
                    <SelectValue placeholder="Select a job role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software-engineer">Software Engineer</SelectItem>
                    <SelectItem value="product-manager">Product Manager</SelectItem>
                    <SelectItem value="data-scientist">Data Scientist</SelectItem>
                    <SelectItem value="ux-designer">UX Designer</SelectItem>
                    <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-type">Question Type</Label>
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger id="question-type" data-testid="select-question-type">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="hr">HR / Behavioral</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6 border-t">
                <Button
                  onClick={handleStartInterview}
                  disabled={!jobRole || !questionType}
                  className="w-full gap-2 min-h-12"
                  size="lg"
                  data-testid="button-start-interview"
                >
                  <Play className="w-5 h-5" />
                  Start Interview
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
