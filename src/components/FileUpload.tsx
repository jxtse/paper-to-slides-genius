
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
    <div className="w-full max-w-2xl mx-auto bg-mint/20 p-8 rounded-lg shadow-xl border border-transparent">
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all duration-300
            ${isDragging ? 'border-solid border-salmon bg-salmon/20' : 'border-mauve hover:border-solid hover:bg-mint/30'}`}
        >
          <UploadCloud size={64} className="text-salmon mb-4 animate-pulse-salmon" />
          <p className="text-xl font-semibold text-teal-green mb-2">Drag & drop your PDF here</p>
          <p className="text-teal-green/80 mb-4">or</p>
          <Button asChild variant="outline" className="bg-white border-salmon text-salmon hover:bg-salmon hover:text-white transition-all">
            <label htmlFor="file-upload" className="cursor-pointer">
              Browse Files
              <input id="file-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} />
            </label>
          </Button>
          <p className="text-xs text-teal-green/60 mt-4">Only PDF files are accepted.</p>
        </div>
      ) : (
        <div className="text-center">
          <FileText size={48} className="text-mauve mx-auto mb-4" />
          <p className="text-lg font-medium text-teal-green mb-2">File Selected: {selectedFile.name}</p>
          <p className="text-sm text-teal-green/70 mb-6">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={clearFile} variant="outline" className="border-mauve text-mauve hover:bg-mauve hover:text-white transition-all hover:scale-105">
              <XCircle size={18} className="mr-2" />
              Change File
            </Button>
            <Button onClick={onGenerate} disabled={isGenerating} className="bg-salmon text-white hover:bg-salmon/90 transition-transform hover:scale-105">
              {isGenerating ? 'Generating...' : 'Start Your Presentation Journey'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
