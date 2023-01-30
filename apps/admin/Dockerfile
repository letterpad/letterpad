FROM node:19-bullseye-slim AS builder

# RUN apk add --no-cache libc6-compat
# RUN apk update 
# RUN apk add bash
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=admin --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:19-bullseye-slim AS installer
# RUN apk add --no-cache libc6-compat
# RUN apk update
WORKDIR /app

ENV CYPRESS_INSTALL_BINARY 0
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install --ignore-engines

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

WORKDIR /app/apps/admin
RUN yarn prisma:generate


WORKDIR /app
RUN yarn turbo run build --filter=admin...
RUN yarn install --production 
# COPY --from=builder /app/out/full/ .

FROM node:19-bullseye-slim AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app ./

EXPOSE 3000
CMD ["yarn", "start"]