FROM node:14-alpine
ENV HOME /app
# Create app directory
WORKDIR $HOME

RUN apk --no-cache add curl
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ["package.json", "yarn.lock", "$HOME/"]

RUN yarn --frozen-lockfile

COPY ./scripts/prepare.sh "$HOME/scripts/prepare.sh"
RUN chmod +x "$HOME/scripts/prepare.sh"

RUN apk update && \
    apk add mysql-client

COPY . $HOME

EXPOSE 8080

CMD [ "yarn", "dev" ]