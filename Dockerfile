# Stage 1: Build native modules with Node.js
FROM node:18-bullseye-slim AS builder

# Install Python, build-essential, and required libraries for node-canvas
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# If you have a build step, run it here
# RUN npm run build

# Stage 2: Run the application with Bun
FROM oven/bun:1.1.25

WORKDIR /app

# Copy built node modules and binaries
COPY --from=builder /app/node_modules ./node_modules

# Copy the rest of your application's code
COPY . .

# Ensure that the scripts are executable
RUN chmod +x ./scripts/*.ts

# Command to start the application
CMD ["bun", "run", "start"]