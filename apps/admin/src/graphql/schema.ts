import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { join } from "path";

import { isAuthDirective } from "./directives/isAuth";
import { maskIfUnauth } from "./directives/maskIfUnauth";
import { resolversArr } from "./resolvers";

const loadedFiles = loadFilesSync(
  join(process.cwd(), "src/graphql/schema/**/*.graphqls")
);
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = mergeResolvers(resolversArr);

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const schema = maskIfUnauth("maskIfUnauth")(
  isAuthDirective("isAuth")(executableSchema)
);
