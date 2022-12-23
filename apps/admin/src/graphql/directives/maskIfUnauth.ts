import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import {
  defaultFieldResolver,
  GraphQLFloat,
  GraphQLInt,
  GraphQLSchema,
} from "graphql";

export function maskIfUnauth(
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
              if (!context?.session?.user) {
                if (fieldConfig.type === GraphQLInt) return 0;
                if (fieldConfig.type === GraphQLFloat) return 0;
                return "";
              }
              const result = await resolve(source, args, context, info);
              return result;
            },
          };
        }
      },
    });
}
