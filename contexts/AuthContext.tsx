import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { PromptCategory, User } from '../types';
import { CATEGORIES, FREE_DAILY_CREDITS } from '../constants';

// The user object stored with password credentials (internal to this module)
interface StoredUser extends User {
  passwordDigest: string; 
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  upgradeToPremium: () => void;
  addCredits: (amount: number) => void;
  consumeResource: (category: PromptCategory) => boolean;
  refundResource: (category: PromptCategory) => void;
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useLocalStorage<StoredUser[]>('proai-users', []);
  const [user, setUser] = useLocalStorage<User | null>('proai-user', null);
  const [lastLoginDate, setLastLoginDate] = useLocalStorage<string | null>('proai-last-login-date', null);

  useEffect(() => {
    if (user) {
      const today = new Date().toDateString();
      if (lastLoginDate !== today) {
        // Daily resource reset for the currently logged-in user
        setUser(currentUser => {
          if (!currentUser) return null;
          return {
            ...currentUser,
            credits: currentUser.isPremium ? PREMIUM_DAILY_CREDITS : FREE_DAILY_CREDITS,
            usage: currentUser.isPremium ? {} : getDefaultFreeUsage(),
          }
        });
        setLastLoginDate(today);
      }
    }
  }, []);

  const login = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate async API call
        const storedUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (storedUser && storedUser.passwordDigest === password) { // NOTE: In a real app, never store/compare plaintext passwords
          const today = new Date().toDateString();
          // Strip password for session state
          const { passwordDigest, ...publicUser } = storedUser;
          setUser(publicUser);
          setLastLoginDate(today);
          resolve();
        } else {
          reject(new Error("Invalid email or password."));
        }
      }, 500);
    });
  };

  const signup = (name: string, email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate async API call
            if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                return reject(new Error("An account with this email already exists."));
            }
            const newUser: StoredUser = {
                name,
                email,
                passwordDigest: password,
                isPremium: false,
                credits: FREE_DAILY_CREDITS,
                usage: getDefaultFreeUsage(),
            };
            setAllUsers(prev => [...prev, newUser]);
            
            // User is not logged in automatically. They must now sign in.
            resolve();
        }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const upgradeToPremium = () => {
    setUser(currentUser => {
      if (currentUser) {
        return { 
          ...currentUser, 
          isPremium: true,
          credits: PREMIUM_DAILY_CREDITS,
          usage: {}, 
        };
      }
      return null;
    });
  };

  const addCredits = (amount: number) => {
    setUser(currentUser => {
        if (currentUser) {
            return { ...currentUser, credits: currentUser.credits + amount };
        }
        return currentUser;
    });
  };

  const consumeResource = (category: PromptCategory): boolean => {
    let canConsume = false;
    setUser(currentUser => {
      if (!currentUser) return null;

      if (currentUser.isPremium) {
        if (currentUser.credits >= category.creditCost) {
          canConsume = true;
          return { ...currentUser, credits: currentUser.credits - category.creditCost };
        }
      } else { // Free user: must have credits AND daily attempts
        const currentUsage = currentUser.usage[category.id] ?? 0;
        const hasEnoughCredits = currentUser.credits >= category.creditCost;
        const hasAttemptsLeft = category.dailyLimit !== undefined && currentUsage < category.dailyLimit;

        if (hasEnoughCredits && hasAttemptsLeft) {
          canConsume = true;
          const newUsage = { ...currentUser.usage, [category.id]: currentUsage + 1 };
          return { 
            ...currentUser, 
            usage: newUsage,
            credits: currentUser.credits - category.creditCost,
          };
        }
      }
      return currentUser; 
    });
    return canConsume;
  };

  const refundResource = (category: PromptCategory) => {
    setUser(currentUser => {
      if (!currentUser) return null;

      if (currentUser.isPremium) {
        return { ...currentUser, credits: currentUser.credits + category.creditCost };
      } else { // Free user: refund both credits and daily attempt
        const currentUsage = currentUser.usage[category.id] ?? 0;
        if (currentUsage > 0) {
            const newUsage = { ...currentUser.usage, [category.id]: currentUsage - 1 };
            return { 
                ...currentUser, 
                usage: newUsage,
                credits: currentUser.credits + category.creditCost,
            };
        }
      }
      return currentUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, upgradeToPremium, addCredits, consumeResource, refundResource }}>
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