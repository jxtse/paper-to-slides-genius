import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import OutlineDisplay from '@/components/OutlineDisplay';
import { Button } from '@/components/ui/button';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { toast } from 'sonner'; // Import toast for notifications

// Required for pdfjs-dist to work
// You might need to host these worker files or adjust the path depending on your bundler setup.
// For Vite, placing them in public and referencing them like this often works.
// Ensure `pdf.worker.min.mjs` is in your `public` folder.
// If you installed `pdfjs-dist`, it should be in `node_modules/pdfjs-dist/build/`.
// You may need to copy `pdf.worker.min.mjs` to your `public` directory.
// For now, we'll try a CDN path for simplicity, but local hosting is better for production.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const Index: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slideMarkdown, setSlideMarkdown] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const extractTextFromPdf = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
      }
      setExtractedText(fullText);
      console.log("Extracted PDF Text:", fullText.substring(0, 500) + "..."); // Log first 500 chars
      return fullText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      toast.error("Error extracting text from PDF.", {
        description: (error as Error).message
      });
      setExtractedText("Error extracting text.");
      return null;
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setSlideMarkdown(null); // Clear previous outline
    setExtractedText(null); // Clear previous extracted text
    toast.info("Extracting text from PDF...", { id: "pdf-extraction" });
    const text = await extractTextFromPdf(file);
    if (text && text !== "Error extracting text.") {
      toast.success("Text extracted successfully!", { id: "pdf-extraction" });
    } else if (text === "Error extracting text.") {
      // Error toast already shown in extractTextFromPdf
      toast.dismiss("pdf-extraction");
    } else {
      toast.warning("Text extraction complete, but no text found or minor issue.", {id: "pdf-extraction"});
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setSlideMarkdown(null);
    setExtractedText(null);
  }

  const handleGenerateOutline = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }
    if (!extractedText || extractedText === "Error extracting text.") {
      toast.error("Text not extracted from PDF or extraction failed. Please re-upload or try another file.");
      return;
    }

    setIsGenerating(true);
    setSlideMarkdown(null); // Clear previous outline while generating new one
    toast.info("Generating slide outline with Gemini AI...", { id: "gemini-generation" });

    try {
      console.log("Invoking Supabase function 'generate-outline'");
      const { data, error } = await supabase.functions.invoke('generate-outline', {
        body: { extractedText },
      });

      if (error) {
        console.error("Error invoking Supabase function:", error);
        toast.error("Failed to generate outline.", {
          description: error.message,
          id: "gemini-generation",
        });
        setSlideMarkdown(`Error generating outline: ${error.message}`);
        return;
      }

      if (data && data.slideMarkdown) {
        console.log("Received outline from Supabase function:", data.slideMarkdown.substring(0,100)+"...");
        setSlideMarkdown(data.slideMarkdown);
        toast.success("Slide outline generated successfully!", { id: "gemini-generation" });
      } else if (data && data.error) {
        console.error("Error from Supabase function logic:", data.error);
        toast.error("Failed to generate outline.", {
          description: data.error,
          id: "gemini-generation",
        });
        setSlideMarkdown(`Error generating outline: ${data.error}`);
      } 
      else {
        console.error("Unexpected response from Supabase function:", data);
        toast.error("Received an unexpected response from the generation service.", { id: "gemini-generation" });
        setSlideMarkdown("Error: Unexpected response from generation service.");
      }
    } catch (invokeError) {
      console.error("Critical error calling Supabase function:", invokeError);
      toast.error("A critical error occurred while trying to generate the outline.", {
        description: (invokeError as Error).message,
        id: "gemini-generation",
      });
      setSlideMarkdown(`Critical error: ${(invokeError as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Transform Your Papers into Engaging Presentations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your academic PDF, and let our AI craft a structured slide outline for you.
            Effortless, intelligent, and fast.
          </p>
        </section>

        <FileUpload
          onFileSelect={handleFileSelect}
          onGenerate={handleGenerateOutline} // Updated to new handler
          isGenerating={isGenerating}
          selectedFile={selectedFile}
          clearFile={clearFile}
        />
        
        {extractedText && extractedText !== "Error extracting text." && (
          <div className="mt-8 p-4 bg-muted rounded-lg max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Extracted Text (Snippet):</h3>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground overflow-auto max-h-40">
              {extractedText.substring(0, 500)}...
            </pre>
          </div>
        )}
        {extractedText === "Error extracting text." && (
            <div className="mt-8 p-4 bg-destructive/10 rounded-lg max-w-3xl mx-auto">
                <p className="text-destructive text-center font-semibold">Could not extract text from PDF. Please try another file.</p>
            </div>
        )}

        {slideMarkdown && <OutlineDisplay markdownContent={slideMarkdown} />}

      </main>
      <Footer />
    </div>
  );
};

export default Index;
