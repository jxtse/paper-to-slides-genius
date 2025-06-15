
import React from 'react';

const HeroSection = () => {
  return (
    <section className="text-center mb-16 animate-fade-in">
      <h2 
        className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-mauve to-salmon text-transparent bg-clip-text"
      >
        Transform Your Papers into Engaging Presentations
      </h2>
      <p className="text-xl text-teal-green/70 max-w-3xl mx-auto">
        Upload your academic PDF, and let our AI craft a structured slide outline for you.
      </p>
    </section>
  );
};

export default HeroSection;
