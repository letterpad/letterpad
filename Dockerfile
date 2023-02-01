# Builder
FROM node:19-bullseye-slim:sha256:8886b323f04105798b3e5aac31ab7cc9ee35ae71099fbd7cd6645e1d165dbf94 AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .

ENV CYPRESS_INSTALL_BINARY 0
RUN yarn install --ignore-engines

COPY turbo.json turbo.json

WORKDIR /app/apps/admin
RUN yarn prisma:generate
RUN rm .env

WORKDIR /app
RUN yarn turbo run build
RUN yarn install --production 


# Runner
FROM node:19-bullseye-slim:sha256:8886b323f04105798b3e5aac31ab7cc9ee35ae71099fbd7cd6645e1d165dbf94 AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app ./

EXPOSE 3000
EXPOSE 3001
CMD ["yarn", "start"]