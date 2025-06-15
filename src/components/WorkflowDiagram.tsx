
import React from 'react';
import { UploadCloud, Cpu, FileSliders, Download } from 'lucide-react';

const steps = [
  { icon: UploadCloud, text: 'Upload' },
  { icon: Cpu, text: 'Analyze' },
  { icon: FileSliders, text: 'Generate' },
  { icon: Download, text: 'Download' },
];

const WorkflowDiagram = () => {
  return (
    <section className="py-16 bg-white/50 rounded-lg my-16">
      <h2 className="text-3xl font-bold text-center text-teal-green mb-12">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.text}>
            <div className="flex flex-col items-center text-center w-36">
              <div className="bg-gradient-to-br from-mint to-white p-4 rounded-full border-2 border-white shadow-md mb-3">
                <step.icon className="h-8 w-8 text-teal-green" />
              </div>
              <p className="font-semibold text-teal-green">{step.text}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden md:block w-16 h-1 bg-gradient-to-r from-mauve to-teal-green mx-4 rounded-full opacity-70" />
            )}
            {index < steps.length - 1 && (
                <div className="md:hidden h-12 w-1 bg-gradient-to-b from-mauve to-teal-green my-2 rounded-full opacity-70" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default WorkflowDiagram;
