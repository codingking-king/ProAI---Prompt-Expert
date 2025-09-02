import React, { useState, useCallback, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainWorkspace from './components/MainWorkspace';
import HistoryPanel from './components/HistoryPanel';
import CheckoutPage from './components/CheckoutPage';
import AuthPage from './components/AuthPage';
import WelcomePage from './components/WelcomePage';
import { generatePrompt } from './services/geminiService';
import type { PromptCategory, PromptFormData, HistoryItem } from './types';
import { CATEGORIES } from './constants';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import { MenuIcon } from './components/icons/MenuIcon';
import Modal from './components/common/Modal';
import { CreditIcon } from './components/icons/CreditIcon';
import { PlusIcon } from './components/icons/PlusIcon';
import Tooltip from './components/common/Tooltip';

type View = 'app' | 'checkout';
type CheckoutMode = 'subscription' | 'topup';

const App: React.FC = () => {
  const { user, logout, consumeResource, refundResource, upgradeToPremium, addCredits } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState<PromptCategory>(CATEGORIES[0]);
  const historyKey = user ? `proai-history-${user.email}` : 'proai-history-anonymous';
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(historyKey, []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [view, setView] = useState<View>('app');
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>('subscription');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [welcomeSeen, setWelcomeSeen] = useLocalStorage('proai-welcome-seen', false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGetStarted = () => {
    setWelcomeSeen(true);
  };

  const handleGeneratePrompt = useCallback(async (formData: PromptFormData) => {
    if (!user) return null;
    
    // Check if user has enough resources (credits or daily limits)
    const canGenerate = consumeResource(activeCategory);
    if (!canGenerate) {
       // The MainWorkspace button tooltip provides specific feedback.
       // This toast is a general fallback.
       toast.error("You don't have enough resources to generate a prompt.");
       return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePrompt(activeCategory, formData);
      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        category: activeCategory.name,
        prompt: result,
        isFavorite: false,
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]);
      return result;
    } catch (err) {
      // Refund credits/usage on failure
      refundResource(activeCategory);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, setHistory, user, consumeResource, refundResource]);
  
  const toggleFavorite = (id: number) => {
    setHistory(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };
  
  const handleSelectCategory = (category: PromptCategory) => {
      if (category.isPremium && !user?.isPremium) {
          setUpgradeModalOpen(true);
      } else {
          setActiveCategory(category);
          setSidebarOpen(false);
      }
  };

  const handleUpgrade = () => {
    setUpgradeModalOpen(false);
    setCheckoutMode('subscription');
    setView('checkout');
  };
  
  const handleTopUp = () => {
    setProfileOpen(false);
    setCheckoutMode('topup');
    setView('checkout');
  };

  const handlePaymentSuccess = (type: CheckoutMode, amount?: number) => {
    if (type === 'subscription') {
      upgradeToPremium();
       toast.success("Welcome to ProAI Plus!");
       const premiumCategory = CATEGORIES.find(c => c.isPremium);
       if (premiumCategory) {
           setActiveCategory(premiumCategory);
       }
    } else if (type === 'topup' && amount) {
       addCredits(amount);
       toast.success(`${amount} credits added to your account!`);
    }
    setView('app');
  };
  
  if (!welcomeSeen) {
    return <WelcomePage onGetStarted={handleGetStarted} />;
  }

  if (view === 'checkout') {
    return <CheckoutPage mode={checkoutMode} onPaymentSuccess={handlePaymentSuccess} onBack={() => setView('app')} />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        className: 'bg-slate-700 text-slate-200',
      }}/>
      <div className="flex flex-col h-screen font-sans bg-slate-900 text-slate-200 overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm flex-shrink-0 z-20">
          <div className="flex items-center">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 mr-2 rounded-full md:hidden hover:bg-slate-700 transition-colors">
              <MenuIcon className="w-6 h-6 text-slate-500" />
            </button>
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold ml-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              ProAI
            </h1>
            { user.isPremium && <span className="ml-4 text-xs font-bold text-yellow-300 bg-yellow-900/50 px-2 py-0.5 rounded-full hidden sm:inline">PLUS</span> }
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-700/50 pr-1 pl-3 py-1 rounded-full">
                <div className="flex items-center space-x-1">
                    <CreditIcon className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-semibold text-slate-200">{user.credits}</span>
                </div>
                <Tooltip text="Top-up Credits">
                    <button onClick={handleTopUp} className="p-1.5 bg-slate-600/80 rounded-full hover:bg-slate-600 transition-colors">
                        <PlusIcon className="w-4 h-4 text-slate-200"/>
                    </button>
                </Tooltip>
            </div>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center space-x-2">
                <img src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${user.name}`} alt="User Avatar" className="w-8 h-8 rounded-full bg-slate-600"/>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-30">
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <p className="text-xs text-slate-400 mt-1">{user.isPremium ? 'ProAI Plus Member' : 'Free Member'}</p>
                  </div>
                  <a href="#" onClick={handleTopUp} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Top-up Credits</a>
                  <a href="#" onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700">Logout</a>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            activeCategory={activeCategory} 
            onSelectCategory={handleSelectCategory} 
            onUpgrade={handleUpgrade} 
            isOpen={isSidebarOpen}
            setIsOpen={setSidebarOpen}
          />
          
          <main className="flex-1 flex flex-col overflow-hidden">
            <MainWorkspace
              category={activeCategory}
              onGenerate={handleGeneratePrompt}
              isLoading={isLoading}
              error={error}
            />
            <HistoryPanel history={history} onToggleFavorite={toggleFavorite} />
          </main>
        </div>
      </div>
      <Modal isOpen={isUpgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} title="Upgrade to ProAI Plus">
          <div className="p-6">
              <p className="text-slate-400 mb-4">
                  You've hit a limit! Upgrade to ProAI Plus for more flexibility.
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-slate-300">
                  <li><strong>Go Limitless:</strong> Get a massive <strong>1,000 daily credits</strong>.</li>
                  <li><strong>No More Caps:</strong> Remove all per-category daily prompt limits.</li>
                  <li>Access the exclusive <strong>Custom Prompt Architect</strong>.</li>
              </ul>
              <button 
                onClick={handleUpgrade}
                className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2.5 px-4 rounded-md shadow-lg transition-all duration-200 ease-in-out hover:opacity-90"
              >
                  Upgrade for $10/month
              </button>
          </div>
      </Modal>
    </>
  );
};

export default App;