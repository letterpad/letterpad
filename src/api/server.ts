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

import { Express } from "express";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import constants from "./utils/constants";
import models from "./models/index";
import upload from "./upload";
import middlewares from "./middlewares";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";

async function A() {
  // var a = await models.Role.findAll();
  // console.log(a);
}

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
}

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers")),
);
const context = ({ req }): Context => ({
  user: req.user || {},
  error: req.error || null,
  SECRET: constants.SECRET,
  admin: req.headers.admin || false,
  models,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
  context: context,
});

const endpoint = `${process.env.baseName}/graphql`;

export default (app: Express) => {
  A();
  middlewares(app);
  server.applyMiddleware({ app, path: endpoint });

  app.use("/upload", upload);
};
