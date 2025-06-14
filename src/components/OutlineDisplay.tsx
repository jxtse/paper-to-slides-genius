
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added Button
import { Lightbulb, Image as ImageIcon, Loader2 } from 'lucide-react'; // Added Loader2
import { supabase } from '@/integrations/supabase/client'; // Added Supabase client
import { toast } from 'sonner'; // Added toast

interface OutlineDisplayProps {
  markdownContent: string | null;
  extractedText: string | null; // Added extractedText for context
}

interface ImageSuggestionState {
  svgCode?: string;
  isLoading: boolean;
  error?: string;
}

const OutlineDisplay: React.FC<OutlineDisplayProps> = ({ markdownContent, extractedText }) => {
  const [imageStates, setImageStates] = useState<Map<string, ImageSuggestionState>>(new Map());

  if (!markdownContent) {
    return null;
  }

  const handleGenerateSvg = async (imagePrompt: string, suggestionKey: string) => {
    if (!extractedText) {
      toast.error("Source document text is not available for context.");
      return;
    }

    setImageStates(prev => new Map(prev).set(suggestionKey, { isLoading: true }));
    toast.info(`Generating SVG for: "${imagePrompt.substring(0, 30)}..."`, { id: `svg-${suggestionKey}`});

    try {
      const { data, error } = await supabase.functions.invoke('generate-svg-gemini', {
        body: { imagePrompt, sourcePaperText: extractedText },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        toast.error(`Failed to generate SVG: ${data.error}`, { id: `svg-${suggestionKey}`});
        setImageStates(prev => new Map(prev).set(suggestionKey, { isLoading: false, error: data.error || "Unknown error from function" }));
      } else if (data.svgCode) {
        toast.success("SVG generated successfully!", { id: `svg-${suggestionKey}`});
        setImageStates(prev => new Map(prev).set(suggestionKey, { isLoading: false, svgCode: data.svgCode }));
      } else {
        // This case might include the "AI could not generate SVG for this prompt." or "AI response was not in expected SVG format."
        const message = data.rawResponse ? `AI response issue: ${data.rawResponse}` : "SVG generation did not return valid code.";
        toast.warning(message, { id: `svg-${suggestionKey}`});
        setImageStates(prev => new Map(prev).set(suggestionKey, { isLoading: false, error: message }));
      }

    } catch (e: any) {
      console.error("Error invoking generate-svg-gemini function:", e);
      toast.error(`SVG Generation Error: ${e.message}`, { id: `svg-${suggestionKey}`});
      setImageStates(prev => new Map(prev).set(suggestionKey, { isLoading: false, error: e.message }));
    }
  };


  const renderMarkdown = (md: string) => {
    return md
      .split('---')
      .map((slideMd, slideIndex) => {
        const lines = slideMd.trim().split('\n');
        const titleLine = lines.find(line => line.startsWith('# Slide')) || lines[0] || `Slide ${slideIndex + 1}`;
        const contentLines = lines.filter(line => line !== titleLine);
        const rawContent = contentLines.join('\n');

        const imageSuggestionRegex = /\[Suggested Image:\s*(.*?)\]/g;
        
        let lastIndex = 0;
        const elements: (string | JSX.Element)[] = [];
        let match;

        // Manual parsing to intersperse text and JSX elements for image suggestions
        while ((match = imageSuggestionRegex.exec(rawContent)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            elements.push(rawContent.substring(lastIndex, match.index).replace(/\n/g, '<br />'));
          }
          
          const imageDescription = match[1].trim();
          const suggestionKey = `slide-${slideIndex}-img-${match.index}`;
          const currentImageState = imageStates.get(suggestionKey) || { isLoading: false };

          elements.push(
            <div key={suggestionKey} className="my-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <ImageIcon className="lucide lucide-image mr-2 text-blue-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm text-blue-700"><em>{imageDescription}</em></span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerateSvg(imageDescription, suggestionKey)}
                  disabled={currentImageState.isLoading}
                  className="ml-4 flex-shrink-0"
                >
                  {currentImageState.isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lightbulb className="mr-2 h-4 w-4" /> // Or a specific SVG icon
                  )}
                  Generate SVG
                </Button>
              </div>
              {currentImageState.isLoading && (
                <div className="mt-2 text-sm text-blue-600">Generating SVG, please wait...</div>
              )}
              {currentImageState.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                  Error: {currentImageState.error}
                </div>
              )}
              {currentImageState.svgCode && (
                <div className="mt-3 p-2 border border-gray-300 rounded bg-white overflow-auto max-h-96">
                  <div className="w-full h-auto" dangerouslySetInnerHTML={{ __html: currentImageState.svgCode }} />
                </div>
              )}
            </div>
          );
          lastIndex = imageSuggestionRegex.lastIndex;
        }
        // Add any remaining text after the last match
        if (lastIndex < rawContent.length) {
          elements.push(rawContent.substring(lastIndex).replace(/\n/g, '<br />'));
        }

        // Combine elements, ensuring strings are correctly handled for dangerouslySetInnerHTML
        const combinedHtml = elements.map(el => typeof el === 'string' ? el : '').join('');
        const jsxElements = elements.filter(el => typeof el !== 'string');


        return (
          <Card key={slideIndex} className="mb-6 shadow-lg">
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
      })
  };


  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Generated Slide Outline</h2>
      <div className="bg-accent/10 p-4 rounded-lg mb-6 flex items-start">
        <Lightbulb className="text-accent-foreground h-5 w-5 mr-3 mt-1 flex-shrink-0" />
        <p className="text-sm text-accent-foreground">
          <strong>Note:</strong> This is an experimental feature. The AI (Gemini 1.5 Flash) will attempt to generate SVG code for image suggestions.
          Success and quality may vary.
        </p>
      </div>
      <div>{renderMarkdown(markdownContent)}</div>
    </div>
  );
};

export default OutlineDisplay;
