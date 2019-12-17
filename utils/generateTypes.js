require("@babel/register");
const { spawn } = require("child_process");

const { fileLoader, mergeTypes } = require("merge-graphql-schemas");
const path = require("path");
const fs = require("fs");

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, "../src/api/schema")),
);
const typesFolder = path.join(__dirname, "../src/__generated__/schema.graphql");
fs.writeFileSync(typesFolder, typeDefs);

spawn("yarn", ["graphql-codegen"], {
  shell: true,
  stdio: "inherit",
});
