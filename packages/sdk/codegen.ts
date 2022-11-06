import { CodegenConfig } from "@graphql-codegen/cli";
import * as path from "path";

const config: CodegenConfig = {
  schema: path.join(
    __dirname,
    "../../apps/admin/src/graphql/schema/*.graphqls"
  ),
  documents: [path.join(__dirname, "./queries/*.graphql")],
  emitLegacyCommonJSImports: false,
  generates: {
    "./src/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        {
          "@graphql-codegen/typescript-generic-sdk": {
            documentMode: "string",
          },
        },
      ],
    },
  },

  hooks: { afterOneFileWrite: ["prettier --write"] },
};

export default config;
