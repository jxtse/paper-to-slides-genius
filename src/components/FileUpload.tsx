
import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Using shadcn button

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  selectedFile: File | null;
  clearFile: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onGenerate, isGenerating, selectedFile, clearFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf') {
        onFileSelect(event.target.files[0]);
      } else {
        alert("Please upload a PDF file.");
        event.target.value = ''; // Clear the input
      }
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
       if (event.dataTransfer.files[0].type === 'application/pdf') {
        onFileSelect(event.dataTransfer.files[0]);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);


  return (
    <div className="w-full max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-xl border border-border">
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors
            ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}`}
        >
          <UploadCloud size={64} className="text-primary mb-4" />
          <p className="text-xl font-semibold text-foreground mb-2">Drag & drop your PDF here</p>
          <p className="text-muted-foreground mb-4">or</p>
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              Browse Files
              <input id="file-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} />
            </label>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Only PDF files are accepted.</p>
        </div>
      ) : (
        <div className="text-center">
          <FileText size={48} className="text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">File Selected: {selectedFile.name}</p>
          <p className="text-sm text-muted-foreground mb-6">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={clearFile} variant="outline">
              <XCircle size={18} className="mr-2" />
              Change File
            </Button>
            <Button onClick={onGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Slides Outline'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
