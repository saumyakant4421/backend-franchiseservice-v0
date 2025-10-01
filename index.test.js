const express = require('express');
const cors = require('cors');

console.log('🚀 Starting minimal test server...');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({ 
    message: 'Franchise Service Test - Minimal Version',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 8080
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const PORT = process.env.PORT || 8080;
console.log(`Starting server on port ${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});
