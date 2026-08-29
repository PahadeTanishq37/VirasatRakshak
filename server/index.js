import app from './src/app.js';
import { config } from './src/config/env.js';

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🏛️ VirasatRakshak Express Backend Server Running`);
  console.log(`  ➜ Base API URL: http://localhost:${PORT}/api`);
  console.log(`  ➜ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  ➜ Heritage Sites API: http://localhost:${PORT}/api/heritage`);
  console.log(`  ➜ Gemini AI Configured: ${config.isAiConfigured ? 'YES' : 'NO (Set GEMINI_API_KEY in server/.env)'}`);
  console.log(`==================================================\n`);
});
