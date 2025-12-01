FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# CRA dev server runs on port 3000
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# Start CRA
CMD ["npm", "start"]
