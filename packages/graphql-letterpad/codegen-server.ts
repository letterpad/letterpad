import { CodegenConfig } from "@graphql-codegen/cli";
import * as path from "path";

const config: CodegenConfig = {
  schema: path.join(
    __dirname,
    "../../apps/admin/src/graphql/schema/*.graphqls"
  ),
  documents: [path.join(__dirname, "../../apps/admin/src/graphql/queries/*.graphql")],
  emitLegacyCommonJSImports: false,
  generates: {
    "./dist/graphql-server.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        // "add"
      ],
      config: {
        withHooks: false
      }
    },
  },

  hooks: { afterOneFileWrite: ["prettier --write"] },
};

export default config;
