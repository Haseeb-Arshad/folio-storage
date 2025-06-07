import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/env';
import { testCloudflareR2Connection } from './config/cloudflare';
import { supabase } from './config/supabase';
import { errorHandler } from './utils/errorUtils';
import { logger } from './utils/logger';
import { cacheService } from './utils/cacheUtils';

// Import routes
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';

// Initialize express app
const app = express();

// Apply middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// Apply rate limiter to all requests
app.use(limiter);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'drive-alternative-backend',
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Global error handling middleware
app.use(errorHandler);

// Handle 404 errors - use a function with 'next' param for catch-all instead of path pattern
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Start the server
const PORT = parseInt(config.PORT, 10) || 5000;

// Setup graceful shutdown
function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  // Close server, DB connections, etc.
  process.exit(0);
}

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Global uncaught exception handler
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught exception:', error);
  // In production, you might want to use a service like Sentry here
  process.exit(1);
});

async function startServer() {
  logger.info(`Starting server in ${config.NODE_ENV} mode`);
  
  try {
    // Test database connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      logger.error(`Supabase connection failed: ${error.message}`);
      process.exit(1);
    }
    
    logger.info('✅ Supabase connection successful');
    
    // Test Cloudflare R2 connection
    const r2Connected = await testCloudflareR2Connection();
    
    if (!r2Connected) {
      logger.error('Cloudflare R2 connection failed');
      // Continue anyway, as some operations might not need storage immediately
    } else {
      logger.info('✅ Cloudflare R2 connection successful');
    }
    
    // Initialize cache service
    cacheService.set('serverStartTime', new Date().toISOString());
    logger.info('✅ Cache service initialized');
    
    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`✨ Server running on port ${PORT} in ${config.NODE_ENV} mode`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`📁 File API: http://localhost:${PORT}/api/files`);
      logger.info(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    });
    
    // Add server timeout settings
    server.timeout = 120000; // 2 minute timeout
    server.keepAliveTimeout = 60000; // 1 minute keep-alive
    
  } catch (error) {
    logger.error('Failed to start server:', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  }
}

// Run the server
startServer();
