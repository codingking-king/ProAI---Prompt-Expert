
import type { PromptCategory } from './types';
import { TextIcon } from './components/icons/TextIcon';
import { ImageIcon } from './components/icons/ImageIcon';
import { VideoIcon } from './components/icons/VideoIcon';
import { AudioIcon } from './components/icons/AudioIcon';
import { JsonIcon } from './components/icons/JsonIcon';
import { CustomIcon } from './components/icons/CustomIcon';

export const CATEGORIES: PromptCategory[] = [
  { id: 'text', name: 'Text Prompts', description: 'For writing, coding, reports, emails', icon: TextIcon, creditCost: 10, dailyLimit: 5 },
  { id: 'image', name: 'Image Prompts', description: 'For MidJourney, DALL·E, Stable Diffusion', icon: ImageIcon, creditCost: 20, dailyLimit: 3 },
  { id: 'video', name: 'Video Prompts', description: 'For Runway, Pika, Gen-2', icon: VideoIcon, creditCost: 50, dailyLimit: 2 },
  { id: 'audio', name: 'Audio Prompts', description: 'For music, voiceover, podcast scripts', icon: AudioIcon, creditCost: 30, dailyLimit: 3 },
  { id: 'json', name: 'JSON / API Prompts', description: 'For developers, structured output', icon: JsonIcon, creditCost: 10, dailyLimit: 1 },
  { id: 'custom', name: 'Custom Prompt Architect', description: 'Deep, multi-layered prompts', icon: CustomIcon, creditCost: 100, isPremium: true },
];

export const INDUSTRIES = [
  'General', 'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Entertainment', 'E-commerce', 'Gaming', 'Photography'
];

export const OUTPUT_STYLES = [
  'Professional', 'Casual', 'Creative', 'Formal', 'Technical', 'Cinematic', 'Academic', 'Humorous', 'Empathetic'
];

export const TARGET_PLATFORMS = [
  'Any', 'ChatGPT (GPT-4)', 'Gemini', 'MidJourney', 'DALL-E 3', 'Stable Diffusion', 'RunwayML', 'Pika Labs', 'Suno AI'
];

export const FREE_DAILY_CREDITS = 100;
