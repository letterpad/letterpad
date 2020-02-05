FROM node:13.7.0-alpine3.11 as builder
WORKDIR /letterpad

RUN apk update && apk add yarn git

COPY package.json yarn.lock /letterpad/
COPY utils /letterpad/utils
RUN yarn --frozen-lockfile
ADD . /letterpad/
RUN NODE_ENV=production yarn build
RUN yarn install --frozen-lockfile --production --ignore-scripts

FROM node:13.7.0-alpine3.11

EXPOSE 4040
WORKDIR /letterpad
VOLUME /letterpad/data

ENV NODE_ENV=production

COPY --from=builder /letterpad/package.json /letterpad
COPY --from=builder /letterpad/dist /letterpad/dist
COPY --from=builder /letterpad/node_modules /letterpad/node_modules
ADD sample.env /letterpad/.env

CMD node dist/server.js
