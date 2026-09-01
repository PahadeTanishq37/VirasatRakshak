import app from './src/app.js';
import { config } from './src/config/env.js';

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🏛️  VirasatRakshak Express Backend Server Running`);
  console.log(`  ➜ Base API URL:      http://localhost:${PORT}/api`);
  console.log(`  ➜ Health Check:      http://localhost:${PORT}/api/health`);
  console.log(`  ➜ AI Story Endpoint: http://localhost:${PORT}/api/ai/story`);
  console.log(`  ➜ Heritage Sites:    http://localhost:${PORT}/api/heritage`);
  console.log(`==================================================`);

  if (config.isAiConfigured) {
    console.log(`  ✅ Gemini AI: CONFIGURED — AI story generation is active.`);
  } else {
    console.error(`  ❌ GEMINI_API_KEY is NOT configured or is a placeholder.`);
    console.error(`     AI story generation will return 503 errors.`);
    console.error(`     Set a valid GEMINI_API_KEY in server/.env`);
    console.error(`     Get your key at: https://aistudio.google.com/app/apikey`);
  }
  console.log(`==================================================\n`);
});

