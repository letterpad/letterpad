import { createSchema, createYoga } from "graphql-yoga";

import { context } from "@/graphql/context";
import { isAuthDirective } from "@/graphql/directives/isAuth";
import { maskIfUnauth } from "@/graphql/directives/maskIfUnauth";
import { resolversArr } from "@/graphql/resolvers";
import { typeDefsList } from "@/graphql/schema";

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

type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: any) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable

export type ResolverContext = Awaited<ReturnType<typeof context>>;
