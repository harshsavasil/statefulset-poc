# WebSocket Server StatefulSet Deployment

This project demonstrates deploying a WebSocket server as a StatefulSet in Kubernetes, allowing clients to connect to specific pods.

## Project Structure

```
├── app/                     # Application code
│   ├── server.js            # WebSocket server implementation
│   ├── server-test.js       # Simplified server for local testing
│   ├── package.json         # Node.js dependencies
│   ├── Dockerfile           # Container image definition
│   ├── client.html          # HTML WebSocket test client
│   └── README.md            # Application documentation
│
├── kubernetes/              # Kubernetes deployment manifests
│   ├── websocket-statefulset.yaml   # StatefulSet definition
│   ├── headless-service.yaml        # Headless service for pod access
│   ├── client-facing-service.yaml   # External service
│   ├── configmap.yaml               # Server configuration
│   ├── networkpolicy.yaml           # Network access rules
│   └── README.md                    # Deployment documentation
│
└── build-and-deploy.sh      # Deployment script for MicroK8s
```

## Quick Start

### Prerequisites

- Docker
- MicroK8s Kubernetes cluster

### Deploy to MicroK8s

Run the build and deploy script:

```bash
./build-and-deploy.sh
```

### Testing the Deployment

1. Port forward the service to access the application:

```bash
microk8s kubectl port-forward service/websocket-server-external 8080:80
```

2. Open `app/client.html` in your browser
3. Connect to `ws://localhost:8080`

### Connect to Specific Pods

To verify the StatefulSet behavior, connect to individual pods using their DNS names:

```
ws://websocket-server-0.websocket-server.default.svc.cluster.local:8080
ws://websocket-server-1.websocket-server.default.svc.cluster.local:8080
ws://websocket-server-2.websocket-server.default.svc.cluster.local:8080
```

Each pod will identify itself in the messages it sends.

## Local Development

To test the application locally:

```bash
cd app
npm install
node server-test.js
```

Then open `client.html` in your browser and connect to `ws://localhost:8080`.

## Architecture

This project showcases:

1. **StatefulSet with stable identities** - Each pod has a predictable name and network identity
2. **Headless Service** - Allows clients to connect to specific pods by DNS name
3. **WebSocket Server** - Sends events every second and shows which pod is serving the connection
4. **HTML Test Client** - Connects to the WebSocket server and displays messages

See the README files in the `app/` and `kubernetes/` directories for more details. 