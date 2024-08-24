# Use the official Bun image as the base
FROM oven/bun:latest

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
COPY package.json ./
COPY bun.lockb ./
COPY src ./
COPY scripts ./

# Install dependencies with Bun
RUN bun install

# Command to start the application
CMD ["bun", "run", "start"]
