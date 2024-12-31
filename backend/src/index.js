import app from './app.js';
import config from './config/environment.js';
import connectDB from './config/database.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let server;

// Graceful shutdown handler
const shutdown = async (signal) => {
  console.log(`${signal} received. Starting graceful shutdown...`);

  // Close HTTP server first
  if (server) {
    console.log('Closing HTTP server...');
    await new Promise((resolve) => server.close(resolve));
    console.log('HTTP server closed');
  }

  // Close database connection
  if (mongoose.connection.readyState === 1) {
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('Database connection closed');
  }

  // Exit process
  console.log('Graceful shutdown completed');
  process.exit(0);
};

// Error handlers
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('UNHANDLED REJECTION');
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('UNCAUGHT EXCEPTION');
});

// Add health check endpoint
app.get('/api/health', (req, res) => {
  const healthcheck = {
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.status = 'error';
    res.status(503).json(healthcheck);
  }
});

const start = async () => {
  try {
    // Connect to database first
    await connectDB();
    console.log('Database connected successfully');
    
    // Start server
    const port = config.port || 5000;
    server = app.listen(port, () => {
      console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      shutdown('SERVER ERROR');
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start server with error handling
start().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

// Export server for testing purposes
export default server;