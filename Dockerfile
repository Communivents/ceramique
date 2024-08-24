# Use the official Bun image as the base
FROM oven/bun:latest

# Install Python, build-essential, and other dependencies for node-gyp
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy project files to the container
COPY package.json ./
COPY bun.lockb ./
COPY src ./
COPY scripts ./

# Install dependencies with Bun
RUN bun install

# Trust all package managers for Bun
RUN bun pm trust --all

# Command to start the application
CMD ["bun", "run", "start"]