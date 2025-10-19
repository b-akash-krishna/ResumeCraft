import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Target, CheckCircle2, Sparkles, TrendingUp, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const features = [
    {
      icon: FileText,
      title: "ATS-Optimized Resumes",
      description: "Build resumes that pass Applicant Tracking Systems with AI-powered optimization.",
    },
    {
      icon: Target,
      title: "AI Mock Interviews",
      description: "Practice with realistic interview questions and get detailed performance feedback.",
    },
    {
      icon: Sparkles,
      title: "Smart Suggestions",
      description: "Get real-time AI suggestions to improve your resume content and structure.",
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your progress with detailed metrics and improvement recommendations.",
    },
    {
      icon: Award,
      title: "Professional Templates",
      description: "Choose from expertly designed templates that make great first impressions.",
    },
    {
      icon: CheckCircle2,
      title: "Instant Feedback",
      description: "Receive immediate scoring and actionable insights to boost your success rate.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Land Your Dream Job with{" "}
                <span className="text-primary">AI-Powered</span> Resume & Interview Prep
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Create ATS-friendly resumes and practice mock interviews with our intelligent platform. 
                Get instant feedback and improve your chances of success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/resume-builder">
                  <Button size="lg" className="w-full sm:w-auto gap-2 min-h-12 px-8" data-testid="button-optimize-resume">
                    <FileText className="w-5 h-5" />
                    Optimize Resume
                  </Button>
                </Link>
                <Link href="/mock-interview">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 min-h-12 px-8" data-testid="button-start-interview">
                    <Target className="w-5 h-5" />
                    Start Mock Interview
                  </Button>
                </Link>
              </div>
              <div className="pt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-chart-3" />
                <span>Trusted by 50,000+ job seekers</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 border-t bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive tools to help you stand out in your job search
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 hover-elevate active-elevate-2" data-testid={`card-feature-${index}`}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of successful job seekers who've improved their resumes and interview skills
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/resume-builder">
                    <Button size="lg" className="w-full sm:w-auto gap-2 min-h-12 px-8" data-testid="button-cta-resume">
                      Build Your Resume
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 min-h-12 px-8" data-testid="button-cta-dashboard">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
