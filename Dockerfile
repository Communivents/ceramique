# Use the official Bun image as the base
FROM imbios/bun-node:1.1.25-18.12.0-slim

# Install Python, build-essential, and required libraries for node-canvas
RUN apt-get update -y
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

# Set the working directory inside the container
# WORKDIR /

# Copy project files to the container
COPY package.json bun.lockb biome.jsonc tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

# Install dependencies with Bun
RUN npm install
# RUN bun pm trust --all

# Command to start the application
CMD ["bun", "run", "start"]