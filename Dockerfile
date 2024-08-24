# Start with an Alpine-based Node image
FROM node:18-alpine

# Install required system dependencies for node-gyp and canvas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    bash \
    curl

# Install Bun manually
RUN curl -fsSL https://bun.sh/install | bash

# Set environment variables permanently
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Set the working directory inside the container
WORKDIR /app

# Copy project files to the container
COPY package.json bun.lockb ./
COPY src ./src
COPY scripts ./scripts

# Install dependencies using Bun (ensure the PATH is set)
RUN bun install

# Command to start the application
CMD ["bun", "run", "start"]
