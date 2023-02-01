# Builder
FROM node:19-bullseye-slim AS builder
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
FROM node:19-bullseye-slim AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app ./

EXPOSE 3000
EXPOSE 3001
CMD ["yarn", "start"]