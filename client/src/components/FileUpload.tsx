import { Upload, File } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  acceptedFormats?: string;
  maxSizeMB?: number;
}

export default function FileUpload({
  onFileSelect,
  acceptedFormats = ".pdf,.docx,.txt",
  maxSizeMB = 5,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    console.log("File selected:", file.name);
    setSelectedFile(file);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onFileSelect?.(file);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging ? "border-primary bg-primary/5" : "border-border"}
          hover:border-primary hover:bg-primary/5 cursor-pointer
        `}
        data-testid="dropzone-file-upload"
      >
        <input
          type="file"
          accept={acceptedFormats}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          data-testid="input-file"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold mb-1">
                Drop your resume here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOCX, TXT (max {maxSizeMB}MB)
              </p>
            </div>
          </div>
        </label>
      </div>

      {selectedFile && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-card-border">
            <File className="w-5 h-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" data-testid="text-filename">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {uploadProgress < 100 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center" data-testid="text-upload-progress">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          {uploadProgress === 100 && (
            <p className="text-sm text-chart-3 text-center font-medium" data-testid="text-upload-complete">
              Upload complete!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
