const WebSocket = require('ws');
const http = require('http');

// Simple WebSocket server test without config file loading
const port = 8080;

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Track connected clients
const clients = new Set();

// Handle connections
wss.on('connection', (ws, req) => {
  // Add client to set
  clients.add(ws);
  
  // Get client IP
  const ip = req.socket.remoteAddress;
  console.log(`New client connected: ${ip}`);

  // Send pod info to client
  const podName = "test-local";
  ws.send(JSON.stringify({
    type: 'connection',
    data: {
      message: `Connected to test server`,
      podName: podName,
      time: new Date().toISOString()
    }
  }));

  // Handle messages from client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Echo back to client
    ws.send(JSON.stringify({
      type: 'echo',
      data: {
        message: message.toString(),
        time: new Date().toISOString()
      }
    }));
  });

  // Handle client disconnection
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client disconnected: ${ip}`);
  });
});

// Broadcast event to all clients every second
setInterval(() => {
  const time = new Date().toISOString();
  
  // Create event message
  const event = JSON.stringify({
    type: 'tick',
    data: {
      podName: "test-local",
      time: time,
      connections: clients.size
    }
  });
  
  // Send to all connected clients
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(event);
    }
  });
  
  if (clients.size > 0) {
    console.log(`Sent tick event to ${clients.size} clients at ${time}`);
  }
}, 1000);

// Start server
server.listen(port, () => {
  console.log(`WebSocket server test started on port ${port}`);
}); 