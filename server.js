const app = require('./app');
const http = require('http');
const connectDB = require('./config/db');
const redisService = require('./services/redisService');

const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Subscribe to Redis updates
// redisService.subscribeToRouteUpdates((message) => {
//     console.log('Route Update:', message);
// });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export WebSocket server for use in other files
module.exports = wss;