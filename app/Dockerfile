FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Set environment variables
ENV PORT=8080

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "server.js"] 