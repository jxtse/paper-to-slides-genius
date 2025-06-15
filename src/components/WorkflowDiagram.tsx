
import React from 'react';
import { UploadCloud, Cpu, FileSliders, Download, Wand } from 'lucide-react';

const steps = [
  { icon: UploadCloud, text: 'Upload' },
  { icon: Cpu, text: 'Analyze' },
  { icon: FileSliders, text: 'Generate Text' },
  { icon: Wand, text: 'Create Graphics' },
  { icon: Download, text: 'Download' },
];

const WorkflowDiagram = () => {
  return (
    <section className="my-16 p-12 bg-white rounded-lg shadow-lg border border-mint">
      <h2 className="text-3xl font-bold text-center text-teal-green mb-12">How It Works</h2>
      
      {/* Mobile View */}
      <div className="flex flex-col justify-center items-center gap-8 md:hidden">
        {steps.map((step, index) => (
          <React.Fragment key={step.text}>
            <div className="flex flex-col items-center text-center w-36">
              <div className="bg-mint/50 p-4 rounded-full mb-3">
                <step.icon className="h-8 w-8 text-teal-green" />
              </div>
              <p className="font-semibold text-teal-green">{step.text}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="h-12 w-1 bg-gradient-to-r from-mauve to-teal-green my-2 rounded-full opacity-70 bg-[length:200%_200%] animate-gradient-flow" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.text}>
              <div className="bg-mint/50 p-4 rounded-full">
                <step.icon className="h-8 w-8 text-teal-green" />
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 bg-gradient-to-r from-mauve to-teal-green mx-4 rounded-full opacity-70 bg-[length:200%_200%] animate-gradient-flow" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          {steps.map((step) => (
            <div key={step.text} className="w-24 text-center">
              <p className="font-semibold text-teal-green">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowDiagram;

