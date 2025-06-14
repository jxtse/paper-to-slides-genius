
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageSuggestionState } from '@/hooks/useImageGeneration';
import ImageSuggestion from './ImageSuggestion';

interface SlideCardProps {
  slideMd: string;
  slideIndex: number;
  imageStates: Map<string, ImageSuggestionState>;
  onGenerateSvg: (description: string, key: string) => void;
}

const SlideCard: React.FC<SlideCardProps> = ({ slideMd, slideIndex, imageStates, onGenerateSvg }) => {
  const lines = slideMd.trim().split('\n');
  const titleLine = lines.find(line => line.startsWith('#')) || lines[0] || `Slide ${slideIndex + 1}`;
  const contentLines = lines.filter(line => line !== titleLine);
  const rawContent = contentLines.join('\n');

  const imageSuggestionRegex = /\[Suggested Image:\s*(.*?)\]/g;
  
  let lastIndex = 0;
  const elements: (string | JSX.Element)[] = [];
  let match;

  while ((match = imageSuggestionRegex.exec(rawContent)) !== null) {
    if (match.index > lastIndex) {
      elements.push(rawContent.substring(lastIndex, match.index).replace(/\n/g, '<br />'));
    }
    
    const imageDescription = match[1].trim();
    const suggestionKey = `slide-${slideIndex}-img-${match.index}`;
    const currentImageState = imageStates.get(suggestionKey) || { isLoading: false };

    elements.push(
      <ImageSuggestion
        key={suggestionKey}
        description={imageDescription}
        suggestionKey={suggestionKey}
        state={currentImageState}
        onGenerate={onGenerateSvg}
      />
    );
    lastIndex = imageSuggestionRegex.lastIndex;
  }
  
  if (lastIndex < rawContent.length) {
    elements.push(rawContent.substring(lastIndex).replace(/\n/g, '<br />'));
  }

  const combinedHtml = elements.map(el => typeof el === 'string' ? el : '').join('');
  const jsxElements = elements.filter(el => typeof el !== 'string');

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary">{titleLine.replace(/^#+\s*/, '')}</CardTitle>
        {slideIndex === 0 && <CardDescription>This is a preview of your slide outline. Click "Generate SVG" to attempt image creation with Gemini.</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-foreground">
          {jsxElements.map((el, idx) => <React.Fragment key={idx}>{el}</React.Fragment>)}
          <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SlideCard;
