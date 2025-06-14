
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Using shadcn card
import { Lightbulb, Image as ImageIcon } from 'lucide-react'; // Added ImageIcon

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
        const titleLine = lines.find(line => line.startsWith('# Slide')) || lines[0] || `Slide ${slideIndex + 1}`;
        // Filter out the title line for content processing
        const contentLines = lines.filter(line => line !== titleLine);
        const content = contentLines.join('\n');

        // Regex to find [Suggested Image: description]
        const imageSuggestionRegex = /\[Suggested Image:\s*(.*?)\]/g;
        
        // Process content for image suggestions and standard markdown
        const processedContent = content
          .replace(imageSuggestionRegex, (match, description) => {
            return `<div class="my-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image mr-2 text-blue-500 flex-shrink-0"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <span class="text-sm text-blue-700"><em>${description.trim()}</em></span>
                    </div>`;
          })
          .replace(/\n/g, '<br />'); // Basic newline to <br>

        return (
          <Card key={slideIndex} className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{titleLine.replace(/^#+\s*/, '')}</CardTitle>
              {slideIndex === 0 && <CardDescription>This is a preview of your slide outline. Image suggestions are highlighted.</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: processedContent }}
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
          <strong>Note:</strong> This is a sample outline. AI will now also suggest placements for images.
          Actual image generation and PPTX generation would require further steps.
        </p>
      </div>
      <div>{renderMarkdown(markdownContent)}</div>
    </div>
  );
};

export default OutlineDisplay;
