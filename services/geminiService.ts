

import { GoogleGenAI, Type } from "@google/genai";
import type { PromptCategory, PromptFormData } from '../types';

if (!process.env.API_KEY) {
  // In a real app, this would be a fatal error.
  // For this environment, we mock it if it's not present.
  // The backend will replace `process.env.API_KEY` with a real key.
  process.env.API_KEY = "mock_api_key_for_local_development";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are 'ProAI', an expert AI prompt engineer with over 15 years of experience. Your task is to take a user's simple request and transform it into a detailed, structured, and professional prompt suitable for the specified target AI platform. 
- Analyze the user's use case, industry, style, and constraints.
- Incorporate platform-specific keywords and formatting (e.g., '--ar 16:9' for MidJourney).
- For image/video prompts, add details about lighting, composition, camera angles, lens, and artistic style.
- For text/code prompts, add instructions on structure, tone, length, and format.
- Your output must be ONLY the generated prompt itself, without any explanations, preambles, or conversational text. It should be ready to be copied and pasted directly into the target platform.`;

export const generatePrompt = async (
  category: PromptCategory,
  formData: PromptFormData
): Promise<string> => {

  const userRequest = `
    Generate a professional prompt based on the following details:
    - Category: ${category.name}
    - Use Case: "${formData.useCase}"
    - Industry / Context: "${formData.industry}"
    - Desired Output Style: "${formData.style}"
    - Target AI Platform: "${formData.platform}"
    - Additional Constraints: "${formData.constraints || 'None'}"
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userRequest,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    
    const text = response.text;

    if (!text) {
      throw new Error("API returned an empty response.");
    }
    
    // Sometimes the model might still add markdown quotes, let's clean them.
    return text.trim().replace(/^```.*?\n|```$/gs, '').trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate prompt. Please check your API key and network connection.");
  }
};

export const generateKeywords = async (useCase: string): Promise<string[]> => {
  const prompt = `Based on the following user request for an AI prompt, extract 5 to 7 relevant keywords or short, descriptive phrases that would enhance the final prompt. Focus on key subjects, styles, actions, or modifiers. Return a JSON object with a single key "keywords" which contains an array of strings.

User Request: "${useCase}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'A relevant keyword or short phrase.'
              }
            }
          }
        },
      }
    });

    const jsonString = response.text;
    if (!jsonString) {
      return [];
    }
    
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.keywords)) {
      return parsed.keywords;
    }

    return [];
  } catch (error) {
    console.error("Error generating keywords from Gemini API:", error);
    // Return empty array for graceful degradation
    return [];
  }
};
