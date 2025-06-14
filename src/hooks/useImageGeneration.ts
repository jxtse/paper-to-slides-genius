
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ImageSuggestionState {
  svgCode?: string;
  isLoading: boolean;
  error?: string;
}

export const useImageGeneration = (extractedText: string | null) => {
  const [imageStates, setImageStates] = useState<Map<string, ImageSuggestionState>>(new Map());

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

  return { imageStates, handleGenerateSvg };
};
