FROM oven/bun:latest

RUN apt-get update && \
    apt-get install -y libfontconfig1 libfontconfig1-dev

WORKDIR /app

COPY package.json bun.lockb biome.jsonc tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

RUN bun install

CMD ["bun", "run", "start"]