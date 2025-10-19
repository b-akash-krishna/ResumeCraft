import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import ResumeEditor from "@/components/ResumeEditor";
import TemplateCard from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LayoutTemplate, Loader2, Save, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton"; // ADDED IMPORT

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
// -----------------------------------------------------

// Mock function to simulate file parsing (since we don't have a file parsing service)
const parseFileContent = (file: File): ResumeContent => {
    return {
        basics: { 
            name: file.name.split(".")[0] || "New Applicant", 
            email: "placeholder@resumeai.com",
            phone: "555-1234", 
            summary: "Extracted summary from uploaded file. Please review and optimize.",
        },
        experience: [{
            company: "Uploaded Corp",
            position: "Senior Upload Specialist",
            startDate: "2020",
            endDate: "Present",
            description: "Data extracted from uploaded file. Please review and edit.",
        }],
        skills: ["Extracted Skills", "File Parsing"],
        projects: [],
        education: [],
    };
};

// Component accepts resumeId from URL via wouter's ProtectedRoute wrapper
export default function ResumeBuilder({ resumeId: urlResumeId }: { resumeId?: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [resumeId, setResumeId] = useState<string | null>(urlResumeId || null); 
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  
  const isEditing = resumeId !== null && resumeId !== 'new-temp-id'; 

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and contemporary design" },
    { id: "professional", name: "Professional", description: "Traditional corporate style" },
    { id: "creative", name: "Creative", description: "Stand out with unique layout" },
    { id: "minimal", name: "Minimal", description: "Simple and elegant" },
  ];

  // --- Data Fetching (Load Existing Resume) ---
  const { data: fetchedResume, isLoading: isLoadingResume, isError: isErrorResume } = useQuery<Resume>({
    queryKey: ["/api/resumes", resumeId],
    queryFn: async ({ queryKey }) => {
        const [, id] = queryKey;
        if (!id || id === 'new-temp-id') return null; // Skip fetch if not a real ID
        
        const res = await apiRequest("GET", `/api/resumes/${id}`);
        return res.json() as Promise<Resume>;
    },
    enabled: !!resumeId && resumeId !== 'new-temp-id', // Only run if a real ID is present
    refetchOnWindowFocus: false,
  });

  // Effect to handle loading fetched data into local state
  useEffect(() => {
    if (fetchedResume) {
        setResumeData(fetchedResume);
        setResumeId(fetchedResume.id);
        setSelectedTemplate(fetchedResume.template);
    }
  }, [fetchedResume]);

  // Effect to sync URL param changes (e.g., direct navigation to a new ID)
  useEffect(() => {
      if (urlResumeId && urlResumeId !== resumeId) {
          setResumeId(urlResumeId);
          setResumeData(null); // Force loading state or new fetch
      } else if (!urlResumeId && resumeId !== null && isEditing) {
          // Navigated back to /resume-builder from /resume-builder/:id, reset state
          setResumeId(null);
          setResumeData(null);
      }
  }, [urlResumeId]);


  // --- Mutations (Save/Update) ---
  const saveMutation = useMutation({
    mutationFn: (data: Partial<Resume>) => {
      const payload = { 
          title: data.title, 
          content: data.content, 
          atsScore: data.atsScore, 
          template: data.template 
      };

      if (isEditing) {
        return apiRequest("PATCH", `/api/resumes/${resumeId}`, payload);
      } else {
        return apiRequest("POST", "/api/resumes", payload);
      }
    },
    onSuccess: async (res) => {
      const savedResume = await res.json() as Resume;
      
      if (resumeId === 'new-temp-id' || !isEditing) {
        setResumeId(savedResume.id);
      }
      
      setResumeData(savedResume);
      
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });

      toast({
        title: "Resume Saved!",
        description: isEditing ? `Updated "${savedResume.title}".` : "New resume created successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      toast({
        title: "Save Failed",
        description: error.message.replace(/400: Error: /, "").trim() || "An unknown error occurred while saving your resume.",
        variant: "destructive",
      });
    }
  });


  // --- Event Handlers ---
  const handleFileSelect = (file: File) => {
    console.log("File selected:", file.name);
    
    try {
        setTimeout(() => {
            const content = parseFileContent(file);
            setResumeData({
                id: 'new-temp-id', // Temporary ID for unsaved new resume
                title: file.name.split(".")[0],
                atsScore: 0,
                template: selectedTemplate,
                content: content,
            });
        }, 1000); // Wait for mock upload/parse simulation
        
    } catch(e) {
        toast({
            title: "File Error",
            description: "Could not parse file content.",
            variant: "destructive",
        });
    }
  };
  
  const handleStartFromScratch = () => {
    setResumeData({
        id: 'new-temp-id', // Temporary ID for unsaved resume
        title: "Untitled Resume",
        atsScore: 0,
        template: selectedTemplate,
        content: {
            basics: { 
                name: "Your Name", 
                email: "user@example.com", 
                phone: "", 
                summary: "A highly motivated and adaptable professional seeking a challenging role." 
            },
            experience: [],
            skills: [],
            projects: [],
            education: [],
        }
    });
  };

  // Callback to update resume state from ResumeEditor.tsx
  const handleEditorChange = (newContent: ResumeContent, newTitle: string) => {
    if (resumeData) {
        setResumeData(prev => prev ? { 
            ...prev, 
            content: newContent,
            title: newTitle,
        } : null as any);
    }
  };
  
  const handleSave = () => {
      if (resumeData) {
          saveMutation.mutate(resumeData);
      }
  };

  // --- Loading/Error Views ---
  const showEditor = resumeData !== null; 
  
  if (isLoadingResume) {
      return (
          <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                      <Skeleton className="h-10 w-2/3" />
                      <div className="grid grid-cols-5 gap-6">
                          <Skeleton className="col-span-3 h-[80vh]" />
                          <Skeleton className="col-span-2 h-[80vh]" />
                      </div>
                  </div>
              </main>
              <Footer />
          </div>
      );
  }
  
  if (isErrorResume) {
      return (
          <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 py-8 text-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                      <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                      <h1 className="text-3xl font-bold">Error Loading Resume</h1>
                      <p className="text-lg text-muted-foreground">
                        The resume ID "{resumeId}" could not be found or access was denied.
                      </p>
                      <Button onClick={() => setResumeId(null)} data-testid="button-back-to-new">Start a New Resume</Button>
                  </div>
              </main>
              <Footer />
          </div>
      );
  }

  // --- Sub Components (Template Selector remains the same) ---
  const templateSelector = (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-change-template">
          <LayoutTemplate className="w-4 h-4" />
          Change Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              name={template.name}
              description={template.description}
              selected={selectedTemplate === template.id}
              onSelect={() => {
                setSelectedTemplate(template.id);
                if (resumeData) {
                    setResumeData(prev => prev ? {...prev, template: template.id} : null as any);
                }
                console.log("Template selected:", template.id);
              }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!showEditor ? (
            // --- Initial Upload/Start Screen (Visible if resumeData is null) ---
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Resume Builder</h1>
                <p className="text-lg text-muted-foreground">
                  Upload your existing resume or start from scratch with AI assistance
                </p>
              </div>
              
              <FileUpload onFileSelect={handleFileSelect} maxSizeMB={5} />
              
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleStartFromScratch}
                  data-testid="button-start-scratch"
                >
                  Start from Scratch
                </Button>
              </div>
            </div>
          ) : (
            // --- Resume Editor Screen (Visible if resumeData is NOT null) ---
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                      {resumeData.title || "Loading..."}
                      {saveMutation.isPending && <Loader2 className="w-5 h-5 inline ml-3 animate-spin text-primary" />}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Edit your resume and see real-time ATS scoring
                  </p>
                </div>
                <div className="flex gap-2">
                    {templateSelector}
                    <Button 
                        onClick={handleSave} 
                        className="gap-2" 
                        disabled={saveMutation.isPending || !resumeData}
                        data-testid="button-save-resume"
                    >
                        <Save className="w-4 h-4" />
                        {resumeId && resumeId !== 'new-temp-id' ? "Save Changes" : "Save New"}
                    </Button>
                </div>
              </div>
              
              {/* Pass state and mutation handler down to editor */}
              {resumeData && (
                <ResumeEditor 
                    resumeData={resumeData}
                    onContentChange={handleEditorChange}
                    isSaving={saveMutation.isPending}
                />
              )}

              {/* Show error if save failed */}
              {saveMutation.isError && (
                  <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/10 border border-destructive/30 rounded-md" data-testid="alert-save-error">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{saveMutation.error.message || "Failed to save resume. Please try again."}</span>
                  </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}