FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb biome.jsonc tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

RUN bun install

CMD ["bun", "run", "start"]