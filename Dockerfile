ARG BUN_VERSION=1.1.17

FROM oven/bun:$BUN_VERSION as base
WORKDIR /usr/src/app

ARG RONIN_TOKEN

# Copy all files from the workspace
COPY . .

# Login to RONIN & install dependencies
RUN bunx ronin login && bun install --frozen-lockfile

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

USER bun

EXPOSE 3000

ENTRYPOINT ["bun", "run", "./api/src/api.ts"]
