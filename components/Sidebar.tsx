
import React from 'react';
import type { PromptCategory } from '../types';
import { CATEGORIES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { XIcon } from './icons/XIcon';

interface SidebarProps {
  activeCategory: PromptCategory;
  onSelectCategory: (category: PromptCategory) => void;
  onUpgrade: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SidebarContent: React.FC<Pick<SidebarProps, 'activeCategory' | 'onSelectCategory' | 'onUpgrade'>> = ({ activeCategory, onSelectCategory, onUpgrade }) => {
  const { user } = useAuth();
  return (
    <>
      <nav className="flex flex-col space-y-1">
        {CATEGORIES.map(category => {
          const isFreeUser = !user?.isPremium;
          const usage = isFreeUser && user?.usage ? user.usage[category.id] ?? 0 : 0;
          const limit = category.dailyLimit;
          const remaining = limit ? limit - usage : 0;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className={`flex items-center w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 group ${
                activeCategory.id === category.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <category.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${activeCategory.id === category.id ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`} />
              <span className="flex-1">{category.name}</span>
              {isFreeUser && limit !== undefined && (
                 <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                    {remaining}/{limit}
                </span>
              )}
              {category.isPremium && (
                <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${user?.isPremium ? 'text-green-800 dark:text-green-300 bg-green-400/50 dark:bg-green-900/50' : 'text-yellow-800 dark:text-yellow-300 bg-yellow-400/50 dark:bg-yellow-900/50'}`}>
                  {user?.isPremium ? 'Active' : 'PRO'}
                </span>
              )}
            </button>
          )
        })}
      </nav>
      
      {!user?.isPremium && (
        <div className="mt-auto p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-white">Go ProAI Plus!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Remove daily limits, unlock credits, and access the Custom Prompt Architect.</p>
          <button 
            onClick={onUpgrade}
            className="w-full mt-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 text-sm rounded-md hover:opacity-90 transition-opacity"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onSelectCategory, onUpgrade, isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      <aside className={`fixed top-0 left-0 w-64 h-full bg-slate-100 dark:bg-slate-800 p-4 flex flex-col z-40 md:hidden transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-2">CATEGORIES</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent activeCategory={activeCategory} onSelectCategory={onSelectCategory} onUpgrade={onUpgrade} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-100/80 dark:bg-slate-800/80 p-4 border-r border-slate-200 dark:border-slate-700 flex-col hidden md:flex">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 px-2">CATEGORIES</h2>
        <SidebarContent activeCategory={activeCategory} onSelectCategory={onSelectCategory} onUpgrade={onUpgrade} />
      </aside>
    </>
  );
};

export default Sidebar;
