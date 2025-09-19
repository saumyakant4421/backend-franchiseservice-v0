const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const admin = require('firebase-admin');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const franchiseRoutes = require('./routes/franchiseRoutes');
const logger = require('./config/logger');

dotenv.config();

const client = new SecretManagerServiceClient();

// Async function to load Firebase service account
async function loadFirebaseServiceAccount() {
  try {
    const [version] = await client.accessSecretVersion({
      name: 'projects/streamverse-movie-12345/secrets/firebase-service-account/versions/latest', // Replace Project ID
    });
    return JSON.parse(version.payload.data.toString('utf8'));
  } catch (error) {
    console.error('Error loading Firebase secret:', error);
    process.exit(1);
  }
}

// Initialize app async
async function initApp() {
  try {
    // Initialize Firebase
    const serviceAccount = await loadFirebaseServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase initialized');

    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
      res.status(200).json({ message: 'Franchise Service is up and running' });
    });

    app.use('/api/franchises', franchiseRoutes);

    // Global error handler
    app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    // 404 handler
    app.use((req, res) => {
      logger.warn(`Route not found: ${req.method} ${req.url}`);
      res.status(404).json({ error: `Route ${req.url} not found` });
    });

    // Start server
    const PORT = process.env.FRANCHISE_PORT || 4014;
    app.listen(PORT, () => {
      logger.info(`Franchise Service running on port ${PORT}`);
    });

    // Handle uncaught exceptions and rejections
    process.on('uncaughtException', (err) => logger.error('Uncaught Exception:', err));
    process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection:', reason));

  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

initApp();