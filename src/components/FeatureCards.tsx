
import React from 'react';
import { BrainCircuit, Zap, Award } from 'lucide-react';

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-mauve" />,
    title: 'AI Intelligence',
    description: 'Leverages advanced AI to understand context and structure your content logically.',
  },
  {
    icon: <Zap className="h-10 w-10 text-salmon" />,
    title: 'Rapid Conversion',
    description: 'Go from a dense paper to a clear slide outline in just a matter of seconds.',
  },
  {
    icon: <Award className="h-10 w-10 text-teal-green" />,
    title: 'Professional Quality',
    description: 'Generates high-quality, professional outlines ready for your presentation.',
  },
];

const FeatureCards = () => {
  return (
    <section className="py-16 my-8">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={feature.title} 
            className="bg-white p-8 rounded-lg border border-mint shadow-lg text-center animate-fade-in"
            style={{ animationDelay: `${index * 150}ms`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-teal-green mb-2">{feature.title}</h3>
            <p className="text-teal-green/80">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
