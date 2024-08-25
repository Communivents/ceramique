# Use the official Bun image as the base
FROM imbios/bun-node:1.1.25-22-alpine

# Install Python, build-essential, and required libraries for node-canvas
RUN apk add --update --no-cache \
    libuuid \
    python3 \
    build-base \
    pkgconf \
    pixman \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev

# Set the working directory inside the container
WORKDIR /app

# Copy project files to the container
COPY package.json bun.lockb biome.jsonc tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

# Ensure that the scripts are executable
RUN chmod +x ./scripts/*.ts

# Install dependencies with Bun
RUN bun install

# Command to start the application
CMD ["bun", "run", "start"]
