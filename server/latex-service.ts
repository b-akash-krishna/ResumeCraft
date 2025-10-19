import type { ResumeContent } from "@shared/schema";

export class LaTeXService {
  generateLaTeX(content: ResumeContent, template: string = "modern"): string {
    if (template === "modern") {
      return this.generateModernTemplate(content);
    } else if (template === "classic") {
      return this.generateClassicTemplate(content);
    } else {
      return this.generateModernTemplate(content);
    }
  }

  private generateModernTemplate(content: ResumeContent): string {
    const { basics, experience, skills, education, projects } = content;

    return `\\\\documentclass[11pt,a4paper]{article}
\\\\usepackage[utf8]{inputenc}
\\\\usepackage[T1]{fontenc}
\\\\usepackage{lmodern}
\\\\usepackage[margin=0.75in]{geometry}
\\\\usepackage{hyperref}
\\\\usepackage{enumitem}
\\\\usepackage{titlesec}
\\\\usepackage{xcolor}

\\\\definecolor{primary}{RGB}{0,102,204}

\\\\titleformat{\\\\section}{\\\\Large\\\\bfseries\\\\color{primary}}{}{0em}{}[\\\\titlerule]
\\\\titleformat{\\\\subsection}{\\\\large\\\\bfseries}{}{0em}{}

\\setlist[itemize]{leftmargin=*,noitemsep,topsep=3pt}

\\pagestyle{empty}

\\begin{document}

\\begin{center}
  {\\Huge\\bfseries ${this.escapeLaTeX(basics.name)}} \\\\[5pt]
  ${this.escapeLaTeX(basics.email)} \\quad ${this.escapeLaTeX(basics.phone)}
\\end{center}

\\vspace{10pt}

\\section*{Professional Summary}
${this.escapeLaTeX(basics.summary)}

\\section*{Professional Experience}
${experience.map(exp => `
\\subsection*{${this.escapeLaTeX(exp.position)} \\hfill ${this.escapeLaTeX(exp.startDate)} -- ${this.escapeLaTeX(exp.endDate || 'Present')}}
\\textit{${this.escapeLaTeX(exp.company)}}
\\begin{itemize}
  ${this.formatBulletPoints(exp.description)}
\\end{itemize}
`).join('\n')}

\\section*{Skills}
${skills.map(skill => `\\textbf{${this.escapeLaTeX(skill)}}`).join(' \\quad ')}

${education && education.length > 0 ? `
\\section*{Education}
${education.map(edu => `
\\subsection*{${this.escapeLaTeX(edu.degree)} \\hfill ${this.escapeLaTeX(edu.year)}}
\\textit{${this.escapeLaTeX(edu.institution)}}
`).join('\n')}
` : ''}

${projects && projects.length > 0 ? `
\\section*{Projects}
${projects.map(proj => `
\\subsection*{${this.escapeLaTeX(proj.name)}}
\\textit{Technologies: ${this.escapeLaTeX(proj.technologies)}}
\\begin{itemize}
  ${this.formatBulletPoints(proj.description)}
\\end{itemize}
`).join('\n')}
` : ''}

\\end{document}`;
  }

  private generateClassicTemplate(content: ResumeContent): string {
    const { basics, experience, skills, education, projects } = content;

    return `\\\\documentclass[11pt,a4paper]{article}
\\\\usepackage[utf8]{inputenc}
\\\\usepackage[margin=1in]{geometry}
\\\\usepackage{enumitem}
\\\\usepackage{titlesec}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\hrule]
\\setlist[itemize]{leftmargin=*,noitemsep}

\\pagestyle{empty}

\\begin{document}

\\begin{center}
  {\\LARGE\\textbf{${this.escapeLaTeX(basics.name)}}} \\\\[8pt]
  ${this.escapeLaTeX(basics.email)} \\quad ${this.escapeLaTeX(basics.phone)}
\\end{center}

\\vspace{12pt}

\\section*{SUMMARY}
${this.escapeLaTeX(basics.summary)}

\\section*{EXPERIENCE}
${experience.map(exp => `
\\textbf{${this.escapeLaTeX(exp.position)}} \\hfill ${this.escapeLaTeX(exp.startDate)} -- ${this.escapeLaTeX(exp.endDate || 'Present')} \\\\
\\textit{${this.escapeLaTeX(exp.company)}}
\\begin{itemize}
  ${this.formatBulletPoints(exp.description)}
\\end{itemize}
`).join('\n')}

\\section*{SKILLS}
${skills.map(skill => this.escapeLaTeX(skill)).join(', ')}

${education && education.length > 0 ? `
\\section*{EDUCATION}
${education.map(edu => `
\\textbf{${this.escapeLaTeX(edu.degree)}} \\hfill ${this.escapeLaTeX(edu.year)} \\\\
${this.escapeLaTeX(edu.institution)}
`).join('\n')}
` : ''}

${projects && projects.length > 0 ? `
\\section*{PROJECTS}
${projects.map(proj => `
\\textbf{${this.escapeLaTeX(proj.name)}} \\\\
\\textit{${this.escapeLaTeX(proj.technologies)}}
\\begin{itemize}
  ${this.formatBulletPoints(proj.description)}
\\end{itemize}
`).join('\n')}
` : ''}

\\end{document}`;
  }

  private escapeLaTeX(text: string): string {
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/[&%$#_{}]/g, '\\$&')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  }

  private formatBulletPoints(text: string): string {
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 1) {
      return `\\item ${this.escapeLaTeX(lines[0])}`;
    }
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        return `\\item ${this.escapeLaTeX(trimmed.substring(1).trim())}`;
      }
      return `\\item ${this.escapeLaTeX(trimmed)}`;
    }).join('\n  ');
  }
}

export const latexService = new LaTeXService();