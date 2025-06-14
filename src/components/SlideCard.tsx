
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
  
  const fullContentString = contentLines.join('\n');
  const imageSuggestionRegex = /\[Suggested Image:\s*(.*?)\]/g;
  
  let lastIndex = 0;
  const elements: (string | JSX.Element)[] = [];
  let match;

  while ((match = imageSuggestionRegex.exec(fullContentString)) !== null) {
    if (match.index > lastIndex) {
      elements.push(fullContentString.substring(lastIndex, match.index));
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
  
  if (lastIndex < fullContentString.length) {
    elements.push(fullContentString.substring(lastIndex));
  }

  const renderedElements: JSX.Element[] = [];
  elements.forEach((element, index) => {
    if (typeof element === 'string') {
      const textLines = element.split('\n').filter(line => line.trim());
      textLines.forEach((line, lineIndex) => {
        const isBullet = /^\s*[\*-]\s/.test(line);
        const text = line.replace(/^\s*[\*-]\s/, '');

        if (isBullet && text) {
          renderedElements.push(
            <div key={`text-${index}-${lineIndex}`} className="flex items-start">
              <span className="mr-3 mt-1 text-primary text-sm">●</span>
              <span>{text}</span>
            </div>
          );
        }
      });
    } else {
      renderedElements.push(<div key={`img-${index}`}>{element}</div>);
    }
  });


  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary">{titleLine.replace(/^#+\s*/, '')}</CardTitle>
        {slideIndex === 0 && <CardDescription>This is a preview of your slide outline. Click "Generate SVG" to attempt image creation with Gemini.</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-foreground">
          {renderedElements}
        </div>
      </CardContent>
    </Card>
  );
};

export default SlideCard;
