# WebSocket Server

A simple WebSocket server built with Node.js that publishes an event every second.

## Features

- WebSocket server that sends a "tick" event every second to all connected clients
- HTTP health endpoint at `/health` for Kubernetes readiness probes
- Configurable via a JSON configuration file
- Displays pod name in messages (useful for StatefulSet deployments)
- Echoes back any messages sent by clients

## Configuration

The server can be configured via a JSON file at `/config/server.conf` with the following options:

```json
{
  "port": 8080,
  "maxConnections": 1000,
  "logLevel": "info"
}
```

## Messages

The server sends the following JSON messages:

### Connection message (sent when a client connects)

```json
{
  "type": "connection",
  "data": {
    "message": "Connected to pod: pod-name",
    "podName": "pod-name",
    "time": "2023-10-30T12:00:00.000Z"
  }
}
```

### Tick message (sent every second to all clients)

```json
{
  "type": "tick",
  "data": {
    "podName": "pod-name",
    "time": "2023-10-30T12:00:01.000Z",
    "connections": 3
  }
}
```

### Echo message (sent in response to client messages)

```json
{
  "type": "echo",
  "data": {
    "message": "Hello, world!",
    "time": "2023-10-30T12:00:02.000Z"
  }
}
```

## Building and Running

### Local Development

```bash
npm install
node server.js
```

### Docker

```bash
docker build -t websocket-server .
docker run -p 8080:8080 websocket-server
```

### Kubernetes

See the `kubernetes` directory for deployment manifests. 