# Websocket Server StatefulSet Deployment

This directory contains Kubernetes manifests for deploying a stateful websocket server application.

## Components

1. **StatefulSet (`websocket-statefulset.yaml`)**: 
   - Manages the deployment of websocket server pods
   - Provides stable network identities with predictable pod names: `websocket-server-0`, `websocket-server-1`, etc.
   - Includes persistent storage for each pod

2. **Headless Service (`headless-service.yaml`)**: 
   - Allows clients to connect to specific pods
   - Creates DNS entries for each pod in the format: `websocket-server-0.websocket-server.default.svc.cluster.local`

3. **External Service (`client-facing-service.yaml`)**: 
   - Exposes the StatefulSet to external clients
   - Type LoadBalancer provides an external IP address

4. **ConfigMap (`configmap.yaml`)**: 
   - Contains configuration for the websocket server

## How to Connect to Specific Pods

Clients can connect to specific pods using the following DNS pattern:
```
<pod-name>.<service-name>.<namespace>.svc.cluster.local
```

Examples:
- `websocket-server-0.websocket-server.default.svc.cluster.local:8080`
- `websocket-server-1.websocket-server.default.svc.cluster.local:8080`
- `websocket-server-2.websocket-server.default.svc.cluster.local:8080`

## Deployment Instructions

To deploy the application, run:

```bash
kubectl apply -f kubernetes/
```

To check status:
```bash
kubectl get sts,svc,pods
``` 