import { join } from "path";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
//@ts-ignore
// import graphQLLetConfig from "../../.graphql-let.yml";
// import resolversArray from "./resolvers";
import subscriber from "./resolvers/subscriber";

const loadedFiles = loadFilesSync(
  join(process.cwd(), "src/graphql/schema/**/*.graphqls"),
);
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = mergeResolvers([subscriber]);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
