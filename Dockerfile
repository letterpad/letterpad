######################################################################################
# This docker file is meant to build a production image for Letterpad Admin Dashboard
######################################################################################


# Build image
FROM node:14-alpine AS build

WORKDIR /build

RUN apk add curl bash mysql-client sqlite

RUN yarn config set --home enableTelemetry 0
COPY package.json yarn.lock /build/
COPY ./.env.sample /build/.env
# Install only the production dependencies
RUN yarn install --production --frozen-lockfile

# Cache these modules for production
RUN cp -R node_modules/ prod_node_modules/

# Install development dependencies
RUN yarn install --frozen-lockfile

COPY . /build
RUN yarn next telemetry disable
RUN yarn build

############## Production image ###################

FROM node:14-alpine AS production
WORKDIR /app

# Copy cached dependencies
COPY --from=build /build/prod_node_modules ./node_modules

COPY --from=build /build/.env ./.env

# Copy generated Prisma client
COPY --from=build /build/node_modules/.prisma/ ./node_modules/.prisma/

COPY --from=build /build/yarn.lock /build/package.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
COPY --from=build /build/prisma ./prisma
COPY --from=build /build/next.config.js ./next.config.js

RUN apk add curl bash mysql-client sqlite python3 py3-pip certbot
RUN pip3 install certbot-nginx
RUN mkdir /etc/letsencrypt
RUN mkdir -p /var/www/html/letterpad-map-test
# USER node

EXPOSE 3000
CMD ["yarn", "start"]