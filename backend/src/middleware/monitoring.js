import rateLimit from 'express-rate-limit';
import { monitoring } from '../utils/monitoring';
import logger from '../utils/logger';

// Rate limiting middleware
export const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path
      });
      res.status(429).json({
        status: 'error',
        message: 'Too many requests, please try again later.'
      });
    }
  };

  return rateLimit({
    ...defaultOptions,
    ...options
  });
};

// Performance monitoring middleware
export const performanceMonitoring = (req, res, next) => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1e6; // Convert to milliseconds

    if (duration > 1000) { // Log slow requests (>1s)
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration,
        userAgent: req.get('user-agent')
      });
    }
  });

  next();
};

// Usage in app.js:
import express from 'express';
import { loggingMiddleware, errorLogger } from './utils/logger';
import { monitoringMiddleware, healthCheck, getMetrics } from './utils/monitoring';
import { createRateLimiter, performanceMonitoring } from './middleware/monitoring';

const app = express();

// Add monitoring middleware
app.use(loggingMiddleware);
app.use(monitoringMiddleware);
app.use(performanceMonitoring);

// Rate limiting
app.use('/api/', createRateLimiter());

// Monitoring endpoints
app.get('/health', healthCheck);
app.get('/metrics', getMetrics);

// Error logging
app.use(errorLogger);