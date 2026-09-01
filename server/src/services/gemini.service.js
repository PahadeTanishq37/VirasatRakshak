import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

const SYSTEM_INSTRUCTION = `You are the "Digital Bharat Heritage Guide", an expert AI storytelling guide for Indian cultural heritage, monuments, history, architecture, arts, and folklore.

Strict Guidelines:
1. Specialize exclusively in Indian heritage (monuments, architecture, traditional arts, crafts, festivals, folklore, regional traditions).
2. Ground your explanations in documented history while honoring cultural traditions.
3. Clearly distinguish between established historical evidence and traditional legends or folklore.
4. Output directly in the requested language (English, Hindi, Marathi, or Tamil).
5. Never fabricate historical facts or sources. If details are uncertain, state so gracefully.
6. Provide rich, engaging, educational, and respectful responses with markdown formatting.`;

const LANGUAGE_NAMES = {
  en: 'English',
  english: 'English',
  hi: 'Hindi',
  hindi: 'Hindi',
  mr: 'Marathi',
  marathi: 'Marathi',
  ta: 'Tamil',
  tamil: 'Tamil'
};

function getModel() {
  if (!config.isAiConfigured) return null;
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  return genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' });
}

export const GeminiService = {
  chat: async ({ userMessage, heritageSite, language = 'english', conversationHistory = [] }) => {
    const model = getModel();
    if (!model) {
      throw new Error('GEMINI_NOT_CONFIGURED');
    }

    const langName = LANGUAGE_NAMES[language.toLowerCase()] || 'English';

    let promptText = `${SYSTEM_INSTRUCTION}\n\n`;

    if (heritageSite) {
      promptText += `CURRENT HERITAGE CONTEXT:\n- Monument/Site: ${heritageSite.name || heritageSite}\n`;
      if (heritageSite.location) promptText += `- Location: ${heritageSite.location}\n`;
      if (heritageSite.category) promptText += `- Category: ${heritageSite.category}\n`;
      if (heritageSite.description) promptText += `- Overview: ${heritageSite.description}\n`;
      promptText += '\n';
    }

    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      promptText += `RECENT CONVERSATION HISTORY:\n`;
      conversationHistory.slice(-6).forEach((msg) => {
        promptText += `${msg.isUser ? 'User' : 'Heritage Guide'}: ${msg.text}\n`;
      });
      promptText += '\n';
    }

    promptText += `INSTRUCTION: Respond directly in ${langName}.\n`;
    promptText += `User Question: "${userMessage.trim()}"`;

    const result = await model.generateContent(promptText);
    return {
      text: result.response.text(),
      language: langName
    };
  },

  generateStory: async ({ heritageSite, storytellingMode = 'historical', language = 'english', userPrompt = '' }) => {
    const model = getModel();
    if (!model) {
      throw new Error('GEMINI_NOT_CONFIGURED');
    }

    const langName = LANGUAGE_NAMES[language.toLowerCase()] || 'English';
    const siteName = typeof heritageSite === 'string' ? heritageSite : heritageSite?.name || 'Indian Heritage Monument';

    const modePrompts = {
      historical: 'Focus on documented historical facts, architectural genius, founding rulers, and historical timelines.',
      children: 'Tell an engaging, inspiring, simple story suitable for young minds with vivid descriptions and moral lessons.',
      cultural: 'Focus on mythological legends, folklore, local cultural traditions, and spiritual symbolism.',
      short: 'Provide a concise, dramatic 2-minute short story capturing the core essence of this heritage landmark.'
    };

    const modeDescription = modePrompts[storytellingMode.toLowerCase()] || modePrompts.historical;

    let promptText = `${SYSTEM_INSTRUCTION}\n\n`;
    promptText += `TASK: Generate a unique, captivating heritage story about "${siteName}".\n`;
    promptText += `STORY MODE: ${storytellingMode.toUpperCase()} (${modeDescription})\n`;
    promptText += `LANGUAGE: Generate the complete story in ${langName}.\n`;
    if (userPrompt) promptText += `USER SPECIAL DIRECTION: ${userPrompt}\n`;
    promptText += `\nFORMAT YOUR RESPONSE AS JSON WITH TWO KEYS: "title" (the story title) and "story" (the full story text in markdown).`;

    const result = await model.generateContent(promptText);
    const responseText = result.response.text();

    let storyTitle = `${siteName} - ${storytellingMode.charAt(0).toUpperCase() + storytellingMode.slice(1)} Tale`;
    let storyContent = responseText;

    try {
      // Strip markdown code fences if present
      let cleanJson = responseText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      // Try to extract a JSON object from the response using regex
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanJson = jsonMatch[0];
      }
      const parsed = JSON.parse(cleanJson);
      if (parsed.title) storyTitle = parsed.title;
      if (parsed.story) storyContent = parsed.story;
    } catch (e) {
      // Use raw output if JSON parsing fails — still a valid story
      console.warn('[GeminiService] JSON parse failed, using raw response text:', e.message);
    }

    return {
      title: storyTitle,
      story: storyContent,
      mode: storytellingMode,
      language: langName
    };
  }
};
