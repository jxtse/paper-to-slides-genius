
import React from 'react';
import { BrainCircuit, Zap, Wand, FileText, Image } from 'lucide-react';

const features = [
  {
    icon: (
      <div className="flex h-10 w-auto items-center justify-center gap-2">
        <BrainCircuit className="h-10 w-10 text-mauve" />
        <Wand className="h-10 w-10 text-mauve" />
      </div>
    ),
    title: 'Dual AI Power',
    description: 'Leverages Gemini 2.5 Pro to generate both structured content and matching SVG graphics.',
  },
  {
    icon: <Zap className="h-10 w-10 text-salmon" />,
    title: 'Rapid Conversion',
    description: 'Go from a dense paper to a clear slide outline, complete with visuals, in just a matter of seconds.',
  },
  {
    icon: (
      <div className="flex h-10 w-auto items-center justify-center gap-2">
        <FileText className="h-10 w-10 text-teal-green" />
        <Image className="h-10 w-10 text-teal-green" />
      </div>
    ),
    title: 'Text + Graphics',
    description: 'Generates comprehensive presentations with both content and visual elements.',
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

