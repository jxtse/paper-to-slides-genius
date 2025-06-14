
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ImageSuggestionState } from '@/hooks/useImageGeneration';

interface ImageSuggestionProps {
  description: string;
  suggestionKey: string;
  state: ImageSuggestionState;
  onGenerate: (description: string, key: string) => void;
}

const ImageSuggestion: React.FC<ImageSuggestionProps> = ({ description, suggestionKey, state, onGenerate }) => {
  return (
    <div className="my-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <ImageIcon className="lucide lucide-image mr-2 text-blue-500 flex-shrink-0 mt-1" size={20} />
          <span className="text-sm text-blue-700"><em>{description}</em></span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onGenerate(description, suggestionKey)}
          disabled={state.isLoading}
          className="ml-4 flex-shrink-0"
        >
          {state.isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Generate SVG
        </Button>
      </div>
      {state.isLoading && (
        <div className="mt-2 text-sm text-blue-600">Generating SVG, please wait...</div>
      )}
      {state.error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          Error: {state.error}
        </div>
      )}
      {state.svgCode && (
        <div className="mt-3 p-2 border border-gray-300 rounded bg-white overflow-auto max-h-96">
          <div className="w-full h-auto" dangerouslySetInnerHTML={{ __html: state.svgCode }} />
        </div>
      )}
    </div>
  );
};

export default ImageSuggestion;
