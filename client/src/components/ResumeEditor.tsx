import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Download, FileCode, CheckCircle2, RefreshCw, AlertCircle, Zap } from "lucide-react";
import ATSScoreMeter from "./ATSScoreMeter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

// --- Types matching the Resume Schema for clarity ---
interface ResumeContent {
  basics: { name: string; email: string; phone: string; summary: string; };
  experience: { company: string; position: string; startDate: string; endDate?: string; description: string; }[];
  skills: string[];
  projects?: { name: string; technologies: string; description: string; }[];
  education?: { institution: string; degree: string; year: string; }[];
}

interface Resume {
  id: string;
  title: string;
  content: ResumeContent;
  atsScore: number;
  template: string;
}

interface ResumeEditorProps {
  resumeData: Resume;
  onContentChange: (newContent: ResumeContent, newTitle: string) => void;
  isSaving: boolean;
}

interface ATSAnalysisResult {
    score: number;
    keywords: string[];
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
}

interface Optimization {
    section: "summary" | string; // e.g., "experience-0"
    original: string;
    optimized: string;
    improvement: string;
}
// -----------------------------------------------------

export default function ResumeEditor({ resumeData, onContentChange, isSaving }: ResumeEditorProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State to hold AI suggestions for the UI
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<Optimization[]>([]);

  // Internal state for form inputs (initialized from props)
  const [name, setName] = useState(resumeData.content.basics.name || "");
  const [email, setEmail] = useState(resumeData.content.basics.email || "");
  const [phone, setPhone] = useState(resumeData.content.basics.phone || "");
  const [summary, setSummary] = useState(resumeData.content.basics.summary || "");
  const [experienceText, setExperienceText] = useState(
    resumeData.content.experience[0]?.description || ""
  );
  const [skillsText, setSkillsText] = useState(resumeData.content.skills.join(", ") || "");
  const [projectsText, setProjectsText] = useState(
    (resumeData.content.projects || []).map(p => `${p.name} | ${p.technologies}\n• ${p.description}`).join('\n\n')
  );

  // Sync internal state when parent's resumeData changes (and clear suggestions)
  useEffect(() => {
    setName(resumeData.content.basics.name);
    setEmail(resumeData.content.basics.email);
    setPhone(resumeData.content.basics.phone);
    setSummary(resumeData.content.basics.summary);
    setExperienceText(resumeData.content.experience[0]?.description || "");
    setSkillsText(resumeData.content.skills.join(", "));
    setProjectsText((resumeData.content.projects || []).map(p => `${p.name} | ${p.technologies}\n• ${p.description}`).join('\n\n'));
    
    // Clear suggestions when resume data changes (e.g., loaded new resume)
    setOptimizationSuggestions([]);
  }, [resumeData]);

  // Unified change handler to update parent state
  const handleEditorChange = useCallback((
    newContent: Partial<ResumeContent["basics"] & { experienceText: string; skillsText: string; projectsText: string }>
  ) => {
    const updatedBasics = {
      ...resumeData.content.basics,
      name: newContent.name !== undefined ? newContent.name : name,
      email: newContent.email !== undefined ? newContent.email : email,
      phone: newContent.phone !== undefined ? newContent.phone : phone,
      summary: newContent.summary !== undefined ? newContent.summary : summary,
    };
    
    // Normalize string inputs back into structured format for parent
    const updatedContent: ResumeContent = {
        ...resumeData.content,
        basics: updatedBasics,
        experience: [{
            ...resumeData.content.experience[0], // Keep existing fields
            description: newContent.experienceText !== undefined ? newContent.experienceText : experienceText,
        }],
        skills: (newContent.skillsText !== undefined ? newContent.skillsText : skillsText).split(',').map(s => s.trim()).filter(s => s.length > 0),
        // NOTE: Simplification for demo
    };
    
    onContentChange(updatedContent, updatedBasics.name || resumeData.title);
  }, [resumeData, onContentChange, name, email, phone, summary, experienceText, skillsText]);


  // --- ATS Analysis Mutation (Step 3.2a) ---
  const atsMutation = useMutation({
    mutationFn: () => {
      if (!resumeData.id || resumeData.id === 'new-temp-id') {
          throw new Error("Please save the resume first.");
      }
      return apiRequest("POST", `/api/resumes/${resumeData.id}/analyze`, {
        jobDescription: "Full Stack Developer role requiring React and Node.js.",
      });
    },
    onSuccess: async (res) => {
        const analysis = await res.json() as ATSAnalysisResult;

        // Manually update ATS score in parent state for immediate feedback
        const newResumeData: Resume = {
            ...resumeData,
            atsScore: analysis.score,
        };
        onContentChange(newResumeData.content, newResumeData.title);

        toast({
            title: "ATS Analysis Complete",
            description: `Score updated to ${analysis.score}%. Check console for details.`,
            duration: 5000,
            variant: analysis.score >= 80 ? "default" : "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
    },
    onError: (error: any) => {
      toast({
        title: "ATS Analysis Failed",
        description: error.message.replace(/500: /, "").trim() || "AI analysis failed. Ensure the API key is set and the content is valid.",
        variant: "destructive",
      });
    }
  });

  const handleAnalyzeATS = () => {
    atsMutation.mutate();
  };
  
  // --- AI Assist Mutation (Step 3.2b - for optimization suggestions) ---
  const aiAssistMutation = useMutation({
    mutationFn: (targetRole: string) => {
      if (!resumeData.id || resumeData.id === 'new-temp-id') {
          throw new Error("Please save the resume first.");
      }
      // Endpoint is POST /api/resumes/:id/optimize
      return apiRequest("POST", `/api/resumes/${resumeData.id}/optimize`, {
        targetRole,
      });
    },
    onSuccess: async (res) => {
        const result = await res.json() as { optimizations: Optimization[] };
        setOptimizationSuggestions(result.optimizations);

        toast({
            title: "Suggestions Ready",
            description: `Found ${result.optimizations.length} optimization suggestions.`,
            variant: "default",
        });
    },
    onError: (error: any) => {
      toast({
        title: "AI Assist Failed",
        description: error.message.replace(/500: /, "").trim() || "AI optimization failed.",
        variant: "destructive",
      });
    }
  });

  const applyOptimizationMutation = useMutation({
    mutationFn: (optimization: Optimization) => {
        // Endpoint is POST /api/resumes/:id/apply-optimization
        return apiRequest("POST", `/api/resumes/${resumeData.id}/apply-optimization`, {
            section: optimization.section,
            optimizedText: optimization.optimized,
        });
    },
    onSuccess: async (res, appliedOptimization) => {
        const updatedResume = await res.json() as Resume;
        
        // Update local state to reflect the applied change and clear suggestions
        onContentChange(updatedResume.content, updatedResume.title);
        setOptimizationSuggestions([]); 
        
        toast({
            title: "Optimization Applied",
            description: `Successfully applied change to ${appliedOptimization.section}. Resume saved.`,
        });
    },
    onError: (error: any) => {
        toast({
            title: "Application Failed",
            description: error.message.replace(/400: /, "").trim() || "Failed to apply optimization.",
            variant: "destructive",
        });
    }
  });

  const handleAIAssist = () => {
    aiAssistMutation.mutate("Senior Software Engineer");
  };

  const handleApplyOptimization = (optimization: Optimization) => {
      applyOptimizationMutation.mutate(optimization);
  };
  
  // --- Export Handlers (Step 3.2c) ---
  const handleDownloadPDF = () => {
    toast({
        title: "PDF Generation",
        description: "PDF generation is currently being mocked. Please use Export LaTeX.",
        variant: "default"
    });
  };

  const handleExportLaTeX = async () => {
    if (!resumeData.id || resumeData.id === 'new-temp-id') {
        toast({
            title: "Save Required",
            description: "Please save your resume before exporting as LaTeX.",
            variant: "destructive"
        });
        return;
    }

    try {
        const res = await fetch(`/api/resumes/${resumeData.id}/latex`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            }
        });

        if (!res.ok) {
            const errorText = await res.text() || res.statusText;
            throw new Error(`Export failed: ${res.status} ${errorText}`);
        }

        // Trigger file download
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.title || 'resume'}.tex`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        toast({
            title: "Export Complete",
            description: "LaTeX file download has started.",
        });
    } catch (error: any) {
        toast({
            title: "Export Failed",
            description: error.message || "Failed to export LaTeX file.",
            variant: "destructive",
        });
    }
  };
  // ------------------------------------

  const isAnyMutationPending = isSaving || atsMutation.isPending || aiAssistMutation.isPending || applyOptimizationMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Resume Editor</h2>
          <Button
            onClick={handleAIAssist}
            className="gap-2"
            disabled={isAnyMutationPending || resumeData.id === 'new-temp-id'}
            data-testid="button-ai-assist"
          >
            {aiAssistMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {aiAssistMutation.isPending ? "Generating..." : "AI Assist"}
          </Button>
        </div>

        {/* AI Suggestions Display */}
        {optimizationSuggestions.length > 0 && (
             <Card className="p-4 border-primary bg-primary/5 space-y-3" data-testid="card-ai-suggestions">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Zap className="w-5 h-5"/> AI Optimization Suggestions
                </h3>
                {optimizationSuggestions.slice(0, 3).map((opt, index) => ( // Show top 3 suggestions
                    <div key={index} className="border-t pt-3 space-y-2">
                        <p className="text-sm font-medium">
                            <span className="text-muted-foreground">{opt.section === 'summary' ? 'Summary:' : `Experience ${opt.section.split('-')[1]}:`}</span>
                            <span className="text-chart-3 ml-2">{opt.improvement}</span>
                        </p>
                        <div className="flex justify-between items-end gap-4 bg-background p-3 rounded-md border text-sm">
                            <p className="flex-1 italic line-clamp-2 text-muted-foreground">Original: "{opt.original}"</p>
                            <Button 
                                size="sm" 
                                className="gap-1 min-w-[120px]"
                                onClick={() => handleApplyOptimization(opt)}
                                disabled={applyOptimizationMutation.isPending || isSaving}
                                data-testid={`button-apply-opt-${index}`}
                            >
                                {applyOptimizationMutation.isPending ? "Applying..." : "Apply"}
                            </Button>
                        </div>
                    </div>
                ))}
            </Card>
        )}

        <Tabs defaultValue="basics" className="w-full">
            {/* ... Tabs List ... */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics" data-testid="tab-basics">Basics</TabsTrigger>
            <TabsTrigger value="experience" data-testid="tab-experience">Experience</TabsTrigger>
            <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
          </TabsList>
            {/* ... Tabs Content ... */}
          <TabsContent value="basics" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  handleEditorChange({ name: e.target.value });
                }}
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleEditorChange({ email: e.target.value });
                }}
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  handleEditorChange({ phone: e.target.value });
                }}
                data-testid="input-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  handleEditorChange({ summary: e.target.value });
                }}
                rows={4}
                data-testid="input-summary"
              />
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Work Experience</Label>
              <Textarea
                id="experience"
                value={experienceText}
                onChange={(e) => {
                  setExperienceText(e.target.value);
                  handleEditorChange({ experienceText: e.target.value });
                }}
                rows={12}
                placeholder="Company Name | Position | Dates&#10;• Achievement 1&#10;• Achievement 2"
                data-testid="input-experience"
              />
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Technical Skills (Comma Separated)</Label>
              <Textarea
                id="skills"
                value={skillsText}
                onChange={(e) => {
                  setSkillsText(e.target.value);
                  handleEditorChange({ skillsText: e.target.value });
                }}
                rows={6}
                placeholder="React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL"
                data-testid="input-skills"
              />
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projects">Projects</Label>
              <Textarea
                id="projects"
                value={projectsText}
                rows={12}
                placeholder="Project Name | Technologies&#10;• Description and impact&#10;• Key achievements"
                data-testid="input-projects"
                onChange={(e) => {
                    setProjectsText(e.target.value);
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleDownloadPDF} className="gap-2 flex-1" data-testid="button-download-pdf">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button onClick={handleExportLaTeX} variant="outline" className="gap-2 flex-1" data-testid="button-export-latex">
            <FileCode className="w-4 h-4" />
            Export LaTeX
          </Button>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
             <Button
                onClick={handleAnalyzeATS}
                variant="secondary"
                className="w-full gap-2"
                disabled={isAnyMutationPending || resumeData.id === 'new-temp-id'}
                data-testid="button-analyze-ats"
            >
                {atsMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {atsMutation.isPending ? "Analyzing..." : "Analyze ATS Score"}
            </Button>
            {atsMutation.isError && (
                 <div className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Failed to analyze ATS.</span>
                </div>
            )}
        </div>
        <ATSScoreMeter score={resumeData.atsScore || 0} />
        
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Live Preview (Template: {resumeData.template})</h3>
          <div className="bg-background p-8 rounded-lg border min-h-[600px] shadow-sm">
            <div className="space-y-6 font-serif">
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {email} | {phone}
                </p>
              </div>
              
              <div>
                <h2 className="text-lg font-bold mb-2 border-b pb-1">Professional Summary</h2>
                <p className="text-sm leading-relaxed">{summary}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-bold mb-2 border-b pb-1">Work Experience</h2>
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-serif">{experienceText}</pre>
              </div>
              
              <div>
                <h2 className="text-lg font-bold mb-2 border-b pb-1">Technical Skills</h2>
                <p className="text-sm leading-relaxed">{skillsText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}