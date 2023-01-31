# Builder
FROM node:19-bullseye-slim AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=admin --docker


# Installer
FROM node:19-bullseye-slim AS installer
WORKDIR /app

ENV CYPRESS_INSTALL_BINARY 0
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install --ignore-engines


COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

WORKDIR /app/apps/admin
RUN yarn prisma:generate
RUN rm .env
WORKDIR /app
RUN yarn turbo run build --filter=admin...
RUN yarn install --production 


# Runner
FROM node:19-bullseye-slim AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app ./

EXPOSE 3000
CMD ["yarn", "start"]