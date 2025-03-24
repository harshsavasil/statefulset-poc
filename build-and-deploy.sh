#!/bin/bash
set -e

# Configuration
APP_NAME="websocket-server"
VERSION="1.0.0"
REGISTRY="pluang.com"
IMAGE_NAME="${REGISTRY}/${APP_NAME}"
NAMESPACE="default"

# Display banner
echo "=========================================================="
echo "  WebSocket Server Build and Deploy Script for MicroK8s"
echo "=========================================================="

# Step 1: Build the Docker image
echo "Building Docker image..."
sudo docker build -t ${IMAGE_NAME} ./app

# # Step 3: Push to MicroK8s registry
# echo "Pushing image to MicroK8s registry..."
# sudo docker push ${IMAGE_NAME}

# # Step 4: Update the StatefulSet manifest to use the correct image
# echo "Updating deployment manifests..."
# sed -i "s|image:.*# Replace with your actual websocket server image|image: ${IMAGE_NAME}|g" kubernetes/websocket-statefulset.yaml

# Step 5: Apply Kubernetes manifests
echo "Deploying to MicroK8s..."
microk8s kubectl apply -f kubernetes/configmap.yaml
microk8s kubectl apply -f kubernetes/headless-service.yaml
microk8s kubectl apply -f kubernetes/websocket-statefulset.yaml
# microk8s kubectl apply -f kubernetes/networkpolicy.yaml

# Wait for pods to be ready
echo "Waiting for pods to be ready..."
microk8s kubectl rollout status statefulset/${APP_NAME} --timeout=120s

# Display information
echo "=========================================================="
echo "Deployment completed successfully!"
echo "To check the status of your deployment, run:"
echo "  microk8s kubectl get all -l app=${APP_NAME}"
echo ""
echo "To access the service locally, run:"
echo "  microk8s kubectl port-forward service/${APP_NAME}-external 8080:80"
echo ""
echo "To access individual pods using the headless service:"
echo "  ws://${APP_NAME}-0.${APP_NAME}.${NAMESPACE}.svc.cluster.local:8080"
echo "  ws://${APP_NAME}-1.${APP_NAME}.${NAMESPACE}.svc.cluster.local:8080"
echo "  ws://${APP_NAME}-2.${APP_NAME}.${NAMESPACE}.svc.cluster.local:8080"
echo "==========================================================" 