'use client';

import React from 'react';

interface ProgressStepperProps {
  currentStep: number;
  steps?: string[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ 
  currentStep, 
  steps = ['Pending', 'In Progress', 'Awaiting Docs', 'Hearing', 'Resolved'] 
}) => {
  return (
    <div className="w-full pt-12 pb-8">
      <div className="flex justify-between items-center relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 -z-10" />
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-lexis-red -translate-y-1/2 -z-10 transition-all duration-1000 ease-in-out" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center gap-4 group">
              <div 
                className={`w-6 h-6 border-2 flex items-center justify-center transition-all duration-300 ${
                  isCompleted ? 'bg-lexis-red border-lexis-red shadow-brutal-red' : 
                  isCurrent ? 'bg-lexis-black border-lexis-red shadow-brutal-red animate-pulse' : 
                  'bg-lexis-black border-white/10'
                }`}
              />
              <span 
                className={`font-mono text-[9px] uppercase tracking-widest text-center max-w-[80px] transition-colors ${
                  isCurrent ? 'text-lexis-red font-bold' : isCompleted ? 'text-white' : 'text-lexis-grey'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
