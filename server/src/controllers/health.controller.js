import { config } from '../config/env.js';

export const checkHealth = (req, res) => {
  res.json({
    success: true,
    service: 'VirasatRakshak API',
    status: 'healthy',
    aiConfigured: config.isAiConfigured,
    timestamp: new Date().toISOString()
  });
};
