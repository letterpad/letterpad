# Builder
FROM node:19-bullseye-slim@sha256:424dd181b3be2a7aec23f6ba3b69e732745bad42e9b8a473efcb1399e76f12de AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .

ENV CYPRESS_INSTALL_BINARY 0
RUN yarn install --ignore-engines

COPY turbo.json turbo.json

WORKDIR /app/apps/admin
RUN yarn prisma:generate
RUN rm .env

WORKDIR /app/apps/client
RUN rm .env

WORKDIR /app
RUN yarn turbo run build
RUN yarn install --production 


# Runner
FROM node:19-bullseye-slim@sha256:424dd181b3be2a7aec23f6ba3b69e732745bad42e9b8a473efcb1399e76f12de AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app ./

ARG SECRET_KEY
ARG DATABASE_URL
ARG RECAPTCHA_KEY_CLIENT
ARG RECAPTCHA_KEY_SERVER
ARG GMAIL_USER
ARG GMAIL_PASSWORD
ARG SENDER_EMAIL
ARG CLOUDINARY_KEY
ARG CLOUDINARY_NAME
ARG CLOUDINARY_SECRET
ARG UNSPLASH_CLIENT_ID
ARG EMAIL
ARG PASSWORD
ARG DEBUG

ENV ROOT_URL="http://localhost:3000/admin"
ENV NEXTAUTH_URL="http://localhost:3000/admin/api/auth"
ENV API_URL="http://localhost:3000/admin/api/graphql"
ENV DEBUG=$DEBUG
ENV DOCKER=true

ENV SECRET_KEY=$SECRET_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV RECAPTCHA_KEY_CLIENT=$RECAPTCHA_KEY_CLIENT
ENV RECAPTCHA_KEY_SERVER=$RECAPTCHA_KEY_SERVER
ENV GMAIL_USER=$GMAIL_USER
ENV GMAIL_PASSWORD=$GMAIL_PASSWORD
ENV SENDER_EMAIL=$SENDER_EMAIL
ENV CLOUDINARY_KEY=$CLOUDINARY_KEY
ENV CLOUDINARY_NAME=$CLOUDINARY_NAME
ENV CLOUDINARY_SECRET=$CLOUDINARY_SECRET
ENV UNSPLASH_CLIENT_ID=$UNSPLASH_CLIENT_ID
ENV EMAIL=$EMAIL
ENV PASSWORD=$PASSWORD

EXPOSE 3000
EXPOSE 3001
CMD ["yarn", "start"]