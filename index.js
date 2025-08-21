const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const franchiseRoutes = require('./routes/franchiseRoutes');
const logger = require('./config/logger');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
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