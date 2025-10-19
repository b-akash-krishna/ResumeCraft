import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import ResumeEditor from "@/components/ResumeEditor";
import TemplateCard from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LayoutTemplate } from "lucide-react";

export default function ResumeBuilder() {
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and contemporary design" },
    { id: "professional", name: "Professional", description: "Traditional corporate style" },
    { id: "creative", name: "Creative", description: "Stand out with unique layout" },
    { id: "minimal", name: "Minimal", description: "Simple and elegant" },
  ];

  const handleFileSelect = (file: File) => {
    console.log("File selected:", file.name);
    setTimeout(() => setHasUploadedFile(true), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!hasUploadedFile ? (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Resume Builder</h1>
                <p className="text-lg text-muted-foreground">
                  Upload your existing resume or start from scratch with AI assistance
                </p>
              </div>
              
              <FileUpload onFileSelect={handleFileSelect} />
              
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setHasUploadedFile(true)}
                  data-testid="button-start-scratch"
                >
                  Start from Scratch
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Resume Builder</h1>
                  <p className="text-muted-foreground mt-1">
                    Edit your resume and see real-time ATS scoring
                  </p>
                </div>
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
                            console.log("Template selected:", template.id);
                          }}
                        />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <ResumeEditor />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
