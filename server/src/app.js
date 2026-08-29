import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import heritageRoutes from './routes/heritage.routes.js';
import aiRoutes from './routes/ai.routes.js';
import orderRoutes from './routes/order.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// CORS Configuration
const allowedOrigin = config.clientUrl || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev, fallback allowed
  },
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request Logging Middleware (Development)
app.use((req, res, next) => {
  console.log(`[API Log] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes Registration
app.use('/api', healthRoutes);
app.use('/api', heritageRoutes);
app.use('/api', aiRoutes);
app.use('/api', orderRoutes);

// Centralized API Error Handling Middleware
app.use(errorHandler);

export default app;

