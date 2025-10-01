const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const admin = require('firebase-admin');
const logger = require('./config/logger');

dotenv.config();

// Simple initialization without Secret Manager for debugging
async function initApp() {
  try {
    console.log('Starting app initialization...');
    
    // Try to initialize Firebase with environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log('Initializing Firebase with environment variable...');
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase initialized successfully');
    } else {
      console.warn('No Firebase configuration found, skipping Firebase initialization');
    }

    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
      res.status(200).json({ 
        message: 'Franchise Service is up and running',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
      });
    });

    // Load routes AFTER Firebase initialization
    const franchiseRoutes = require('./routes/franchiseRoutes');
    app.use('/api/franchises', franchiseRoutes);

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('Global error:', err);
      logger.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    // 404 handler
    app.use((req, res) => {
      console.log(`Route not found: ${req.method} ${req.url}`);
      logger.warn(`Route not found: ${req.method} ${req.url}`);
      res.status(404).json({ error: `Route ${req.url} not found` });
    });

    // Start server
    const PORT = process.env.PORT || process.env.FRANCHISE_PORT || 8080;
    console.log(`Starting server on port ${PORT}...`);
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Franchise Service running on port ${PORT}`);
      console.log(`✅ Health check endpoint: http://localhost:${PORT}/`);
      logger.info(`Franchise Service running on port ${PORT}`);
    });

    // Handle server startup errors
    server.on('error', (err) => {
      console.error('❌ Server startup error:', err);
      logger.error('Server startup error:', err);
    });

    console.log('✅ App initialization completed');

  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    logger.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

console.log('🚀 Starting Franchise Service...');
initApp();
