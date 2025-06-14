
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExtractedImagesDisplayProps {
  images: string[];
}

const ExtractedImagesDisplay: React.FC<ExtractedImagesDisplayProps> = ({ images }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Extracted Images ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            These are the images found in your PDF. Support for adding them to the presentation is coming soon!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((src, index) => (
              <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
                <img
                  src={src}
                  alt={`Extracted image ${index + 1}`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtractedImagesDisplay;
