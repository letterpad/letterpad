import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
} from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";

import { publish } from "@/shared/eventBus";
import { schema } from "./schema";
import { getResolverContext } from "./context";

const isTest = process.env.NODE_ENV === "test";
const isBuildRunning = process.env.NEXT_PHASE === "phase-production-build";

async function createContext(context) {
  if (!isBuildRunning && context.req && !isTest) {
    const resolverContext = await getResolverContext(context);
    return resolverContext;
  }
}
async function graphqlSchemaLink(context) {
  const newContext = await createContext(context);
  return new SchemaLink({ schema, context: { ...context, newContext } });
}

const saveMiddleware = new ApolloLink((operation, forward) => {
  if (operation.query.definitions.length > 0) {
    const isMutation = operation.query.definitions[0];
    if (isMutation["operation"] === "mutation") {
      publish("save", "Saving..");
    }
  }

  return forward(operation);
});

export async function createApolloServerClient(context) {
  const schemaLinkMiddleware = await graphqlSchemaLink(context);
  return new ApolloClient({
    ssrMode: false,
    link: concat(saveMiddleware, schemaLinkMiddleware),
    cache: new InMemoryCache(),
  });
}
