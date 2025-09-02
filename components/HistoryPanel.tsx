
import React, { useState } from 'react';
import type { HistoryItem } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { StarIcon } from './icons/StarIcon';
import Tooltip from './common/Tooltip';
import toast from 'react-hot-toast';

interface HistoryPanelProps {
  history: HistoryItem[];
  onToggleFavorite: (id: number) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onToggleFavorite }) => {

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  if (history.length === 0) {
    return (
        <div className="h-48 border-t border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-500">Your generated prompts will appear here.</p>
        </div>
    );
  }

  return (
    <div className="h-48 flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 p-4 overflow-hidden">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">HISTORY</h3>
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-4">
          {history.map(item => (
            <div key={item.id} className="w-80 flex-shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div>
                <span className="text-xs font-bold text-indigo-800 dark:text-indigo-400 bg-indigo-200 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">{item.category}</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{item.prompt}</p>
              </div>
              <div className="flex items-center justify-end space-x-1 mt-3">
                <Tooltip text="Favorite">
                  <button 
                    onClick={() => onToggleFavorite(item.id)}
                    className="p-1.5 text-slate-400 hover:text-yellow-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Favorite"
                  >
                    <StarIcon className={`w-5 h-5 ${item.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
                  </button>
                </Tooltip>
                 <Tooltip text="Copy">
                  <button 
                    onClick={() => handleCopy(item.prompt)}
                    className="p-1.5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Copy"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
