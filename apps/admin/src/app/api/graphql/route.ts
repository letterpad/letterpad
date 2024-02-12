import { createSchema, createYoga } from "graphql-yoga";

import { context } from "@/graphql/context";
import { isAuthDirective } from "@/graphql/directives/isAuth";
import { maskIfUnauth } from "@/graphql/directives/maskIfUnauth";
import { resolversArr } from "@/graphql/resolvers";
import { typeDefsList } from "@/graphql/schema";

import cors from "../_cors";

export const setupYoga = (context) => {
  return createYoga({
    schema: maskIfUnauth("maskIfUnauth")(
      isAuthDirective("isAuth")(
        createSchema({
          typeDefs: typeDefsList,
          resolvers: resolversArr,
        })
      )
    ),
    context,
    graphqlEndpoint: "/api/graphql",
    fetchAPI: { Response },
  });
};

const { handleRequest } = setupYoga(context);
export { handleRequest as GET, handleRequest as POST };

export async function OPTIONS(request: Request) {
  return cors(
    request,
    new Response(null, {
      status: 204,
    })
  );
}

export type ResolverContext = Awaited<ReturnType<typeof context>>;
