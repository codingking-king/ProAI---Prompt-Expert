import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { PromptCategory, User } from '../types';
import { CATEGORIES, FREE_DAILY_CREDITS } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  upgradeToPremium: () => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  consumeResource: (category: PromptCategory) => Promise<boolean>;
  refundResource: (category: PromptCategory) => Promise<void>;
  // Fix: Add login and signup methods to the context type for AuthPage.tsx
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PREMIUM_DAILY_CREDITS = 1000;

const getDefaultFreeUsage = () => {
  return CATEGORIES.reduce((acc, category) => {
    if (category.dailyLimit) {
      acc[category.id] = 0;
    }
    return acc;
  }, {} as { [key: string]: number });
};

const defaultUser: User = {
  uid: 'local-user',
  name: 'ProAI User',
  email: 'user@proai.app',
  isPremium: false,
  credits: FREE_DAILY_CREDITS,
  usage: getDefaultFreeUsage(),
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User>('proai-local-user', defaultUser);

  // Daily reset logic
  useEffect(() => {
    const today = new Date().toDateString();
    const lastLoginKey = `proai-last-login-local`;
    const lastLoginDate = localStorage.getItem(lastLoginKey);

    if (lastLoginDate !== today) {
      setUser(currentUser => ({
        ...currentUser,
        credits: currentUser.isPremium ? PREMIUM_DAILY_CREDITS : FREE_DAILY_CREDITS,
        usage: currentUser.isPremium ? {} : getDefaultFreeUsage(),
      }));
      localStorage.setItem(lastLoginKey, today);
    }
  }, [setUser]);

  const upgradeToPremium = async (): Promise<void> => {
    setUser(prevUser => ({
      ...prevUser,
      isPremium: true,
      credits: PREMIUM_DAILY_CREDITS,
      usage: {},
    }));
  };

  const addCredits = async (amount: number): Promise<void> => {
    setUser(prevUser => ({
      ...prevUser,
      credits: prevUser.credits + amount,
    }));
  };

  const consumeResource = async (category: PromptCategory): Promise<boolean> => {
    if (!user) return false;

    let canConsume = false;
    
    if (user.isPremium) {
      if (user.credits >= category.creditCost) {
        canConsume = true;
      }
    } else {
      const currentUsage = user.usage[category.id] ?? 0;
      const hasEnoughCredits = user.credits >= category.creditCost;
      const hasAttemptsLeft = category.dailyLimit !== undefined && currentUsage < category.dailyLimit;

      if (hasEnoughCredits && hasAttemptsLeft) {
        canConsume = true;
      }
    }
    
    if (canConsume) {
      setUser(prevUser => {
        const newUsage = prevUser.isPremium 
          ? {} 
          : { ...prevUser.usage, [category.id]: (prevUser.usage[category.id] ?? 0) + 1 };
        
        return {
            ...prevUser,
            credits: prevUser.credits - category.creditCost,
            usage: newUsage,
        };
      });
    }
    
    return canConsume;
  };

  const refundResource = async (category: PromptCategory): Promise<void> => {
    setUser(prevUser => {
      const newCredits = prevUser.credits + category.creditCost;
      let newUsage = prevUser.usage;
      if (!prevUser.isPremium) {
          const currentUsage = prevUser.usage[category.id] ?? 0;
          if (currentUsage > 0) {
              newUsage = { ...prevUser.usage, [category.id]: currentUsage - 1 };
          }
      }
      return { ...prevUser, credits: newCredits, usage: newUsage };
    });
  };

  // Fix: Implement mock login and signup functions to satisfy AuthPage.tsx
  const login = async (email: string, password: string): Promise<void> => {
    console.log('Mock login called with:', email, password);
    // In this local-only setup, we don't need to do anything.
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    console.log('Mock signup called with:', name, email, password);
     // In this local-only setup, we don't need to do anything.
  };


  return (
    <AuthContext.Provider value={{ user, upgradeToPremium, addCredits, consumeResource, refundResource, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
