import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";
import { Context } from "./server";
import { Handler, Request, Response } from "express";
import {
  GraphQLSchema,
  parse,
  validate,
  print,
  OperationTypeNode,
  OperationDefinitionNode,
} from "graphql";
import { compileQuery, isCompiledQuery, CompiledQuery } from "graphql-jit";

type QueryStore = Map<string, CompiledQuery>;
type GetContextFn = ({ req, res }: { req: Request; res: Response }) => Context;
type OnBeforeCompleteFn = ({
  operationKind,
}: {
  operationKind: OperationTypeNode;
}) => void;

export function graphqlMiddleware({
  getContext,
  onBeforeComplete: onComplete,
}: {
  getContext: GetContextFn;
  onBeforeComplete?: OnBeforeCompleteFn;
}): Handler {
  const schema = getSchema();

  const queryStore: QueryStore = new Map();

  return (req, res) => {
    graphqlHandler(schema, queryStore, getContext, req, res, onComplete).catch(
      e => {
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
      },
    );
  };
}

async function graphqlHandler(
  schema: GraphQLSchema,
  queryStore: QueryStore,
  getContext: GetContextFn,
  req: Request,
  res: Response,
  onBeforeComplete?: OnBeforeCompleteFn,
) {
  let query: string;
  let operationName: string | undefined;
  let variables: { [key: string]: any } | undefined;

  try {
    ({ query, variables, operationName } = parseGraphqlRequest(req));
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

    /**
     * If there is no operation name then take the first operation
     */
    if (!operationName) {
      const firstOp = document.definitions.find(
        def => def.kind === "OperationDefinition",
      ) as OperationDefinitionNode;
      if (!firstOp) {
        res.status(400);
        res.end(
          JSON.stringify({
            errors: [
              {
                message: "Must have at least 1 operation - query or mutation",
              },
            ],
          }),
        );
        return;
      }

      if (firstOp.name) {
        operationName = firstOp.name.value;
      }
    }

    const newCompiledQuery = compileQuery(schema, document, operationName);
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

  if (onBeforeComplete) {
    const operationDef = document.definitions.find(
      op => op.kind === "OperationDefinition",
    ) as OperationDefinitionNode;

    onBeforeComplete({
      operationKind: operationDef.operation,
    });
  }

  res.end(JSON.stringify(executionResult));
}

interface ParsedGraphqlRequest {
  query: string;
  operationName?: string;
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
