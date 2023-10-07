import { createSchema, createYoga } from "graphql-yoga";

import { getResolverContext } from "@/graphql/context";
import { isAuthDirective } from "@/graphql/directives/isAuth";
import { maskIfUnauth } from "@/graphql/directives/maskIfUnauth";
import { resolversArr } from "@/graphql/resolvers";
import { typeDefsList } from "@/graphql/schema";

const context = async ({ request }) => {
  const resolverContext = await getResolverContext(request);
  return { ...resolverContext, prisma };
};

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
