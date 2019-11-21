import path from "path";
import { ApolloServer } from "apollo-server-express";
import constants from "./utils/constants";
import models from "./models/index";
import upload from "./upload";
import middlewares from "./middlewares";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers")),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
  context: ({ req, res }) => ({
    user: req.user || {},
    error: req.error || null,
    SECRET: constants.SECRET,
    admin: req.headers.admin || false,
    models: models,
  }),
});

const endpoint = `${process.env.baseName}/graphql`;

module.exports = app => {
  middlewares(app);
  server.applyMiddleware({ app, path: endpoint });

  app.use("/upload", upload);
};
