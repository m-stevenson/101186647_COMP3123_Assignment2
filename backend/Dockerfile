FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Environment
ENV PORT=8081

# Expose port
EXPOSE 8081

# Start the server
CMD ["node", "server.js"]
