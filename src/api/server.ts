declare global {
  namespace Express {
    interface Request {
      user: {
        expiresIn: Date;
        id: number;
      };
      error: any;
    }
    interface Headers {
      authorization: string;
    }
  }
}

import { Express, Response } from "express";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";

import { ApolloServer } from "apollo-server-express";
import RssFeed from "./rssFeed";
import cache from "../client/server/cache";
import config from "../config";
import constants from "./utils/constants";
import fileUpload from "express-fileupload";
import logger from "../shared/logger";
import middlewares from "./middlewares";
import models from "./models/index";
import path from "path";
import upload from "./upload";
import { graphqlMiddleware } from "./graphql";
import graphiqlMiddleware from "./graphiql";

const MAX_UPLOAD_SIZE = parseInt(process.env["MAX_IMAGE_UPLOAD_SIZE"] || "10");

export interface Context {
  user: object;
  error: any;
  SECRET: unknown;
  admin: boolean;
  models: {
    Author: typeof models.Author;
    Post: typeof models.Post;
    Taxonomy: typeof models.Taxonomy;
    Role: typeof models.Role;
    Permission: typeof models.Permission;
    Setting: typeof models.Setting;
    Media: typeof models.Media;
    PostTaxonomy: typeof models.PostTaxonomy;
    Theme: typeof models.Theme;
  };
  response: Response;
}

const context = ({ req, res }): Context => ({
  user: req.user || {},
  error: req.error || null,
  SECRET: constants.SECRET,
  admin: req.headers.admin || false,
  models,
  response: res,
});

const { pathname } = new URL(config.API_URL);

export default async (app: Express) => {
  middlewares(app);
  app.use(
    fileUpload({
      limits: { fileSize: MAX_UPLOAD_SIZE * 1024 * 1024 },
      abortOnLimit: true,
    }),
  );
  app.use(config.BASE_NAME + "/upload", upload);
  app.get(config.BASE_NAME + "/" + config.rssPath, RssFeed);

  if (config.USE_GRAPHQL_JIT) {
    const graphqlEndpoint = config.BASE_NAME + "/graphql";
    app.use(
      graphqlEndpoint,
      graphqlMiddleware({
        getContext: context,
        onBeforeComplete({ operationKind }) {
          if (operationKind === "mutation") {
            cache.clear();
            logger.debug("Clearedcache");
          }
        },
      }),
    );
    app.use(
      config.BASE_NAME + "/graphiql",
      graphiqlMiddleware({ graphqlEndpoint }),
    );
  } else {
    const server = getApolloServer();
    server.applyMiddleware({ app, path: pathname });
  }
};

function getApolloServer() {
  const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

  const resolvers = mergeResolvers(
    fileLoader(path.join(__dirname, "./resolvers")),
  );
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: error => {
      console.log("error.message :", error.message);
      logger.error(
        error.message,
        error.extensions,
        error,
        JSON.stringify(error),
      );
      return error;
    },
    plugins: [
      {
        requestDidStart({ request }) {
          return {
            didResolveOperation({ request }) {
              if (request.query?.startsWith("mutation")) {
                cache.clear();
                logger.debug("Clearedcache");
              }
            },
          };
        },
      },
    ],
    context: context,
    introspection: true,
    playground: {
      endpoint: config.API_URL,
    },
  });

  return server;
}
