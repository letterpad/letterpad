import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";
import { Context } from "./server";
import constants from "./utils/constants";
import models from "./models/index";
import { Handler, Request, Response } from "express";
import { GraphQLSchema, parse, validate, print } from "graphql";
import { compileQuery, isCompiledQuery, CompiledQuery } from "graphql-jit";

type QueryStore = Map<string, CompiledQuery>;

export function graphqlMiddleware(): Handler {
  const schema = getSchema();

  const queryStore: QueryStore = new Map();

  return (req, res) => {
    graphqlHandler(schema, queryStore, req, res).catch(e => {
      res.status(500);
      console.error("Unexpected error handling graphql request:", e);
      res.end(
        JSON.stringify({
          errors: [
            {
              message: `Unexpected error: ${e.message}`,
            },
          ],
        }),
      );
    });
  };
}

async function graphqlHandler(
  schema: GraphQLSchema,
  queryStore: QueryStore,
  req: Request,
  res: Response,
) {
  let query: string;
  let variables: { [key: string]: any } | undefined;

  try {
    ({ query, variables } = parseGraphqlRequest(req));
  } catch (e) {
    res.status(400);
    res.end(e.message);
    return;
  }

  const document = parse(query);
  const normalizedQuery = print(document);

  let compiledQuery: CompiledQuery;

  const cachedQuery = queryStore.get(normalizedQuery);
  if (cachedQuery) {
    compiledQuery = cachedQuery;
  } else {
    const errors = validate(schema, document);
    if (errors.length > 0) {
      res.status(400);
      res.end(
        JSON.stringify({
          errors,
        }),
      );
      return;
    }

    const newCompiledQuery = compileQuery(schema, document);
    if (!isCompiledQuery(newCompiledQuery)) {
      // Compilation Failure
      res.status(400);
      res.end(JSON.stringify(newCompiledQuery));
      return;
    }

    compiledQuery = newCompiledQuery;
    queryStore.set(normalizedQuery, compiledQuery);
  }

  const executionResult = await compiledQuery.query(
    {},
    getContext({ req, res }),
    variables,
  );

  res.end(JSON.stringify(executionResult));
}

interface ParsedGraphqlRequest {
  query: string;
  variables?: {
    [key: string]: any;
  };
}

function parseGraphqlRequest(req: Request): ParsedGraphqlRequest {
  const parsedReq = req.body;
  if (typeof parsedReq.query !== "string") {
    throw new TypeError("requestBody.query is not found");
  }

  return parsedReq;
}

function getContext({ req, res }): Context {
  return {
    user: req.user || {},
    error: req.error || null,
    SECRET: constants.SECRET,
    admin: req.headers.admin || false,
    models,
    response: res,
  };
}

export function getSchema() {
  const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")), {
    all: true,
  });

  const resolvers = mergeResolvers(
    fileLoader(path.join(__dirname, "./resolvers")),
  );

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
}
