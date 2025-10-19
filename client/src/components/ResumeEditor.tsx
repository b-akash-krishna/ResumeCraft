import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Download, FileCode } from "lucide-react";
import ATSScoreMeter from "./ATSScoreMeter";

export default function ResumeEditor() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@email.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [summary, setSummary] = useState(
    "Experienced software engineer with 5+ years in full-stack development. Specialized in React, Node.js, and cloud technologies."
  );
  const [experience, setExperience] = useState(
    "Senior Software Engineer | Tech Corp | 2020 - Present\n• Led development of customer-facing web applications serving 1M+ users\n• Improved application performance by 40% through optimization\n• Mentored team of 5 junior developers"
  );
  const [skills, setSkills] = useState(
    "React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL, REST APIs, Git, Agile/Scrum"
  );

  const handleAIAssist = () => {
    console.log("AI assist triggered");
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF triggered");
  };

  const handleExportLaTeX = () => {
    console.log("Export LaTeX triggered");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Resume Editor</h2>
          <Button
            onClick={handleAIAssist}
            className="gap-2"
            data-testid="button-ai-assist"
          >
            <Sparkles className="w-4 h-4" />
            AI Assist
          </Button>
        </div>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics" data-testid="tab-basics">Basics</TabsTrigger>
            <TabsTrigger value="experience" data-testid="tab-experience">Experience</TabsTrigger>
            <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                data-testid="input-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
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
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={12}
                placeholder="Company Name | Position | Dates&#10;• Achievement 1&#10;• Achievement 2"
                data-testid="input-experience"
              />
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Technical Skills</Label>
              <Textarea
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={6}
                placeholder="List your skills separated by commas"
                data-testid="input-skills"
              />
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projects">Projects</Label>
              <Textarea
                id="projects"
                rows={12}
                placeholder="Project Name | Technologies&#10;• Description and impact&#10;• Key achievements"
                data-testid="input-projects"
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
        <ATSScoreMeter score={78} />
        
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Live Preview</h3>
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
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-serif">{experience}</pre>
              </div>
              
              <div>
                <h2 className="text-lg font-bold mb-2 border-b pb-1">Technical Skills</h2>
                <p className="text-sm leading-relaxed">{skills}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
