FROM nginx:alpine as node
LABEL author="Abhishek Saha"

# The below tools and script will allow us to reload nginx whenever there is a change in the server configuration
RUN apk add inotify-tools
COPY ./nginxReloader.sh /usr/local/bin/nginxReloader.sh
COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]