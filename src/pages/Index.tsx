import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import OutlineDisplay from '@/components/OutlineDisplay';
import { Button } from '@/components/ui/button';
import * as pdfjsLib from 'pdfjs-dist';

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
      setExtractedText("Error extracting text.");
      return null;
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setSlideMarkdown(null); // Clear previous outline
    setExtractedText(null); // Clear previous extracted text
    await extractTextFromPdf(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setSlideMarkdown(null);
    setExtractedText(null);
  }

  const mockGenerateOutline = () => {
    // For now, this still uses mock data.
    // In a future step, `extractedText` would be used here or sent to an LLM.
    if (!selectedFile) return;
    if (extractedText) {
      console.log("Generating outline (mock) for file with extracted text available.");
    } else {
      console.log("Generating outline (mock) for file, text extraction might still be in progress or failed.");
    }

    setIsGenerating(true);
    // Simulate API call / LLM processing
    setTimeout(() => {
      const mockPaperName = selectedFile.name.replace('.pdf', '');
      // If we have extracted text, we could potentially use it here in the future
      // For now, the mock remains the same.
      const mockMarkdown = `
# Slide 1: Title - ${mockPaperName}
- Presenter: Your Name
- Date: ${new Date().toLocaleDateString()}
- (Content based on extracted text would go here)

---

# Slide 2: Introduction
- Brief overview of the paper (from extracted text)
- Motivation and problem statement (from extracted text)

---

# Slide 3: Main Points (Example)
- Point 1 from paper (from extracted text)
- Point 2 from paper (from extracted text)

---

# Slide 4: Methodology (Example)
- Approach details (from extracted text)

---

# Slide 5: Results (Example)
- Key findings (from extracted text)

---

# Slide 6: Conclusion
- Summary (from extracted text)

---

# Slide 7: Q&A
- Thank you
      `;
      setSlideMarkdown(mockMarkdown.trim());
      setIsGenerating(false);
    }, 2000);
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
          onGenerate={mockGenerateOutline}
          isGenerating={isGenerating}
          selectedFile={selectedFile}
          clearFile={clearFile}
        />
        
        {/* Optionally, display a snippet of extracted text for debugging/confirmation */}
        {extractedText && (
          <div className="mt-8 p-4 bg-muted rounded-lg max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Extracted Text (Snippet):</h3>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground overflow-auto max-h-40">
              {extractedText.substring(0, 500)}...
            </pre>
            {extractedText === "Error extracting text." && <p className="text-destructive mt-2">Could not extract text from PDF.</p>}
          </div>
        )}

        {slideMarkdown && <OutlineDisplay markdownContent={slideMarkdown} />}

      </main>
      <Footer />
    </div>
  );
};

export default Index;
