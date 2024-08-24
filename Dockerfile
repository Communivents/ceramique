FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY src ./
COPY scripts ./

RUN bun install
RUN bun pm trust --all

CMD bun run start