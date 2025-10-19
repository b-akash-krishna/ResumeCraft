import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResumeCard from "@/components/ResumeCard";
import InterviewHistoryCard from "@/components/InterviewHistoryCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Target, TrendingUp, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const resumes = [
    { id: "1", title: "Software Engineer Resume", lastEdited: "2 days ago", atsScore: 85 },
    { id: "2", title: "Product Manager Resume", lastEdited: "1 week ago", atsScore: 72 },
    { id: "3", title: "Data Scientist Resume", lastEdited: "2 weeks ago", atsScore: 90 },
  ];

  const interviews = [
    {
      id: "1",
      role: "Software Engineer",
      date: "Oct 15, 2024",
      duration: "25 min",
      score: 81,
      type: "Technical" as const,
    },
    {
      id: "2",
      role: "Product Manager",
      date: "Oct 12, 2024",
      duration: "30 min",
      score: 75,
      type: "HR" as const,
    },
    {
      id: "3",
      role: "Full Stack Developer",
      date: "Oct 8, 2024",
      duration: "28 min",
      score: 88,
      type: "Mixed" as const,
    },
  ];

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
                      {resumes.length}
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
                      {interviews.length}
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
                      81%
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
                {resumes.map((resume) => (
                  <ResumeCard key={resume.id} {...resume} />
                ))}
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
                {interviews.map((interview) => (
                  <InterviewHistoryCard key={interview.id} {...interview} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
