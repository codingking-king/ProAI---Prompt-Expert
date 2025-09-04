

import React, { useState, useEffect, useCallback } from 'react';
import type { PromptCategory, PromptFormData } from '../types';
import { INDUSTRIES, OUTPUT_STYLES, TARGET_PLATFORMS } from '../constants';
import { CopyIcon } from './icons/CopyIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { toast } from 'react-hot-toast';
import Spinner from './common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import Tooltip from './common/Tooltip';
import { generateKeywords } from '../services/geminiService';
import { PlusIcon } from './icons/PlusIcon';

interface MainWorkspaceProps {
  category: PromptCategory;
  onGenerate: (formData: PromptFormData) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

const MainWorkspace: React.FC<MainWorkspaceProps> = ({ category, onGenerate, isLoading, error }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PromptFormData>({
    useCase: '',
    industry: INDUSTRIES[0],
    style: OUTPUT_STYLES[0],
    platform: TARGET_PLATFORMS[0],
    constraints: '',
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);

  useEffect(() => {
    // Reset form when category changes
    setFormData({
      useCase: '',
      industry: INDUSTRIES[0],
      style: OUTPUT_STYLES[0],
      platform: TARGET_PLATFORMS[0],
      constraints: '',
    });
    setGeneratedPrompt('');
    setSuggestedKeywords([]);
  }, [category]);
  
  useEffect(() => {
    if (formData.useCase.trim().length < 15) {
      setSuggestedKeywords([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsGeneratingKeywords(true);
      try {
        const keywords = await generateKeywords(formData.useCase);
        setSuggestedKeywords(keywords);
      } catch (err) {
        console.error("Failed to generate keywords:", err);
        setSuggestedKeywords([]); // Clear on error
      } finally {
        setIsGeneratingKeywords(false);
      }
    }, 750); // 750ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [formData.useCase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !formData.useCase || !user) return;
    const result = await onGenerate(formData);
    if (result) {
      setGeneratedPrompt(result);
    }
  };

  const handleCopy = useCallback(() => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt).then(() => {
        toast.success('Copied to clipboard!');
      });
    }
  }, [generatedPrompt]);

  const handleAddKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints ? `${prev.constraints}, ${keyword}` : keyword
    }));
  };

  const renderSelect = (name: keyof PromptFormData, label: string, options: string[]) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
  
  // Determine button state and text
  let buttonText = 'Generate Prompt';
  let isButtonDisabled = isLoading || !formData.useCase;
  let tooltipText = '';

  if (user) {
    if (user.isPremium) {
      const hasEnoughCredits = user.credits >= category.creditCost;
      buttonText = `Generate (${category.creditCost} Credits)`;
      isButtonDisabled = isButtonDisabled || !hasEnoughCredits;
      if (!hasEnoughCredits) tooltipText = "You don't have enough credits.";
    } else {
      const limit = category.dailyLimit;
      const usage = user.usage ? user.usage[category.id] ?? 0 : 0;
      const remaining = limit !== undefined ? limit - usage : 0;
      
      const hasEnoughCredits = user.credits >= category.creditCost;
      const hasAttemptsLeft = limit !== undefined ? usage < limit : false;

      buttonText = `Generate (Cost: ${category.creditCost}, ${remaining}/${limit} left)`;
      isButtonDisabled = isButtonDisabled || !hasEnoughCredits || !hasAttemptsLeft;
      
      if (!hasEnoughCredits) {
        tooltipText = "You don't have enough credits for this action.";
      } else if (!hasAttemptsLeft) {
        tooltipText = "You've reached your daily limit for this category.";
      }
    }
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{category.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{category.description}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="useCase" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              What do you want to create? <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
              id="useCase"
              name="useCase"
              rows={4}
              value={formData.useCase}
              onChange={handleInputChange}
              placeholder="e.g., A cinematic photo of a baby playing with a toy car, or a professional resignation email."
              required
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>
          
          {(isGeneratingKeywords || suggestedKeywords.length > 0) && (
            <div className="h-16">
              <h4 className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-2">Keyword Suggestions</h4>
              {isGeneratingKeywords ? (
                <div className="flex items-center text-sm text-slate-400 animate-pulse">
                  Generating keywords...
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {suggestedKeywords.map((keyword, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAddKeyword(keyword)}
                      className="flex items-center text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      <PlusIcon className="w-3 h-3 mr-1.5" />
                      {keyword}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderSelect('industry', 'Industry / Context', INDUSTRIES)}
            {renderSelect('style', 'Output Style', OUTPUT_STYLES)}
            {renderSelect('platform', 'Target Platform', TARGET_PLATFORMS)}
          </div>
          
          <div>
            <label htmlFor="constraints" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Additional Constraints</label>
            <input
              type="text"
              id="constraints"
              name="constraints"
              value={formData.constraints}
              onChange={handleInputChange}
              placeholder="e.g., polite but firm tone, 200-250 words, warm soft lighting"
              className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="pt-2">
            <Tooltip text={tooltipText}>
                <button
                type="submit"
                disabled={isButtonDisabled}
                className="w-full flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-md shadow-lg transition-all duration-200 ease-in-out hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50"
                >
                {isLoading ? (
                    <>
                    <Spinner />
                    Generating...
                    </>
                ) : (
                    <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {buttonText}
                    </>
                )}
                </button>
            </Tooltip>
          </div>
        </form>
        
        {error && <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">{error}</div>}

        {generatedPrompt && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Expert Prompt</h3>
            <div className="relative mt-2 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              <code>{generatedPrompt}</code>
              <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300">
                <CopyIcon className="w-5 h-5"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainWorkspace;
