import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLSchema } from "graphql";

export function isAuthDirective(
  directiveName: string
): (schema: GraphQLSchema) => GraphQLSchema {
  return (schema) =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const upperDirective = getDirective(
          schema,
          fieldConfig,
          directiveName
        )?.[0];
        if (upperDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          return {
            ...fieldConfig,
            resolve: async function (source, args, context, info) {
              if (!context.session?.user) {
                throw new Error("Unauthorized");
              }
              const result = await resolve(source, args, context, info);

              return result;
            },
          };
        }
      },
    });
}
