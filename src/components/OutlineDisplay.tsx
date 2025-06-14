
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Using shadcn card
import { Lightbulb } from 'lucide-react';

interface OutlineDisplayProps {
  markdownContent: string | null;
}

const OutlineDisplay: React.FC<OutlineDisplayProps> = ({ markdownContent }) => {
  if (!markdownContent) {
    return null;
  }

  // Basic Markdown to HTML conversion for demonstration
  // A proper library like 'marked' or 'react-markdown' would be better for rich features.
  const renderMarkdown = (md: string) => {
    return md
      .split('---') // Split by slide delimiter
      .map((slideMd, slideIndex) => {
        const lines = slideMd.trim().split('\n');
        const title = lines[0] || `Slide ${slideIndex + 1}`;
        const content = lines.slice(1).join('\n');

        return (
          <Card key={slideIndex} className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{title.replace(/^#+\s*/, '')}</CardTitle>
              {slideIndex === 0 && <CardDescription>This is a preview of your slide outline.</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<span class="text-accent-foreground italic">[Image: $1 - $2 (placeholder)]</span>') // Placeholder for images
                    .replace(/\n/g, '<br />')
                }}
              />
            </CardContent>
          </Card>
        );
      })
  };


  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Generated Slide Outline</h2>
      <div className="bg-accent/10 p-4 rounded-lg mb-6 flex items-start">
        <Lightbulb className="text-accent-foreground h-5 w-5 mr-3 mt-1 flex-shrink-0" />
        <p className="text-sm text-accent-foreground">
          <strong>Note:</strong> This is a sample outline. Actual LLM integration and PPTX generation would require backend processing. Images are shown as placeholders.
        </p>
      </div>
      <div>{renderMarkdown(markdownContent)}</div>
    </div>
  );
};

export default OutlineDisplay;
