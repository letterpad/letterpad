import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { join } from "path";

// import graphQLLetConfig from "../../.graphql-let.yml";
import resolversArray from "./resolvers";

const loadedFiles = loadFilesSync(
  join(process.cwd(), "src/graphql/schema/**/*.graphqls"),
);
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = mergeResolvers(resolversArray);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
