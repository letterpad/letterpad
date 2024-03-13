import { CodegenConfig } from "@graphql-codegen/cli";
import * as path from "path";

const config: CodegenConfig = {
  schema: path.join(
    __dirname,
    "../../apps/admin/src/graphql/schema/*.graphqls"
  ),
  documents: [path.join(__dirname, "../../apps/**/*.graphql")],
  emitLegacyCommonJSImports: false,
  generates: {
    "./dist/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-urql",
        "typescript-resolvers"
      ],
      config: {
        withHooks: false,
        withComponent: false,
        avoidOptionals: false,
        maybeValue: 'T'
      }
    },
    "./dist/hooks.ts": {
      plugins: [
        "typescript-urql",
      ],
      preset: 'import-types',
      config: {
        withHooks: true,
        withComponent: false,
        documentMode: 'external',
        importDocumentNodeExternallyFrom: './graphql.ts',
        avoidOptionals: false,
        maybeValue: 'T'
      },
      presetConfig: {
        typesPath: "./graphql",
      },
    },
  },

  hooks: { afterOneFileWrite: ["prettier --write"] },
};

export default config;
