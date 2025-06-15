
import React from 'react';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <section className="text-center mb-16 animate-fade-in">
      <h2 
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-mauve to-salmon text-transparent bg-clip-text py-2"
      >
        Transform Your Papers into Engaging Presentations
      </h2>
      <p className="text-xl text-teal-green/70 max-w-3xl mx-auto mb-6">
        Upload your academic PDF, and let our AI craft a structured slide outline for you.
      </p>
      <Badge className="bg-teal-green text-white hover:bg-teal-green/90">
        Powered by Gemini 2.5 Pro
      </Badge>
    </section>
  );
};

export default HeroSection;

