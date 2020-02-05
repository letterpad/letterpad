declare global {
  namespace Express {
    interface Request {
      user: {
        expiresIn: Date;
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
import constants from "./utils/constants";
import logger from "../shared/logger";
import middlewares from "./middlewares";
import models from "./models/index";
import path from "path";
import upload from "./upload";

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

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers")),
);
const context = ({ req, res }): Context => ({
  user: req.user || {},
  error: req.error || null,
  SECRET: constants.SECRET,
  admin: req.headers.admin || false,
  models,
  response: res,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log("error.message :", error.message);
    logger.error(error.message, error.extensions, error, JSON.stringify(error));
    return error;
  },
  context: context,
});

const endpoint = `${process.env.baseName}/graphql`;

export default async (app: Express) => {
  middlewares(app);
  server.applyMiddleware({ app, path: endpoint });

  app.use("/upload", upload);
};
