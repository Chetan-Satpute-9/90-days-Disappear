import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, ShieldAlert, Target, Zap } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "You Lack Discipline",
    description: "Most people fail because they lack a system. The world is designed to distract you. It's time to disappear and rebuild.",
    icon: <ShieldAlert className="w-16 h-16 text-red-500" />,
    color: "from-red-900/20 to-black"
  },
  {
    title: "90-Day Transformation",
    description: "In 90 days, you won't recognize yourself. This isn't a hobby. It's a complete identity shift.",
    icon: <Target className="w-16 h-16 text-blue-500" />,
    color: "from-blue-900/20 to-black"
  },
  {
    title: "The Strict System",
    description: "10 daily habits. No excuses. Missing a full day resets your streak. This is where the weak are separated from the strong.",
    icon: <Zap className="w-16 h-16 text-yellow-500" />,
    color: "from-yellow-900/20 to-black"
  },
  {
    title: "Ready to Disappear?",
    description: "The challenge starts now. Commit to the next 90 days. Your future self is waiting.",
    icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
    color: "from-green-900/20 to-black"
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b ${steps[currentStep].color}`}
        >
          <div className="mb-8 p-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            {steps[currentStep].icon}
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-4 tracking-tight">
            {steps[currentStep].title}
          </h1>
          
          <p className="text-lg text-gray-400 text-center max-w-md leading-relaxed">
            {steps[currentStep].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="p-8 flex flex-col items-center gap-6 bg-black">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? "w-8 bg-white" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full max-w-md py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors active:scale-95"
        >
          {currentStep === steps.length - 1 ? "START CHALLENGE" : "CONTINUE"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
