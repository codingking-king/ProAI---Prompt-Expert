import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { LayersIcon } from './icons/LayersIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface WelcomePageProps {
  onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center">
        <div className="bg-slate-900/80 p-3 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
    </div>
);

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen w-full gradient-bg text-slate-200 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto">
        <header className="absolute top-0 left-0 w-full p-4">
            <div className="flex items-center opacity-0 fade-in-up-1">
                <SparklesIcon className="w-8 h-8 text-indigo-400" />
                <h1 className="text-2xl font-bold ml-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                ProAI
                </h1>
            </div>
        </header>

        <main className="text-center flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 opacity-0 fade-in-up-2">
              Craft Perfect AI Prompts, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">Instantly</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 opacity-0 fade-in-up-3">
              Transform your simple ideas into expert-level instructions for any AI platform. Go from concept to creation faster than ever before.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 opacity-0 fade-in-up-4"
            >
              Get Started Now
            </button>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl opacity-0 fade-in-up-5">
            <FeatureCard
              icon={<BrainCircuitIcon className="w-7 h-7 text-indigo-400" />}
              title="Expert-Level Quality"
              description="Generate prompts with the detail and nuance of a 15+ year experienced prompt engineer."
            />
            <FeatureCard
              icon={<LayersIcon className="w-7 h-7 text-purple-400" />}
              title="Multi-Platform Support"
              description="Create tailored prompts for text, image, video, and audio generation AIs like GPT-4, MidJourney, and more."
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-7 h-7 text-emerald-400" />}
              title="Flexible & Powerful"
              description="Start with a generous free plan and upgrade to ProAI Plus for limitless creativity and advanced features."
            />
          </div>
        </main>
      </div>
      <footer className="absolute bottom-4 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} ProAI. All rights reserved.
      </footer>
    </div>
  );
};

export default WelcomePage;