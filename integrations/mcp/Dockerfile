FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app/integrations/mcp
COPY integrations/mcp/package.json integrations/mcp/package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node integrations/mcp/server.mjs ./
COPY --chown=node:node packages/sdk/mcp.mjs /app/packages/sdk/mcp.mjs
USER node
EXPOSE 3030
CMD ["node", "server.mjs"]
