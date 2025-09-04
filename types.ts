import type React from 'react';

export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  creditCost: number;
  dailyLimit?: number;
  isPremium?: boolean;
}

export interface PromptFormData {
  useCase: string;
  industry: string;
  style: string;
  platform: string;
  constraints: string;
}

export interface HistoryItem {
  id: number;
  category: string;
  prompt: string;
  isFavorite: boolean;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  isPremium: boolean;
  credits: number;
  usage: { [categoryId: string]: number };
}