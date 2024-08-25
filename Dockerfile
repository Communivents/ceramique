# Use Node.js 18 as the base image
FROM node:18-bullseye-slim

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

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

# Set the working directory inside the container
WORKDIR /app

# Copy project files to the container
COPY package.json bun.lockb biome.jsonc tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

# Ensure that the scripts are executable
RUN chmod +x ./scripts/*.ts

# Add Bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Install dependencies with Bun
RUN bun install

# Rebuild canvas module specifically for the current environment
RUN npm rebuild canvas --update-binary

# Command to start the application
CMD ["bun", "run", "start"]