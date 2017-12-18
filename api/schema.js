import * as GraphQLTools from "graphql-tools";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

const resolvers = mergeResolvers(
    fileLoader(path.join(__dirname, "./resolvers"))
);

/*  generate executable GraphQL schema  */
let schema = GraphQLTools.makeExecutableSchema({
    typeDefs,
    resolvers,
    allowUndefinedInResolve: false,
    printErrors: true,
    resolverValidationOptions: {
        requireResolversForArgs: true,
        requireResolversForNonScalar: false,
        requireResolversForAllFields: false
    }
});

export default schema;
