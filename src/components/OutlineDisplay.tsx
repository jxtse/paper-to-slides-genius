
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Download } from 'lucide-react';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { generatePptx } from '@/lib/pptxGenerator';
import SlideCard from './SlideCard';

interface OutlineDisplayProps {
  markdownContent: string | null;
  extractedText: string | null;
  extractedImages: string[];
}

const OutlineDisplay: React.FC<OutlineDisplayProps> = ({ markdownContent, extractedText, extractedImages }) => {
  const [isPptxGenerating, setIsPptxGenerating] = useState(false);
  const { imageStates, handleGenerateSvg } = useImageGeneration(extractedText);

  if (!markdownContent) {
    return null;
  }

  const handleDownloadPptx = async () => {
    setIsPptxGenerating(true);
    // Note: extractedImages are not yet being passed to the generator.
    // This will be the next step.
    await generatePptx(markdownContent, imageStates);
    setIsPptxGenerating(false);
  };

  const slides = markdownContent.split('---');

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Generated Slide Outline</h2>
        <Button onClick={handleDownloadPptx} disabled={isPptxGenerating}>
          {isPptxGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download .pptx
        </Button>
      </div>
      <div>
        {slides.map((slideMd, index) => (
          <SlideCard
            key={index}
            slideMd={slideMd}
            slideIndex={index}
            imageStates={imageStates}
            onGenerateSvg={handleGenerateSvg}
          />
        ))}
      </div>
    </div>
  );
};

export default OutlineDisplay;
