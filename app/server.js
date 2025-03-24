const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");

// Try to load configuration
let config = {
  port: 8080,
  maxConnections: 1000,
  logLevel: "info",
};

try {
  if (fs.existsSync("/config/server.conf")) {
    const configFile = fs.readFileSync("/config/server.conf", "utf8");
    config = { ...config, ...JSON.parse(configFile) };
  }
} catch (err) {
  console.error("Error loading config:", err);
}

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("OK");
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Track connected clients
const clients = new Set();

// Handle connections
wss.on("connection", (ws, req) => {
  // Add client to set
  clients.add(ws);

  // Get client IP
  const ip = req.socket.remoteAddress;
  console.log(`New client connected: ${ip}`);

  // Send pod info to client
  const podName = process.env.HOSTNAME || "unknown";
  ws.send(
    JSON.stringify({
      type: "connection",
      data: {
        message: `Connected to pod: ${podName}`,
        podName: podName,
        time: new Date().toISOString(),
      },
    })
  );

  // Handle messages from client
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // Echo back to client
    ws.send(
      JSON.stringify({
        type: "echo",
        data: {
          message: message.toString(),
          time: new Date().toISOString(),
        },
      })
    );
  });

  // Handle client disconnection
  ws.on("close", () => {
    clients.delete(ws);
    console.log(`Client disconnected: ${ip}`);
  });
});

// Broadcast event to all clients every second
setInterval(() => {
  const time = new Date().toISOString();
  const podName = process.env.HOSTNAME || "unknown";

  // Create event message
  const event = JSON.stringify({
    type: "tick",
    data: {
      podName: podName,
      time: time,
      connections: clients.size,
    },
  });

  // Send to all connected clients
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(event);
    }
  });
  if (clients.size > 0) {
    console.log(`Sent tick event to ${clients.size} clients at ${time}`);
  }
}, 1000);

// Start server
server.listen(config.port, () => {
  console.log(`WebSocket server started on port ${config.port}`);
  console.log(`Pod name: ${process.env.HOSTNAME || "unknown"}`);
});
