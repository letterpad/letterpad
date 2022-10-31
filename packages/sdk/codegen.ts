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
        "typescript-graphql-request",
      ],
      config: {
        gqlImport: "graphql-request#gql",
      },
    },
  },
  hooks: { afterOneFileWrite: ["prettier --write"] },
};

export default config;
