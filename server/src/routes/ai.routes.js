import { Router } from 'express';
import { handleAiChat, handleAiStory } from '../controllers/ai.controller.js';
import { validateBody } from '../middleware/requestValidator.js';

const router = Router();

router.post('/ai/chat', validateBody(['userMessage']), handleAiChat);
router.post('/ai/story', handleAiStory);

export default router;
