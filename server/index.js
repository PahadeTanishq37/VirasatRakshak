import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config(); // fallback to CWD .env if present

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Helper to get initialized Gemini model
function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // Use gemini-3.6-flash as default model
  return genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
}

// System Instruction Prompt for Digital Bharat Heritage Guide
const SYSTEM_INSTRUCTION = `You are the "Digital Bharat Heritage Guide", an expert AI storytelling guide for Indian cultural heritage, monuments, history, architecture, arts, and folklore.

Strict Guidelines:
1. Specialize exclusively in Indian heritage (monuments, architecture, traditional arts, crafts, festivals, folklore, regional traditions).
2. Ground your explanations in documented history while honoring cultural traditions.
3. Clearly distinguish between established historical evidence and traditional legends or folklore.
4. Output directly in the requested language (English, Hindi, Marathi, or Tamil).
5. Never fabricate historical facts or sources. If details are uncertain, state so gracefully.
6. Provide rich, engaging, educational, and respectful responses with markdown formatting.`;

// Map language codes to full names for prompt instruction
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

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  res.json({
    status: 'ok',
    service: 'VirasatRakshak Generative AI Server',
    aiConfigured: hasKey
  });
});

// Endpoint 1: Interactive Heritage AI Chatbot (/api/ai/chat)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { userMessage, heritageSite, language = 'english', conversationHistory = [] } = req.body;

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return res.status(400).json({ success: false, error: 'User message is required.' });
    }

    if (userMessage.length > 1000) {
      return res.status(400).json({ success: false, error: 'Message exceeds maximum length limit.' });
    }

    const model = getGeminiModel();
    if (!model) {
      console.warn('[AI Server Warning] GEMINI_API_KEY is not configured in server/.env');
      return res.status(503).json({
        success: false,
        error: 'The AI Heritage Guide service is not configured. Please set GEMINI_API_KEY in server/.env file.'
      });
    }

    const langName = LANGUAGE_NAMES[language.toLowerCase()] || 'English';

    // Construct Context-Aware Prompt
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
    const responseText = result.response.text();

    return res.json({
      success: true,
      text: responseText,
      language: langName
    });
  } catch (error) {
    console.error('[AI Chat Server Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'The Heritage AI Guide encountered an issue generating a response. Please try again.'
    });
  }
});

// Endpoint 2: Custom AI Story Generator (/api/ai/story)
app.post('/api/ai/story', async (req, res) => {
  try {
    const { heritageSite, storytellingMode = 'historical', language = 'english', userPrompt = '' } = req.body;

    const model = getGeminiModel();
    if (!model) {
      console.warn('[AI Server Warning] GEMINI_API_KEY is not configured in server/.env');
      return res.status(503).json({
        success: false,
        error: 'The AI Heritage Storyteller service is not configured. Please set GEMINI_API_KEY in server/.env file.'
      });
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

    // Parse JSON response or fallback to markdown parsing
    let storyTitle = `${siteName} - ${storytellingMode.charAt(0).toUpperCase() + storytellingMode.slice(1)} Tale`;
    let storyContent = responseText;

    try {
      // Clean JSON formatting if wrapped in codeblocks
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.title) storyTitle = parsed.title;
      if (parsed.story) storyContent = parsed.story;
    } catch (e) {
      // Use raw text as story content
    }

    return res.json({
      success: true,
      title: storyTitle,
      story: storyContent,
      mode: storytellingMode,
      language: langName
    });
  } catch (error) {
    console.error('[AI Story Server Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate heritage story. Please check server logs or try again.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🏛️ VirasatRakshak Generative AI Server running on port ${PORT}`);
  console.log(`  ➜ Health check: http://localhost:${PORT}/api/health`);
  console.log(`  ➜ Gemini API configured: ${Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') ? 'YES' : 'NO (Set GEMINI_API_KEY in server/.env)'}`);
  console.log(`==================================================\n`);
});
