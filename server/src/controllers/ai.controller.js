import { GeminiService } from '../services/gemini.service.js';

export const handleAiChat = async (req, res, next) => {
  try {
    const { userMessage, heritageSite, language = 'english', conversationHistory = [] } = req.body;

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return res.status(400).json({ success: false, error: 'User message is required.' });
    }

    if (userMessage.length > 1000) {
      return res.status(400).json({ success: false, error: 'Message exceeds maximum length limit.' });
    }

    const result = await GeminiService.chat({
      userMessage,
      heritageSite,
      language,
      conversationHistory
    });

    res.json({
      success: true,
      text: result.text,
      language: result.language
    });
  } catch (error) {
    if (error.message === 'GEMINI_NOT_CONFIGURED') {
      return res.status(503).json({
        success: false,
        error: 'The AI Heritage Guide service is not configured. Please set GEMINI_API_KEY in server/.env file.'
      });
    }
    next(error);
  }
};

export const handleAiStory = async (req, res, next) => {
  try {
    const { heritageSite, storytellingMode = 'historical', language = 'english', userPrompt = '' } = req.body;

    const result = await GeminiService.generateStory({
      heritageSite,
      storytellingMode,
      language,
      userPrompt
    });

    res.json({
      success: true,
      title: result.title,
      story: result.story,
      mode: result.mode,
      language: result.language
    });
  } catch (error) {
    if (error.message === 'GEMINI_NOT_CONFIGURED') {
      return res.status(503).json({
        success: false,
        error: 'The AI Heritage Storyteller service is not configured. Please set GEMINI_API_KEY in server/.env file.'
      });
    }
    next(error);
  }
};
