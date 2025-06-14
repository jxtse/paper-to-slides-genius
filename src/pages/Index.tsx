import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import OutlineDisplay from '@/components/OutlineDisplay';
import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ExtractedImagesDisplay from '@/components/ExtractedImagesDisplay';

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
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  useEffect(() => {
    // Reset expansion when a new file's text is extracted
    if (extractedText) {
      setIsTextExpanded(false);
    }
  }, [extractedText]);

  const processPdf = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const imageUrls: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        
        // 1. Extract Text
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
        
        // 2. Extract Images
        const operatorList = await page.getOperatorList();
        const processedImageNames = new Set<string>();
        
        for (let j = 0; j < operatorList.fnArray.length; j++) {
            const op = operatorList.fnArray[j];
            if (op === pdfjsLib.OPS.paintImageXObject) {
                const imageName = operatorList.argsArray[j][0];
                if (processedImageNames.has(imageName)) {
                    continue; // Already processed this image on this page.
                }
                processedImageNames.add(imageName);

                try {
                    const img = await page.objs.get(imageName);
                    if (!img || !img.data) continue;

                    const { width, height, data } = img;
                    if (!width || !height || !data) continue;
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) continue;

                    const imageData = ctx.createImageData(width, height);
                    const pixelData = imageData.data;
                    
                    if (data.length === width * height * 4) { // RGBA
                        pixelData.set(data);
                    } else if (data.length === width * height * 3) { // RGB
                        for (let k = 0, l = 0; k < data.length; k += 3, l += 4) {
                            pixelData[l] = data[k];
                            pixelData[l + 1] = data[k + 1];
                            pixelData[l + 2] = data[k + 2];
                            pixelData[l + 3] = 255;
                        }
                    } else if (data.length === width * height) { // Grayscale
                        for (let k = 0, l = 0; k < data.length; k++, l += 4) {
                            pixelData[l] = data[k];
                            pixelData[l + 1] = data[k];
                            pixelData[l + 2] = data[k];
                            pixelData[l + 3] = 255;
                        }
                    } else {
                        console.warn(`Skipping image with unhandled data format. Data length: ${data.length}, WxH: ${width*height}`);
                        continue;
                    }

                    ctx.putImageData(imageData, 0, 0);
                    imageUrls.push(canvas.toDataURL('image/png'));
                } catch (e) {
                    console.error("Error processing an image on page", i, e);
                }
            }
        }
      }

      setExtractedText(fullText);
      setExtractedImages(imageUrls);
      console.log(`Extracted ${imageUrls.length} images.`);
      console.log("Extracted PDF Text:", fullText.substring(0, 500) + "...");
      
      return { text: fullText, images: imageUrls };

    } catch (error) {
      console.error("Error processing PDF:", error);
      toast.error("Error processing PDF.", {
        description: (error as Error).message
      });
      setExtractedText("Error extracting text.");
      setExtractedImages([]);
      return null;
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setSlideMarkdown(null); // Clear previous outline
    setExtractedText(null); // Clear previous extracted text
    setExtractedImages([]); // Clear previous images
    toast.info("Processing PDF (text and images)...", { id: "pdf-processing" });
    const result = await processPdf(file);
    
    if (result) {
      if (result.text && result.text !== "Error extracting text.") {
        toast.success("PDF processed successfully!", { id: "pdf-processing" });
        if (result.images.length > 0) {
            toast.info(`${result.images.length} image(s) extracted.`);
        }
      } else {
        toast.dismiss("pdf-processing");
      }
    } else {
      toast.error("Failed to process PDF.", {id: "pdf-processing"});
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setSlideMarkdown(null);
    setExtractedText(null);
    setExtractedImages([]);
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
        <section className="text-center mb-16 p-12 bg-card rounded-xl shadow-lg">
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
          onGenerate={handleGenerateOutline}
          isGenerating={isGenerating}
          selectedFile={selectedFile}
          clearFile={clearFile}
        />
        
        {extractedText && extractedText !== "Error extracting text." && (
          <div className="mt-8 p-4 bg-muted rounded-lg max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-foreground">
                    {isTextExpanded ? "Extracted Text" : "Extracted Text (Snippet)"}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setIsTextExpanded(!isTextExpanded)}>
                    <Expand className="mr-2 h-4 w-4" />
                    <span>{isTextExpanded ? "Collapse" : "Expand"}</span>
                </Button>
            </div>
            <pre className={`whitespace-pre-wrap text-sm text-muted-foreground overflow-auto transition-all duration-300 ${isTextExpanded ? 'max-h-[60vh]' : 'max-h-40'}`}>
              {isTextExpanded ? extractedText : `${extractedText.substring(0, 500)}...`}
            </pre>
          </div>
        )}
        {extractedText === "Error extracting text." && (
            <div className="mt-8 p-4 bg-destructive/10 rounded-lg max-w-3xl mx-auto">
                <p className="text-destructive text-center font-semibold">Could not extract text from PDF. Please try another file.</p>
            </div>
        )}
        
        {extractedImages.length > 0 && <ExtractedImagesDisplay images={extractedImages} />}

        {slideMarkdown && <OutlineDisplay markdownContent={slideMarkdown} extractedText={extractedText} extractedImages={extractedImages} />}

      </main>
      <Footer />
    </div>
  );
};

export default Index;
