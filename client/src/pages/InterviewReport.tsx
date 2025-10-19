import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InterviewMetricCard from "@/components/InterviewMetricCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, MessageSquare, Target, Download, Share2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function InterviewReport() {
  const performanceData = [
    { question: "Q1", score: 85 },
    { question: "Q2", score: 72 },
    { question: "Q3", score: 90 },
    { question: "Q4", score: 68 },
    { question: "Q5", score: 88 },
  ];

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };

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
                  Software Engineer | Technical Interview | Completed 10/19/2024
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InterviewMetricCard
                title="Confidence Score"
                score={81}
                icon={Smile}
                color="blue"
              />
              <InterviewMetricCard
                title="Grammar & Clarity"
                score={87}
                icon={MessageSquare}
                color="green"
              />
              <InterviewMetricCard
                title="Relevance"
                score={75}
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
                    <li>Clear and concise communication throughout the interview</li>
                    <li>Strong technical knowledge demonstrated in problem-solving</li>
                    <li>Good use of examples from past experience</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-chart-4">Areas for Improvement</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Consider providing more specific metrics when discussing achievements</li>
                    <li>Take a moment to structure answers before speaking</li>
                    <li>Include more details about team collaboration and leadership</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-chart-2/5 border-primary/20">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Great Job!</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Your overall performance was strong. Keep practicing to maintain consistency
                  and continue improving in the areas highlighted above.
                </p>
                <Button size="lg" className="gap-2" data-testid="button-practice-again">
                  Practice Another Interview
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
